const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Report extends Model {}

Report.init(
  {
    reference: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    source: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING,
      defaultValue: 'NGN',
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    flaggedReason: {
      type: DataTypes.STRING,
      defaultValue: 'Unknown',
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isRejected: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'Report',
  }
);

module.exports = Report;
