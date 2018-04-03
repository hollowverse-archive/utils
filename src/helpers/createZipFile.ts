import glob from 'glob';
import JsZip from 'jszip';
import flatten from 'lodash/flatten';
import fs from 'fs';

/**
 * Compresses all files that match an array of glob patterns into a ZIP file written to the
 * specified path.
 * The contents of the ZIP file will have the same folder structure of the matched files, with
 * the root of the file matching the current working directory.
 * @param path The full path where the ZIP file will be saved, including the
 * filename and extension
 * @param patterns Glob patterns of files to include in the ZIP file
 * @param ignore Patterns of files to ignore
 */
export async function createZipFile(
  path: string,
  patterns: string[],
  ignore?: string[],
): Promise<void> {
  const files = flatten(
    patterns.map(pattern => glob.sync(pattern, { nodir: true, ignore })),
  );
  const zipFile = new JsZip();

  files.forEach(file =>
    // @ts-ignore
    zipFile.file(file, fs.createReadStream(file), { createFolders: true }),
  );

  return new Promise<void>((resolve, reject) => {
    zipFile
      .generateNodeStream({ streamFiles: true, type: 'nodebuffer' })
      .pipe(fs.createWriteStream(path))
      .on('finish', resolve)
      .on('error', reject);
  });
}

export default createZipFile;
