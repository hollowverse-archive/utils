import {
  executeCommand,
  Command,
  ExecuteCommandOptions,
} from './executeCommand';

/**
 * A helper function that executes shell commands or JavaScript functions.
 * Supports asynchronous JavaScript functions.
 * Simulates `set -e` behavior in shell, i.e. exits as soon as any commands fail
 * @return A promise that resolves if all commands were successful, otherwise rejects
 * on the first error. If the command is a shell command, the error message
 * will be stderr of the command.
 */
export async function executeCommands(
  commands: Command[],
  executeCommandOptions?: ExecuteCommandOptions,
): Promise<void> {
  for (const command of commands) {
    await executeCommand(command, executeCommandOptions);
  }
}

export default executeCommands;
