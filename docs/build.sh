#!/bin/bash

cd "$(dirname "$0")/.."

markdown-github-toc README.md --insert --maxdepth 1
markdown-github-toc docs/toc-test.md --insert
