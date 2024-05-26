const {
    PrismaClient
} = require('@prisma/client');
const company = require('../src/rest/company');
const prisma = new PrismaClient()

const products = require("./seed/data.json");
const organizations = require("./seed/organizations.json");

async function main() {
    console.log(`Deleting data ...`)
    await prisma.productCategory.deleteMany()
    await prisma.product.deleteMany();
    await prisma.company.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.order.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.carrier.deleteMany();
    console.log(`Data deleted.`)

    console.log(`Starting to seed...`)
    for (const c of organizations.company) {
        await prisma.company.create({
            data: {
                id: c.id,
                name: c.name,
                image: c.image,
                addresses: {
                    create: {
                        ...c.address
                    }
                },
            }
        })
    }

    await prisma.carrier.create({
        data: {
            id: "1",
            name: organizations.carrier.name,
            phone: organizations.carrier.phone,
            email: organizations.carrier.email,
            image: organizations.carrier.image,
            amountOfCharacters: organizations.carrier.amountOfCharacters,
            numOnly: organizations.carrier.numOnly,
            prefix: organizations.carrier.prefix,
        }
    })

    for (const company of organizations.company) {
        for (const employee of company.employees) {
            await prisma.customer.create({
                data: {
                    customerId: employee.customerId,
                    firstName: employee.firstName,
                    secondName: employee.secondName,
                    phoneNr: employee.phoneNr,
                    email: employee.email,
                    company: {
                        connect: {
                            id: employee.companyId
                        }
                    }
                }
            });
        }
    }

    for (const p of products) {
        await prisma.productCategory.create({
            data: {
                categoryId: p.id,
                categoryName: p.name,
            }
        })
        for (const product of p.products) {
            await prisma.product.create({
                data: {
                    id: product.productId,
                    stock: product.stock,
                    eta: product.eta,
                    productDescription: {
                        createMany: {
                            data: product.productDescription,
                        }
                    },
                    productPrice: {
                        create: {
                            currencyId: "EUR",
                            price: product.productPrice.price,
                            unitOfMeasure: "EAX",
                            syncDateTime: new Date(),
                        },
                    },
                    productToCategory: {
                        create: {
                            categoryId: p.id,
                        },
                    },
                    linkToImg: product.linkToImg || null,
                }
            })
        }

        for (const order of p.orders) {
            await prisma.order.create({
                data: {
                    orderId: order.orderId,
                    company: {
                        connect: {
                            id: order.companyId
                        }
                    },
                    address: {
                        connect: {
                            id: "1"
                        }
                    },
                    packingType: "Regular cardboard",
                    trackAndTrace: {
                        create: {
                            number: order.trackAndTrace.number,
                            status: order.trackAndTrace.status,
                            verificationCode: order.trackAndTrace.verificationCode,
                            carrier: {
                                connect: {
                                    id: order.trackAndTrace.carrierId
                                }
                            }
                        },
                    },
                    orderItems: {
                        create: {
                            product: {
                                connect: {
                                    id: "EL002"
                                }
                            },
                            quantity: 1,
                        }
                    },
                    packingType: "Regular cardboard",
                }
            });
        }
        if (p.notifications) {
            for (const n of p.notifications) {
                await prisma.notification.create({
                    data: {
                        title: n.title,
                        description: n.description,
                        read: n.read ?? false,
                        company: {
                            connect: {
                                id: n.companyId
                            }
                        },
                        order: {
                            connect: {
                                orderId: n.orderId
                            }
                        }
                    }
                })
            }
        }
    }
    console.log(`Seeding finished.`)
}



main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })