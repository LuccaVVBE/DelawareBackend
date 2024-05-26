/*
    REPO CARRIER
    only Prisma-related code should go here
*/
const MainPrisma = require('./mainRepo');

const prisma = MainPrisma.prisma;
const { getLogger } = require('../core/logging/logger');

const getAll = async () => {
    const res = await prisma.carrier.findMany();
    return res;
}

const getById = async (id) => {
    const res = await prisma.carrier.findUniqueOrThrow({
        where: {
            id: id
        }
    });
    return res;
}

const createCarrier = async (info) => {
    const res = await prisma.carrier.create({
        data: {
            firstName: info.firstName,
            secondName: info.secondName,
            phonenr: info.phonenr,
            email: info.email,
            active: info.active
        }
    });
    return res;
}

const editCarrier = async (id, info) => {
    await prisma.carrier.update({
        where: {
            carrierId: id
        },
        data: info
    });

    const res = await getById(id);
    return res;
}

const deleteCarrier = async (id) => {
    await prisma.carrier.delete({
        where: {
            carrierId: id
        }
    })
}

module.exports = {
    getAll,
    getById,
    createCarrier,
    editCarrier,
    deleteCarrier
}