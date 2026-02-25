export const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    if (!err.isOperational) {
        console.error(err);
    }

    res.status(statusCode).json({
        success: false,
        error: {
            code: err.code || 'INTERNAL_SERVER_ERROR',
            message: statusCode === 500 ? 'Something went wrong' : err.message,
        },
    });
};
