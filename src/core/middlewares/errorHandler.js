module.exports = (app) => {
    app.use((err, req, res, next) => {
        console.log(err);
        const status = err.status ?? 500;
        res.status(status).json({
            error: "internal",
            message: err.message ?? "the server encountered an internal error"
        });
    });
}