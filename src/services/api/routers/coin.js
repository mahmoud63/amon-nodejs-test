const Joi = require('joi');
const Router = require('@koa/router');
const CoinController = require('../controllers/coin');
const { validateParams, validateBody } = require('../../../helpers/validation');

const CoinRouter = {
  schemaGetByCoinCode: Joi.object({
    coinCode: Joi.string().min(3).uppercase().max(5),
  }),

  schemaAddCoin: Joi.object({
    coinName: Joi.string().min(1),
    coinCode: Joi.string().min(3).uppercase().max(5),
  }),

  async getCoinByCode(ctx) {
    const params = {
      coinCode: ctx.params.coinCode,
    };

    const formattedParams = await validateParams(CoinRouter.schemaGetByCoinCode, params);

    const coinResponse = await CoinController.getCoinByCode(formattedParams.coinCode);

    ctx.body = coinResponse;
  },

  async addCoin(ctx) {
    const body = {
      coinCode: ctx.request.body.coinCode,
      coinName: ctx.request.body.coinName,
    };

    const formattedBody = await validateBody(CoinRouter.schemaAddCoin, body);

    ctx.body = await CoinController.addCoin(formattedBody);
  },

  router() {
    const router = Router();

    /**
     * @api {get} / Get coinCode
     * @apiName coinCode
     * @apiGroup Status
     * @apiDescription Get coinCode
     *
     * @apiSampleRequest /
     *
     */
    router.get('/:coinCode', CoinRouter.getCoinByCode);
    router.put('/createCoin', CoinRouter.addCoin);

    return router;
  },
};

module.exports = CoinRouter;
