const jwksrsa = require('jwks-rsa')
const config = require('config')
const { getLogger } = require('../logging/logger')
const { expressjwt: jwt } = require('express-jwt')

function checkJwsToken() {
    const logger = getLogger();
    const jwksUri = config.has('auth.jwksUri') ? config.get('auth.jwksUri') : '';
    const audience = config.has('auth.audience') ? config.get('auth.audience') : '';

    try {
        return jwt({
            secret: jwksrsa.expressJwtSecret({
                jwksUri: jwksUri,
                cache: true
            }),
            aud: audience,
            issuer: config.has('auth.issuer') ? config.get('auth.issuer') : '',
            algorithms: ['RS256']
        }).unless({
            path: [
                /^\/products.*/,
                /^\/product-categories*/,
                /^\/track*/,
                // /^\/carriers*/,
                // /^\/companies*/,
                // /^\/customers*/,
                // /^\/notifications/,
                // /^\/orders*/,
                "/testCon",
            ]
        });
    } catch (error) {
        logger.error(error)
        throw error
    }
}

const permissions = Object.freeze({
    Customer: "Customer",
    WarehouseEmployee: "WarehouseEmployee",
    Admin: "Admin"
})

function hasPermission(permission) {
    return async (ctx, res, next) => {
        const logger = getLogger()
        const user = ctx.auth
        logger.debug(`hasPermission: ${JSON.stringify(user)}`)
        
        if (user && user.permissions && user.permissions.includes(permission)) {
            await next();
        } else {
            res.status(403).send('You are not allowed to view this part of the application');
        }
    }
}

module.exports = {
    checkJwsToken,
    hasPermission,
    permissions
}
