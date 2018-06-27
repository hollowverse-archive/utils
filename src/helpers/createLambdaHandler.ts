/**
 * Converts an async function to a callback-based Lambda handler.
 * If the function completes without throwing, the callback will
 * be called with the return value of the function (i.e. `done(null, returnValue)`).
 * If the function throws, the callback will be called with the error (i.e. `done(error)`).
 */
export const createLambdaHandler = <E, R>(
  handleEvent: (event: E, context: AWSLambda.Context) => Promise<R>,
): AWSLambda.Handler<E, R> => {
  return async (event, context, done) => {
    try {
      done(null, await handleEvent(event, context));
    } catch (e) {
      console.error(e);
      done(e);
    }
  };
};
