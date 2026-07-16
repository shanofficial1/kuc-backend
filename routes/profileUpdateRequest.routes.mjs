import { Router } from "express";

import authMiddleware from "../middlewares/middlewares.auth.mjs";

import {
  createProfileUpdateRequest,
  getMyProfileUpdateRequests,
  getPendingProfileUpdateRequests,
  getProfileUpdateRequestById,
  approveProfileUpdateRequest,
  rejectProfileUpdateRequest,
} from "../controllers/profileUpdateRequest.controller.mjs";

const router = Router();

/* =====================================================
   STUDENT ROUTES
===================================================== */

// Submit Profile Update Request
router.post(
  "/",
  authMiddleware,
  createProfileUpdateRequest
);

// View My Profile Update Requests
router.get(
  "/my",
  authMiddleware,
  getMyProfileUpdateRequests
);

/* =====================================================
   HOD / ADMIN ROUTES
===================================================== */

// View All Pending Requests
router.get(
  "/pending",
  getPendingProfileUpdateRequests
);

// View Request Details
router.get(
  "/:id",
  authMiddleware,
  getProfileUpdateRequestById
);

// Approve Profile Update Request
router.post(
  "/:id/approve",
  approveProfileUpdateRequest
);

// Reject Profile Update Request
router.post(
  "/:id/reject",
  authMiddleware,
  rejectProfileUpdateRequest
);



export default router;