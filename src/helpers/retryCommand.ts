import {
  executeCommand,
  Command,
  ExecuteCommandOptions,
} from './executeCommand';

/**
 * Retries a JS or shell command multiple times before giving up.
 * @param command The shell command or JavaScript function to execute,
 * the JS function must return a number. `0` indicates success, any other value indicates failure.
 * @param maxNumAttempts How many times should the `command` be retried
 */
export async function retryCommand(
  command: Command,
  maxNumAttempts = 5,
  executeCommandOptions?: ExecuteCommandOptions,
) {
  let numAttempts = 0;
  while (numAttempts < maxNumAttempts) {
    try {
      /* eslint-disable-next-line no-await-in-loop */
      await executeCommand(command, executeCommandOptions);
      break;
    } catch (e) {
      numAttempts += 1;
      if (numAttempts === maxNumAttempts) {
        throw new Error(e);
      }
    }
  }
}
