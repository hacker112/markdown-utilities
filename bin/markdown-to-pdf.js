#!/usr/bin/env node

const fs = require('fs')
const meow = require('meow')

//
// CLI setup
//
const cli = meow(
  `
    Usage:
        $ markdown-to-pdf <source> [<destination>] [<options>]

    <source> must be a markdown file, with the extension '.md'.
    <destination> must be a PDF file, with the extension '.pdf'
                  if ommitted it will be named <source>.pdf


    Examples:
            $ markdown-to-pdf README.md
            $ markdown-to-pdf in.md out.pdf --toc
            $ markdown-to-pdf in.md out.pdf --toc --save-html out.html

    Options:
        --border=<size>         Border (top, left, bottom, right; default: 20mm)
        --border-top=<size>     Top border (default: 20mm)
        --border-left=<size>    Left border (default: 20mm)
        --border-bottom=<size>  Bottom border (default: 20mm)
        --border-right=<size>   Right border (default: 20mm)
        --format=<format>       PDF size format: A0-A6, Legal, Ledger, Letter, Tabloid (Default: A4)

        --toc                   Add table of content where a "toc" html comment is.
        --maxdepth=<depth>      TOC: Use headings whose depth is at most maxdepth (default: 6)

        --save-html=<file>      Save intermediate HTML to file. if no filename is given use <source>.pdf

        --help                  Display this menu
        --version               Display the application version
    `,
  {
    description:
      'Convert markdown to PDF (and also HTML) with optional table of content.',
    flags: {
      toc: {
        type: 'boolean',
        default: false,
      },
      maxdepth: {
        type: 'number',
        default: 6,
      },
      border: {
        type: 'string',
        default: '20mm',
      },
      saveHtml: {
        type: 'string',
      },
      format: {
        type: 'string',
        default: 'A4',
      },
    },
  }
)

function isMarkdown(file) {
  return /.+\.md$/.test(file)
}
function isPdf(file) {
  return /.+\.pdf$/.test(file)
}
function isHtml(file) {
  return /.+\.html$/.test(file)
}

function showErrorAndHelp(error) {
  console.error('\nError\n-----\n' + error + '\n')
  console.error('\nHelp\n----')
  cli.showHelp()
}

const marginCheckRegex = /^[0-9]{1,10}(in|px|cm|mm)$/

function testBorderMargin(name, value) {
  if (!marginCheckRegex.test(value)) {
    showErrorAndHelp(
      `${name} must be number followed by on of the following units px, in, cm, mm.`
    )
  }
}

const source = cli.input[0]

if (!isMarkdown(source)) {
  showErrorAndHelp('<source> not set or not a markdown file (.md)')
}
if (!fs.existsSync(source)) {
  showErrorAndHelp('<source> file does not exist')
}
const destination = cli.input[1] || source.replace(/\.md$/, '.pdf')

if (!isPdf(destination)) {
  showErrorAndHelp('<destination> must be a PDF file (.pdf)')
}

const maxdepth = cli.flags.maxdepth

if (maxdepth < 1 || maxdepth > 6) {
  showErrorAndHelp('<maxdepth> must be between 1 and 6.')
}

const border = cli.flags.border

testBorderMargin('border', border)

const margin = {
  top: cli.flags.borderTop || border,
  left: cli.flags.borderLeft || border,
  right: cli.flags.borderRight || border,
  bottom: cli.flags.borderBottom || border,
}

for (const key in margin) {
  testBorderMargin('border-' + key, margin[key])
}

const format = cli.flags.format

if (!/^(A[0-6]|Legal|Ledger|Letter|Tabloid)$/.test(format)) {
  showErrorAndHelp(
    '<format> must be on of the following A0-A6, Legal, Ledger, Letter, Tabloid'
  )
}

const addToc = cli.flags.toc

const saveHtml = cli.flags.saveHtml !== undefined

const htmlFile = cli.flags.saveHtml || destination.replace(/\.pdf/, '.html')

console.log(htmlFile)

if (!isHtml(htmlFile)) {
  showErrorAndHelp('html file must be end with .html')
}

// TODO: no print
const cliOptions = {
  source,
  destination,
  maxdepth,
  margin,
  format,
  addToc,
  saveHtml,
  htmlFile,
}

console.log(cliOptions)

// TODO: move to be separate lib file

//
// TODO: do stuff
//
const { Remarkable } = require('remarkable')
const path = require('path')
const puppeteer = require('puppeteer')
const toc = require('markdown-toc')
//
const hljs = require('highlight.js')

function addTocToMarkdown(markdown, tocOptions) {
  return toc.insert(markdown, tocOptions) //{open: '', close: ''});
}

function markdownToHtml(markdown) {
  // Actual default values
  return new Remarkable({
    html: true,
    highlight: function(str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(lang, str).value
          // eslint-disable-next-line no-empty
        } catch (err) {}
      }

      try {
        return hljs.highlightAuto(str).value
        // eslint-disable-next-line no-empty
      } catch (err) {}

      return '' // use external default escaping
    },
  })
    .use(remarkable => {
      remarkable.renderer.rules.heading_open = function(tokens, idx) {
        return (
          '<h' +
          tokens[idx].hLevel +
          ' id=' +
          toc.slugify(tokens[idx + 1].content) +
          '>'
        )
      }
    })
    .render(markdown)
}

function createPdf(html, pdfPath, options) {
  // Write html to a temp file
  let browser
  let page

  return puppeteer
    .launch({ headless: true })
    .then(newBrowser => {
      browser = newBrowser
      return browser.newPage()
    })
    .then(p => {
      page = p
      return page.setContent(html, {
        waitUntil: 'networkidle2',
      })
    })
    .then(() => {
      const pdfOptions = {
        margin: options.margin,
        path: pdfPath,
        displayHeaderFooter: false,
        printBackground: true,
        format: options.format,
      }

      console.log('pdfOptions', pdfOptions)

      return page.pdf(pdfOptions)
    })
    .then(() => {
      return browser.close()
    })
}

let markdown = fs.readFileSync(source, 'utf-8')

if (addToc) {
  markdown = addTocToMarkdown(markdown, {
    indent: '\t',
    maxdepth,
  })
}

//
// Generate CSS and HTML from markdown
//
const cssStyleFiles = [
  path.join(__dirname, '../styles/github-markdown-css.css'),
  path.join(__dirname, '../styles/default.css'),
  path.join(__dirname, '../node_modules/highlight.js/styles/github.css'),
]

const cssStyle = cssStyleFiles
  .map(file => fs.readFileSync(file, 'utf-8').replace(/\r\n/g, '\n'))
  .join('\n')

const htmlMarkdownContent = markdownToHtml(markdown)

let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>${cssStyle}</style>
</head>
<body class="markdown-body">
  ${htmlMarkdownContent}
</body>
</html>
`

if (saveHtml) {
  // Make sure that the HTML is as small ass possible before saving it
  const minify = require('html-minifier').minify

  html = minify(html, {
    removeAttributeQuotes: true,
    minifyCSS: true,
  })

  fs.writeFileSync(htmlFile, html)
}

createPdf(html, destination, {
  margin,
  format,
})
