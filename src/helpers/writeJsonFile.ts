import { writeFile, PathLike, WriteFileOptions } from './writeFile';

export async function writeJsonFile(
  path: PathLike,
  data: any,
  options?: WriteFileOptions,
) {
  return writeFile(path, JSON.stringify(data, undefined, 2), options);
}

export default writeJsonFile;
