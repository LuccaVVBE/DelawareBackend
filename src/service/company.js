/*
    SERVICE COMPANY

    all domain logic and tests go here
    acts as a check before asking things from the repo
*/

const { getLogger } = require('../core/logging/logger');
const dbCompany = require('../repo/company.js');
const dbOrders = require('../repo/order.js');
const dbNotifications = require('../repo/notification.js');
const dbCustomers = require('../repo/customer.js');
const prismaErrorTranslator = require('../core/util/prismaErrorTranslator.js');

const getAll = async () => {
    const data = await dbCompany.getAll();
    // const data = await Promise.all(companies.map(async (company) => {
    //     const orders = await dbOrders.getByCompanyId(company.id);
    //     return { ...company, orders: orders };
    // }));
    const logger = getLogger();
    logger.info("Sending all the companies...");
    return {
        "count": data.length,
        items: data
    };
}

const getById = async (id) => {
    const logger = getLogger();
    try {
        const company = await dbCompany.getById(id);
        const orders = await dbOrders.getByCompanyId(id);
        const notifications = await dbNotifications.getByCompanyId(id);
        logger.info(`Sending the company with id ${id}...`);
        return { ...company, orders: orders, notifications: notifications };
    } catch (error) {
        logger.error("This company does not exist!");
        prismaErrorTranslator(error, "No company found with this id");
    }
}

const getOrdersById = async (id) => {
    const logger = getLogger();
    try {
        const orders = await dbOrders.getByCompanyId(id);
        logger.info(`Sending the orders of the company with id ${id}...`);
        return { "count": orders.length, items: orders };
    } catch (error) {
        logger.error("This company does not exist!");
        prismaErrorTranslator(error, "No company found with this id");
    }
}

const getEmployeesById = async (id) => {
    const logger = getLogger();
    try {
        const employees = await dbCustomers.getByCompanyId(id);
        logger.info(`Sending the employees of the company with id ${id}...`);
        return { "count": employees.length, items: employees };
    } catch (error) {
        logger.error("This company does not exist!");
        prismaErrorTranslator(error, "No company found with this id");
    }
}

const getNotificationsById = async (id, read) => {
    const logger = getLogger();
    try {
        const notifications = await dbNotifications.getByCompanyId(id, read);
        logger.info(`Sending the notifications of the company with id ${id}...`);
        return { "count": notifications.length, items: notifications };
    } catch (error) {
        logger.error("This company does not exist!");
        prismaErrorTranslator(error, "No company found with this id");
    }
}

module.exports = {
    getAll,
    getById,
    getOrdersById,
    getEmployeesById,
    getNotificationsById
}