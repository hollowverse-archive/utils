import { SecretsManager } from 'aws-sdk';
import { snakeCase } from 'lodash';
import { stripIndent } from 'common-tags';

export type ReadAwsSecretForStageOptions = {
  stage?: string;
  secretsManager?: SecretsManager;
  isJson?: boolean;
};

const defaultSecretsManager = new SecretsManager();

/**
 * Reads a secret from AWS Secrets Manager by its friendly name.
 *
 * The full secret name should follow the convention `stage/secretName`.
 *
 * The secret names passed to this function should not be prefixed
 * with the stage name. For example, if the stored secret name is
 * `production/github/accessToken`, the secret name passed to this
 * function should be just `github/accessToken`.
 *
 * The stage is automatically read from the `stage` option
 * or from `process.env.STAGE` and prepended to the secret name
 * before it's fetched.
 *
 * Note: this function only supports secrets stored as strings. It does not support
 * binary secrets. Also, if the string returned is JSON, you can set the `isJson`
 * option to get the parsed JSON object instead of having to parse it manually.
 *
 * @param secretName The friendly name of the secret, i.e. `github/accessToken`,
 * without the stage prefix.
 */
export const readAwsSecretForStage = async <T = string>(
  secretName: string,
  {
    stage = process.env.STAGE || 'local',
    secretsManager = defaultSecretsManager,
    isJson = false,
  }: ReadAwsSecretForStageOptions = {},
) => {
  const fallbackEnvVariableName = snakeCase(secretName).toUpperCase();
  const fallback = process.env[fallbackEnvVariableName];

  if (process.env.NODE_ENV !== 'production' && stage === 'local') {
    if (fallback === undefined) {
      console.warn(stripIndent`
        [WARN] Could not find a fallback value for AWS Secret "${secretName}".
        If you want to test functionality that depends on this secret locally,
        pass the secret as an environment variable named "${fallbackEnvVariableName}".
      `);
      console.warn('\n');
    }

    return fallback;
  }

  const response = await secretsManager
    .getSecretValue({
      SecretId: `${stage}/${secretName}`,
    })
    .promise();

  const rawSecret = response.SecretString || fallback;

  if (typeof rawSecret === 'string' && isJson) {
    return JSON.parse(rawSecret) as T;
  }

  return rawSecret as T | undefined;
};
