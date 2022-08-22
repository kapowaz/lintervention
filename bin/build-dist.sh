#!/bin/sh

set -e

echo "Building dist:"

echo "- Cleaning dist directories…"
[ -d dist ] && rm -rf dist/*

echo "- Babel-ing all components in 'src'…"
yarn build:js

# Emit all .d.ts files using TypeScript
echo "- Generating all type definitions in 'src'…"
yarn build:tsc

echo "- Copying static files to 'dist/'…"
cp package.json dist/
cp readme.md dist/

echo "- Copying bin files to 'dist/'…"
cp -R src/bin/ dist/bin/
