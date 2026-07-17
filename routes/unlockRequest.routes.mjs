import { Router } from "express";

import authMiddleware from "../middlewares/middlewares.auth.mjs";

import {
  createUnlockRequest,
  getMyUnlockRequests,
  getPendingUnlockRequests,
  getUnlockRequestById,
  approveUnlockRequest,
  rejectUnlockRequest,
  getEligibility,
} from "../controllers/unlockRequest.controller.mjs";

import {
  getUnlockRequestHistory,
} from "../controllers/unlockRequestHistory.controller.mjs";

const router = Router();

/* =====================================================
   STUDENT ROUTES
===================================================== */

// Submit Full Unlock Request
router.post(
  "/",
  authMiddleware,
  createUnlockRequest
);

// View My Unlock Requests
router.get(
  "/my",
  authMiddleware,
  getMyUnlockRequests
);

// Check Unlock Eligibility
router.get(
  "/eligibility",
  authMiddleware,
  getEligibility
);

// Unlock Request History
router.get(
  "/history",
  authMiddleware,
  getUnlockRequestHistory
);

/* =====================================================
   HOD / ADMIN ROUTES
===================================================== */

// View All Pending Unlock Requests
router.get(
  "/pending",
  getPendingUnlockRequests
);

// View Unlock Request Details
router.get(
  "/:id",
  getUnlockRequestById
);

// Approve Unlock Request
router.post(
  "/:id/approve",
  approveUnlockRequest
);

// Reject Unlock Request
router.post(
  "/:id/reject",
  rejectUnlockRequest
);

export default router;