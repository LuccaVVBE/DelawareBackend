const installTest = require('./tester');
const installProduct = require('./product');
const installProductCategory = require('./productCategories');
const installOrder = require('./order');
const installCustomer = require('./customer');
const installNotification = require('./notification');
const installCompanies = require('./company');
const installCarriers = require('./carrier');
const installTrack = require('./trackAndTrace');

module.exports = (app) => {
    installTest(app);
    installProduct(app);
    installProductCategory(app);
    installOrder(app);
    installCustomer(app);
    installNotification(app);
    installCompanies(app);
    installCarriers(app);
    installTrack(app);
}