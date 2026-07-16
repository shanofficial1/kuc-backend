import mongoose from "mongoose";

const forgotPasswordRequestSchema = new mongoose.Schema(
  {
    // Student
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
      index: true,
    },

    // Student Snapshot
    studentName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    department: {
      type: String,
      trim: true,
      default: "",
      index: true,
    },

    program: {
      type: String,
      trim: true,
      default: "",
    },

    requestNo: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    reason: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "pending",
        "completed",
        "rejected",
      ],
      default: "pending",
      index: true,
    },

    adminRemark: {
      type: String,
      trim: true,
      default: "",
    },

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

forgotPasswordRequestSchema.index({
  studentId: 1,
  status: 1,
});

forgotPasswordRequestSchema.index({
  department: 1,
  status: 1,
});

const ForgotPasswordRequest =
  mongoose.models.ForgotPasswordRequest ||
  mongoose.model(
    "ForgotPasswordRequest",
    forgotPasswordRequestSchema
  );

export default ForgotPasswordRequest;