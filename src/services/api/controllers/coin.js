const errors = require('../../../helpers/errors');
const Models = require('../../../models/pg');
const { differenceBetweenTwoDatesGreaterThanHour, getLiveCoinPrice } = require('../../../helpers/utils');

const CoinController = {
  async getCoinByCode(coinCode) {
    const coin = await Models.Coin.findByCoinCode(coinCode);

    errors.assertExposable(coin, 'unknown_coin_code');

    const outdatedPrice = await differenceBetweenTwoDatesGreaterThanHour(coin.updatedAt);

    if (outdatedPrice || !coin.price) {
      const price = await getLiveCoinPrice(coin.name);
      coin.price = price;
      await Models.Coin.update({ price: price }, { where: { id: coin.id } });
    }

    return coin.filterKeys();
  },

  async addCoin(coinData) {
    const coin = await Models.Coin.creadCoin(coinData.coinCode, coinData.coinName);

    errors.assertExposable(coin, 'existing_coin_code');

    return coin;
  },
};

module.exports = CoinController;
