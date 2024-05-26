/*
    REPO PRODUCT
    only Prisma-related code should go here
*/
const MainPrisma = require('./mainRepo');

const prisma = MainPrisma.prisma;
const categoryRepo = require('./productCategory');
const PrismaError = require('../core/util/prismaError.js');

const getAll = async (category) => {
    const res = await prisma.product.findMany({
        ...(category ? {
            where: {
                productToCategory: {
                    some: {
                        category: {
                            categoryId: category
                        }
                    }
                }
            }
        } : {}),
        include: {
            productDescription: true,
            productPrice: true,
            productToCategory: {
                select: {
                    category: true
                }
            }
        }
    });
    return res;
}

const getById = async (id) => {
    return await prisma.product.findFirstOrThrow({
        where: {
            id: id
        },
        include: {
            productDescription: true,
            productPrice: true,
            productToCategory: {
                select: {
                    category: true
                }
            }
        }
    });
}

const createProduct = async (info) => {
    const category = await categoryRepo.getById(info.category.categoryId);
    if (category == null) {
        throw new PrismaError("The category does not exist!");
    }

    const res = await prisma.product.create({
        data: {
            id: info.id,
            stock: info.stock,
            eta: info.eta,
            linkToImg: info.linkToImg != null ? info.linkToImg : "",
            productToCategory: {
                create: {
                    category: {
                        connect: {
                            categoryId: info.category.categoryId
                        }
                    }
                }
            },
        }
    });
    return res;
}

const editProduct = async (id, {
    ...args
}) => {
    await prisma.product.update({
        where: {
            productId: id
        },
        data: args
    })
}

// deleting a product also deletes the categoryToProduct relation
const deleteProduct = async (id) => {
    const res = await prisma.product.delete({
        where: {
            id
        }
    })
    return res;
}

const removeStock = async (id, quantity) => {
    const product = await getById(id);
    if (product.stock < quantity) {
        throw new PrismaError(`Not enough stock, you requested ${quantity} but there is only ${product.stock} in stock.`);
    }
    const res = await prisma.product.update({
        where: {
            id
        },
        data: {
            stock: {
                decrement: quantity
            }
        }
    })

    return res;
}

module.exports = {
    getAll,
    getById,
    createProduct,
    editProduct,
    deleteProduct,
    removeStock,
}