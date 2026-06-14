import StudentProfile from "../models/StudentProfile.mjs";
import Users from "../models/Users.mjs";
import qs from "qs";
import ProfileUpdateRequest from "../models/ProfileUpdateRequest.mjs";

import {
  deepMerge
}
from "../utils/deepMerge.mjs";
import {
  buildNestedObjectFromDotPaths,
  isEmptyFileValue,
  sanitizeProfilePayload,
  setByDotPath
}
from "../utils/profileDataSanitizer.mjs";
export const CreateOrUpdate = async (req, res) => {
  const body = qs.parse(req.body);
  console.log("BODY =", JSON.stringify(body, null, 2));
  console.log("TYPE =", typeof body.professional_details);

console.log(
  "VALUE =",
  body.professional_details
);
  const files = req.files || {};
console.log("FILES =", files);
console.log("MEMBERSHIP FILES =", files.membershipDocs);
console.log(
  "BODY MEMBERSHIP =",
  body.professional_details?.membershipUrl
);

console.log(
  "FILES MEMBERSHIP =",
  files.membershipDocs
);
console.log(
  "VACCINATION FILE =",
  files.vaccinationDoc
);
  console.log(
  "PERSONAL DETAILS FROM FRONTEND",
  body.personal_details 
);

console.log(
  "PASSPORT EXPIRY FROM FRONTEND",
  body.personal_details?.passportExpiry
);

  try {

    if (req.user.role !== "student") {
      return res.status(403).json({
        message: "Only students allowed"
      });
    }

    const userId = req.user._id;

    const files = req.files || {};

    // ✅ Parse multipart nested fields properly

const jsonSections = [
  "academic_details",
  "personal_details",
  "contact_details",
  "health_details",
  "family_details",
  "financial_details",
  "professional_details",
  "residential_details",
  "education_details"
];

jsonSections.forEach(section => {

  if (
    body[section] &&
    typeof body[section] === "string"
  ) {

    try {

      body[section] =
        JSON.parse(body[section]);

    } catch (err) {

      console.log(
        `${section} parse failed`
      );

    }

  }

});

    const users = await Users.findById(userId);

    if (!users || !users.canEdit) {
      return res.status(403).json({
        message: "Editing not allowed"
      });
    }

    const existingProfile =
      await StudentProfile.findOne({ userId });

    const academic = body.academic_details;

    // =========================
    // ✅ FIRST SUBMISSION CHECK
    // =========================

    if (!existingProfile) {

      if (
        !academic?.rollNumber ||
        !academic?.admissionApplicationNumber ||
        !academic?.universityEnrollmentNumber
      ) {

        return res.status(400).json({
          message:
            "Academic identifiers required for first submission"
        });

      }
    }

    const admissionNumber =
      academic?.admissionApplicationNumber;

    const enrollmentNumber =
      academic?.universityEnrollmentNumber;

    const rollNumber =
      academic?.rollNumber;

    let errors = {};

    // =========================
    // ✅ DUPLICATE CHECKS
    // =========================

    if (admissionNumber) {

      const existing =
        await StudentProfile.findOne({
          "academic_details.admissionApplicationNumber":
            admissionNumber
        });

      if (
        existing &&
        existing.userId.toString() !== userId.toString()
      ) {

        errors.admissionApplicationNumber =
          "Already exists";

      }
    }

    if (enrollmentNumber) {

      const existing =
        await StudentProfile.findOne({
          "academic_details.universityEnrollmentNumber":
            enrollmentNumber
        });

      if (
        existing &&
        existing.userId.toString() !== userId.toString()
      ) {

        errors.universityEnrollmentNumber =
          "Already exists";

      }
    }

    if (rollNumber) {

      const existing =
        await StudentProfile.findOne({
          "academic_details.rollNumber":
            rollNumber
        });

      if (
        existing &&
        existing.userId.toString() !== userId.toString()
      ) {

        errors.rollNumber =
          "Already exists";

      }
    }

    if (Object.keys(errors).length > 0) {

      return res.status(400).json({
        message: "Duplicate fields",
        errors
      });

    }

    let updateData = {};

    // =========================
    // ✅ NORMAL FIELD MAPPING
    // =========================

    const sections = [
      "academic_details",
      "personal_details",
      "contact_details",
      "health_details",
      "family_details",
      "financial_details",
      "professional_details",
      "residential_details"
    ];

    sections.forEach(section => {

      if (body[section]) {

        for (let key in body[section]) {

          const value =
            body[section][key];

          if (
            value === undefined ||
            (
              section === "academic_details" &&
              key === "fellowshipLetter" &&
              isEmptyFileValue(value)
            )
          ) {
            continue;
          }

          updateData[`${section}.${key}`] =
            value;

        }

        console.log(
  typeof body.professional_details
);

console.log(
  body.professional_details
);
      }
    });

    // =========================
    // ✅ FILE FIELD MAP
    // =========================

    const fileFieldMap = {

     fellowshipLetter:
  "academic_details.fellowshipLetter",

      passportDoc:
        "personal_details.passportDoc",

      visaDoc:
        "personal_details.visaDoc",

      birthCertificateDoc:
        "personal_details.birthCertificateDoc",

      disabilityCertificate:
        "health_details.disabilityCertificate",

      vaccinationDoc:
        "health_details.vaccinationDoc",
        

      migrationUrl:
        "education_details.migrationUrl",

      feeWaiveDocument:
  "financial_details.feeWaiveUrl.document",

      hostelDeclarationForm:
        "residential_details.hostelDeclarationForm",

      profilePhoto:
        "documents.profilePhoto",

      signature:
        "documents.signature",

      identityProof:
        "documents.identityProof.document",

      incomeCertificate:
        "documents.legalCertificates.incomeCertificate",

      casteCertificate:
        "documents.legalCertificates.casteCertificate",

      nonCreamyLayerCertificate:
        "documents.legalCertificates.nonCreamyLayerCertificate",

      nativityCertificate:
        "documents.legalCertificates.nativityCertificate"
    };

console.log("FILES =", files);
console.log(
  "FELLOWSHIP =",
  files.fellowshipLetter
);
Object.keys(fileFieldMap).forEach(field => {
console.log("REQ FILES =", req.files);

  console.log(
    "DISABILITY =",
    req.files?.disabilityCertificate
  );

  console.log(
    "VACCINATION =",
    req.files?.vaccinationDoc
  );

  if (files[field]) {

    updateData[`${fileFieldMap[field]}`] = {

      url:
        files[field][0].path,

      name:
        files[field][0].originalname

    };

  }

});
    // =========================
    // ✅ EDUCATION ARRAY
    // =========================

    if (body.education_details?.education) {

      const educationArray =
        body.education_details.education;

      updateData["education_details.education"] =
        educationArray.map((edu, index) => ({

          ...edu,

          documentUrl:
  files.educationDocuments?.[index]
    ? {
        url:
          files.educationDocuments[index].path,
        name:
          files.educationDocuments[index].originalname
      }
    : edu.documentUrl 

        }));
    }

    // =========================
    // ✅ COMPETITIVE EXAMS
    // =========================

    if (body.education_details?.competitiveExams) {

      const exams =
        body.education_details.competitiveExams;

      updateData["education_details.competitiveExams"] =
        exams.map((exam, index) => ({

          ...exam,

       documentUrl:
  files.competitiveExamDocs?.[index]
    ? {
        url:
          files.competitiveExamDocs[index].path,
        name:
          files.competitiveExamDocs[index].originalname
      }
    : exam.documentUrl

        }));
    }

    // =========================
    // ✅ PUBLICATIONS
    // =========================

    if (body.professional_details?.publications) {

      const publications =
        body.professional_details.publications;

      updateData["professional_details.publications"] =
        publications.map((pub, index) => ({

          ...pub,

          url:
  files.publicationDocs?.[index]
    ? {
        url: files.publicationDocs[index].path,
        name: files.publicationDocs[index].originalname
      }
    : pub.url

        }));
    }

    // =========================
    // ✅ CONFERENCES
    // =========================

    if (body.professional_details?.conferences) {

      const conferences =
        body.professional_details.conferences;

      updateData["professional_details.conferences"] =
        conferences.map((conf, index) => ({

          ...conf,

          url:
  files.conferenceDocs?.[index]
    ? {
        url: files.conferenceDocs[index].path,
        name: files.conferenceDocs[index].originalname
      }
    : conf.url

        }));
    }

    // =========================
    // ✅ PATENTS
    // =========================

    if (body.professional_details?.patents) {

      const patents =
        body.professional_details.patents;

      updateData["professional_details.patents"] =
        patents.map((patent, index) => ({

          ...patent,

          document:
  files.patentDocs?.[index]
    ? {
        url: files.patentDocs[index].path,
        name: files.patentDocs[index].originalname
      }
    : patent.document

        }));
    }

    // =========================
    // ✅ EXPERIENCE
    // =========================

    if (body.professional_details?.experience) {

      const experience =
        body.professional_details.experience;

      updateData["professional_details.experience"] =
        experience.map((exp, index) => ({

          ...exp,

         url:
  files.experienceDocs?.[index]
    ? {
        url: files.experienceDocs[index].path,
        name: files.experienceDocs[index].originalname
      }
    : exp.url

        }));
    }

  if (body.professional_details?.membershipUrl) {

  updateData["professional_details.membershipUrl"] =
    body.professional_details.membershipUrl.map(
      (item, index) => ({

        url:
          files.membershipDocs?.[index]
            ? files.membershipDocs[index].path
            : item.url,

        name:
          files.membershipDocs?.[index]
            ? files.membershipDocs[index].originalname
            : item.name

      })
    );

}
    // =========================
    // ✅ TRANSCRIPTS
    // =========================

    if (files.transcripts) {

     updateData["documents.transcripts"] =
  files.transcripts.map(file => ({

    url: file.path,

    name: file.originalname

  }));
    }

    // =========================
    // ✅ SAVE PROFILE
    // =========================

  const existingData =
  await StudentProfile.findOne({
    userId
  });

Object.keys(updateData).forEach((key) => {

  if (
    updateData[key] === undefined ||
    (
      key ===
      "academic_details.fellowshipLetter" &&
      isEmptyFileValue(updateData[key])
    )
  ) {
    delete updateData[key];
  }

});

console.log(
  JSON.stringify(
    updateData,
    null,
    2
  )
);

console.log(
  "fellowshipLetter:",
  updateData[
    "academic_details.fellowshipLetter"
  ]
);

let finalData = {
  ...(existingData?.toObject() || {}),
};

Object.keys(updateData).forEach((key) => {

  setByDotPath(
    finalData,
    key,
    updateData[key]
  );

});

finalData =
  sanitizeProfilePayload(finalData);
console.log(
  JSON.stringify(
    updateData["professional_details.publications"],
    null,
    2
  )
);

console.log(
  JSON.stringify(
    updateData["professional_details.conferences"],
    null,
    2
  )
);

console.log(
  JSON.stringify(
    updateData["professional_details.experience"],
    null,
    2
  )
);

console.log(
  JSON.stringify(
    updateData["professional_details.patents"],
    null,
    2
  )
);


let profile = null;

// First Submission
if (!existingData) {

  profile =
  await StudentProfile.create({
    userId,
    ...finalData
  });

} else {
const requestChanges =
  buildNestedObjectFromDotPaths(updateData);

await ProfileUpdateRequest.create({

  studentId: userId,

  requestNo: `REQ-${Date.now()}`,

  changes: requestChanges,

  status: "pending"

});
}

  console.log(
  "BODY PUBLICATIONS",
  JSON.stringify(
    body.professional_details?.publications,
    null,
    2
  )
);

console.log(
  "BODY CONFERENCES",
  JSON.stringify(
    body.professional_details?.conferences,
    null,
    2
  )
);

console.log(
  "BODY EXPERIENCE",
  JSON.stringify(
    body.professional_details?.experience,
    null,
    2
  )
);

console.log(
  "BODY MEMBERSHIP",
  JSON.stringify(
    body.professional_details?.membershipUrl,
    null,
    2
  )
);

console.log(
  "FINAL PROFESSIONAL",
  JSON.stringify(
    finalData.professional_details,
    null,
    2
  )
);

    // =========================
    // ✅ LOCK EDITING
    // =========================

    await Users.findByIdAndUpdate(
      userId,
      { canEdit: false }
    );

    return res.status(200).json({

      message:
        "Profile saved successfully",

        
      profile

    });

  } catch (error) {

    console.log(error);

    if (error.code === 11000) {

      return res.status(400).json({

        message:
          "Duplicate value detected",

        field:
          Object.keys(error.keyValue)

      });
    }

    return res.status(500).json({
      message: error.message
    });
  }
};
// controllers/studentController.js

