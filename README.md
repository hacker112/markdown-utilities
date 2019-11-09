# markdown-utilities

A collection of small handy tools for improving and converting markdown.

## Install

```shell
    $ npm install -g markdown-utilities
```

# Utilities

<!-- toc -->

- [markdown-github-toc](#markdown-github-toc)
- [markdown-to-pdf](#markdown-to-pdf)

<!-- tocstop -->

# markdown-github-toc

Add Github compatible table of content to markdown (Replacing "&lt;!-- toc --&gt;" in source file)

This tools uses [markdown-toc](https://github.com/jonschlinkert/markdown-toc) internally.

## CLI

```
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
```

# markdown-to-pdf

Convert markdown to PDF (and also HTML) with optional table of content.

Inspired by [MDPDF](https://www.npmjs.com/package/mdpdf) and [markdown-pdf](https://www.npmjs.com/package/markdown-pdf). With the improvement that you can generate a table of content (ToC) using [markdown-toc](https://github.com/jonschlinkert/markdown-toc), and the ToC document links works correctly in the PDF even if non-latin-letter like åäö are used. Another improvement that is made compared to MDPDF is that the intermediate temporary HTML is never stored as a file unless you want it to be saved. If you choose to store the HTML it is minified before stored to disk.

## CLI

```
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
```
