/*
    REST ORDER

    only routing here, all domain dunctions should go in service
    the only other allowed thing here is validation
*/

/*
    REMINDERS:
    - the information put into the body of a request is readable in req.body
    - to parse parameters from the request: req.params.[name parameter]
    - to return info in json format: res.json()
*/
const orderService = require('../service/order');
const companyService = require('../service/company');
const validator = require('express-joi-validation').createValidator({
    passError: true
});
const { orderBody, orderBodyEdit } = require('../core/util/joiSchemas.js');
const { hasPermission, permissions } = require('../core/middlewares/auth0');
const { getCompanyId, authorization } = require('../core/util/authorization');

const getAll = async (req, res) => {
    const companyId = await getCompanyId(req.auth, req.headers.authorization);
    const info = await orderService.getAll(companyId);
    res.json(info);
}

const getById = async (req, res) => {
    const result = await orderService.getById(req.params.id);
    // res.json(result);
    authorization(req, res, result);
}

const createOrder = async (req, res) => {
    const companyId = await getCompanyId(req.auth, req.headers.authorization);
    const reqCompanyId = req.body.companyId;
    if (reqCompanyId !== companyId) {
        return res.status(403).json({
            "error": "Unauthorized",
            "message": 'You are not authorized to access this resource'
        });
    } else {
        const result = await orderService.createOrder(req.body);
        res.json(result);
    }
}

const editOrder = async (req, res) => {
    const companyId = await getCompanyId(req.auth, req.headers.authorization);
    const company = await companyService.getById(companyId);
    const reqOrderId = req.params.id;
    const orderToBeEdited = await orderService.getById(reqOrderId);
    if (orderToBeEdited.companyId !== companyId && company.addresses.filter(a => a.id === req.body.addressId).length === 0) {
        return res.status(403).json({
            "error": "Unauthorized",
            "message": 'You are not authorized to access this resource'
        });
    } else {
        const result = await orderService.editOrder(reqOrderId, req.body);
        res.json(result);
    }
}

const deleteOrder = async (req, res) => {
    const result = await orderService.deleteOrder(req.params.id);
    return res.json({ ...result });
}

module.exports = (app) => {
    app.get('/orders', hasPermission(permissions.Customer), (req, res) => {
        getAll(req, res);
    });

    app.get('/orders/:id', hasPermission(permissions.Customer), (req, res, next) => {
        getById(req, res).catch(next);
    });

    app.post('/orders', hasPermission(permissions.Customer), validator.body(orderBody), (req, res, next) => {
        createOrder(req, res).catch(next);
    });

    app.put('/orders/:id', validator.body(orderBodyEdit), (req, res, next) => {
        editOrder(req, res).catch(next);
    });

    app.delete('/orders/:id', hasPermission(permissions.Customer), (req, res, next) => {
        deleteOrder(req, res).catch(next);
    });

}