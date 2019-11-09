#!/bin/bash

cd "$(dirname "$0")/.."

markdown-github-toc README.md --insert --maxdepth 1
markdown-github-toc docs/toc-test.md --insert

# Demo of markdown-to-pdf
mkdir -p output
markdown-to-pdf README.md output/README.pdf --save-html output/README.html --toc --maxdepth 2
