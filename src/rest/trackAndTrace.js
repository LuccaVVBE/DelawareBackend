/*
    REST PRODUCT

    only routing here, all domain dunctions should go in service
    the only other allowed thing here is validation
*/

/*
    REMINDERS:
    - the information put into the body of a request is readable in req.body
    - to parse parameters from the request: req.params.[name parameter]
    - to return info in json format: res.json()
*/
const tntService = require('../service/trackAndTrace');

// This options forces validation to pass any errors the express
// error handler instead of generating a 400 error
const validator = require('express-joi-validation').createValidator({
    passError: true
});

const { trackAndTrace } = require('../core/util/joiSchemas.js');

const getAll = async (req, res) => {
    const info = await tntService.getAll();
    res.json(info);
}

const getByNumbers = async (req, res) => {
    const { trackingNumber, confirmationNumber } = req.query;
    const info = await tntService.getByNumbers(trackingNumber, confirmationNumber);
    res.json(info);
}

module.exports = (app) => {
    app.get('/track', validator.query(trackAndTrace), (req, res, next) => {
        getByNumbers(req, res).catch(next);
    });
}