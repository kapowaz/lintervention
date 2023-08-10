/* eslint-disable no-console, @typescript-eslint/no-var-requires */
import { exec as execChildProcess } from 'child_process';
import util from 'util';

import { grepCommand } from './grepCommand';
import { GrepPlatform, IFindDisabled, IOutput } from './types';

const exec = util.promisify(execChildProcess);

const DEFAULT_ARGUMENTS = {
  platform: GrepPlatform.BSD,
  grepArguments: 'roh',
  summary: true,
  findCommand: '',
};

/**
 * This function generates a command using grep to run against either all files in
 * the repository, or a subset (based on git history).
 */

export const findDisabled = async ({
  platform,
  grepArguments,
  summary,
  findCommand,
}: IFindDisabled = DEFAULT_ARGUMENTS): Promise<IOutput> => {
  const command = grepCommand({
    platform,
    grepArguments,
    summary,
    findCommand,
  });

  return exec(command);
};
