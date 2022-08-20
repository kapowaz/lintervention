import { GitScope } from './types';

/**
 * `gitFilesCommand` returns a git command which when executed will return a list
 * of changed files, either in the current branch, or in the currently staged
 * (uncommitted) changes. If scope is anything other than branch or staged, it
 * returns an empty string.
 */
export const gitFilesCommand = ({
  scope = GitScope.Branch,
  baseBranch = 'master',
}: {
  scope?: GitScope;
  baseBranch?: string;
}) => {
  const getCurrentBranch = "$(git branch | grep '*' | awk '{print $2}')";

  switch (true) {
    case scope === GitScope.Staged:
      return 'git diff --name-only --cached';
    case scope === GitScope.Branch:
      return `git diff --name-only ${baseBranch}...${getCurrentBranch}`;
    default:
      // return nothing if scope isn’t one of the options above
      return '';
  }
};
