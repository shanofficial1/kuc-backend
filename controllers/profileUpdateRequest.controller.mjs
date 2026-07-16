import ProfileUpdateRequest from "../models/profileUpdateRequest.mjs";
import StudentProfile from "../models/studentProfile.mjs";
import Users from "../models/users.mjs";
import {sanitizeProfileSection,stripUndefinedDeep}from "../utils/profileDataSanitizer.mjs";
import DropdownRequest from "../models/dropdownRequest.mjs";
import { createNotification } from "../utils/createNotification.mjs";
const FIELD_LABELS = {
  specialization: "Specialization / Research Area",
  faculty: "Faculty",
  department: "Department",
  degreeName: "Degree Name",
};

export const createProfileUpdateRequest = async (req, res) => {
  try {

    const userId = req.user._id;

    const {
      updateType,
      changes,
      remarks = "",
    } = req.body;

    // =====================================
    // VALIDATE UPDATE TYPE
    // =====================================

    if (!["full_profile", "field_correction"].includes(updateType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid update type.",
      });
    }

    // =====================================
    // FIND USER
    // =====================================

    const user = await Users.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // =====================================
    // FIND PROFILE
    // =====================================

    const profile = await StudentProfile.findOne({
      userId,
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found.",
      });
    }

 // =====================================
// FULL PROFILE REQUIRES UNLOCK
// =====================================

if (updateType === "full_profile") {

  if (!profile.fullUnlockActive) {
    return res.status(400).json({
      success: false,
      message: "Full unlock is not active.",
    });
  }

  if (!user.canEdit) {
    return res.status(400).json({
      success: false,
      message: "Profile editing is not enabled.",
    });
  }

}

    // =====================================
    // FULL PROFILE REQUEST
    // Only one pending request allowed
    // =====================================

    if (updateType === "full_profile") {

      const pending = await ProfileUpdateRequest.findOne({
        studentId: userId,
        updateType: "full_profile",
        status: "pending",
      });

      if (pending) {
        return res.status(400).json({
          success: false,
          message: "A full profile update request is already pending.",
        });
      }

    }

    // =====================================
    // FIELD CORRECTION LIMIT
    // Maximum 5 correction fields
    // =====================================

    if (updateType === "field_correction") {

      const requestedCount = changes.length;

      if (
        profile.fieldCorrectionCount + requestedCount > 5
      ) {
        return res.status(400).json({
          success: false,
          message: `Only ${
            5 - profile.fieldCorrectionCount
          } correction slot(s) available.`,
        });
      }

    }

    // =====================================
    // REQUEST NUMBER
    // =====================================

    const requestNo =
      updateType === "full_profile"
        ? `PROFILE-${Date.now()}`
        : `CORRECTION-${Date.now()}`;

    // =====================================
    // CREATE REQUEST
    // =====================================

const request = await ProfileUpdateRequest.create({

  studentId: userId,

  department:
    profile.academic_details?.department || "",

  requestNo,

  updateType,

  changes,

  remarks,

  status: "pending",

});

    // =====================================
// CREATE DROPDOWN REQUESTS
// =====================================

// =====================================
// CREATE DROPDOWN REQUESTS
// =====================================

if (updateType === "full_profile") {

  for (const [section, sectionData] of Object.entries(changes || {})) {

    if (!sectionData || typeof sectionData !== "object") {
      continue;
    }

    for (const [fieldKey, value] of Object.entries(sectionData)) {

      // Skip custom helper fields
      if (fieldKey.endsWith("Custom")) {
        continue;
      }

      // Only process "Other"
      if (value !== "__OTHER__") {
        continue;
      }

      const customKey = `${fieldKey}Custom`;

      const requestedValue =
        sectionData[customKey]?.trim();

      if (!requestedValue) {
        continue;
      }

      // Prevent duplicate pending requests
      const exists = await DropdownRequest.findOne({

        fieldKey,

        requestedValue,

        status: "pending",

      });

      if (exists) {
        continue;
      }

      await DropdownRequest.create({

        profileRequestId: request._id,

        studentId: userId,

        studentName:
          profile.personal_details?.fullName || "",

        registerNumber:
          profile.academic_details?.rollNumber || "",

        department:
          profile.academic_details?.department || "",

        program:
          profile.academic_details?.degreeName || "",

        section,

        fieldKey,

        fieldLabel:
          FIELD_LABELS[fieldKey] || fieldKey,

        requestedValue,

      });

    }

  }

}

    // =====================================
    // INCREMENT FIELD CORRECTION COUNT
    // =====================================

    if (updateType === "field_correction") {

      profile.fieldCorrectionCount += changes.length;

      await profile.save();

    }

    // =====================================
    // SUCCESS
    // =====================================

    return res.status(201).json({

      success: true,

      message: "Profile update request submitted successfully.",

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


export const approveProfileUpdateRequest = async (req, res) => {
  try {

    const request = await ProfileUpdateRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Profile update request not found.",
      });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Request already processed.",
      });
    }


    
    const profile = await StudentProfile.findOne({
      userId: request.studentId,
    });


    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found.",
      });
    }

    // =====================================
