/*
    REPO CUSTOMER
    only Prisma-related code should go here
*/
const MainPrisma = require('./mainRepo');

const prisma = MainPrisma.prisma;

const getAll = async (companyId) => {
    const res = await prisma.customer.findMany({
        where: {
            companyId: companyId
        }
    });
    return res;
}

const getById = async (id) => {
    const res = await prisma.customer.findUniqueOrThrow({
        where: {
            customerId: id
        }
    });
    return res;
}

const getByCompanyId = async (id) => {
    const res = await prisma.customer.findMany({
        where: {
            company: {
                id: id
            }
        }
    })
    return res;
};

const getNotificationsByCustomerId = async (id, read) => {
    const res = await prisma.notification.findMany({
        where: {
            customerId: id,
            ...(read ? { read: read === "true" } : {}),
        }
    });
    return res;
}

const editCustomer = async (id, { ...args }) => {
    const res = await prisma.customer.update({
        where: {
            customerId: id
        },
        data: args
    })
    return res;
}

const deleteCustomer = async (id) => {
    const res = await prisma.customer.delete({
        where: {
            customerId: id
        }
    })
    return res;
}

module.exports = {
    getAll,
    getById,
    getByCompanyId,
    // createCustomer,
    editCustomer,
    deleteCustomer,
    getNotificationsByCustomerId
}