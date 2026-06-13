import { Router } from "express";
import authMiddleware from "../middlewares/middlewares.auth.mjs";

import {
  createUnlockRequest,
  getMyUnlockRequests,
  getPendingUnlockRequests,
  getUnlockRequestById,
  approveUnlockRequest,
  rejectUnlockRequest,getEligibility
} from "../controllers/unlockRequest.controller.mjs";

const router = Router();

router.post(
  "/",
  createUnlockRequest
);

router.get(
  "/my",
  authMiddleware,
  getMyUnlockRequests
);

router.get(
  "/pending",
  authMiddleware,
  getPendingUnlockRequests
);

router.get(
  "/eligibility",
  authMiddleware,
  getEligibility
);

router.get(
  "/:id",
  authMiddleware,
  getUnlockRequestById
);

router.post(
  "/:id/approve",
  authMiddleware,
  approveUnlockRequest
);

router.post(
  "/:id/reject",
  authMiddleware,
  rejectUnlockRequest
);

export default router;