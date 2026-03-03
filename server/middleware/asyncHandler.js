/**
 * A wrapper to catch errors in asynchronous route handlers.
 * Eliminates the need for try-catch blocks in every controller method.
 */
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
