// routes/file.routes.mjs

import { Router } from "express";
import authMiddleware from "../middlewares/middlewares.auth.mjs";
import compressUpload from "../configs/compressMulter.mjs";import { compressPdf } from "../controllers/file.controller.mjs";

const router = Router();

router.post(
  "/compress",
  authMiddleware,
  compressUpload.single("pdf"),
  compressPdf
);

export default router;