// CHECK PENDING DROPDOWN REQUESTS
// =====================================

const pendingDropdownRequests =
  await DropdownRequest.find({
    profileRequestId: request._id,
    status: "pending",
  }).select(
    "_id fieldKey fieldLabel requestedValue"
  );

if (pendingDropdownRequests.length > 0) {

  return res.status(400).json({

    success: false,

    code: "PENDING_DROPDOWN_REQUESTS",

    message:
      "This profile update contains pending dropdown requests. Resolve them before approving the profile.",

    profileRequestId: request._id,

    pendingDropdownRequests,

  });

}

    const sectionMap = {
      personal: "personal_details",
      academic: "academic_details",
      contact: "contact_details",
      family: "family_details",
      education: "education_details",
      financial: "financial_details",
      health: "health_details",
      professional: "professional_details",
      residential: "residential_details",
      documents: "documents_details",
    };


    // =====================================
// CHECK PENDING DROPDOWN REQUESTS
// =====================================

const pendingDropdowns = await DropdownRequest.find({
  profileRequestId: request._id,
  status: "pending",
});

if (pendingDropdowns.length > 0) {
  return res.status(400).json({
    success: false,
    message:
      "This profile update has pending dropdown requests. Resolve them first.",
  });
}

    // =====================================
    // FULL PROFILE UPDATE
    // =====================================

    if (request.updateType === "full_profile") {

  for (const [section, data] of Object.entries(request.changes || {})) {

    const dbSection = sectionMap[section];

    if (!dbSection || !data) continue;

    const cleanedData = sanitizeProfileSection(dbSection, data);
console.log("SECTION:", section);
console.log(
  "REQUEST DATA:",
  JSON.stringify(data, null, 2)
);
console.log(
  "CLEANED:",
  JSON.stringify(cleanedData, null, 2)
);
    if (dbSection === "education_details") {
        profile.set(dbSection, cleanedData);
        continue;
    }

    const existing =
        profile[dbSection]?.toObject?.() ||
        profile[dbSection] ||
        {};

    profile.set(
        dbSection,
        sanitizeProfileSection(dbSection, {
            ...stripUndefinedDeep(existing),
            ...cleanedData,
        })
    );
}

    }

    // =====================================
    // FIELD CORRECTION
    // =====================================

    if (request.updateType === "field_correction") {

      for (const item of request.changes || []) {

        const dbSection = sectionMap[item.section];

        if (!dbSection) continue;

        if (
          dbSection === "academic_details" &&
          item.field === "fellowshipLetter" &&
          isEmptyFileValue(item.requestedValue)
        ) {
          continue;
        }

        profile[dbSection][item.field] =
          stripUndefinedDeep(item.requestedValue);

      }

      // =====================================
      // RELEASE FIELD CORRECTION SLOTS
      // =====================================

      profile.fieldCorrectionCount -= request.changes.length;

      if (profile.fieldCorrectionCount < 0) {
        profile.fieldCorrectionCount = 0;
      }

    }

    // =====================================
    // CLOSE UNLOCK
    // =====================================

    profile.fullUnlockActive = false;
