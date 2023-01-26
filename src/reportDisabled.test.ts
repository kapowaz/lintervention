import { GitScope, GrepPlatform, reportDisabled } from '.';

/**
 * In order for these tests to pass in CI, the env variable GREP_PLATFORM needs
 * to be set to 'linux' in that environment. When running on MacOS locally you
 * can ignore this, but if you’re running on Linux locally run tests with
 * GREP_PLATFORM set, i.e.
 *
 * $ GREP_PLATFORM=linux yarn test
 */
const platform: GrepPlatform =
  (process.env.GREP_PLATFORM as GrepPlatform) || GrepPlatform.BSD;

describe('reportDisabled', () => {
  it('should return a structured report with only entries in the specified location', async () => {
    const result = await reportDisabled({
      platform,
      scope: GitScope.All,
      files: 'ls -1d src/test/sample/*',
    });
    expect(result).toEqual([
      { count: '1', rule: '@typescript-eslint/no-unused-vars' },
      { count: '1', rule: '@typescript-eslint/no-non-null-assertion' },
      { count: '1', rule: 'no-undef' },
      { count: '1', rule: 'no-param-reassign' },
      { count: '1', rule: 'no-console' },
      { count: '1', rule: 'import/no-extraneous-dependencies' },
    ]);
  });

  it('should return a structured report of disabled directives for the entire repo', async () => {
    const result = await reportDisabled({ platform, scope: GitScope.All });
    expect(result).toEqual([
      { count: '3', rule: 'no-console' },
      { count: '1', rule: '@typescript-eslint/no-var-requires' },
      { count: '1', rule: '@typescript-eslint/no-unused-vars' },
      { count: '1', rule: '@typescript-eslint/no-non-null-assertion' },
      { count: '1', rule: 'no-undef' },
      { count: '1', rule: 'no-param-reassign' },
      { count: '1', rule: 'import/no-extraneous-dependencies' },
    ]);
  });
});
