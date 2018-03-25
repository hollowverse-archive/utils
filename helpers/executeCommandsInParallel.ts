import {
  executeCommand,
  Command,
  ExecuteCommandOptions,
} from './executeCommand';
import bluebird from 'bluebird';

/**
 * Executes JS functions or shell commands in parallel and returns 1 as soon
 * as one command or function fails.
 * Supports asynchronous functions.
 * @param commands The shell commands or JavaScript functions to
 * execute in parallel
 */
export async function executeCommandsInParallel(
  commands: Command[],
  {
    concurrency = 3,
    ...restOptions
  }: ExecuteCommandOptions & { concurrency?: number } = {},
) {
  // Promise.all rejects as soon as one promise rejects
  bluebird.map(
    commands,
    async command => executeCommand(command, restOptions),
    {
      concurrency,
    },
  );
}

export default executeCommandsInParallel;
