const { Model, DataTypes } = require('sequelize');

class Transaction extends Model {}

Transaction.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  amount: DataTypes.FLOAT,
  status: DataTypes.STRING,
  reference: DataTypes.STRING,
  source: DataTypes.STRING,
  currency: DataTypes.STRING,
  timestamp: DataTypes.DATE,
  isDuplicate: DataTypes.BOOLEAN,
  isFlagged: DataTypes.BOOLEAN,
  isFraudulent: DataTypes.BOOLEAN,
  isVerified: DataTypes.BOOLEAN,
}, {
  sequelize: require('../config/database'), // directly pass your sequelize instance here
  modelName: 'Transaction',
});

module.exports = Transaction;
