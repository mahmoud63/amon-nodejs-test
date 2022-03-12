const { v4: uuid } = require('uuid');
const { pick } = require('lodash');

module.exports = function (sequelize, DataTypes) {
  const Coin = sequelize.define(
    'Coin',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: () => uuid(),
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      code: {
        type: DataTypes.STRING,

        allowNull: false,
      },
      price: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
    },
    {
      freezeTableName: true,
      timestamps: true,
    }
  );

  Coin.prototype.filterKeys = function () {
    const obj = this.toObject();

    return obj;
  };

  Coin.findByCoinCode = function (code, tOpts = {}) {
    return Coin.findOne(Object.assign({ where: { code } }, tOpts));
  };

  Coin.creadCoin = async function (code, name, tOpts = {}) {
    const coin = await Coin.findByCoinCode(code);

    if (coin) {
      return null;
    }

    return Coin.create({ code: code, name: name });
  };

  Coin.prototype;
  return Coin;
};
