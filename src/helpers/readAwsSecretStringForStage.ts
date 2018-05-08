import { SecretsManager } from 'aws-sdk';
import { snakeCase } from 'lodash';
import { stripIndent } from 'common-tags';

export type ReadAwsSecretStringForStageOptions = {
  stage?: string;
  secretsManager?: SecretsManager;
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
 * binary secrets.
 *
 * @param secretName The friendly name of the secret, i.e. `github/accessToken`,
 * without the stage prefix.
 */
export const readAwsSecretStringForStage = async (
  secretName: string,
  {
    stage = process.env.STAGE || 'local',
    secretsManager = defaultSecretsManager,
  }: ReadAwsSecretStringForStageOptions = {},
) => {
  const fallbackEnvVariableName = snakeCase(secretName).toUpperCase();
  const fallback = process.env[fallbackEnvVariableName];

  if (process.env.NODE_ENV !== 'production' && stage === 'local') {
    if (fallback === undefined) {
      console.warn(stripIndent`
        [WARN] Could not find a fallback value for AWS Secret "${secretName}".
        If you want to test functionality that depends on this secret locally,
        provide a value for this secret as an environment variable named
        "${fallbackEnvVariableName}".
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

  return response.SecretString || fallback;
};
