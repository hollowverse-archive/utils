import awsSdk from 'aws-sdk';

type ReadAwsSecretOrFallbackOptions = {
  secretName: string;
  fallback?: string;
  stage?: string;
  secretsManager?: awsSdk.SecretsManager;
};

const defaultSecretsManager = new awsSdk.SecretsManager();

/**
 * Access a secret string stored in AWS Secrets Manager by the secret's friendly
 * name.
 * The full secret name should follow the convention `stage/secretName`.
 * The stage is automatically prepended to the secret name following so you
 * only have to provide the actual secret name.
 * A fallback value will be used if the secret is not found or if the stage is
 * not specified.
 */
export const readAwsSecretStringOrFallback = async ({
  stage,
  secretName,
  fallback,
  secretsManager = defaultSecretsManager,
}: ReadAwsSecretOrFallbackOptions) => {
  if (stage === undefined) {
    return fallback;
  }

  const response = await secretsManager
    .getSecretValue({
      SecretId: `${stage}/${secretName}`,
    })
    .promise();

  return response.SecretString || fallback;
};
