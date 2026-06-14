import express from "express";
import {
  getSensorData,
  addSensorData,
} from "../controllers/sensorController.js";

const router = express.Router();

router.get("/sensor", getSensorData);
router.post("/sensor", addSensorData);

export default router;