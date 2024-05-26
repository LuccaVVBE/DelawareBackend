/*
    REST NOTIFICATION

    only routing here, all domain dunctions should go in service
    the only other allowed thing here is validation
*/

/*
    REMINDERS:
    - the information put into the body of a request is readable in req.body
    - to parse parameters from the request: req.params.[name parameter]
    - to return info in json format: res.json()
*/
const notificationService = require('../service/notification.js');
const { hasPermission, permissions } = require('../core/middlewares/auth0');
const { getCompanyId, authorization } = require('../core/util/authorization');

const getAll = async (req, res) => {
    const companyId = await getCompanyId(req.auth, req.headers.authorization);
    const info = await notificationService.getAll(companyId);
    res.json(info);
}

const getById = async (req, res) => {
    const info = await notificationService.getById(req.params.id);
    // res.json(info);
    authorization(req, res, info);
}

const readNotification = async (req, res) => {
    const companyId = await getCompanyId(req.auth, req.headers.authorization);
    const notificationToRead = await notificationService.getById(req.params.id);
    if (notificationToRead.companyId !== companyId) {
        return res.status(403).json({
            "error": "Unauthorized",
            "message": 'You are not authorized to access this resource'
        });
    }
    const info = await notificationService.readNotification(req.params.id);
    res.json(info);
}

// const createNotification = async (req, res) => {
//     const result = await notificationService.createNotification(req.body);
//     res.json({ ...result })
// }

// const deleteNotification = async (req, res) => {
//     const result = await notificationService.deleteNotification(req.params.id);
//     res.json({ ...result })
// }

module.exports = (app) => {

    app.get('/notifications', hasPermission(permissions.Customer), (req, res, next) => {
        getAll(req, res).catch(next);
    });

    app.get('/notifications/:id', hasPermission(permissions.Customer), (req, res, next) => {
        getById(req, res).catch(next);
    });

    app.put('/notifications/:id', hasPermission(permissions.Customer), (req, res, next) => {
        readNotification(req, res).catch(next);
    });

    // app.post('/notifications', validator.body(notificationBody), (req, res, next) => {
    //     createNotification(req, res).catch(next);
    // });

    // app.delete('/notifications/:id', (req, res, next) => {
    //     deleteNotification(req, res).catch(next);
    // });
}