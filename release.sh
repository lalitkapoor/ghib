#!/usr/bin/env bash

set -e
set -u
set -o pipefail

git checkout master
npm version patch
git push origin master
git push origin --tags
npm publish
