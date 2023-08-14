/* eslint-disable no-console */

import minimist from 'minimist';

import { findDisabled, IOutput } from '../';

export const report = async () => {
  const argv = minimist(process.argv.slice(2));
  const scope = argv.scope || 'all';
  const platform = argv.platform || 'bsd';
  const baseBranch = Object.hasOwnProperty.call(argv, 'with-base-branch')
    ? argv['with-base-branch']
    : undefined;

  findDisabled({ platform, scope, baseBranch }).then(({ stdout }: IOutput) => {
    console.log(stdout);
  });
};
