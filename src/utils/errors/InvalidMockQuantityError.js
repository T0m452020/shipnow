// Exclusivo Modulo de Mocks


import AppError from "./AppError.js";

class InvalidMockQuantityError extends AppError {
    constructor(message = "Invalid mock quantity") {
        super(message, 400);

        this.name = "InvalidMockQuantityError";
    }
}

export default InvalidMockQuantityError;