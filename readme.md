# Lintervention

Lintervention is a tool for identifying ESLint rules you routinely ignore. It
generates a report identifying which rules you are ignoring — either across a
repository, or in a branch — and can output them (for example, using Danger.js)
to help you identify which rules you shouldn’t be using, and which rules you
_should_ be using, _but following_.

## Why?

Let’s say you decide to add ESLint to an existing repository. Some of your older
code might not pass the rules you want to apply to your work, and so you choose
to only run ESLint against changes (e.g. using [lint-staged][1]). Now you can
ensure future changes are good, whilst not blocking CI with older code.

Problem is now any time you make a change to an older file, the whole file needs
to pass your rules. And one day you _really need_ to get something shipped that
involves touching something old. So you break out `/* eslint-ignore */` and move
on with your life.

But now it’s a couple of years later, and you’re noticing that `/* eslint-ignore
*/` directives litter your codebase. Worse, some of the rules you chose to add
didn’t turn out to align with how your team works, so you’re routinely ignoring
ESLint rules that maybe shouldn’t even be enabled in your project.

It’s time for a _lintervention_.

## So what does it do?

This package exports some useful bits and bobs to incorporate into your
workflow:

* A general-purpose function `findDisabled` which finds disabled directives, and
  outputs the result.
* A script you can hook up to a `yarn` or `npm` script in your repo making use
  of `findDisabled()`: you can then run this whenever you want to check how many
  directives you’re ignoring locally; either across an entire repository, or
  just on your local branch (or just staged changes).
* A function which generates a report (formatted as a Markdown table) which is
  then supplied to Danger.js; you can then directly import this into your own
  Dangerfile.

## Installation

There are two (supported) ways to generate reports with Lintervention:

* Locally with yarn or npm scripts
* With Danger.js, as part of CI

### yarn or npm script

The package installs an `lintervention` tool which you can run with `yarn
lintervention` or `npx lintervention`. You can optionally also add these scripts
to your `package.json`:

```json
"scripts": {
  "lintervention:staged": "lintervention --scope staged",
  "lintervention:branch": "lintervention --scope branch"
}
```

### Danger.js

Add the following to your `dangerfile.js`:

```js
import { markdown } from 'danger';
import { dangerReport } from 'lintervention';

async function lintervention() {
  // the default main branch is 'main'; you can override this here.
  const report = await dangerReport({ baseBranch: 'master' });
  markdown(report);
}

lintervention();
```

If for any reason your CI platform is a bit unusual and you want to scope the
report to changes within a branch, you can explicitly pass in the current branch
name as follows:

```js
import { markdown } from 'danger';
import { dangerReport } from 'lintervention';

// let’s say you get your branch name this way
const currentBranch = process.env.CURRENT_BRANCH;

async function lintervention() {
  const report = await dangerReport({ scope: 'branch', baseBranch: 'master', currentBranch });
  markdown(report);
}

lintervention();
```

[1]: https://github.com/okonet/lint-staged
