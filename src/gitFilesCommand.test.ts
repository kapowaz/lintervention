import { GitScope } from './types';
import { gitFilesCommand } from '.';

describe('gitFilesCommand', () => {
  it('should return the correct command if scope is branch', () => {
    const result = gitFilesCommand({ scope: GitScope.Branch });
    expect(result).toBe(
      `git diff --name-only main...$(git branch | grep '*' | awk '{print $2}')`
    );
  });

  it('should return the correct command if a base branch name is supplied', () => {
    const result = gitFilesCommand({
      scope: GitScope.Branch,
      baseBranch: 'develop',
    });
    expect(result).toBe(
      `git diff --name-only develop...$(git branch | grep '*' | awk '{print $2}')`
    );
  });

  it('should return the correct command if scope is staged', () => {
    const result = gitFilesCommand({ scope: GitScope.Staged });
    expect(result).toBe('git diff --name-only --cached');
  });

  it('should return nothing if scope is all', () => {
    const result = gitFilesCommand({ scope: GitScope.All });
    expect(result).toBe('');
  });
});
