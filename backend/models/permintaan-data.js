"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class PermintaanData extends Model {
    static associate(models) {
      // Jika nanti ingin dihubungkan dengan model User atau Admin
      // define associations here
    }
  }

  PermintaanData.init(
    {
      namaLengkap: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      instansi: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      jenisData: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      periodeDari: {
        type: DataTypes.DATEONLY, // YYYY-MM-DD sesuai dengan <input type="date">
        allowNull: false,
      },
      periodeSampai: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      noTelepon: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tujuanPenggunaan: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      fileSurat: {
        type: DataTypes.STRING,
        allowNull: true, // Menyimpan path file PDF/JPG dari permohonan
      },
      status: {
        type: DataTypes.ENUM("pending", "diproses", "selesai", "ditolak"),
        allowNull: false,
        defaultValue: "pending",
      },
      statusLogs: {
        type: DataTypes.JSON,
        get() {
          const rawValue = this.getDataValue("statusLogs");
          if (typeof rawValue === "string") {
            try {
              return JSON.parse(rawValue);
            } catch (e) {
              return [];
            }
          }
          return rawValue || [];
        },
      },
    },
    {
      sequelize,
      modelName: "PermintaanData",
      tableName: "permintaan_data", // Memastikan nama tabel snake_case di DB
    },
  );

  return PermintaanData;
};
