const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../database");

const User = require("./user");

class AuthCode extends Model {}

AuthCode.init(
  {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
    },
    authCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    audience: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    clientId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    redirectUri: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    scope: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "AuthCode",
    tableName: "authCodes",
  }
);

AuthCode.belongsTo(User, {
  onDelete: "cascade",
  foreignKey: {
    name: "userId",
    allowNull: false,
  },
});

module.exports = AuthCode;
