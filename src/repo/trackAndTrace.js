/*
    REPO TRACK&TRACE
    only Prisma-related code should go here
*/

const MainPrisma = require('./mainRepo');
const prisma = MainPrisma.prisma;

const getAll = async () => {
    const res = await prisma.trackAndTrace.findMany();
    return res;
}

const getByNumbers = async (trackingNumber, confirmationNumber) => {
    const res = await prisma.trackAndTrace.findFirstOrThrow({
        where: {
            AND: [
                { number: trackingNumber },
                { verificationCode: confirmationNumber }
            ]
        },
        include: {
            order: true,
            order: {
                include: {
                    address: true
                }
            },
            carrier: true
        }

    });
    return res;
}


module.exports = {
    getAll,
    getByNumbers
}