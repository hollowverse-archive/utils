import compact from 'lodash/compact';

/**
 * Converts an environment variable to a `boolean`
 * Returns `false` if the value is `"false"`, `"0"` or `undefined`.
 * Otherwise, returns `true`.
 */
export const parseBooleanEnvVariable = (variable: string | undefined) => {
  if (
    variable === undefined ||
    variable.toLowerCase() === 'false' ||
    variable === '0'
  ) {
    return false;
  }

  return true;
};

/**
 * Creates a function that returns the passed value if the given `condition` evaluates to `true`,
 * or `undefined` (or the specified `fallback` value) otherwise.
 * Arrays are treated specially. If the passed `value` is an array, and the `condition`
 * evaluates to `true`, a new array is returned with all the falsey values in the original array
 * removed. If the `condition` evaluates to `false`, and the `fallback` value is falsey,
 * the fallback value will default to an empty array. This is to make it convenient to compose
 * configurations that expect arrays of strings or objects and be able to spread the arrays
 * without having to worry about spreading `undefined` (`[...undefined]`)
 * (which would be a runtime error).
 *
 * @example
 * ```javascript
 * const isCi = process.env.CI;
 * const isProd = process.env.NODE_ENV === 'production';
 * const isReact = process.env.REACT === 'true';
 *
 * const ifCi = createConditionalWithFallback(isCi);
 * const ifProd = createConditionalWithFallback(isProd);
 * const ifReact = createConditionalWithFallback(isReact);
 *
 * const deploymentTasks = [ifCi('yarn publish') || 'yarn test'];
 *
 * const babelConfig = {
 *  presets: compact([
 *   'babel-preset-env',
 *   ...ifReact(['babel-preset-react', ifProd('babel-preset-minify')])
 *  ]),
 * };
 * ```
 */
export function createConditionalWithFallback(condition: boolean) {
  return <T, F = undefined>(
    value: T,
    fallback?: F,
  ): T extends any[] ? NonFalsey<T | F | any[]> : T | F => {
    if (Array.isArray(value)) {
      return (condition ? compact(value) : fallback || []) as any;
    }

    return (condition ? value : fallback) as any;
  };
}

type NonFalsey<T> = T extends (false | '' | 0) ? never : NonNullable<T>;

export const isTest = process.env.NODE_ENV === 'test';

export const isProduction = process.env.NODE_ENV === 'production';

export const isCi = parseBooleanEnvVariable(process.env.CI);

export const isDevelopment = process.env.NODE_ENV === 'development';

export const isDev = isDevelopment;

export const isProd = isProduction;

export const isHot = parseBooleanEnvVariable(process.env.HOT);

export const isPreact = parseBooleanEnvVariable(process.env.PREACT);

export const isReact = !isPreact;

export const isEs5 = parseBooleanEnvVariable(process.env.ES5);

export const isEsNext = !isEs5;

export const isPerf = !parseBooleanEnvVariable(process.env.NO_PERF_CHECKS);

export const shouldTypeCheck = !parseBooleanEnvVariable(
  process.env.NO_TYPE_CHECK,
);

export const isDebug = parseBooleanEnvVariable(process.env.DEBUG);

export const ifProd = createConditionalWithFallback(isProd);

export const ifHot = createConditionalWithFallback(isHot);

export const ifTest = createConditionalWithFallback(isTest);

export const ifDev = createConditionalWithFallback(isDev);

export const ifReact = createConditionalWithFallback(isReact);

export const ifPreact = createConditionalWithFallback(isPreact);

export const ifEs5 = createConditionalWithFallback(isEs5);

export const ifEsNext = createConditionalWithFallback(isEsNext);

export const ifCi = createConditionalWithFallback(isCi);

export const ifPerf = createConditionalWithFallback(isPerf);

export const ifDebug = createConditionalWithFallback(isDebug);
