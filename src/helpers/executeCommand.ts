import shelljs from 'shelljs';

export type Command = string | (() => void | Promise<void>);

export type ExecuteCommandOptions = {
  log?(command: string): void;
};

/**
 * A helper function that executes a single shell command or JavaScript function.
 * Supports asynchronous JS functions, and executes shell commands in a child process
 * so that the event loop is not blocked while executing the command.
 * @param command
 * @param options
 * @return A promise that resolves if the command was successful, otherwise throws an `Error`. If the
 * command is a shell command, the error message will be stderr of the command.
 */
export async function executeCommand(
  command: Command,
  { log = console.info.bind(console) }: ExecuteCommandOptions = {},
): Promise<void> {
  if (typeof command === 'function') {
    if (command.name && log !== undefined) {
      // tslint:disable-next-line:no-console
      log(`${command.name}()`);
    }

    return Promise.resolve(command());
  }

  const shellCommand = command
    .replace('\n', '')
    .replace(/\s+/g, ' ')
    .trim();

  if (log !== undefined) {
    log(shellCommand);
  }

  return new Promise<void>((resolve, reject) =>
    shelljs.exec(shellCommand, (code, stdout, stderr) => {
      if (code === 0) {
        resolve();
      } else {
        const error = new TypeError(stderr || stdout);
        reject(error);
      }
    }),
  );
}

export default executeCommand;
