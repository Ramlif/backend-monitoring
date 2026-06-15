import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sensorRoutes from "./routes/sensorRoutes.js";
import cameraRoutes from "./routes/cameraRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", cameraRoutes);
app.use("/api", cameraRoutes);

app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("Backend Monitoring Kandang Ayam Petelur Berjalan");
});

app.use("/api", sensorRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server berjalan di port ${PORT}`);
});