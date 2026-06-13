import multer from "multer";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.user._id;

    if (!userId) {
      return cb(new Error("Please Login"), null);
    }

    const userFolder = path.join("uploads", userId.toString());

    fs.mkdirSync(userFolder, { recursive: true });

    cb(null, userFolder);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);

    const uniqueId = uuidv4(); // 🔥 unique id

    const fileName = `${uniqueId}${ext}`;

    cb(null, fileName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, PNG, PDF allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});

export default upload;