/*
    REPO BOX
    only Prisma-related code should go here
*/
const MainPrisma = require('./mainRepo');

const prisma = MainPrisma.prisma;
const { getLogger } = require('../core/logging/logger');

const getAll = async () => {
    const res = await prisma.box.findMany();
    return res;
}

const getById = async (id) => {
    const res = await prisma.box.findUniqueOrThrow({
        where: {
            boxId: id
        }
    });
    return res;
}

const createBox = async ({ ...args }) => {
    const logger = getLogger();
    const info = { ...args };
    const res = await prisma.box.create({
        data: {
            type: info.type,
            width: info.width || 50,
            height: info.height || 50,
            length: info.length || 50,
            price: info.price || 5,
            status: info.status || "PROCESSING"
        }
    });
    return res;
}

const editBox = async (id, { ...args }) => {
    await prisma.box.update({
        where: {
            boxId: id
        },
        data: args
    });
}

const deleteBox = async (id) => {
    await prisma.box.delete({
        where: {
            boxId: id
        }
    })
}

module.exports = {
    getAll,
    getById,
    createBox,
    editBox,
    deleteBox
}