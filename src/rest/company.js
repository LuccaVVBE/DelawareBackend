/*
    REST COMPANY

    only routing here, all domain dunctions should go in service
    the only other allowed thing here is validation
*/

/*
    REMINDERS:
    - the information put into the body of a request is readable in req.body
    - to parse parameters from the request: req.params.[name parameter]
    - to return info in json format: res.json()
*/
const companyService = require('../service/company.js');
const { authorization } = require('../core/util/authorization');
const { hasPermission, permissions } = require('../core/middlewares/auth0');


const getAll = async (req, res) => {
    const info = await companyService.getAll();
    res.json(info);
}

const getById = async (req, res) => {
    const info = await companyService.getById(req.params.id);
    // res.json(info);
    authorization(req, res, info);
}

const getOrdersById = async (req, res) => {
    const info = await companyService.getOrdersById(req.params.id);
    authorization(req, res, info);
    // res.json(info);
}

const getEmployeesById = async (req, res) => {
    const info = await companyService.getEmployeesById(req.params.id);
    // res.json(info);
    authorization(req, res, info);
}

const getNotificationsById = async (req, res) => {
    const { id } = req.params;
    const { read } = req.query;
    const info = await companyService.getNotificationsById(id, read);
    // res.json(info);
    authorization(req, res, info);
}


module.exports = (app) => {

    app.get('/companies', (req, res, next) => {
        getAll(req, res).catch(next);
    });

    app.get('/companies/:id', hasPermission(permissions.Customer), (req, res, next) => {
        getById(req, res).catch(next);
    });

    app.get('/companies/:id/orders', hasPermission(permissions.Customer), (req, res, next) => {
        getOrdersById(req, res).catch(next);
    });

    app.get('/companies/:id/employees', hasPermission(permissions.Customer), (req, res, next) => {
        getEmployeesById(req, res).catch(next);
    });

    app.get('/companies/:id/notifications', hasPermission(permissions.Customer), (req, res, next) => {
        getNotificationsById(req, res).catch(next);
    });
}