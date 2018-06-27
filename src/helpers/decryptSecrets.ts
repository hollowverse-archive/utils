import path from 'path';
import { executeCommands } from './executeCommands';

export type Secret = {
  password: string;
  decryptedFilename: string;
};

/**
 * Decrypts sensitive AES-256-CBC encrypted files using OpenSSL.
 * @param secrets Array of secret definitions
 * @param baseDirectory The full path to the directory containing the encrypted secrets
 */
export async function decryptSecrets(
  secrets: Secret[],
  baseDirectory = './secrets',
) {
  return executeCommands(
    secrets.map(secret => {
      const { password, decryptedFilename } = secret;

      if (password === undefined) {
        throw new TypeError(
          `Decryption password for ${decryptedFilename} is undefined. ` +
            'Make sure you are passing the correct environment variable in your deploy script',
        );
      }

      const decryptedFilePath = path.join(baseDirectory, decryptedFilename);
      const encryptedFilePath = `${decryptedFilePath}.enc`;

      return `
        openssl aes-256-cbc \
          -in ${encryptedFilePath} \
          -out ${decryptedFilePath} \
          -d \
          -base64 \
          -pass pass:'${password}'
      `;
    }),
  );
}
