export class AppError extends Error {
    constructor({ message, statusCode = 500, code, data }) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.isOperational = true;
        this.data = data;

        Error.captureStackTrace(this, this.constructor);
    }
}
