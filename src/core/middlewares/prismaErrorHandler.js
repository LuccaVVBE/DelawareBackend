const PrismaError = require('../util/prismaError.js');
const { Prisma } = require("@prisma/client");

module.exports = (app) => {
    app.use((err, req, res, next) => {

        if (err instanceof PrismaError) {
            res.status(err.code).json({
                error: err.name,
                message: err.message
            });
        }
        // For any prisma-related error not manually converted to PrismaError
        else if (err instanceof Prisma.PrismaClientKnownRequestError) {
            res.status(400).json({
                error: err.name,
                message: err.message
            });
        } else {
            // pass on to another error handler
            next(err);
        }
    });
}