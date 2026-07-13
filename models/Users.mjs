import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // =====================================
    // BASIC INFORMATION
    // =====================================

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\S+@\S+\.\S+$/,
        "Please use a valid email address",
      ],
    },

    phone: {
      type: String,
      required: true,
      match: [
        /^[0-9]{10}$/,
        "Invalid phone number",
      ],
    },

    // =====================================
    // AUTHENTICATION
    // =====================================

    password: {
      type: String,
      required: true,
      select: false,
    },

    mustChangePassword: {
      type: Boolean,
      default: true,
    },

    otp: {
      type: String,
      select: false,
    },

    otpExpiry: {
      type: Date,
      select: false,
    },

    // =====================================
    // ROLE
    // =====================================

    role: {
      type: String,
      enum: [
        "student",
        "professor",
        "staff",
        "office",
      ],
      default: "student",
    },

    // =====================================
    // PROFILE EDIT PERMISSION
    // =====================================

    canEdit: {
      type: Boolean,
      default: true,
    },

    editApprovedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const User =
  mongoose.models.User ||
  mongoose.model(
    "User",
    userSchema
  );

export default User;