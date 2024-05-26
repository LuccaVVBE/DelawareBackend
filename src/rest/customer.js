/*
    REST CUSTOMER

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
const {getCompanyId, authorization} = require('../core/util/authorization');
const customerService = require('../service/customer');

const getAll = async (req, res) => {
    const companyId = await getCompanyId(req.auth, req.headers.authorization);
    const info = await customerService.getAll(companyId);
    res.json(info);
}

const getById = async (req, res) => {
    const info = await customerService.getById(req.params.id);
    authorization(req, res, info);
}

// const getNotificationsByCustomerId = async (req, res) => {
//     const { read } = req.query;
//     const info = await customerService.getNotificationsByCustomerId(req.params.id, read);
//     res.json(info);
// }

// const getOrdersByCustomerId = async (req, res) => {
//     const { read } = req.query;
//     console.log(req.params.id, read);
//     const info = await customerService.getNotificationsByCustomerId(req.params.id, read);
//     res.json(info);
// }

// const createCustomer = async (req, res) => {
//     const result = await customerService.createCustomer({
//         ...req.body,
//         customerId: req.auth.sub
//     });
//     res.json({ ...result })
// }

// const editCustomer = async (req, res) => {
//     const { customerId, ...args } = req.body;
//     const result = await customerService.editCustomer(customerId, args);
//     res.json({ ...result })
// }

// const deleteCustomer = async (req, res) => {
//     const result = await customerService.deleteCustomer(req.params.id);
//     res.json({ ...result })
// }

module.exports = (app) => {
    app.get('/customers', hasPermission(permissions.Customer), (req, res) => {
        getAll(req, res);
    });

    app.get('/customers/:id', hasPermission(permissions.Customer), (req, res, next) => {
        getById(req, res).catch(next);
    });

    // app.get('/customers/:id/notifications', hasPermission(permissions.Customer), (req, res, next) => {
    //     getNotificationsByCustomerId(req, res).catch(next);
    // });

    // app.get('/customers/:id/orders', hasPermission(permissions.Customer), (req, res, next) => {
    //     getOrdersByCustomerId(req, res).catch(next);
    // });

    // app.post('/customers', validator.body(customerBody), (req, res, next) => {
    //     createCustomer(req, res).catch(next);
    // });

    // app.put('/customers/:id', validator.body(customerBodyEdit), (req, res, next) => {
    //     editCustomer(req, res).catch(next);
    // });

    // app.delete('/customers/:id', (req, res, next) => {
    //     deleteCustomer(req, res).catch(next);
    // });

}