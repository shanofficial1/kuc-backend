import bcrypt from "bcryptjs";

import ForgotPasswordRequest from "../models/forgotPasswordRequest.mjs";
import Users from "../models/users.mjs";
import StudentProfile from "../models/studentProfile.mjs";

import { createNotification } from "../utils/createNotification.mjs";

export const createForgotPasswordRequest = async (req, res) => {
  try {

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    // ==============================
    // FIND USER
    // ==============================

    const user = await Users.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email.",
      });
    }

    // ==============================
    // FIND PROFILE
    // ==============================

    const profile = await StudentProfile.findOne({
      userId: user._id,
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found.",
      });
    }

    // ==============================
    // PREVENT DUPLICATE REQUEST
    // ==============================

    const existing = await ForgotPasswordRequest.findOne({
      studentId: user._id,
      status: "pending",
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "A password reset request is already pending.",
      });
    }

    // ==============================
    // CREATE REQUEST
    // ==============================

    const request = await ForgotPasswordRequest.create({

      studentId: user._id,

      studentName:
        profile.personal_details?.fullName ||
        user.name,

      email: user.email,

      department:
        profile.academic_details?.department || "",

      program:
        profile.academic_details?.degreeName || "",

      requestNo: `FP-${Date.now()}`,

      status: "pending",

    });

    // ==============================
    // NOTIFICATION
    // ==============================

    await createNotification({

      studentId: user._id,

      title: "Password Reset Request Submitted",

      message:
        "Your password reset request has been submitted successfully. Please wait for administrator approval.",

      type: "info",

    });

    // ==============================
    // SUCCESS
    // ==============================

    return res.status(201).json({

      success: true,

      message: "Password reset request submitted successfully.",

      request,

    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({

      success: false,

      message: err.message,

    });

  }
};


export const getPendingForgotPasswordRequests = async (req, res) => {
  try {

    const { department } = req.body;

    const filter = {
      status: "pending",
    };

    // Filter by department if provided
    if (department && department.trim() !== "") {
      filter.department = department.trim();
    }

    const requests = await ForgotPasswordRequest.find(filter)
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({

      success: true,

      count: requests.length,

      requests,

    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({

      success: false,

      message: err.message,

    });

  }
};


export const resetStudentPassword = async (req, res) => {
  try {

    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password is required.",
      });
    }

    const request = await ForgotPasswordRequest.findById(
      req.params.id
    );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found.",
      });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Request has already been processed.",
      });
    }

    const user = await Users.findById(request.studentId)
      .select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    // ===============================
    // CHANGE PASSWORD
    // ===============================

    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    user.password = hashedPassword;

    // Force student to change password after login
    user.mustChangePassword = true;

    await user.save();

    // ===============================
    // COMPLETE REQUEST
    // ===============================

    request.status = "completed";

    request.reviewedBy = null;

    request.reviewedAt = new Date();

    await request.save();

    // ===============================
    // NOTIFICATION
    // ===============================

    await createNotification({

      studentId: user._id,

      title: "Password Reset",

      message:
        "Your password has been reset by the administrator. Please log in using the new password and change it immediately.",

      type: "info",

    });

    return res.status(200).json({

      success: true,

      message: "Password reset successfully.",

    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({

      success: false,

      message: err.message,

    });

  }
};


export const getMyForgotPasswordRequests = async (req, res) => {
  try {

    const userId = req.user._id;

    const requests = await ForgotPasswordRequest.find({

      studentId: userId,

    }).sort({

      createdAt: -1,

    });

    return res.status(200).json({

      success: true,

      count: requests.length,

      requests,

    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({

      success: false,

      message: err.message,

    });

  }
};

export const rejectForgotPasswordRequest = async (req, res) => {
  try {

    const { reason = "" } = req.body;

    const request = await ForgotPasswordRequest.findById(
      req.params.id
    );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found.",
      });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Request has already been processed.",
      });
    }

    request.status = "rejected";

    request.adminRemark = reason;

    request.reviewedBy = req.user._id;

    request.reviewedAt = new Date();

    await request.save();

    await createNotification({

      studentId: request.studentId,

      title: "Password Reset Request Rejected",

      message: reason
        ? `Your password reset request has been rejected. Reason: ${reason}`
        : "Your password reset request has been rejected.",

      type: "warning",

    });

    return res.status(200).json({

      success: true,

      message: "Password reset request rejected successfully.",

    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({

      success: false,

      message: err.message,

    });

  }
};

