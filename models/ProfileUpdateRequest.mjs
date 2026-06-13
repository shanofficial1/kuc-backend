import mongoose from "mongoose";

const profileUpdateRequestSchema =
new mongoose.Schema({

  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  requestNo: {
    type: String,
    required: true
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

  changes: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },

  remarks: {
    type: String,
    default: ""
  },

  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  reviewedAt: Date

},{
  timestamps:true
});

export default mongoose.model(
  "ProfileUpdateRequest",
  profileUpdateRequestSchema
);