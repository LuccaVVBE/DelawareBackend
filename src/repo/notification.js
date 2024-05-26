/*
    REPO NOTIFICATION
    only Prisma-related code should go here
*/
const MainPrisma = require('./mainRepo');
const prisma = MainPrisma.prisma;

const getAll = async (companyId) => {
    console.log(companyId);
    const res = await prisma.notification.findMany({
        where: {
            companyId: companyId
        }
    });
    return res;
}

const getById = async (id) => {
    const res = await prisma.notification.findUniqueOrThrow({
        where: {
            id: id
        }
    });
    return res;
}

const getByCompanyId = async (id, read) => {
    const res = await prisma.notification.findMany({
        where: {
            company: {
                id: id
            },
            ...(read ? { read: read == "true" } : {}),
        }
    });
    return res;
}

const createNotification = async ({ ...args }) => {
    const info = { ...args };
    const res = await prisma.notification.create({
        data: {
            title: info.title,
            description: info.description,
            read: info.read ?? false,
            company: {
                connect: {
                    id: info.companyId
                }
            }
        }
    });
    return res;
}

const readNotification = async (id) => {
    return await prisma.notification.update({
        where: {
            id: id
        },
        data: {
            read: true
        }
    });
}

const deleteNotification = async (id) => {
    return await prisma.notification.delete({
        where: {
            id: id
        }
    })
}

module.exports = {
    getAll,
    getById,
    getByCompanyId,
    createNotification,
    readNotification,
    deleteNotification
}