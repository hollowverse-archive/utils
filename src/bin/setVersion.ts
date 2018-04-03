#!/usr/bin/env node

import { writeJsonFile } from '../helpers/writeJsonFile';
import path from 'path';
import { trim } from 'lodash';
import { stripIndent } from 'common-tags';
import bluebird from 'bluebird';

/**
 * This script is used during the deployment of packages that need to have a
 * version specified before they are published.
 *
 * The script sets `version` key in `package.json` during deployment to the
 * value passed via the CLI command:
 *
 * ```shell
 * yarn set-version 1.4.5
 * ```
 *
 * If no value is not passed, the script will look for an
 * environment variable named `TRAVIS_TAG`.
 *
 * That way we don't have to remember to set the version
 * key in `package.json` before publishing.
 *
 * If the version number starts with a `v` such as `v4.0.2`, this script will strip out the `v`
 * to make the version number semver-compatible.
 */
function getVersion() {
  const version = trim(process.argv[2] || process.env.TRAVIS_TAG);

  if (version.startsWith('v')) {
    return version.substr(1);
  }

  return version;
}

async function setVersion() {
  const version = getVersion();
  if (!version) {
    // tslint:disable-next-line:no-multiline-string
    throw new TypeError(stripIndent`
      Expected a semver version to be specified for set-version.
      
      Make sure a version is passed like this:

        yarn set-version 1.4.5
      
      or that you have an environment variable named "$TRAVIS_TAG"
    `);
  }

  const packageJsonPath = path.resolve(process.cwd(), 'package.json');
  const packageJson = require(packageJsonPath); // tslint:disable-line no-require-imports non-literal-require
  await writeJsonFile(packageJsonPath, { ...packageJson, version });
}

bluebird
  .try(async () => {
    await setVersion();
  })
  .catch(error => {
    console.error('Could not set version in package.json:', error.message);
    process.exit(1);
  });
