import UnlockRequest from "../models/unlockRequest.mjs";
import StudentProfile from "../models/studentProfile.mjs";
import Users from "../models/users.mjs";
import {
  isEmptyFileValue,
  sanitizeProfileSection,
  stripUndefinedDeep
}
from "../utils/profileDataSanitizer.mjs";

export const createUnlockRequest = async (req, res) => {
  try {

    const userId = req.user._id;
    const { reason = "" } = req.body;

    // Check user
    const user = await Users.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check profile
    const profile = await StudentProfile.findOne({
      userId,
    });

    console.log("========== CREATE PROFILE UPDATE ==========");
console.log("User ID:", userId.toString());
console.log("Profile User ID:", profile.userId.toString());
console.log("fullUnlockActive:", profile.fullUnlockActive);
console.log("canEdit:", user.canEdit);


    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    // Already active?
    if (profile.fullUnlockActive) {
      return res.status(400).json({
        success: false,
        message: "A full unlock request is already active.",
      });
    }

    // Activate unlock workflow
    profile.fullUnlockActive = true;

    await profile.save();

    // Student cannot edit until HOD approves
    await Users.findByIdAndUpdate(
      userId,
      {
        canEdit: false,
      }
    );

    // Create unlock request
   const request = await UnlockRequest.create({

  studentId: userId,

  department:
    profile.academic_details?.department || "",

  requestNo: `UNLOCK-${Date.now()}`,

  reason,

  status: "pending",

});

    return res.status(201).json({

      success: true,

      message: "Unlock request submitted successfully.",

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

export const getMyUnlockRequests = async (req, res) => {
  try {

    const userId = req.user._id;

    const profile = await StudentProfile.findOne({
      userId,
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    const requests = await UnlockRequest.find({
      studentId: userId,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({

      success: true,

      fullUnlockActive: profile.fullUnlockActive,

      canEdit: (
        await Users.findById(userId)
          .select("canEdit")
      )?.canEdit || false,

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

export const getPendingUnlockRequests = async (req, res) => {
  try {

    const requests = await UnlockRequest.find({
      status: "pending",
    })
      .populate(
        "studentId",
        "name email"
      )
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



export const getUnlockRequestById = async (req, res) => {
  try {

    const request = await UnlockRequest.findById(req.params.id)
      .populate(
        "studentId",
        "name email"
      );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Unlock request not found",
      });
    }

    return res.status(200).json({

      success: true,

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


export const approveUnlockRequest = async (req, res) => {
  try {

    const request = await UnlockRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Unlock request not found",
      });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Request already processed",
      });
    }

    const profile = await StudentProfile.findOne({
      userId: request.studentId,
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    // =====================================
    // ENABLE FULL UNLOCK
    // =====================================

profile.fullUnlockActive = true;

console.log("Before save:", profile.fullUnlockActive);

await profile.save();

const updatedProfile = await StudentProfile.findOne({
  userId: request.studentId,
});

console.log("After save:", updatedProfile.fullUnlockActive);
    // =====================================
    // ENABLE PROFILE EDITING
    // =====================================

    await Users.findByIdAndUpdate(
      request.studentId,
      {
        canEdit: true,
      }
    );

    // =====================================
    // APPROVE REQUEST
    // =====================================

    request.status = "approved";

    // Temporary dummy admin ID
    request.reviewedBy = "507f1f77bcf86cd799439011";

    request.reviewedAt = new Date();

    await request.save();
    await createNotification({
  studentId: request.studentId,

  title: "Profile Editing Enabled",

  message:
    "Your unlock request has been approved. You can now edit your profile and submit the updated information.",

  type: "unlock_approved",

  unlockRequestId: request._id,
});
    return res.status(200).json({
      success: true,
      message: "Unlock request approved successfully.",
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};

export const rejectUnlockRequest = async (req, res) => {
  try {

    const { reason = "" } = req.body;

    const request = await UnlockRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Unlock request not found",
      });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Request already processed",
      });
    }

    const profile = await StudentProfile.findOne({
      userId: request.studentId,
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    // =====================================
    // REJECT FULL UNLOCK
    // =====================================

    profile.fullUnlockActive = false;

    await profile.save();

    await Users.findByIdAndUpdate(
      request.studentId,
      {
        canEdit: false,
      }
    );

    request.status = "rejected";

    request.remarks = reason;

    request.reviewedBy = req.user._id;

    request.reviewedAt = new Date();

    await request.save();

    await createNotification({
  studentId: request.studentId,

  title: "Unlock Request Rejected",

  message: remarks
    ? `Your unlock request has been rejected. Reason: ${remarks}`
    : "Your unlock request has been rejected.",

  type: "unlock_rejected",

  unlockRequestId: request._id,
});

    return res.status(200).json({
      success: true,
      message: "Unlock request rejected successfully.",
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};



export const getEligibility = async (req, res) => {
  try {

    const userId = req.user._id;

    const profile = await StudentProfile.findOne({
      userId,
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    const user = await Users.findById(userId)
      .select("canEdit");

    const maxSlots = 5;

    const pendingCorrections =
      profile.fieldCorrectionCount || 0;

    const availableSlots =
      Math.max(0, maxSlots - pendingCorrections);

    return res.status(200).json({

      success: true,

      // Full Unlock
      fullUnlockActive: profile.fullUnlockActive,

      canEdit: user?.canEdit || false,

      canRequestFullUnlock: !profile.fullUnlockActive,

      // Field Correction
      pendingCorrections,

      availableSlots,

      maxSlots,

      canRequestFieldCorrection:
        availableSlots > 0,

    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};