console.log(
  "PROFILE EDUCATION:",
  JSON.stringify(profile.education_details, null, 2)
);
    await profile.save();

    // =====================================
    // DISABLE EDITING
    // =====================================

    await Users.findByIdAndUpdate(
      request.studentId,
      {
        canEdit: false,
      }
    );

    // =====================================
    // APPROVE REQUEST
    // =====================================

    request.status = "approved";

    // Temporary dummy admin id
    request.reviewedBy = "507f1f77bcf86cd799439011";

    request.reviewedAt = new Date();

    await request.save();

    await createNotification({

    studentId: request.studentId,

    title: "Profile Update Approved",

    message:
        "Your profile update request has been approved successfully.",

    type: "approved",

    profileRequestId:
        request._id,

});

    return res.status(200).json({

      success: true,

      message: "Profile update approved successfully.",

    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};


export const rejectProfileUpdateRequest = async (req, res) => {
  try {

    const { remarks = "" } = req.body;

    const request = await ProfileUpdateRequest.findById(
      req.params.id
    );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Profile update request not found.",
      });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Request already processed.",
      });
    }

    const profile = await StudentProfile.findOne({
      userId: request.studentId,
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found.",
      });
    }

    // =====================================
    // REJECT LINKED DROPDOWN REQUESTS
    // =====================================

    await DropdownRequest.updateMany(
      {
        profileRequestId: request._id,
        status: "pending",
      },
      {
        $set: {
          status: "rejected",
          adminRemark: "Profile update request rejected.",
          reviewedBy: req.user._id,
          reviewedAt: new Date(),
        },
      }
    );

    // =====================================
    // END UNLOCK WORKFLOW
    // =====================================

    profile.fullUnlockActive = false;

    await profile.save();

    // =====================================
    // DISABLE EDITING
    // =====================================

    await Users.findByIdAndUpdate(
      request.studentId,
      {
        canEdit: false,
      }
    );

    // =====================================
    // REJECT PROFILE REQUEST
    // =====================================

    request.status = "rejected";

    request.remarks = remarks;

    request.reviewedBy = req.user._id;

    request.reviewedAt = new Date();

    await request.save();
await createNotification({

    studentId: request.studentId,

    title: "Profile Update Request Rejected",

    message: remarks
        ? `Your profile update request has been rejected. Reason: ${remarks}`
        : "Your profile update request has been rejected.",

    type: "rejected",

    profileRequestId: request._id,

});
    // =====================================
    // TODO
    // CREATE NOTIFICATION
    // =====================================

    return res.status(200).json({

      success: true,

      message: "Profile update request rejected successfully.",

    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({

      success: false,

      message: err.message,

    });

  }
};

export const getMyProfileUpdateRequests = async (req, res) => {
  try {

    const requests = await ProfileUpdateRequest.find({
      studentId: req.user._id,
    }).sort({
      createdAt: -1,
    });

    const data = await Promise.all(

      requests.map(async (request) => {

        const dropdownRequests =
          await DropdownRequest.find({
            profileRequestId: request._id,
          });

        return {
          ...request.toObject(),
          dropdownRequests,
        };

      })

    );

    return res.status(200).json({

      success: true,

      count: data.length,

      requests: data,

    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({

      success: false,

      message: err.message,

    });

  }
};

export const getPendingProfileUpdateRequests = async (req, res) => {
  try {

    const { department } = req.body;

    const filter = {
      status: "pending",
    };

    // Filter only if department is provided
    if (department) {
      filter.department = department;
    }

    const requests = await ProfileUpdateRequest.find(filter)
      .populate("studentId", "name email")
      .sort({
        createdAt: -1,
      });

    const data = await Promise.all(
      requests.map(async (request) => {

        const dropdownRequests = await DropdownRequest.find({
          profileRequestId: request._id,
        }).select(
          "section fieldKey fieldLabel requestedValue approvedValue status"
        );

        return {
          ...request.toObject(),
          dropdownRequests,
        };
      })
    );

    return res.status(200).json({
      success: true,
      count: data.length,
      requests: data,
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getProfileUpdateRequestById = async (req, res) => {
  try {

    const request = await ProfileUpdateRequest.findById(
      req.params.id
    ).populate(
      "studentId",
      "name email"
    );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Profile update request not found.",
      });
    }

    const dropdownRequests =
      await DropdownRequest.find({
        profileRequestId: request._id,
      }).select(
        "section fieldKey fieldLabel requestedValue approvedValue status adminRemark reviewedAt"
      );

    return res.status(200).json({

      success: true,

      request: {
        ...request.toObject(),
        dropdownRequests,
      },

    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({

      success: false,

      message: err.message,

    });

  }
};

