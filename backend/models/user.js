'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
      models.User.hasMany(models.Post)
    }
  };
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      notEmpty: true,
      unique: 'email'
    },
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    isAdmin: {
      type: DataTypes.BOOLEAN,
      default: false
    },
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};