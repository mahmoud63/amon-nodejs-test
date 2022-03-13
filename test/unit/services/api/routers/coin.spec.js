const path = require('path');
const sinon = require('sinon');
const Router = require('@koa/router');
const CoinRouter = require(path.join(srcDir, '/services/api/routers/coin'));
const CoinController = require(path.join(srcDir, '/services/api/controllers/coin'));

const config = require(path.join(srcDir, '../config'));

describe('Router: coin', () => {
  let sandbox = null;

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
    this.get = sandbox.stub(Router.prototype, 'get');
    this.put = sandbox.stub(Router.prototype, 'put');
  });

  afterEach(() => {
    config.DEMO_ACCOUNT = null;
    sandbox && sandbox.restore();
  });

  it('Should get router', async () => {
    const router = await CoinRouter.router();

    expect(router instanceof Router).to.be.true;
    expect(router.get.calledWith('/:coinCode', CoinRouter.getCoinByCode)).to.be.true;
  });

  it('Should get error on not exist coin', async () => {
    sandbox.stub(CoinController, 'getCoinByCode').resolves('getCoinByCode');
    const ctx = {
      cacheControl: sandbox.stub(),
      params: { coinCode: 'bitcoin' },
    };
    await CoinRouter.getCoinByCode(ctx);
    expect(ctx.body.code).to.be.eq(undefined);
  });

  it('Should put router', async () => {
    const router = await CoinRouter.router();

    expect(router instanceof Router).to.be.true;
    expect(router.put.calledWith('/createCoin', CoinRouter.addCoin)).to.be.true;
  });
});
