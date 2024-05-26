/*
    SERVICE BOX

    all domain logic and tests go here
    acts as a check before asking things from the repo
*/

const { getLogger } = require('../core/logging/logger');
const prismaErrorTranslator = require('../core/util/prismaErrorTranslator.js');
const dbBox = require('../repo/box');

const getAll = async () => {
    const data = await dbBox.getAll();
    const logger = getLogger();
    logger.info("Sending all the boxes...");
    return { "count": data.length, data: data };
}

const getById = async (id) => {
    try {
        const res = await dbBox.getById(id);
        const logger = getLogger();
        logger.info(`Sending the box with id ${id}...`);
        return res;
    } catch (error) {
        logger.error("This box does not exist!");
        prismaErrorTranslator(error);
    }
}

const createBox = async (info) => {
    const logger = await getLogger();
    try {
        const res = await dbBox.createBox(info);
        logger.info(`A new box has been created.`);
        return res;
    } catch (error) {
        logger.error("This box already exists or the passed information is wrong!");
        prismaErrorTranslator(error);
    }
}

const editBox = async (id, { ...args }) => {
    const info = {
        ...args
    }
    try {
        await dbBox.editBox(id, info);
        const logger = await getLogger();
        logger.info(`The box has been edited.`);
    } catch (error) {
        logger.error("This box does not exist!");
        prismaErrorTranslator(error);
    }

}

const deleteBox = async (id) => {
    const logger = await getLogger();
    try {
        await dbBox.deleteBox(id);
        logger.info(`The box with id ${id} has been deleted.`);
    } catch (error) {
        logger.error("This box does not exist!");
        prismaErrorTranslator(error);
    }

}

module.exports = {
    getAll,
    getById,
    createBox,
    editBox,
    deleteBox
}