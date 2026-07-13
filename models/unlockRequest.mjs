import mongoose from "mongoose";

const unlockRequestSchema = new mongoose.Schema({

  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  requestNo: {
    type: String,
    required: true
  },

  reason: {
    type: String,
    default: ""
  },

  status: {
    type: String,
    enum: [
      "pending",
      "approved",
      "rejected"
    ],
    default: "pending"
  },

  remarks: {
    type: String,
    default: ""
  },

  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  reviewedAt: {
    type: Date
  }

},{
  timestamps: true
});

const UnlockRequest =
  mongoose.models.UnlockRequest ||
  mongoose.model(
    "UnlockRequest",
    unlockRequestSchema
  );

export default UnlockRequest;