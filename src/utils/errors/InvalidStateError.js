import AppError from "./AppError.js";

class InvalidStateError extends AppError {
    constructor(message = "Invalid state") {
        super(message, 409);

        this.name = "InvalidStateError";
    }
}

export default InvalidStateError;