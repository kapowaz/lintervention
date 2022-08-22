/* eslint-disable no-console, @typescript-eslint/no-var-requires */
import { exec as execChildProcess } from 'child_process';
import util from 'util';

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
  const command = grepDisabledCommand({
    platform,
    grepArguments,
    summary,
    findCommand,
  });

  return exec(command);
};

/**
 * `findDisabled` executes a grep command against either all files in
 * the repository, or a subset (based on git history), and returns a promise
 * which when resolved will contain stdout and stderr for the result of
 * executing the command.
 */

export const grepDisabledCommand = ({
  /**
   * In CI we want to ensure we default to a GNU/Linux-like set of command-line
   * utilities; we can override this by passing the --platform argument in from
   * the command line when running the yarn script locally, otherwise by default
   * the yarn script will pass --platform bsd, since MacOS uses BSD-like command
   * line utilities.
   */
  platform,
  grepArguments = DEFAULT_ARGUMENTS.grepArguments,
  summary = DEFAULT_ARGUMENTS.summary,

  /**
   * If provided, this command will be prepended to the grep command run, using
   * xargs to pipe the resulting list of files to search across
   */
  findCommand = DEFAULT_ARGUMENTS.findCommand,
}: IFindDisabled = DEFAULT_ARGUMENTS): string => {
  /**
   * This variable lets us specify which files to explicitly include and
   * include, if we’re not supplying an explicit *list* of files to check; this
   * is only used when grepping across the entire repo, as opposed to only
   * checking staged files, or files changed within the current branch.
   */
  const excludeDirs = ['dist', 'node_modules', '.jest-cache']
    .map((dir) => `--exclude-dir=${dir}`)
    .join(' ');
  const includeFiles = ['jsx', 'js', 'ts', 'tsx']
    .map((ext) => `--include \\*.${ext}`)
    .join(' ');
  const includeExclude = `${excludeDirs} ${includeFiles}`;

  /**
   * Platform-specific flags to pass to each of the various commands run here.
   *
   * Since grep on BSD uses POSIX-compatible regular expressions, and GNU/Linux
   * uses Perl-compatible regular expressions, we need to provide the correct
   * platform-specific argument for which type of regular expressions to
   * interpret the search pattern as.
   */
  const platformGrepArguments =
    platform === GrepPlatform.BSD ? `-${grepArguments}E` : `-${grepArguments}P`;
  const directivesPattern =
    '(?:eslint-disable(?:(?:-next)?-line)?) (@?[-a-z0-9\\/]+(,\\s?@?[-a-z0-9\\/]+)*)';

  /**
   * This somewhat convoluted command executes grep across a set of input files,
   * looking for eslint disable directives, which can take one of several forms:
   *
   * - eslint-disable <directive(s)>
   * - eslint-disable-line <directive(s)>
   * - eslint-disable-next-line <directive(s)>
   *
   * <directive(s)> then can also appear as either a single entry, or
   * comma-separated values
   *
   * Once the list of disabled directives has been acquired, it is run through a
   * few other commands to sort and count occurrences, then print a unique list
   * of directives and occurrence count, sorted by occurrences.
   */
  const grepCommand = `grep ${platformGrepArguments} ${includeExclude} "${directivesPattern}"`;
  const sedCommand = `sed -E 's/eslint-disable|eslint-disable-line|eslint-disable-next-line//g'`;
  const countUniques = `tr ',' '\\n' | tr -d ' ' | sort | uniq -c | sort -nr`;
  const fullCommand = summary
    ? `${grepCommand} | ${sedCommand} | ${countUniques}`
    : grepCommand;

  /**
   * If we’re checking all files, we can simply run the above-constructed grep
   * command, but if a findCommand has been supplied, this should be piped into
   * the grep command using xargs.
   */
  const command =
    findCommand !== '' ? `${findCommand} | xargs ${fullCommand}` : fullCommand;

  return command;
};
