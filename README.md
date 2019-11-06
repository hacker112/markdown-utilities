# markdown-tools
A collection of small handy tools for improving and converting markdown

# Tools

<!-- toc -->

- [markdown-tools-github-toc](#markdown-tools-github-toc)

<!-- tocstop -->

# markdown-tools-github-toc

Add Github compatible table of content to markdown (Replacing "&lt;!-- toc --&gt;" in source file)

This tools uses [markdown-toc](https://github.com/jonschlinkert/markdown-toc#tocinsert) internally.

## Install

```shell
    $ npm install --save markdown-toc
```

## CLI

```
    Usage:
        $ markdown-tools-github-toc <source> [<destination>] [<options>]

    <source> must be a markdown file, with the extension '.md'.
    <destination> must be a markdown file, with the extension '.md'
                  if ommitted it will be named <source>-toc.md


    Examples:
            $ markdown-tools-github-toc README.md
            $ markdown-tools-github-toc in.md out.md --maxdepth 3
            $ markdown-tools-github-toc README.md --insert

    Options:
        --help                       Display this menu
        --insert                     Use source markdown as destination
        --maxdepth=<depth>           Use headings whose depth is at most maxdepth (default: 6)
        --version                    Display the application version
```
