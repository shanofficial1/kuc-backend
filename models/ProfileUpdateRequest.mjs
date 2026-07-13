import mongoose from "mongoose";

const profileUpdateRequestSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    requestNo: {
      type: String,
      required: true,
    },

    updateType: {
      type: String,
      enum: [
        "full_profile",
        "field_correction",
      ],
      required: true,
    },

    changes: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

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

    remarks: {
      type: String,
      trim: true,
      default: "",
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    reviewedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const ProfileUpdateRequest =
  mongoose.models.ProfileUpdateRequest ||
  mongoose.model(
    "ProfileUpdateRequest",
    profileUpdateRequestSchema
  );

export default ProfileUpdateRequest;