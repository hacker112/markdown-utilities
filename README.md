# markdown-utilities

A collection of small handy tools for improving and converting markdown.

## Install

```shell
    $ npm install -g markdown-utilities
```

# Utilities

<!-- toc -->

- [markdown-github-toc](#markdown-github-toc)

<!-- tocstop -->

# markdown-github-toc

Add Github compatible table of content to markdown (Replacing "&lt;!-- toc --&gt;" in source file)

This tools uses [markdown-toc](https://github.com/jonschlinkert/markdown-toc#tocinsert) internally.

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
