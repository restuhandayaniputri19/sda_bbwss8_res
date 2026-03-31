const express = require("express");
const router = express.Router();

const { createPermintaan, getAllPermintaan, updateStatus, getPermintaanById } = require("../controllers/permintaanDataController")

const multer = require('multer');
const upload = multer(); // Simpan di memory buffer sementara

router.post("/", upload.any(), createPermintaan);
router.get("/", getAllPermintaan);
router.get("/:id", getPermintaanById);
router.patch("/:id/status", updateStatus);

module.exports = router;
