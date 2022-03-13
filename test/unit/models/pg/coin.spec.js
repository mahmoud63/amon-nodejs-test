const path = require('path');
const sinon = require('sinon');
const sequelizeMockingMocha = require('sequelize-mocking').sequelizeMockingMocha;
const Models = require(path.join(srcDir, '/models/pg'));
const DB = require(path.join(srcDir, 'modules/db'));

describe('Model:coin', () => {
  let sandbox = null;

  sequelizeMockingMocha(DB.sequelize, [path.resolve('test/mocks/coins.json')], { logging: false });

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
    this.coin = await Models.Coin.findByPk('26a05507-0395-447a-bbbb-000000000000');
  });

  afterEach(() => {
    sandbox && sandbox.restore();
  });

  it('Should create', async () => {
    const coin = await Models.Coin.create({
      name: 'Bitcoin Cash',
      code: 'BCH',
    });

    expect(coin.name).to.eq('Bitcoin Cash');
    expect(coin.code).to.eq('BCH');
  });

  it('Should create with price', async () => {
    const coin = await Models.Coin.create({
      name: 'Bitcoin Cash known price',
      code: 'BCHP',
      price: 1000,
    });

    expect(coin.name).to.eq('Bitcoin Cash known price');
    expect(coin.code).to.eq('BCHP');
    expect(coin.price).to.eq(1000);
  });

  it('Should create if not exist', async () => {
    const coin = await Models.Coin.createCoin('BCH2', 'Bitcoin two');

    expect(coin.name).to.eq('Bitcoin two');
    expect(coin.code).to.eq('BCH2');
  });

  it('Should not create', async () => {
    await Models.Coin.createCoin('BCH2', 'Bitcoin two');

    const coin = await Models.Coin.createCoin('BCH2', 'Bitcoin two');

    expect(coin).to.eq(null);
  });

  it('Should find by coinCode', async () => {
    const coinCode = this.coin.code;
    const coin = await Models.Coin.findByCoinCode(coinCode);

    expect(coin.id).to.eq(this.coin.id);
  });

  it('Should filterKeys', async () => {
    const coin = await Models.Coin.create({
      name: 'Amon',
      code: 'AMN',
    });

    const filterCoin = coin.filterKeys();
    expect(Object.keys(filterCoin).length).to.eq(3);
  });
});
