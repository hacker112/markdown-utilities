#!/bin/bash

cd "$(dirname "$0")/.."

markdown-tools-github-toc README.md --insert --maxdepth 1
markdown-tools-github-toc docs/toc-test.md --insert
