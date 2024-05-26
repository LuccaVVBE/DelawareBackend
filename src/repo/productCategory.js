/*
    REPO PRODUCT
    only Prisma-related code should go here
*/
const MainPrisma = require('./mainRepo');
const { getLogger } = require('../core/logging/logger');
const prismaErrorTranslator = require('../core/util/prismaErrorTranslator.js');

const prisma = MainPrisma.prisma

const getAll = async () => {
    const res = await prisma.productCategory.findMany();
    return res;
}

const getById = async (id) => {
    const logger = getLogger();
    const res = await prisma.productCategory.findUniqueOrThrow({
        where: {
            categoryId: id
        }
    });
    return res;
}

const createCategory = async ({ ...args }) => {
    const logger = getLogger();

    try {
        await prisma.productCategory.create({
            data: args
        });
        logger.info("The new category is created!")
    } catch (error) {
        logger.error("There has been an error or such a category already exists!");
        prismaErrorTranslator(error)
    }
}

const editProductCategory = async (id, { ...args }) => {
    await prisma.productCategory.update({
        where: {
            categoryId: id
        },
        data: args
    })
}

const deleteProductCategory = async (id) => {
    await prisma.productCategory.delete({
        where: {
            categoryId: id
        }
    })
}

module.exports = {
    getAll,
    getById,
    createCategory,
    editProductCategory,
    deleteProductCategory
}