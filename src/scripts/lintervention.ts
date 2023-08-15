/* eslint-disable no-console */

import { findDisabled, GitScope, GrepPlatform, IOutput } from '../';

export const report = async ({
  scope = GitScope.All,
  platform = GrepPlatform.BSD,
  baseBranch,
  currentBranch,
}: {
  scope?: GitScope;
  platform?: GrepPlatform;
  baseBranch: string;
  currentBranch?: string;
}) => {
  findDisabled({ scope, platform, baseBranch, currentBranch }).then(
    ({ stdout }: IOutput) => {
      console.log(stdout);
    }
  );
};
