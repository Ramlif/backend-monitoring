import db from "../config/db.js";

/// ======================
// DETEKSI ANOMALI
// ======================
function detectAnomaly(suhu, kelembapan, gerakan, pakan) {

  // Suhu ideal ayam petelur
  if (suhu > 50 || suhu < 23) {
    return "Anomali";
  }

  // Kelembapan ideal
  if (kelembapan > 90 || kelembapan < 20) {
    return "Anomali";
  }

  // Aktivitas ayam rendah
  if (gerakan < 3) {
    return "Anomali";
  }

  // Pakan (kg)
  if (pakan < 0.2) {
    return "Anomali";
  }

  return "Normal";
}

// ======================
// AMBIL SEMUA DATA SENSOR
// ======================
export const getSensorData = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        id,
        DATE_FORMAT(created_at, '%d-%m-%Y %H:%i') AS tanggal,
        suhu,
        kelembapan,
        gerakan,
        pakan,
        status
      FROM sensor_data
      ORDER BY created_at DESC
    `);

    res.status(200).json(rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Gagal mengambil data sensor",
      error: error.message,
    });
  }
};

// ======================
// TAMBAH DATA SENSOR
// ======================
export const addSensorData = async (req, res) => {
  try {
    const { suhu, kelembapan, gerakan, pakan } = req.body;

    // Validasi input
    if (
      suhu === undefined ||
      kelembapan === undefined ||
      gerakan === undefined ||
      pakan === undefined
    ) {
      return res.status(400).json({
        message: "Data suhu, kelembapan, gerakan, dan pakan wajib diisi",
      });
    }

    const suhuNum = Number(suhu);
    const kelembapanNum = Number(kelembapan);
    const gerakanNum = Number(gerakan);
    const pakanNum = Number(pakan);

    const status = detectAnomaly(
      suhuNum,
      kelembapanNum,
      gerakanNum,
      pakanNum
    );

    await db.query(
      `
      INSERT INTO sensor_data
      (suhu, kelembapan, gerakan, pakan, status)
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        suhuNum,
        kelembapanNum,
        gerakanNum,
        pakanNum,
        status,
      ]
    );

    res.status(201).json({
      message: "Data sensor berhasil disimpan",
      data: {
        suhu: suhuNum,
        kelembapan: kelembapanNum,
        gerakan: gerakanNum,
        pakan: pakanNum,
        status,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Gagal menyimpan data sensor",
      error: error.message,
    });
  }
};

// ======================
// DATA TERBARU
// ======================
export const getLatestSensorData = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        id,
        suhu,
        kelembapan,
        gerakan,
        pakan,
        status,
        created_at
      FROM sensor_data
      ORDER BY created_at DESC
      LIMIT 1
    `);

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Belum ada data sensor",
      });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Gagal mengambil data terbaru",
      error: error.message,
    });
  }
};