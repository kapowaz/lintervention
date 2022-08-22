import { GrepPlatform } from './types';
import { findDisabled, grepDisabledCommand } from '.';

describe('grepDisabledCommand', () => {
  it('should return the default command', () => {
    const result = grepDisabledCommand();
    expect(result).toBe(
      `grep -rohE --exclude-dir=dist --exclude-dir=node_modules --exclude-dir=.jest-cache --include \\*.jsx --include \\*.js --include \\*.ts --include \\*.tsx \"(?:eslint-disable(?:(?:-next)?-line)?) (@?[-a-z0-9\\/]+(,\\s?@?[-a-z0-9\\/]+)*)\" | sed -E 's/eslint-disable|eslint-disable-line|eslint-disable-next-line//g' | tr ',' '\\n' | tr -d ' ' | sort | uniq -c | sort -nr`
    );
  });

  it('should return the command with the correct arguments for GNU/Linux grep', () => {
    const result = grepDisabledCommand({ platform: GrepPlatform.Linux });
    expect(result).toBe(
      `grep -rohP --exclude-dir=dist --exclude-dir=node_modules --exclude-dir=.jest-cache --include \\*.jsx --include \\*.js --include \\*.ts --include \\*.tsx \"(?:eslint-disable(?:(?:-next)?-line)?) (@?[-a-z0-9\\/]+(,\\s?@?[-a-z0-9\\/]+)*)\" | sed -E 's/eslint-disable|eslint-disable-line|eslint-disable-next-line//g' | tr ',' '\\n' | tr -d ' ' | sort | uniq -c | sort -nr`
    );
  });
});

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

    expect(stdout).toBe(`${indent}3 no-console
${indent}1 no-undef
${indent}1 no-param-reassign
${indent}1 import/no-extraneous-dependencies
${indent}1 @typescript-eslint/no-var-requires
${indent}1 @typescript-eslint/no-unused-vars
${indent}1 @typescript-eslint/no-non-null-assertion
`);
  });
});
