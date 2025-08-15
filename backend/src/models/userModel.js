// backend/src/models/userModel.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('User', {
    firstName:     { type: DataTypes.STRING, allowNull: false, field: 'first_name' },
    lastName:      { type: DataTypes.STRING, allowNull: false, field: 'last_name' },
    username:      { type: DataTypes.STRING, allowNull: false, unique: true },
    email:         { type: DataTypes.STRING, allowNull: false, unique: true },
    walletAddress: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      field: 'wallet_address'
    },
    sponsorCode:   { type: DataTypes.STRING, allowNull: false, field: 'sponsor_code' },
    passwordHash:  { type: DataTypes.STRING, allowNull: false, field: 'password_hash' },
    pinHash:       { type: DataTypes.STRING, allowNull: false, field: 'pin_hash' },
    resetToken:       { type: DataTypes.STRING, field: 'reset_token' },
    resetTokenExpiry: { type: DataTypes.BIGINT, field: 'reset_token_expiry' }
  }, {
    tableName: 'users',
    underscored: true,  // we manually set field names above
    timestamps: true
  });
};
