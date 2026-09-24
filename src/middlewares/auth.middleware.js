import jwt from "jsonwebtoken";

import env from "../config/env.js";
import InvalidDataError from "../utils/errors/InvalidDataError.js";

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new InvalidDataError("Authentication token required");
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, env.jwtSecret);

        req.user = decoded;

        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return next(
                new InvalidDataError("Authentication token expired")
            );
        }

        if (error.name === "JsonWebTokenError") {
            return next(
                new InvalidDataError("Invalid authentication token")
            );
        }

        next(error);
    }
};

export default authMiddleware;