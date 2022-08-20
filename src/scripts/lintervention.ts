/* eslint-disable no-console */

import minimist from 'minimist';

import { findDisabled, gitFilesCommand, IOutput } from '../';

const argv = minimist(process.argv.slice(2));
const scope = argv.scope || 'all';
const platform = argv.platform || 'bsd';
const baseBranch = Object.hasOwnProperty.call(argv, 'with-base-branch')
  ? argv['with-base-branch']
  : undefined;

export const report = async () => {
  const findCommand = gitFilesCommand({ scope, baseBranch });

  findDisabled({ platform, findCommand }).then(({ stdout }: IOutput) => {
    console.log(stdout);
  });
};

report();
