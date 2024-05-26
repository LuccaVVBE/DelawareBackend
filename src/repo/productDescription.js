/*
    REPO PRODUCT
    only Prisma-related code should go here
*/
const MainPrisma = require('./mainRepo');

const prisma = MainPrisma.prisma

const getAll = async (language) => {
    const res = await prisma.productDescription.findMany({
        where: {
            languageId: language,
        },
        include: {
            product: true,
        },
    });
    return res;
}

const getByProductId = async (id, language) => {
    const res = await prisma.productDescription.findMany({
        where: {
            productId: id,
            languageId: language,
        },
        include: {
            product: true,
        },
    });
    return res;
}

// const createProductDescription = async ({ ...args }) => {
//     await prisma.productDescription.create({
//         data: args
//     });
// }

// const editProductDescription = async (id, { ...args }) => {
//     await prisma.productDescription.update({
//         where: {
//             categoryId: id
//         },
//         data: args
//     })
// }

// const deleteProductDescription = async (id) => {
//     await prisma.productDescription.delete({
//         where: {
//             categoryId: id
//         }
//     })
// }

module.exports = {
    getAll,
    getByProductId,
    // createProductDescription,
    // editProductDescription,
    // deleteProductDescription
}