import { Router } from "express";
import auth from "../../middleware/auth.js";
import { Role } from "../../generated/prisma/enums.js";
import uploadController from "./uploads.controller.js";
import multer, { memoryStorage } from 'multer'
import { uploadSingle } from "../../middleware/upload.js";

const upload = multer({storage:memoryStorage()})

const router:Router = Router();

router.post("/single", upload.single("file"), uploadSingle('file', '/images'), uploadController.uploadSingle);
router.post("/multiple",  uploadController.uploadMultiple);

const uploadRouter = router;
export default uploadRouter;