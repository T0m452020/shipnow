import AppError from "./AppError.js";

class InvalidDataError extends AppError {
    constructor(message = "Invalid data") {
        super(message, 400);

        this.name = "InvalidDataError";
    }
}

export default InvalidDataError;