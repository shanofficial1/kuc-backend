import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "approved",
        "rejected",
        "info",
        "warning",
      ],
      default: "info",
    },

    isSeen: {
      type: Boolean,
      default: false,
      index: true,
    },

    metadata: {
      profileRequestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProfileUpdateRequest",
      },

      dropdownRequestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DropdownRequest",
      },
    },
  },
  {
    timestamps: true,
  }
);

const Notification =
  mongoose.models.Notification ||
  mongoose.model(
    "Notification",
    notificationSchema
  );

export default Notification;