/*
    REPO ORDER
    only Prisma-related code should go here
*/
const MainPrisma = require('./mainRepo');
const prisma = MainPrisma.prisma;


const getAll = async (companyId) => {
    const res = await prisma.order.findMany({
        include: {
            orderItems: true,
            trackAndTrace:true
        },
        where: {
            companyId: companyId
        }
    });
    return res;
}

const getById = async (id) => {
    const res = await prisma.order.findUniqueOrThrow({
        where: {
            orderId: id
        },
        include: {
            orderItems: true,
            address: true,
            trackAndTrace: true,
        },
    });
    return res;
}

const getByCompanyId = async (id) => {
    const res = await prisma.order.findMany({
        where: {
            companyId: id
        },
        include: {
            orderItems: true,
            address: true,
            company: true,
        }
    });
    return res;
}

const createOrder = async ({ ...args }) => {
    const info = { ...args };
    let addressId = info.addressId;
    if (addressId === undefined) {
        const address = await prisma.address.create({
            data: info.address
        });
        addressId = address.id;
    }

    const result = await prisma.order.create({
        data: {
            address: {
                connect: {
                    id: addressId
                }
            },
            company: {
                connect: {
                    id: info.companyId
                }
            },
            packingType: info.packingType,
            orderItems: {
                createMany: {
                    data: info.orderItems.map(item => {
                        return {
                            quantity: item.quantity,
                            productId: item.productId,
                        }
                    })
                }
            },
        }
    });
    return result;
}

const editOrder = async (id, info) => {
    const order = await prisma.order.findUniqueOrThrow({
        where: {
            orderId: id
        }
    });
    let addressId = info.addressId;
    if (addressId === undefined && info.address !== undefined) {
        const address = await prisma.address.create({
            data: info.address
        });
        addressId = address.id;
    }
    let res;
    if (info.addressId || info.address) {
        res = await prisma.order.update({
            where: {
                orderId: id
            },
            data: {
                address: {
                    connect: {
                        id: addressId
                    }
                },
                packingType: info.packingType ?? order.packingType
            }
        })
    } else {
        res = await prisma.order.update({
            where: {
                orderId: id
            },
            data: {
                packingType: info.packingType
            }
        })
    }
    return res;
}

const updateOrderPackingType = async (id, packingType) => {
    return await prisma.order.update({
        where: {
            orderId: id
        },
        data: {
            packingType
        }
    })
}

const deleteOrder = async (id) => {
    return await prisma.order.delete({
        where: {
            orderId: id
        }
    })
}

module.exports = {
    getAll,
    getById,
    getByCompanyId,
    createOrder,
    editOrder,
    updateOrderPackingType,
    deleteOrder
}