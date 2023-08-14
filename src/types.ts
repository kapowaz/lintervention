export enum GitScope {
  All = 'all',
  Branch = 'branch',
  Staged = 'staged',
}

export enum GrepPlatform {
  BSD = 'bsd',
  Linux = 'linux',
}

export interface IFindDisabled extends IGrepCommand {
  /**
   * Indicates the scope of the git command when performing the search against a
   * git diff; can be one of Staged (only files currently staged but not
   * committed), Branch (files that have changed in the specified base branch
   * compared to the current branch), or All, i.e. all files, regardless of git
   * status
   */
  scope?: GitScope;

  /**
   * When the scope is Branch, this permits overriding the default baseBranch
   * configuration value of 'main', e.g. if the base branch is called 'master'
   */
  baseBranch?: string;
}

export interface IGitCommand {
  xargs?: string;
  scope?: GitScope;
  baseBranch?: string;
}

export interface IGrepCommand {
  /**
   * Different platforms have different versions of grep whose command
   * syntax/structure, and output are subtly different; this allows us to
   * account for these differences when running in different environments, i.e.
   * MacOS (development) vs Linux (CI)
   */
  platform: GrepPlatform;

  /**
   * Along with the platform, this allows providing different arguments to grep
   * according to the platform
   */
  grepArguments?: string;

  /**
   * Boolean indicating if we’re just generating a summary of disabled
   * directives, or a full report
   */
  summary?: boolean;

  /**
   * An optional command to pipe into xargs ahead of the command to count
   * results, for example to specify a specific location to use as the input.
   */
  xargs?: string;
}

export interface IOutput {
  stdout: string;
  stderr: string;
}

export interface IOverruleReport {
  count: string;
  rule: string;
}
