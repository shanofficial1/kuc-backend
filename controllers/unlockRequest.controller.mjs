import UnlockRequest from "../models/UnlockRequest.mjs";
import StudentProfile from "../models/StudentProfile.mjs";
import Users from "../models/Users.mjs";
import {
  isEmptyFileValue,
  sanitizeProfileSection,
  stripUndefinedDeep
}
from "../utils/profileDataSanitizer.mjs";

export const createUnlockRequest =
async (req, res) => {

  try {

    const userId =
      req.user._id;

    const {
      requestType,
      correctionFields,
      reason,
      formData
    } = req.body;

    // ======================
    // VALIDATE TYPE
    // ======================

    if (
      ![
        "field_correction",
        "full_unlock"
      ].includes(requestType)
    ) {

      return res.status(400).json({
        message:
          "Invalid request type"
      });

    }

    // ======================
    // USER
    // ======================

    const user =
      await Users.findById(
        userId
      );

    if (!user) {

      return res.status(404).json({
        message:
          "User not found"
      });

    }

    // ======================
    // FIELD CORRECTION
    // ======================

    if (
      requestType ===
      "field_correction"
    ) {

   

   if (
  requestType ===
  "field_correction"
) {

  if (
    !correctionFields ||
    correctionFields.length === 0
  ) {

    return res.status(400).json({

      message:
        "At least one field is required"

    });

  }

  if (
    correctionFields.length > 5
  ) {

    return res.status(400).json({

      message:
        "Maximum 5 fields allowed in one request"

    });

  }

}

    }

    // ======================
    // FULL UNLOCK
    // ======================

if (
  requestType ===
  "full_unlock"
) {

  const pendingUnlock =
  await UnlockRequest.findOne({

    studentId: userId,

    requestType:
      "full_unlock",

    status:
      "pending"

  });


  if (
    pendingUnlock
  ) {

    return res.status(400)
    .json({

      message:
        "You already have a pending full unlock request"

    });

  }

}

if (
  requestType ===
  "field_correction"
) {

  const pendingCount =
  await UnlockRequest.countDocuments({

    studentId: userId,

    requestType:
      "field_correction",

    status:
      "pending"

  });

  if (
    pendingCount >= 5
  ) {

    return res.status(400)
    .json({

      message:
        "Maximum 5 pending correction requests allowed"

    });

  }

}
    // ======================
    // CREATE REQUEST
    // ======================

const request =
await UnlockRequest.create({

  studentId:
    userId,

  requestNo:
    `UNLOCK-${Date.now()}`,

  requestType,

  correctionFields:
    correctionFields || [],

  formData:
    formData || {},

  reason:
    reason || "",

  status:
    "pending"

});
await Users.findByIdAndUpdate(

  userId,

  {
    canEdit: false
  }

);
return res.status(201).json({

  success: true,

  message:
    "Request submitted successfully",

  request

});

  } catch (err) {

    console.log(err);

    return res.status(500).json({

      message:
        err.message

    });

  }

};



export const getMyUnlockRequests =
async (req, res) => {

  try {

    const requests =
    await UnlockRequest.find({

      studentId: req.user._id

    })
    .sort({
      createdAt: -1
    });

    return res.json(requests);

  } catch (err) {

    return res.status(500).json({
      message: err.message
    });

  }

};



export const getPendingUnlockRequests =
async (req, res) => {

  try {

    const requests =
    await UnlockRequest.find({

      status: "pending"

    })
    .populate(
      "studentId",
      "name email"
    )
    .sort({
      createdAt: -1
    });

    return res.json(requests);

  } catch (err) {

    return res.status(500).json({
      message: err.message
    });

  }

};




export const getUnlockRequestById =
async (req, res) => {

  try {

    const request =
    await UnlockRequest.findById(
      req.params.id
    )
    .populate(
      "studentId",
      "name email"
    );

    if (!request) {

      return res.status(404).json({
        message:
          "Request not found"
      });

    }

    return res.json(request);

  } catch (err) {

    return res.status(500).json({
      message: err.message
    });

  }

};



