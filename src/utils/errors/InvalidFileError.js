class InvalidFileError extends Error {
    constructor(message = "Invalid file") {
        super(message);
        this.name = "InvalidFileError";
        this.statusCode = 400;
    }
}

export default InvalidFileError;