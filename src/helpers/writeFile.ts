import { PathLike, writeFile as writeFileCb } from 'fs';

export { PathLike };

export type WriteFileOptions =
  | { encoding?: string | null; mode?: number | string; flag?: string }
  | string
  | null;

/**
 *
 * @param path Full path to the file to be written, including the file name and extension
 */
export async function writeFile(
  path: PathLike,
  data: any,
  options?: WriteFileOptions,
) {
  return new Promise((resolve, reject) => {
    writeFileCb(path, data, options, err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

export default writeFile;
