module.exports = (app) => {
    app.use((err, req, res, next) => {
        if (err && err.error && err.error.isJoi) {
            // we had a joi error, let's return a custom 400 json response
            res.status(400).json({
                error: err.type, // can be "query", "headers", "body", or "params"
                message: err.error.toString()
            });
        } else {
            // pass on to another error handler
            next(err);
        }
    });
}