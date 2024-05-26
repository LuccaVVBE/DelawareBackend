/*
    REPO PRODUCT
    only Prisma-related code should go here
*/
const prismaErrorTranslator = require('../core/util/prismaErrorTranslator.js');
const MainPrisma = require('./mainRepo');

const prisma = MainPrisma.prisma

const getAll = async () => {
    const res = await prisma.productPrice.findMany({
        include: {
            product: true,
        },
    }); return { count: res.length, data: res };
}

const getAllByCurrencyId = async (id) => {
    const res = await prisma.productPrice.findMany({
        where: {
            currencyId: id
        },
        include: {
            product: true,
        },
    });
    return res;
}

const getByProductId = async (id) => {
    const res = await prisma.productPrice.findMany({
        where: {
            productId: id
        },
        include: {
            product: true,
        },
    });
    return res;
}

const createPrice = async ({ ...args }) => {
    try {
        await prisma.productPrice.create({
            data: args
        });
    } catch (error) {
        prismaErrorTranslator(error);
    }
}

const editPrice = async (id, { ...args }) => {
    try {
        await prisma.productPrice.update({
            where: {
                productId: id
            },
            data: args
        })
    } catch (error) {
        prismaErrorTranslator(error);
    }

}

const deletePrice = async (id) => {
    try {
        await prisma.productPrice.delete({
            where: {
                productId: id
            }
        })
    } catch (error) {
        prismaErrorTranslator(error);
    }
}

module.exports = {
    getAll,
    getAllByCurrencyId,
    getByProductId,
    createPrice,
    editPrice,
    deletePrice
}