export const approveUnlockRequest =
async (req, res) => {

  try {

    const request =
      await UnlockRequest.findById(
        req.params.id
      );

    if (!request) {

      return res.status(404).json({
        message:
          "Request not found"
      });

    }

    if (
      request.status !==
      "pending"
    ) {

      return res.status(400).json({
        message:
          "Request already processed"
      });

    }

    // ======================
    // FULL UNLOCK
    // ======================

// ======================
// FULL UNLOCK
// ======================

if (
  request.requestType ===
  "full_unlock"
) {

  const profile =
  await StudentProfile.findOne({

    userId:
      request.studentId

  });

  if (!profile) {

    return res.status(404).json({
      message:
        "Profile not found"
    });

  }

  const sectionMap = {

    personal:
      "personal_details",

    academic:
      "academic_details",

    contact:
      "contact_details",

    family:
      "family_details",

    education:
      "education_details",

    financial:
      "financial_details",

    health:
      "health_details",

    professional:
      "professional_details",

    residential:
      "residential_details",

    documents:
      "documents_details"

  };
const updateData = {};

Object.entries(
  request.formData || {}
).forEach(

  ([section, data]) => {

    const dbSection =
      sectionMap[section];

    if (
      !dbSection ||
      !data
    ) {
      return;
    }

    const cleanedData =
      sanitizeProfileSection(
        dbSection,
        data
      );

    if (
      Object.keys(cleanedData).length ===
      0
    ) {
      return;
    }

    const existingSection =
      profile[dbSection]?.toObject?.() ||
      profile[dbSection] ||
      {};

    const mergedSection =
      sanitizeProfileSection(
        dbSection,
        {
          ...stripUndefinedDeep(existingSection),
          ...cleanedData
        }
      );

    profile.set(
      dbSection,
      mergedSection
    );

    updateData[dbSection] =
      cleanedData;

  }

);

console.log(
  JSON.stringify(
    updateData,
    null,
    2
  )
);

console.log(
  "fellowshipLetter:",
  updateData
    ?.academic_details
    ?.fellowshipLetter
);

await profile.save();

 

}
    // ======================
    // FIELD CORRECTION
    // ======================

    if (
      request.requestType ===
      "field_correction"
    ) {

      const profile =
      await StudentProfile.findOne({

        userId:
          request.studentId

      });

      if (!profile) {

        return res.status(404).json({
          message:
            "Profile not found"
        });

      }

      const sectionMap = {

  personal: "personal_details",

  academic: "academic_details",

  contact: "contact_details",

  health: "health_details",

  family: "family_details",

  education: "education_details",

  financial: "financial_details",

  professional: "professional_details",

  residential: "residential_details"

};

const updateData = {};

     request.correctionFields
.forEach(field => {

  const section =
    sectionMap[
      field.section
    ];

  const key =
    field.field;

  const value =
    field.requestedValue;

  if (
    !section ||
    value === undefined ||
    (
      section === "academic_details" &&
      key === "fellowshipLetter" &&
      isEmptyFileValue(value)
    )
  ) {
    return;
  }

  if (
    profile[section]
  ) {

    profile[section][key] =
      stripUndefinedDeep(value);

    if (!updateData[section]) {
      updateData[section] = {};
    }

    updateData[section][key] =
      stripUndefinedDeep(value);

  }

});

console.log(
  JSON.stringify(
    request.formData,
    null,
    2
  )
);

console.log(
  "FORM DATA",
  JSON.stringify(
    request.formData,
    null,
    2
  )
);

console.log(
  "ACADEMIC",
  JSON.stringify(
    profile.academic_details,
    null,
    2
  )
);

console.log(
  JSON.stringify(
    updateData,
    null,
    2
  )
);

console.log(
  "fellowshipLetter:",
  updateData
    ?.academic_details
    ?.fellowshipLetter
);

Object.keys(updateData).forEach((section) => {

  const cleanSection =
    sanitizeProfileSection(
      section,
      profile[section]?.toObject?.() ||
      profile[section] ||
      {}
    );

  profile.set(
    section,
    cleanSection
  );

});
      await profile.save();

    }

    request.status =
      "approved";

    request.reviewedBy =
      req.user._id;

    request.reviewedAt =
      new Date();

    await request.save();

    return res.json({

      success: true,

      message:
        "Request approved"

    });

  } catch (err) {

    return res.status(500).json({
      message:
        err.message
    });

  }

};

export const rejectUnlockRequest =
async (req, res) => {

  try {

    const {
      reason
    } = req.body;

    const request =
      await UnlockRequest.findById(
        req.params.id
      );

    if (!request) {

      return res.status(404).json({
        message:
          "Request not found"
      });

    }

    request.status =
      "rejected";

    request.reviewedBy =
      req.user._id;

    request.reviewedAt =
      new Date();

    request.remarks =
      reason;

    await request.save();

    return res.json({

      success: true,

      message:
        "Request rejected"

    });

  } catch (err) {

    return res.status(500).json({
      message:
        err.message
    });

  }

};


export const getEligibility =
async (req, res) => {

  try {

    const userId =
      req.user._id;

    const user =
      await Users.findById(
        userId
      );

    if (!user) {

      return res.status(404).json({
        message:
          "User not found"
      });

    }

const requests =
await UnlockRequest.find({

  studentId: userId,

  requestType:
    "field_correction"

});

const totalFieldsUsed =
requests.reduce(

  (total, request) =>

    total +
    (request.correctionFields?.length || 0),

  0

);


    const pendingUnlock =
    await UnlockRequest.findOne({

      studentId:
        userId,

      requestType:
        "full_unlock",

      status:
        "pending"

    });

return res.json({

  totalFieldsUsed,

  remainingFields:
    Math.max(
      0,
      5 - totalFieldsUsed
    ),

  canCreateCorrection:
    totalFieldsUsed < 5,

  pendingUnlock:
    !!pendingUnlock,

  canRequestFullUnlock:
    totalFieldsUsed >= 5 &&
    !pendingUnlock

});
  } catch (err) {

    return res.status(500).json({
      message:
        err.message
    });

  }

};
  
