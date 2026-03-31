const { PublicAuth, PermintaanData } = require("../../models");

const loginPublic = async (req, res) => {
  try {
    const { telepon, pin } = req.body;

    // 1. Validasi di tabel pusat autentikasi
    const auth = await PublicAuth.findOne({
      where: { noTelepon: telepon, pin: pin }
    });

    if (!auth) {
      return res.status(401).json({ 
        success: false, 
        message: "Nomor Telepon atau PIN salah." 
      });
    }

    // 2. Ambil semua riwayat permintaan-data milik nomor tersebut
    const riwayat = await PermintaanData.findAll({
      where: { noTelepon: telepon },
      order: [['createdAt', 'DESC']]
    });

    return res.json({
      success: true,
      message: "Login berhasil",
      user: {
        noTelepon: auth.noTelepon
      },
      data: riwayat // Mengembalikan array permohonan (termasuk status & statusLogs)
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { loginPublic };