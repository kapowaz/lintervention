import { GitScope } from './types';
import { gitCommand } from '.';

describe('gitCommand', () => {
  it('should just return the xargs argument if this is provided', () => {
    const result = gitCommand({
      scope: GitScope.Branch,
      xargs: 'ls -1d src/test/sample/*',
    });
    expect(result).toBe(`ls -1d src/test/sample/*`);
  });

  it('should return the correct command if scope is branch', () => {
    const result = gitCommand({ scope: GitScope.Branch });
    expect(result).toBe(
      `git diff --name-status main...$(git branch | grep '*' | awk '{print $2}') | grep '^[^D]' | awk '{print $2}'`
    );
  });

  it('should return the correct command if a base branch name is supplied', () => {
    const result = gitCommand({
      scope: GitScope.Branch,
      baseBranch: 'develop',
    });
    expect(result).toBe(
      `git diff --name-status develop...$(git branch | grep '*' | awk '{print $2}') | grep '^[^D]' | awk '{print $2}'`
    );
  });

  it('should return the correct command if scope is staged', () => {
    const result = gitCommand({ scope: GitScope.Staged });
    expect(result).toBe(
      `git diff --name-status --cached | grep '^[^D]' | awk '{print $2}'`
    );
  });

  it('should return nothing if scope is all', () => {
    const result = gitCommand({ scope: GitScope.All });
    expect(result).toBe('');
  });
});
