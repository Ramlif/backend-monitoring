import express from "express";
import multer from "multer";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(null, "latest.jpg");
  },
});

const upload = multer({ storage });

router.post(
  "/camera/upload",
  upload.single("image"),
  (req, res) => {
    res.json({
      success: true,
      file: "latest.jpg",
    });
  }
);

export default router;