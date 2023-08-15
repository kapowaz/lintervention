import { GitScope, IGitCommand } from './types';

/**
 * `gitCommand` returns a git command which when executed will return a list of
 * changed files, either in the current branch, or in the currently staged
 * (uncommitted) changes.
 *
 * If an xargs argument indicating a set of files is passed, this is returned
 * immediately. Otherwise, if scope is anything other than branch or staged, it
 * returns an empty string.
 */
export const gitCommand = ({
  xargs = undefined,
  scope = GitScope.Branch,
  baseBranch = 'main',
  currentBranch = undefined,
}: IGitCommand) => {
  const getCurrentBranch =
    currentBranch || "$(git branch | grep '*' | awk '{print $2}')";
  const filterDeleted = "grep '^[^D]' | awk '{print $2}'";

  switch (true) {
    case Boolean(xargs):
      return xargs;
    case scope === GitScope.Staged:
      return `git diff --name-status --cached | ${filterDeleted}`;
    case scope === GitScope.Branch:
      return `git diff --name-status ${baseBranch}...${getCurrentBranch} | ${filterDeleted}`;
    default:
      // return nothing if scope isn’t one of the options above
      return '';
  }
};
