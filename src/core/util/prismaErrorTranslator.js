const PrismaError = require('../util/prismaError.js');
const { Prisma } = require("@prisma/client");

module.exports = function prismaErrorTranslator(
    error,
    message
) {
    // console.log(error);
    if (error instanceof PrismaError) {
        throw error;
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2000") {
            throw new PrismaError(
                message ?? "The data you've provided is too long.",
                413);
        }

        if (error.code === "P2001") {
            throw new PrismaError(
                message ?? "No data exists for the condition you've provided.",
                404);
        }

        if (error.code === "P2002") {
            throw new PrismaError(
                message ?? "The entity already exists.",
                409);
        }

        if (error.code === "P2003") {
            throw new PrismaError(
                message ?? "Foreign key constraint failed!",
                404);
        }

        if (error.code === "P2015") {
            throw new PrismaError(
                message ?? "A related record could not be found.",
                404);
        }

        if (error.code === "P2025") {
            throw new PrismaError(
                message ?? "The entity you're looking for does not exist.",
                404);
        }
        throw new PrismaError(
            message ?? "There is a problem with your request",
            400);
    }

    if (error instanceof Prisma.PrismaClientUnknownRequestError) {
        throw new PrismaError(
            message ?? "The database server ran into a problem",
            500);
    }

    if (error instanceof Prisma.PrismaClientInitializationError) {
        throw new PrismaError(
            message ?? "There's a problem with database connection",
            500);
    }

    if (error instanceof Prisma.PrismaClientRustPanicError) {
        throw new PrismaError(
            message ?? "The database server ran into a problem",
            500);
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
        throw new PrismaError(
            message ?? "There's a problem with the parameters you've provided",
            500);
    }

    throw new PrismaError(
        message ?? "The database server ran into a problem",
        500);
}
