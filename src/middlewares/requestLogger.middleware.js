import logger from "../utils/logger/logger.js";

const requestLoggerMiddleware = (req, res, next) => {
    const start = Date.now();

    res.on("finish", () => {
        const duration = Date.now() - start;

        if (res.statusCode < 400) {
            logger.info("HTTP request", {
                method: req.method,
                url: req.originalUrl,
                statusCode: res.statusCode,
                duration: `${duration}ms`,
            });
        }
    });

    next();
};

export default requestLoggerMiddleware;