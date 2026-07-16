import express from "express";


import {
  createForgotPasswordRequest,
  getMyForgotPasswordRequests,
  getPendingForgotPasswordRequests,
  resetStudentPassword,
  rejectForgotPasswordRequest,
} from "../controllers/forgotPasswordRequest.controller.mjs";

const router = express.Router();

/* =====================================
   STUDENT
===================================== */

// Submit forgot password request
router.post(
  "/",
  createForgotPasswordRequest
);

// View own request history
router.get(
  "/my",
  getMyForgotPasswordRequests
);

/* =====================================
   ADMIN / HOD
===================================== */

// Pending requests
router.post(
  "/pending",
  getPendingForgotPasswordRequests
);

// Reset password
router.put(
  "/:id/reset",
  resetStudentPassword
);

// Reject request
router.put(
  "/:id/reject",
  rejectForgotPasswordRequest
);

export default router;