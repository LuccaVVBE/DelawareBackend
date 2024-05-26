/*
    REPO PRODUCT
    only Prisma-related code should go here
*/
const MainPrisma = require('./mainRepo');

const prisma = MainPrisma.prisma;

const getAll = async () => {
    return await prisma.company.findMany({});
}

const getById = async (id) => {
    return await prisma.company.findFirstOrThrow({
        where: {
            id: id
        },
        include: {
            addresses: true,
            employees: true,
        }
    });
}

module.exports = {
    getAll,
    getById,
}