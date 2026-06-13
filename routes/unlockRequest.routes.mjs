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
  getMyUnlockRequests
);

router.get(
  "/pending",
  getPendingUnlockRequests
);

router.get(
  "/eligibility",
  getEligibility
);

router.get(
  "/:id",
  getUnlockRequestById
);

router.post(
  "/:id/approve",
  approveUnlockRequest
);

router.post(
  "/:id/reject",
  rejectUnlockRequest
);

export default router;