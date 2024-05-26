/*
    SERVICE CARRIER

    all domain logic and tests go here
    acts as a check before asking things from the repo
*/

const { getLogger } = require('../core/logging/logger');
const trackAndTraceService = require('./trackAndTrace');
const dbCarrier = require('../repo/carrier');
const carrier = require('../rest/carrier');
const prismaErrorTranslator = require('../core/util/prismaErrorTranslator.js');

const getAll = async () => {
    const data = await dbCarrier.getAll();
    const logger = getLogger();
    logger.info("Sending all the carriers...");
    return { "count": data.length, data: data };
}

const getById = async (id) => {
    const logger = getLogger();
    try {
        const res = await dbCarrier.getById(id);
        logger.info(`Sending the carrier with id ${id}...`);
        return res;
    } catch (error) {
        logger.error("No carrier found with this id");
        prismaErrorTranslator(error, "The carrier with this id does not exist!");
    }
}

const createCarrier = async (info) => {
    const logger = await getLogger();
    try {
        const res = await dbCarrier.createCarrier({
            firstName: info.firstName,
            secondName: info.secondName,
            phonenr: info.phonenr,
            email: info.email,
            active: info.active
        });
        logger.info(`A new carrier has been created.`);
    } catch (error) {
        logger.error("This carrier already exists or the passed information is wrong!");
        prismaErrorTranslator(error, "This carrier already exists or the passed information is wrong!");
    }
}

const editCarrier = async (id, info) => {
    const tntInfo = info.trackAndTrace;
    const carrierInfo = info.data;
    const editedCarrier = {};

    if (tntInfo != undefined && tntInfo != {}) {
        editedCarrier.trackAndTrace = await trackAndTraceService.createTnT({
            carrierId: id,
            ...tntInfo
        });
    }

    if (carrierInfo != undefined && carrierInfo != {}) {
        editedCarrier.carrier = await dbCarrier.editCarrier(id, {
            ...carrierInfo
        });
    }

    const logger = await getLogger();
    logger.info(`The carrier has been edited.`);
    return editedCarrier;
}

const deleteCarrier = async (id) => {
    const logger = await getLogger();
    try {
        await dbCarrier.deleteCarrier(id);
        logger.info(`The carrier with id ${id} has been deleted.`);
    } catch (error) {
        logger.error("Error while deleting the carrier");
        prismaErrorTranslator(error);
    }
}

module.exports = {
    getAll,
    getById,
    createCarrier,
    editCarrier,
    deleteCarrier
}