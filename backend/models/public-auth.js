"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class PublicAuth extends Model {}
  PublicAuth.init({
    noTelepon: {
      type: DataTypes.STRING(20),
      primaryKey: true,
      allowNull: false,
    },
    pin: {
      type: DataTypes.STRING(4),
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: "PublicAuth",
    tableName: "public_auth",
    // Menghilangkan timestamps jika Anda ingin tabel yang sangat ringan, 
    // tapi 'createdAt' biasanya berguna untuk audit.
    timestamps: true 
  });
  return PublicAuth;
};