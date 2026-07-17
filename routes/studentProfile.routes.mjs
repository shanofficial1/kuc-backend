import express, { Router } from "express";
import authMiddleware from "../middlewares/middlewares.auth.mjs";
import upload from "../configs/multer.mjs";
import {
  CreateOrUpdate,
  getStudentProfile,
  getStudentsByDepartment,
  getMyRequests,
  getPendingRequests,
  getRequestById,
  approveRequest,
  rejectRequest,
  getAllStudents,
  deleteProfileRecord
} from "../controllers/studentProfile.controller.mjs";

const studentProfileRouter = Router();

studentProfileRouter.post(
  "/profile",
  authMiddleware,
  upload.fields([

    // 📘 Academic
    { name: "fellowshipLetter", maxCount: 1 },

    // 📘 Personal
    { name: "passportDoc", maxCount: 1 },
    { name: "visaDoc", maxCount: 1 },
    { name: "birthCertificateDoc", maxCount: 1 },

    // 📘 Health
    { name: "disabilityCertificate", maxCount: 1 },
  { name: "vaccinationDoc", maxCount: 1 },
    // 📘 Education
    { name: "educationDocuments", maxCount: 10 }, // for education[].documentUrl
    { name: "competitiveExamDocs", maxCount: 5 },
    { name: "migrationUrl", maxCount: 1 },

    // 📘 Financial
    { name: "feeWaiveDocument", maxCount: 1 },

    // 📘 Professional
    { name: "publicationDocs", maxCount: 5 },
    { name: "conferenceDocs", maxCount: 5 },
    { name: "patentDocs", maxCount: 5 },
    { name: "experienceDocs", maxCount: 5 },
    { name: "patentUrlDocs", maxCount: 5 },
    { name: "membershipDocs", maxCount: 5 },

    {name: "membershipDocs", maxCount: 5} ,
    // 📘 Residential
    { name: "hostelDeclarationForm", maxCount: 1 },

    // 📘 Main Documents
    { name: "profilePhoto", maxCount: 1 },
    { name: "signature", maxCount: 1 },

    { name: "transcripts", maxCount: 10 },

    { name: "identityProof", maxCount: 1 },

    // 📘 Legal Certificates
    { name: "incomeCertificate", maxCount: 1 },
    { name: "casteCertificate", maxCount: 1 },
    { name: "nonCreamyLayerCertificate", maxCount: 1 },
    { name: "nativityCertificate", maxCount: 1 }

  ]),
  CreateOrUpdate
);


studentProfileRouter.get("/profile",authMiddleware, getStudentProfile);
 
studentProfileRouter.delete(
  "/record/:section/:recordId",
  authMiddleware,
  deleteProfileRecord
);
studentProfileRouter.post(
  "/by-department",
  getStudentsByDepartment
); 

studentProfileRouter.post(
  "/all-students",
  getAllStudents
);

studentProfileRouter.get(
  "/my-requests",
  authMiddleware,
  getMyRequests
);

studentProfileRouter.get(
  "/my-requests/:id",
  authMiddleware,
  getRequestById
);

studentProfileRouter.get(
  "/requests/pending",
  getPendingRequests
);

studentProfileRouter.post(
  "/requests/:id/approve",
  authMiddleware,
  approveRequest
);

studentProfileRouter.post(
  "/requests/:id/reject",
  authMiddleware,
  rejectRequest
);

export default studentProfileRouter;