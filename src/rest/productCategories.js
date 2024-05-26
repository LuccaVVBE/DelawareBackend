/*
    REST PRODUCT PRICE

    only routing here, all domain dunctions should go in service
    the only other allowed thing here is validation
*/

/*
    REMINDERS:
    - the information put into the body of a request is readable in req.body
    - to parse parameters from the request: req.params.[name parameter]
    - to return info in json format: res.json()
*/
const productCategoryService = require('../service/productCategory');

const getAll = async (req, res) => {
    const info = await productCategoryService.getAll();
    res.json(info);
}

const getById = async (req, res) => {
    const info = await productCategoryService.getByCategoryId(req.params.id);
    res.json(info);
}

module.exports = (app) => {
    app.get('/product-categories', (req, res) => {
        getAll(req, res);
    });

    app.get('/product-categories/:id', (req, res, next) => {
        getById(req, res).catch(next);
    });
}