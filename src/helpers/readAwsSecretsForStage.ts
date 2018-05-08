import bluebird from 'bluebird';
import {
  ReadAwsSecretForStageOptions,
  readAwsSecretForStage,
} from './readAwsSecretForStage';
import { zipObject } from 'lodash';

/**
 * Reads all the secrets specified from AWS Secrets Manager and
 * returns an object whose keys are the secret names and whose values
 * are the corresponding secret values.
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
 * @param options Options passed to this function apply to _all_ secrets.
 * @see `readAwsSecretForStage`
 */
export const readAwsSecretsForStage = async <SecretName extends string>(
  secretNames: SecretName[],
  options: ReadAwsSecretForStageOptions = {},
) => {
  const values = await bluebird.map<string, string | undefined>(
    secretNames,
    async secretName => readAwsSecretForStage(secretName, options),
  );

  return zipObject(secretNames, values) as Record<
    SecretName,
    string | undefined
  >;
};
