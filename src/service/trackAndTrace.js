/*
    SERVICE TRACK&TRACE

    all domain logic and tests go here
    acts as a check before asking things from the repo
*/

const { getLogger } = require('../core/logging/logger');
const prismaErrorTranslator = require('../core/util/prismaErrorTranslator');
const dbTnT = require('../repo/trackAndTrace');

const getAll = async () => {
    const data = await dbTnT.getAll();
    const logger = getLogger();
    logger.info("Sending all the track&traces...");
    return { "count": data.length, data: data };
}

const getByNumbers = async (trackingNumber, confirmationNumber) => {
    const logger = getLogger();
    try {
        const res = await dbTnT.getByNumbers(trackingNumber, confirmationNumber);
        logger.info(`Sending the track&trace with number ${trackingNumber}...`);
        return res;
    } catch (error) {
        logger.error("The track&trace with this id does not exist!")
        prismaErrorTranslator(error, "The track&trace with this id does not exist!")
    }
}


module.exports = {
    getAll,
    getByNumbers
}