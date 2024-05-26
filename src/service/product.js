/*
    SERVICE PRODUCT

    all domain logic and tests go here
    acts as a check before asking things from the repo
*/

const { getLogger } = require('../core/logging/logger');
const dbProduct = require('../repo/product');
const PrismaError = require('../core/util/prismaError.js');
const prismaErrorTranslator = require('../core/util/prismaErrorTranslator.js');

const reformatProductCategory = (product) => {
    const category = product.productToCategory[0]?.category || {}; // this shouldn't be possible since the productToCategory is required in the schema
    delete product.productToCategory;
    return {
        ...product,
        category: category
    }
}

const filterByLanguage = (products, language) => {
    const filtered = [];
    products.forEach((product) => {
        const description = product.productDescription.filter((description) => description.languageId === language);
        if (description.length > 0) {
            filtered.push({
                ...product,
                productDescription: description[0]
            });
        }
    });
    if (filtered.length === 0) {
        throw new PrismaError("No product found with this language");
    }
    return filtered;
}

const getAll = async (language, category) => {
    const data = await dbProduct.getAll(category);
    const reformatted = data.map((product) => reformatProductCategory(product));
    const res = language ? filterByLanguage(reformatted, language) : reformatted;
    const logger = getLogger();
    logger.info("Sending all the products...");
    return {
        "count": res.length,
        items: res
    };
}

const getByName = async (name) => {
    const res = await dbProduct.getByName(name);
    const logger = getLogger();
    logger.info(`Sending the product called ${name}...`);
    return res;
}

const getById = async (id, language) => {
    const logger = getLogger();
    try {
        const data = await dbProduct.getById(id);
        const reformatted = reformatProductCategory(data);
        const res = language ? filterByLanguage([reformatted], language)[0] : reformatted;
        logger.info(`Sending the product with id ${id}...`);
        return res;
    } catch (error) {
        logger.error("This product does not exist!");
        prismaErrorTranslator(error, "No product found with this id");
    }

}

const createProduct = async ({
    ...args
}) => {
    const info = {
        ...args
    }
    const logger = await getLogger();
    try {
        const res = await dbProduct.createProduct({
            stock: info.stock,
            eta: info.eta,
            linkToImg: info.linkToImg != null ? info.linkToImg : "",
            category: info.category
        });
        logger.info(`A new product has been created.`);
        return res;
    } catch (error) {
        logger.error(`Error while creating a new product`);
        prismaErrorTranslator(error);
    }
}

const editProduct = async (id, {
    ...args
}) => {
    const info = {
        ...args
    }

    await dbProduct.editProduct(id, info);
    const logger = await getLogger();
    logger.info(`The product has been edited.`);
}

const deleteProduct = async (id) => {
    const logger = await getLogger();
    try {
        await dbProduct.deleteProduct(id);
        logger.info(`Product with id ${id} has been deleted.`);
    } catch (error) {
        logger.error(`Error while deleting the product with id ${id}`);
        prismaErrorTranslator(error);
    }

}

const removeStock = async (id, amount) => {
    const logger = await getLogger();
    logger.info(`${amount} products has been removed from the stock.`);
    return dbProduct.removeStock(id, amount);
}

module.exports = {
    getAll,
    getByName,
    getById,
    createProduct,
    editProduct,
    deleteProduct,
    removeStock,
}