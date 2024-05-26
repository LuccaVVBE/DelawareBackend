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
const productService = require('../service/product');

// This options forces validation to pass any errors the express
// error handler instead of generating a 400 error
const validator = require('express-joi-validation').createValidator({
    passError: true
});

const {language, quantity, productBody} = require('../core/util/joiSchemas.js');
const PrismaError = require('../core/util/prismaError.js');
const { hasPermission, permissions } = require('../core/middlewares/auth0');

const getAll = async (req, res) => {
    const {language, category} = req.query;
    const info = await productService.getAll(language, category);
    res.json(info);
}

const getById = async (req, res) => {
    const language = req.query.language;
    const info = await productService.getById(req.params.id, language);
    res.json(info);
}

// const createProduct = async (req, res) => {
//     const result = await productService.createProduct(req.body);
//     res.json({ ...result })
// }

// const editProduct = async (req, res) => {
//     await productService.editProduct(req.body);
// }

// const deleteProduct = async (req, res) => {
//     await productService.deleteProduct(req.params.id);
// }

// const removeStock = async (req, res) => {
//         const result = await productService.removeStock(req.params.id, parseInt(req.query.quantity));
//         res.json(result);
// }

module.exports = (app) => {

    app.get('/products', validator.query(language), (req, res,next) => {
        getAll(req, res).catch(next);
    });

    app.get('/products/:id', validator.query(language), (req, res, next) => {
        getById(req, res).catch(next);
    });

    // app.post('/products', validator.body(productBody) ,(req, res, next) => {
    //     createProduct(req, res).catch(next);
    // });

    // app.delete('/products/:id', (req, res) => {
    //     deleteProduct(req, res);
    // });

    // app.put('/products/:id/remove-stock', validator.query(quantity), (req, res, next) => {
    //     removeStock(req, res).catch(next);
    // });
}