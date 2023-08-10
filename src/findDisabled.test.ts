import { GrepPlatform } from './types';
import { findDisabled } from '.';

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

// This is kind of ridiculous
const indent = platform === GrepPlatform.BSD ? '   ' : '      ';

describe('findDisabled', () => {
  it('should correctly identify all eslint disable directives in the repo', async () => {
    const { stdout } = await findDisabled({ platform });

    expect(stdout).toBe(`${indent}5 no-console
${indent}2 import/no-extraneous-dependencies
${indent}1 @typescript-eslint/no-var-requires
${indent}1 @typescript-eslint/no-unused-vars
${indent}1 @typescript-eslint/no-non-null-assertion
${indent}1 no-undef
${indent}1 no-param-reassign
`);
  });
});
