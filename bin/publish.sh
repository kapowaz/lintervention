#!/bin/bash

set -e

echo "Starting NPM publish"
echo "- Setting up auth token for npm"
echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN_CI" >> .npmrc

echo "- Comparing local package.json version with version in registry"
DIST_TAG=${1-latest}
LATEST=$(npm show lintervention version)
CURRENT=$(node -e 'console.log(require("./dist/package.json").version)')

if [ "$CURRENT" != "$LATEST" ]
then
  echo "- Publishing to NPM $DIST_TAG v${CURRENT}" && \
  npm publish ./dist --tag $DIST_TAG
else
  echo "- No version mismatch, nothing to publish"
fi
