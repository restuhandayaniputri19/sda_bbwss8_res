const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const bannerRoutes = require("./routes/bannerRoutes");
const infografisRoutes = require("./routes/infografisRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const youtubeRoutes = require("./routes/youtubeRoutes");
const layananTerpaduRoutes = require("./routes/layananTerpaduRoutes");
const majalahRoutes = require("./routes/majalahRoutes");
const beritaRoutes = require("./routes/beritaRoutes");
const strukturOrganisasiRoutes = require("./routes/strukturOrganisasiRoutes");
const polaRencanaRoutes = require("./routes/polaRencanaRoutes");
const tugasFungsiRoutes = require("./routes/tugasFungsiRoutes");
const dipaRoutes = require("./routes/dipaRoutes");
const peraturanRoutes = require("./routes/peraturanRoutes");
const geolocationRoutes = require("./routes/geolocationRoutes");
const informasiRoutes = require("./routes/informasiRoutes");
const pengumumanRoutes = require("./routes/pengumumanRoutes");
const rpsdaRoutes = require("./routes/rpsdaRoutes");
const prediksiCuacaRoutes = require("./routes/prediksiCuacaRoutes");
const permintaanDataRoutes = require("./routes/permintaanDataRoutes");
const cors = require("cors");
const path = require("path"); // Import path module

const app = express();

// CORS options for specific route
const corsOptions = {
  origin: ["https://bbwssumatera8.com", "http://localhost:5173"], // Replace with the frontend domain
  methods: ["GET"], // Adjust as needed
  allowedHeaders: ["Content-Type", "Authorization"], // Customize headers
};

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the uploads directory
app.use(
  "/uploads",
  cors(corsOptions),
  express.static(path.join(__dirname, "../uploads"))
);

// Define your routes
app.use("/api/auth", authRoutes);
app.use("/api/banner", bannerRoutes);
app.use("/api/infografis", infografisRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/youtube", youtubeRoutes);
app.use("/api/layanan-terpadu", layananTerpaduRoutes);
app.use("/api/majalah", majalahRoutes);
app.use("/api/berita", beritaRoutes);
app.use("/api/struktur-organisasi", strukturOrganisasiRoutes);
app.use("/api/permintaan-data", permintaanDataRoutes);
app.use("/api/pola-rencana", polaRencanaRoutes);
app.use("/api/tugas-fungsi", tugasFungsiRoutes);
app.use("/api/dipa", dipaRoutes);
app.use("/api/peraturan", peraturanRoutes);
app.use("/api/geolocations", geolocationRoutes);
app.use("/api/informasi", informasiRoutes);
app.use("/api/pengumuman", pengumumanRoutes);
app.use("/api/rpsda", rpsdaRoutes);
app.use("/api/prediksi-cuaca", prediksiCuacaRoutes);

module.exports = app;
