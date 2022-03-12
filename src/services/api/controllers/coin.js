const errors = require('../../../helpers/errors');
const Models = require('../../../models/pg');
const { differenceBetweenTwoDatesGreaterThanHour, getLiveCoinPrice } = require('../../../helpers/utils');

const CoinController = {
  async getCoinByCode(coinCode) {
    const coin = await Models.Coin.findByCoinCode(coinCode);

    errors.assertExposable(coin, 'unknown_coin_code');

    const diff = await differenceBetweenTwoDates(coin.updatedAt);

    if (diff >= 1 || !coin.price) {
      const price = await getLiveCoinPrice(coin.name);
      await Models.Coin.update({ price: price }, { where: { id: coin.id } });
      coin.price = price;
    }

    const filterdData = coin.filterKeys();

    delete filterdData.id;

    return filterdData;
  },

  async addCoin(coinData) {
    const coin = await Models.Coin.createCoin(coinData.coinCode, coinData.coinName);

    errors.assertExposable(coin, 'existing_coin_code');

    return coin.filterKeys();
  },
};

module.exports = CoinController;
