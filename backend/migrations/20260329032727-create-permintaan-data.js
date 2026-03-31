'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     await queryInterface.createTable("permintaan_data", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      namaLengkap: { type: Sequelize.STRING, allowNull: false },
      instansi: { type: Sequelize.STRING },
      jenisData: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      periodeDari: { type: Sequelize.DATEONLY, allowNull: false },
      periodeSampai: { type: Sequelize.DATEONLY, allowNull: false },
      email: { type: Sequelize.STRING, allowNull: false },
      noTelepon: { type: Sequelize.STRING, allowNull: false },
      tujuanPenggunaan: { type: Sequelize.TEXT, allowNull: false },
      fileSurat: { type: Sequelize.STRING },
      status: {
        type: Sequelize.ENUM("pending", "diproses", "selesai", "ditolak"),
        defaultValue: "pending",
      },
      statusLogs: { type: Sequelize.JSON }, // Field JSON untuk MySQL 5.7+
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable("permintaan_data");
  }
};
