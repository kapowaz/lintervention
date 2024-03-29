import { findDisabled } from './findDisabled';
import { sortResults } from './sortResults';
import { GitScope, GrepPlatform, IOverruleReport } from './types';

/**
 * For the purposes of Dangerfile, we only want to check against changes in the
 * current branch.
 *
 * `reportDisabledDirectives` iterates over all lines in the stdout returned by
 * `findDisabled` and arranges them into an an array of instances,
 * with a key for the count and rule name, ordered by number of occurrences
 * (largest first). This is particularly useful if you want to take this as
 * structured input for generating a formatted report (e.g. markdown for a
 * Danger.js report)
 */
export const reportDisabled = async ({
  /**
   * Most of the time CI will be running on a platform using GNU/Linux versions
   * of tools like grep, so default to Linux here.
   */
  platform = GrepPlatform.Linux,
  scope = GitScope.Branch,
  files = '',
  baseBranch,
  currentBranch,
}: {
  platform?: GrepPlatform;
  scope?: GitScope;
  files?: string;
  baseBranch?: string;
  currentBranch?: string;
}): Promise<IOverruleReport[]> => {
  const xargs = scope === GitScope.All ? files : '';

  const { stdout } = await findDisabled({
    platform,
    scope,
    xargs,
    baseBranch,
    currentBranch,
  });
  const trimmed = stdout.trim();

  if (trimmed === '') return [];

  const results = trimmed.split('\n').map((line) => {
    const [count, rule] = line.trim().split(' ');

    return { count, rule };
  });

  return sortResults(results);
};
