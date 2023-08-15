import { reportDisabled } from '../reportDisabled';
import { GitScope, GrepPlatform, IOverruleReport } from '../types';

const table = ({
  heading,
  headings,
  rows,
}: {
  heading: string;
  headings: string[];
  rows: string[][];
}) => `#### ${heading}

|${headings.join('|')}|
|${headings.map(() => '---').join('|')}|
${rows.map((row) => `|${row.join('|')}|`).join('\n')}
`;

/**
 * Generates a report of all disabled directives, as a Markdown table; note that
 * the platform here defaults to Linux, not BSD, since the assumption is this is
 * run in CI where Linux is more prevalent.
 */
export const dangerReport = async ({
  platform = GrepPlatform.Linux,
  scope = GitScope.Branch,
  baseBranch = 'main',
  currentBranch,
}: {
  platform?: GrepPlatform;
  scope?: GitScope;
  baseBranch?: string;
  currentBranch?: string;
}) => {
  const directives = await reportDisabled({
    platform,
    scope,
    baseBranch,
    currentBranch,
  });
  const heading = 'Lintervention Report';
  const headings = ['Count', 'Rule'];

  if (directives.length === 0) {
    return `#### ${heading}

✨ No ESLint rules ignored!`;
  }

  const rows = directives.map(({ count, rule }) => [count, rule]);

  return table({ heading, headings, rows });
};

/**
 * Generates a report of all disabled directives, as an array of IOverruleReport
 * (i.e. counts keyed by rule name); note that the platform here defaults to
 * Linux, not BSD, since the assumption is this is run in CI where Linux is more
 * prevalent.
 */
export const dangerResults = async ({
  platform = GrepPlatform.Linux,
  scope = GitScope.Branch,
  baseBranch = 'main',
  currentBranch,
}: {
  platform?: GrepPlatform;
  scope?: GitScope;
  baseBranch?: string;
  currentBranch?: string;
}): Promise<IOverruleReport[]> => {
  return await reportDisabled({ platform, scope, baseBranch, currentBranch });
};