export const getStudentProfile = async (req, res) => {
  try {
    console.log("REQ.USER:", req.user);

    const userId = req.user._id;

    const profile = await StudentProfile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: profile
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getAllStudents = async (req, res) => {
  try {
    const students = await StudentProfile.find();

    return res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
export const getStudentsByDepartment = async (req, res) => {
  try {
    const { department } = req.body;

    if (!department) {
      return res.status(400).json({
        success: false,
        message: "Department is required"
      });
    }

    const students = await StudentProfile.find({
      "academic_details.department": department
    });

    return res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getMyRequests =
async (req, res) => {

  try {

    const requests =
    await ProfileUpdateRequest
    .find({
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



export const getPendingRequests =
async (req, res) => {

  try {

    const requests =
      await ProfileUpdateRequest
        .find({
          status: "pending"
        })
        .populate(
          "studentId"
        )
        .sort({
          createdAt: -1
        });

    return res.status(200).json(
      requests
    );

  } catch (error) {

    return res.status(500).json({
      message: error.message
    });

  }

};


export const getRequestById =
async (req, res) => {

  try {

    const request =
      await ProfileUpdateRequest
        .findById(
          req.params.id
        );

    if (!request) {

      return res.status(404).json({
        message:
          "Request not found"
      });

    }

    return res.status(200).json(
      request
    );

  } catch (error) {

    return res.status(500).json({
      message:
        error.message
    });

  }

};


export const approveRequest =
async (req, res) => {

  try {

    const request =
      await ProfileUpdateRequest
      .findById(
        req.params.id
      );

    if (!request) {

      return res
        .status(404)
        .json({
          message:
            "Request not found"
        });

    }

    if (
      request.status !==
      "pending"
    ) {

      return res
        .status(400)
        .json({
          message:
            "Already processed"
        });

    }

    const profile =
      await StudentProfile
      .findOne({
        userId:
          request.studentId
      });

    if (!profile) {

      return res
        .status(404)
        .json({
          message:
            "Profile not found"
        });

    }

    const sanitizedChanges =
      sanitizeProfilePayload(
        request.changes || {}
      );

    const mergedData =
      sanitizeProfilePayload(
        deepMerge(
          profile.toObject(),
          sanitizedChanges
        )
      );

    console.log(
      JSON.stringify(
        sanitizedChanges,
        null,
        2
      )
    );

    console.log(
      "fellowshipLetter:",
      sanitizedChanges
        ?.academic_details
        ?.fellowshipLetter
    );

    delete mergedData._id;

    delete mergedData.__v;

    await StudentProfile
      .findOneAndUpdate(
        {
          userId:
            request.studentId
        },
        mergedData,
        {
          new: true
        }
      );

    request.status =
      "approved";

    request.reviewedAt =
      new Date();

    request.reviewedBy =
      req.user._id;

    await request.save();

    return res.json({

      success: true,

      message:
        "Request approved"

    });

  } catch (error) {

    return res
      .status(500)
      .json({
        message:
          error.message
      });

  }

};


export const rejectRequest =
async (req, res) => {

  try {

    const request =
      await ProfileUpdateRequest
        .findById(
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

    request.remarks =
      req.body.remarks || "";

    request.reviewedBy =
      req.user._id;

    request.reviewedAt =
      new Date();

    await request.save();

    

    return res.status(200).json({
      message:
        "Request rejected successfully"
    });

  } catch (error) {

    return res.status(500).json({
      message:
        error.message
    });

  }

};
