import express from "express";
import fs from "fs";

const router = express.Router();

router.post(
  "/camera/upload",
  express.raw({
    type: "image/jpeg",
    limit: "10mb",
  }),
  (req, res) => {

    fs.writeFileSync(
      "uploads/latest.jpg",
      req.body
    );

    res.json({
      success: true,
    });
  }
);

export default router;