/*
    SERVICE ORDER

    all domain logic and tests go here
    acts as a check before asking things from the repo
*/

const { getLogger } = require('../core/logging/logger');
const prismaErrorTranslator = require('../core/util/prismaErrorTranslator');
const dbOrder = require('../repo/order');

const getAll = async (companyId) => {
    const data = await dbOrder.getAll(companyId);
    const logger = getLogger();
    logger.info("Sending all the orders...");
    return {
        "count": data.length,
        items: data
    };
}

const getById = async (id) => {
    const logger = getLogger();
    try {
        const res = await dbOrder.getById(id);
        logger.info(`Sending the order with id ${id}...`);
        return res;
    } catch (error) {
        logger.error("No order found with this id");
        prismaErrorTranslator(error, "The order with this id does not exist!")
    }
}

const createOrder = async (info) => {
    const logger = await getLogger();
    try {
        const res = await dbOrder.createOrder(info);
        logger.info(`A new order has been created with id ${res.orderId} .`);
        return res;
    } catch (error) {
        logger.error('Failed to create order!');
        prismaErrorTranslator(error)
    }

}

const editOrder = async (orderId, info) => {
    const logger = await getLogger();
    try {
        const editedOrder = await dbOrder.editOrder(orderId, info);
        logger.info(`The order ${orderId} has been edited.`);
        return editedOrder;
    } catch (error) {
        logger.error("Error while editing order!");
        prismaErrorTranslator(error);
    }
}

const deleteOrder = async (id) => {
    const logger = await getLogger();
    try {
        const result = await dbOrder.deleteOrder(id);
        logger.info(`order with id ${id} has been deleted.`);
        return result;
    } catch (error) {
        logger.error("Error while deleting order!");
        prismaErrorTranslator(error);
    }

}

module.exports = {
    getAll,
    getById,
    createOrder,
    editOrder,
    deleteOrder,
}