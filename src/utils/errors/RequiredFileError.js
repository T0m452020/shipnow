import AppError from "./AppError.js";

class RequiredFileError extends AppError {
    constructor(message = "File is required") {
        super(message, 400);

        this.name = "RequiredFileError";
    }
}

export default RequiredFileError;