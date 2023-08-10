import { GrepPlatform } from './types';
import { grepCommand } from '.';

describe('grepCommand', () => {
  it('should return the default command', () => {
    const result = grepCommand();
    expect(result).toBe(
      `grep -rohE --exclude-dir=dist --exclude-dir=node_modules --exclude-dir=.jest-cache --include \\*.jsx --include \\*.js --include \\*.ts --include \\*.tsx \"(?:eslint-disable(?:(?:-next)?-line)?) (@?[-a-z0-9\\/]+(,\\s?@?[-a-z0-9\\/]+)*)\" | sed -E 's/eslint-disable|eslint-disable-line|eslint-disable-next-line//g' | tr ',' '\\n' | tr -d ' ' | sort -d | uniq -c | sort -dr`
    );
  });

  it('should return the command with the correct arguments for GNU/Linux grep', () => {
    const result = grepCommand({ platform: GrepPlatform.Linux });
    expect(result).toBe(
      `grep -rohP --exclude-dir=dist --exclude-dir=node_modules --exclude-dir=.jest-cache --include \\*.jsx --include \\*.js --include \\*.ts --include \\*.tsx \"(?:eslint-disable(?:(?:-next)?-line)?) (@?[-a-z0-9\\/]+(,\\s?@?[-a-z0-9\\/]+)*)\" | sed -E 's/eslint-disable|eslint-disable-line|eslint-disable-next-line//g' | tr ',' '\\n' | tr -d ' ' | sort -d | uniq -c | sort -dr`
    );
  });
});
