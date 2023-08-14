/* eslint-disable no-console */

import { findDisabled, GitScope, GrepPlatform, IOutput } from '../';

export const report = async ({
  scope = GitScope.All,
  platform = GrepPlatform.BSD,
  baseBranch,
}: {
  scope?: GitScope;
  platform?: GrepPlatform;
  baseBranch: string;
}) => {
  findDisabled({ scope, platform, baseBranch }).then(({ stdout }: IOutput) => {
    console.log(stdout);
  });
};
