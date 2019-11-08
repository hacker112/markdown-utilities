#!/usr/bin/env node

const toc = require('markdown-toc')
const fs = require('fs')
const path = require('path')
const meow = require('meow')

//
// CLI setup
//

const cli = meow(
  `
    Usage:
        $ markdown-github-toc <source> [<destination>] [<options>]

    <source> must be a markdown file, with the extension '.md'.
    <destination> must be a markdown file, with the extension '.md'
                  if ommitted it will be named <source>-toc.md


    Examples:
            $ markdown-github-toc README.md
            $ markdown-github-toc in.md out.md --maxdepth 3
            $ markdown-github-toc README.md --insert

    Options:
        --help                       Display this menu
        --insert                     Use source markdown as destination
        --maxdepth=<depth>           Use headings whose depth is at most maxdepth (default: 6)
        --version                    Display the application version
    `,
  {
    description:
      'Add Github compatible table of content to markdown (Replacing <!-- toc --> in source file)',
    flags: {
      maxdepth: {
        type: 'number',
        default: 6,
      },
      insert: {
        type: 'boolean',
        default: false,
      },
    },
  }
)

function isMarkdown(file) {
  return /.+\.md$/.test(file)
}

function showErrorAndHelp(error) {
  console.error('\nError\n-----\n' + error + '\n')
  console.error('\nHelp\n----')
  cli.showHelp()
}

const source = cli.input[0]

if (!isMarkdown(source)) {
  showErrorAndHelp('<source> not set or not a markdown file (.md)')
}
if (!fs.existsSync(source)) {
  showErrorAndHelp('<source> file does not exist')
}

const insert = cli.flags.insert

const destination = insert
  ? source
  : cli.input[1] || source.replace(/\.md$/, '-toc.md')

if (!isMarkdown(destination)) {
  showErrorAndHelp('<destination> must be a markdown file (.md)')
}

if (!insert && path.resolve(source) === path.resolve(destination)) {
  showErrorAndHelp('<source> must not be equal to <destination>')
}

const maxdepth = cli.flags.maxdepth

if (maxdepth < 1 || maxdepth > 6) {
  showErrorAndHelp('<maxdepth> must be between 1 and 6.')
}

// const cliOptions = {
//     source,
//     destination,
//     maxdepth,
//     insert,
// }
//
// console.log(cliOptions)

//
// Add ToC
//

// The slug code is borrowed from showdown header.js if(options.ghCompatibleHeaderId)...
// https://github.com/showdownjs/showdown/blob/fc7ac1e1ca90d1849d120025105d1f45c9d4f8f6/src/subParsers/makehtml/headers.js line
function slug(title) {
  return (
    title
      .replace(/ /g, '-')
      // replace previously escaped chars (&, ¨ and $)
      .replace(/&amp;/g, '')
      .replace(/¨T/g, '')
      .replace(/¨D/g, '')
      // replace rest of the chars (&~$ are repeated as they might have been escaped)
      // borrowed from github's redcarpet (some they should produce similar results)
      // eslint-disable-next-line no-useless-escape
      .replace(/[&+$,\/:;=?@"#{}|^¨~\[\]`\\*)(%.!'<>]/g, '')
      .toLowerCase()
  )
}

const options = {
  slugify: slug,
  // Using tab since spaces fails to have correct depth
  indent: '\t',
  maxdepth: maxdepth,
}

const originalMarkdown = fs.readFileSync(source, 'utf-8')
const newMarkdown = toc.insert(originalMarkdown, options)

fs.writeFileSync(destination, newMarkdown)
