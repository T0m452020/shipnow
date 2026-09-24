import { Router } from "express";
import upload from "../middlewares/upload.middleware.js";
import UploadController from "../controllers/upload.controller.js";

const router = Router();

router.post(
    "/",
    upload.single("file"),
    UploadController.uploadFile
);

export default router;