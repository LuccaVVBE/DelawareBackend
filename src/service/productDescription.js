/*
    SERVICE PRODUCT DESCRIPTION

    all domain logic and tests go here
    acts as a check before asking things from the repo
*/

const { getLogger } = require('../core/logging/logger');
const dbProductDescription = require('../repo/productDescription')

const getAll = async (language) => {
    const res = await dbProductDescription.getAll(language);
    const logger = getLogger();
    logger.info('Sending all product descriptions...');
    return res;
}

const getByProductId = async (id, language) => {
    const res = await dbProductDescription.getByProductId(id, language);
    const logger = getLogger();
    logger.info(`Sending the product description with id ${id}...`);
    return res;
}

module.exports = {
    getAll,
    getByProductId,
}

