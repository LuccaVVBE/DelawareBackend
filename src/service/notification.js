/*
    SERVICE NOTIFICATION

    all domain logic and tests go here
    acts as a check before asking things from the repo
*/

const { getLogger } = require('../core/logging/logger');
const prismaErrorTranslator = require('../core/util/prismaErrorTranslator.js');
const dbNotification = require('../repo/notification.js');

const getAll = async (companyId) => {
    const data = await dbNotification.getAll(companyId);
    const logger = getLogger();
    logger.info("Sending all the notifications...");
    return { "count": data.length, data: data };
}

const getAllByCompanyId = async (id) => {
    const data = await dbNotification.getByCompanyId(id);
    const logger = getLogger();
    logger.info(`Sending all the notifications for user ${id}...`);
    return { "count": data.length, data: data };
}

const getById = async (id) => {
    const logger = getLogger();
    try {
        const res = await dbNotification.getById(id);
        logger.info(`Sending the notification with id ${id}...`);
        return res;
    } catch (error) {
        const logger = getLogger();
        logger.error("This notification does not exist!");
        prismaErrorTranslator(error);
    }
}

const createNotification = async (info) => {
    const logger = await getLogger();
    try {
        const res = await dbNotification.createNotification(info);
        logger.info(`A new notification has been created.`);
        return res;
    } catch (error) {
        console.log(error);
        logger.error("This notification already exists or the passed information is wrong!");
        prismaErrorTranslator(error);
    }
}

const readNotification = async (id) => {
    const logger = await getLogger();

    try {
        const result = await dbNotification.readNotification(id);
        logger.info(`The notification has been read.`);
        return result;
    } catch (error) {
        console.log(error);
        logger.error("This notification does not exist!");
        prismaErrorTranslator(error);
    }

}

const deleteNotification = async (id) => {
    const logger = await getLogger();
    try {
        const result = await dbNotification.deleteNotification(id);
        logger.info(`The notification with id ${id} has been deleted.`);
        return result;
    } catch (error) {
        logger.error("This notification does not exist!");
        prismaErrorTranslator(error);
    }

}

module.exports = {
    getAll,
    getById,
    getAllByCompanyId,
    createNotification,
    readNotification,
    deleteNotification
}