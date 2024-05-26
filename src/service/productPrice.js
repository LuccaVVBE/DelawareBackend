/*
    SERVICE PRODUCT PRICE

    all domain logic and tests go here
    acts as a check before asking things from the repo
*/

const { getLogger } = require('../core/logging/logger');
const dbProductPrices = require('../repo/productPrice')
const prismaErrorTranslator = require('../core/util/prismaErrorTranslator.js');

const getAll = async () => {
    const res = await dbProductPrices.getAll();
    const logger = getLogger();
    logger.info('Sending all product prices...');
    return res;
}

const getByProductId = async (id) => {
    try {
        const res = await dbProductPrices.getByProductId(id);
        const logger = getLogger();
        logger.info(`Sending the product price with id ${id}...`);
        return res;
    } catch (error) {
        prismaErrorTranslator(error);
    }
}

const getAllByCurrencyId = async (id) => {
    try {
        const res = await dbProductPrices.getAllByCurrencyId(id);
        const logger = getLogger();
        logger.info(`Sending the product price with currency id ${id}...`);
        return {count: res.length, data: res};
    } catch (error) {
        prismaErrorTranslator(error);
    }

}


module.exports = {
    getAll,
    getByProductId,
    getAllByCurrencyId,
}

