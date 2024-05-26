// main repo file to init Prisma
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = {
    prisma
}