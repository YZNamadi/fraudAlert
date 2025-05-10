const { Model, DataTypes } = require('sequelize');

class Report extends Model {}

Report.init({
  reference: DataTypes.STRING,
  amount: DataTypes.FLOAT,
  source: DataTypes.STRING,
  status: DataTypes.STRING,
  currency: DataTypes.STRING,
  timestamp: DataTypes.DATE,
  flaggedReason: DataTypes.STRING,
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  }
}, {
  sequelize: require('../config/database'),
  modelName: 'Report',
});

module.exports = Report;
