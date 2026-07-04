import { Router } from "express";
import { uploadCV } from "../controllers/cvController.js";
import upload from "../middleware/multerMiddleware.js";
import { authenticateHealthCareProfessional } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/upload", authenticateHealthCareProfessional, upload.single("cv"), uploadCV);

export default router;
