const { PermintaanData, PublicAuth } = require("../../models");

const createPermintaan = async (req, res) => {
try {
    // Destructuring dari req.body (sesuai field di route tadi)
    const { nama, instansi, tujuan, jenisData, periodeDari, periodeSampai, email, telepon } = req.body;

    let user = await PublicAuth.findOne({ where: { noTelepon: telepon } });

    if (!user) {
      user = await PublicAuth.create({
        noTelepon: telepon,
        pin: Math.floor(1000 + Math.random() * 9000).toString()
      });
    }

    const initialLog = [{
      status: "pending",
      timestamp: new Date().toISOString(),
      note: "Permohonan baru berhasil dikirim.",
    }];

    const newRequest = await PermintaanData.create({
      namaLengkap: nama, // Mapping 'nama' ke field DB 'namaLengkap'
      instansi: instansi,
      tujuanPenggunaan: tujuan,
      jenisData: jenisData || 'hidrologi', // Default jika kosong
      periodeDari: periodeDari,
      periodeSampai: periodeSampai,
      email: email,
      noTelepon: telepon,
      status: "pending",
      statusLogs: initialLog,
      // Jika ada file di memory buffer (upload.any())
      fileSurat: req.files && req.files.length > 0 ? req.files[0].originalname : null,
    });

    console.log("Permintaan baru berhasil dibuat:", newRequest.toJSON());
    return res.status(201).json({
      success: true,
      pin: user.pin, // Kirim PIN kembali ke frontend untuk referensi pengguna
      message: "Permintaan data berhasil disimpan",
      data: newRequest
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Fungsi untuk Admin mengambil semua data (untuk tabel admin nanti)
const getAllPermintaan = async (req, res) => {
try {
    const { status } = req.query; // Ambil filter status dari URL (jika ada)
    
    let whereClause = {};
    if (status && status !== 'semua') {
      whereClause.status = status;
    }

    const data = await PermintaanData.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']], // Selalu yang terbaru di atas
    });
    
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

const updateStatus = async (req, res) => {
try {
    const { id } = req.params;
    const { status, catatan } = req.body;

    const permohonan = await PermintaanData.findByPk(id);
    if (!permohonan) return res.status(404).json({ message: "Data tidak ditemukan" });

    // PENGAMAN: Pastikan logs adalah array, bukan string
    let logs = permohonan.statusLogs;
    if (typeof logs === 'string') {
      try {
        logs = JSON.parse(logs);
      } catch (e) {
        logs = []; // Jika gagal parse, reset jadi array kosong
      }
    }
    
    // Jika masih bukan array (misal null/undefined), jadikan array kosong
    if (!Array.isArray(logs)) {
      logs = [];
    }

    const newLog = {
      status: status,
      timestamp: new Date().toISOString(),
      note: catatan || `Status diubah menjadi ${status}`
    };

    // Sekarang spread akan bekerja dengan benar pada Array
    const updatedLogs = [...logs, newLog];

    await permohonan.update({
      status: status,
      statusLogs: updatedLogs // Sequelize akan handle stringify ke MariaDB
    });

    return res.json({ success: true, data: updatedLogs });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getPermintaanById = async (req, res) => {
  try {
    const { id } = req.params;

    // Mencari data berdasarkan Primary Key (ID)
    const data = await PermintaanData.findByPk(id);

    if (!data) {
      return res.status(404).json({ 
        success: false, 
        message: "Data permohonan tidak ditemukan" 
      });
    }

    // Pastikan statusLogs terurai (parsing) jika disimpan sebagai string di DB
    let logs = data.statusLogs;
    if (typeof logs === 'string') {
      try {
        logs = JSON.parse(logs);
      } catch (e) {
        logs = [];
      }
    }

    return res.json({
      success: true,
      data: {
        ...data.toJSON(),
        statusLogs: Array.isArray(logs) ? logs : []
      }
    });
  } catch (error) {
    console.error("Error Detail:", error);
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

module.exports = {
  createPermintaan,
  getAllPermintaan,
  updateStatus,
  getPermintaanById
};