class UploadController {
    uploadFile(req, res) {
        res.status(200).json({
            status: "success",
            message: "File uploaded successfully",
            file: req.file
        });
    }
}

export default new UploadController();