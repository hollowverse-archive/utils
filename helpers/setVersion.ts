#!/usr/bin/env node

import { writeJsonFile } from './writeJsonFile';
import path from 'path';
import { trim } from 'lodash';

/**
 * This script is used during the deployment of packages that need to have a
 * version specified before they are published.
 *
 * The script sets `version` key in `package.json` during deployment to the
 * value of `TRAVIS_TAG`. That way we don't have to remember to set the version
 * key in `package.json` before publishing.
 *
 * If `TRAVIS_TAG` starts with a `v` such as `v4.0.2`, this script will strip out the `v`
 * to make `TRAVIS_TAG` semver-compatible.
 */
function getVersion() {
  const version = trim(process.env.TRAVIS_TAG);

  if (version[0] === 'v') {
    return version.substr(1);
  }

  return version;
}

async function setVersion() {
  const packagejsonPath = path.resolve(process.cwd(), 'package.json');
  const packageJson = require(packagejsonPath); // tslint:disable-line no-require-imports non-literal-require
  const version = getVersion();

  if (version) {
    await writeJsonFile(packagejsonPath, { ...packageJson, version });
  }
}

setVersion(); // tslint:disable-line no-floating-promises
