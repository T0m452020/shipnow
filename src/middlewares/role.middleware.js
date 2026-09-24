import InvalidDataError from "../utils/errors/InvalidDataError.js";

const roleMiddleware = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(
                new InvalidDataError("Authentication required")
            );
        }

        if (!allowedRoles.includes(req.user.role)) {
            return next(
                new InvalidDataError("Insufficient permissions")
            );
        }

        next();
    };
};

export default roleMiddleware;