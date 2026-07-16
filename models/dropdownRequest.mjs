import mongoose from "mongoose";

const dropdownRequestSchema = new mongoose.Schema(
  {
    // Student
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
      index: true,
    },
    department: {
  type: String,
  trim: true,
},

    // Linked Profile Update Request
    profileRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProfileUpdateRequest",
      required: true,
      index: true,
    },

    // Student Details (Snapshot)
    studentName: {
      type: String,
      required: true,
      trim: true,
    },

    registerNumber: {
      type: String,
      trim: true,
    },

    department: {
      type: String,
      trim: true,
    },

    program: {
      type: String,
      trim: true,
    },

    // Which section generated this request
    section: {
      type: String,
      required: true,
      trim: true,
    },

    // Dropdown Details
    fieldKey: {
      type: String,
      required: true,
      trim: true,
    },

    fieldLabel: {
      type: String,
      required: true,
      trim: true,
    },

    // Value requested by student
    requestedValue: {
      type: String,
      required: true,
      trim: true,
    },

    // Value approved by admin
    approvedValue: {
      type: String,
      trim: true,
      default: "",
    },

    // Request Status
    status: {
      type: String,
      enum: [
        "pending",
        "approved",
        "rejected",
      ],
      default: "pending",
      index: true,
    },

    // Optional rejection remark
    adminRemark: {
      type: String,
      trim: true,
      default: "",
    },

    // Admin
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      default: null,
    },

    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index
dropdownRequestSchema.index({
  studentId: 1,
  fieldKey: 1,
  status: 1,
});

dropdownRequestSchema.index({
  department: 1,
  status: 1,
});

const DropdownRequest =
  mongoose.models.DropdownRequest ||
  mongoose.model(
    "DropdownRequest",
    dropdownRequestSchema
  );

export default DropdownRequest;