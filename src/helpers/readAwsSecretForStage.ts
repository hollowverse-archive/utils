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
 * Access a secret string stored in AWS Secrets Manager by the secret's friendly
 * name.
 * The full secret name should follow the convention `stage/secretName`.
 * The stage is automatically prepended to the secret name following so you
 * only have to provide the actual secret name.
 * If no `stage` is provided, it will try to read the stage from `process.env.STAGE`.
 * A fallback value will be used if the secret is not found or if the stage is
 * not specified.
 *
 * Note: this function only supports secrets stored as string. It does not support
 * binary secrets. Also, if the string returned is JSON, you can set the `isJson`
 * option to get the parsed JSON object instead of having to parse it manually.
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
