const path = require('path');
const sinon = require('sinon');
const sequelizeMockingMocha = require('sequelize-mocking').sequelizeMockingMocha;
const CoinController = require(path.join(srcDir, '/services/api/controllers/coin'));
const DB = require(path.join(srcDir, 'modules/db'));

describe('Controller: Coin', () => {
  let sandbox = null;

  sequelizeMockingMocha(DB.sequelize, [path.resolve('test/mocks/coins.json')], { logging: false });

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox && sandbox.restore();
  });

  describe('getCoinByCode', () => {
    it('should get coin by code', async () => {
      const coinCode = 'BTC';
      const coin = await CoinController.getCoinByCode(coinCode);

      expect(coin.code).to.eq(coinCode);
      expect(Object.keys(coin).length).to.eq(3);
    });

    it('should get coin by code from stored price', async () => {
      const coinCode = 'ETH';
      const coin = await CoinController.getCoinByCode(coinCode);

      expect(coin.code).to.eq(coinCode);
      expect(Object.keys(coin).length).to.eq(3);
    });

    it('should fail get coin by code', async () => {
      const coinCode = 'AMN';
      expect(CoinController.getCoinByCode(coinCode)).to.be.rejectedWith(Error, 'unknown_coin_code');
    });
  });

  describe('addCoin', () => {
    it('should add coin', async () => {
      const coinData = { coinName: 'bitcoin', coinCode: 'BTC00' };

      const coin = await CoinController.addCoin(coinData);

      expect(coin.code).to.eq(coinData.coinCode);
      expect(coin.name).to.eq(coinData.coinName);

      expect(Object.keys(coin).length).to.eq(3);
    });

    it('should fail add coin', async () => {
      const coinData = { coinName: 'bitcoin', coinCode: 'BTC' };

      expect(CoinController.addCoin(coinData)).to.be.rejectedWith(Error, 'existing_coin_code');
    });
  });
});
