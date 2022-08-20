export enum GitScope {
  All = 'all',
  Branch = 'branch',
  Staged = 'staged',
}

export enum GrepPlatform {
  BSD = 'bsd',
  Linux = 'linux',
}

export interface IFindDisabled {
  platform: GrepPlatform;
  grepArguments?: string;
  summary?: boolean;
  findCommand?: string;
}

export interface IOutput {
  stdout: string;
  stderr: string;
}

export interface IOverruleReport {
  count: string;
  rule: string;
}
