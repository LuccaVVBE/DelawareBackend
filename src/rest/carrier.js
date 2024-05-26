/*
    REST CARRIER

    only routing here, all domain dunctions should go in service
    the only other allowed thing here is validation
*/

/*
    REMINDERS:
    - the information put into the body of a request is readable in req.body
    - to parse parameters from the request: req.params.[name parameter]
    - to return info in json format: res.json()
*/
const { hasPermission, permissions } = require('../core/middlewares/auth0');
const carrierService = require('../service/carrier');

const getAll = async (req, res) => {
    const info = await carrierService.getAll();
    res.json(info);
}

const getById = async (req, res) => {
    const info = await carrierService.getById(req.params.id);
    res.json(info);
}

module.exports = (app) => {
    app.get('/carriers', hasPermission(permissions.Customer), (req, res) => {
        getAll(req, res);
    });

    app.get('/carriers/:id', hasPermission(permissions.Customer), (req, res, next) => {
        getById(req, res).catch(next);
    });
}