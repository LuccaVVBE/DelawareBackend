/*
    SERVICE CUSTOMER

    all domain logic and tests go here
    acts as a check before asking things from the repo
*/

const { getLogger } = require('../core/logging/logger');
const prismaErrorTranslator = require('../core/util/prismaErrorTranslator.js');
const dbCustomer = require('../repo/customer')

const getAll = async (companyId) => {
    const data = await dbCustomer.getAll(companyId);
    const logger = getLogger();
    logger.info("Sending all the customers...");
    return { "count": data.length, data: data };
}

const getById = async (id) => {
    const logger = getLogger();
    try {
        const res = await dbCustomer.getById(id);
        logger.info(`Sending the customer with id ${id}...`);
        return res;
    } catch (error) {
        logger.error("No customer found with this id");
        prismaErrorTranslator(error, "The customer with this id does not exist!")
    }
}

const getNotificationsByCustomerId = async (id, read) => {
    const logger = getLogger();
    try {
        const res = await dbCustomer.getNotificationsByCustomerId(id, read);
        logger.info(`Sending the notifications of the customer with id ${id}...`);
        return { count: res.length, data: res };
    } catch (error) {
        console.log(error);
        logger.error("No customer found with this id");
        prismaErrorTranslator(error, "The customer with this id does not exist!")
    }
}

// const createCustomer = async ({ ...args }) => {
//     const info = {
//         ...args
//     }
    
//     try {
//         const res = await dbCustomer.createCustomer({
//             customerId: info.customerId,
//             firstName: info.firstName,
//             secondName: info.secondName,
//             country: info.country,
//             city: info.city,
//             street: info.street,
//             houseNum: info.houseNum,
//             zipCode: info.zipCode,
//             phoneNr: info.phoneNr
//         });
//         return res;
//     } catch (error) {
//         logger.error("This customer already exists or the passed information is wrong!");
//         prismaErrorTranslator(error, "This customer already exists or the passed information is wrong!");
//     }
// }

// const editCustomer = async (id, { ...args }) => {
//     const info = {
//         ...args
//     }
//     const logger = await getLogger();
//     try {
//         const res = await dbCustomer.editCustomer(id, info);
//         logger.info(`The customer with id ${id} has been edited.`);
//         return res;
//     } catch (error) {
//         logger.error("Error while editing the customer!");
//         prismaErrorTranslator(error);
//     }
// }

// const deleteCustomer = async (id) => {
//     try {
//         const res = await dbCustomer.deleteCustomer(id);
//         const logger = await getLogger();
//         logger.info(`The customer with id ${id} has been deleted.`);
//         return res;
//     } catch (error) {
//         logger.error("Error while deleting the customer!");
//         prismaErrorTranslator(error)
//     }
// }

module.exports = {
    getAll,
    getById,
    getNotificationsByCustomerId,
    // createCustomer,
    // editCustomer,
    // deleteCustomer,
}