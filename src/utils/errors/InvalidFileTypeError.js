import AppError from "./AppError.js";

class InvalidFileTypeError extends AppError {
    constructor(message = "Invalid file type") {
        super(message, 400);

        this.name = "InvalidFileTypeError";
    }
}

export default InvalidFileTypeError;
