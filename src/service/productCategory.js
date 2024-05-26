/*
    SERVICE PRODUCT DESCRIPTION

    all domain logic and tests go here
    acts as a check before asking things from the repo
*/

const { getLogger } = require('../core/logging/logger');
const dbProductCategory = require('../repo/productCategory')

const getAll = async () => {
    const res = await dbProductCategory.getAll();
    const logger = getLogger();
    logger.info('Sending all product categories...');
    return res;
}

const getByCategoryId = async (id) => {
    const logger = getLogger();
    try {
        const res = await dbProductCategory.getById(id);
        logger.info(`Sending product category with id ${id}...`);
        return res;
    } catch (error) {
        logger.error("There has been an error or such a category does not exist!");
        prismaErrorTranslator(error, "The category you're looking for does not exist!")
    }
}


module.exports = {
    getAll,
    getByCategoryId,
}

