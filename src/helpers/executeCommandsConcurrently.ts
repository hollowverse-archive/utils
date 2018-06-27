import {
  executeCommand,
  Command,
  ExecuteCommandOptions,
} from './executeCommand';
import bluebird from 'bluebird';

/**
 * Executes JS functions or shell commands concurrently and rejects as soon
 * as one command or function fails.
 * Supports asynchronous functions.
 * @param commands The shell commands or JavaScript functions to
 * execute concurrently
 */
export async function executeCommandsConcurrently(
  commands: Command[],
  {
    concurrency = 3,
    ...restOptions
  }: ExecuteCommandOptions & { concurrency?: number } = {},
) {
  await bluebird.map(
    commands,
    async command => executeCommand(command, restOptions),
    {
      concurrency,
    },
  );
}
