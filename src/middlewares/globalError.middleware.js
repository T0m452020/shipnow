import multer from "multer";
import logger from "../utils/logger/logger.js";

const globalErrorMiddleware = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal server error";
    let errors;

    if (err instanceof multer.MulterError) {
        statusCode = 400;

        if (err.code === "LIMIT_FILE_SIZE") {
            message = "File size exceeds the 5 MB limit";
        } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
            message = "Unexpected file field";
        } else {
            message = "File upload error";
        }
    }

    if (err.name === "CastError") {
        statusCode = 400;
        message = "Invalid ID";
    }

    if (err.code === 11000) {
        statusCode = 400;
        message = "Duplicate value";
    }

    if (err.name === "ValidationError") {
        statusCode = 400;
        message = "Validation error";

        errors = Object.fromEntries(
            Object.entries(err.errors).map(([field, error]) => [
                field,
                error.message,
            ])
        );
    }

    const response = {
        status: "error",
        message,
    };

    if (errors) {
        response.errors = errors;
    }

    if (statusCode >= 500) {
        logger.error(
            `${req.method} ${req.originalUrl} - ${message}`,
            {
                stack: err.stack,
            }
        );
    } else {
        logger.error(
            `${req.method} ${req.originalUrl} - ${message}`
        );
    }

    res.status(statusCode).json(response);
};

export default globalErrorMiddleware;