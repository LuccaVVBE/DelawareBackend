const Joi = require('joi');

const language = Joi.object({
    language: Joi.string().min(2).max(2).optional(),
    category: Joi.string().optional()
});

const quantity = Joi.object({
    quantity: Joi.number().positive().required()
});

const trackAndTrace = Joi.object({
    trackingNumber: Joi.string().required(),
    confirmationNumber: Joi.string().required(),
});

const notificationBody = Joi.object({
    customerId: Joi.string().required(),
    title: Joi.string().required(),
    description: Joi.string().required(),
});

const orderBody = Joi.object({
    orderDateTime: Joi.date().required(),
    addressId: Joi.string().optional(),
    address: Joi.object({
        country: Joi.string().required(),
        zipCode: Joi.number().required(),
        city: Joi.string().required(),
        street: Joi.string().required(),
        number: Joi.string().required(),
    }).optional(),
    carrierId: Joi.string().optional(),
    companyId: Joi.string().required(),
    packingType: Joi.string().required(),
    orderItems: Joi.array().items(Joi.object({
        quantity: Joi.number().positive().required(),
        productId: Joi.string().required(),
    })).required()
}).xor('addressId', 'address');;

const orderBodyEdit = Joi.object({
    addressId: Joi.string().optional(),
    address: Joi.object({
        country: Joi.string().required(),
        zipCode: Joi.number().required(),
        city: Joi.string().required(),
        street: Joi.string().required(),
        number: Joi.string().required(),
    }).optional(),
    packingType: Joi.string().optional(),
}).xor('addressId', 'address');;

module.exports = {
    language,
    quantity,
    orderBody,
    orderBodyEdit,
    notificationBody,
    trackAndTrace,
}