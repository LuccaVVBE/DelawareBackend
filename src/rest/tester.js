const { getLogger } = require("../core/logging/logger");
const { verifyJwsToken } = require("../core/middlewares/auth0");

const getAll = async (ctx, res) => {
    const m1 = await ctx.headers.authorization;
    const m2 = JSON.stringify(ctx.auth);

    await res.status(200).send(`${m1} : ${m2}`)
}

module.exports = (app) => {
	app.get('/testCon', (req, res) => {
        getAll(req, res)
    });
    /*
        other possibilities are:
            app.put()
            app.post()
            app.delete()

        user info is given through the ctx.auth aka req.auth
    */
}
