import multer from "multer";
import path from "path";
import fs from "fs";

const uploadPath = path.resolve("uploads/menu_images");

// Ensure the folder exists
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".avif", ".jfif"];

  if (!allowedExtensions.includes(ext)) {
    return cb(new Error("File type is not supported"), false);
  }
  cb(null, true);
};

const uploader = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter
});

export default uploader;
