const Joi = require('joi')

const registerSchema = Joi.object({
    user: Joi.string()
        .min(3)
        .max(50)
        .required(),

    fname: Joi.string().min(2).required(),
    lname: Joi.string().min(2).required(),

    email: Joi.string().email().required(),

    mobile: Joi.string()
        .pattern(/^[0-9]{10}$/)
        .required(),

    roles: Joi.array()
        .items(Joi.string().valid('Buyer', 'Seller'))
        .optional(),

    address: Joi.object({
        street: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        pincode: Joi.string().required()
    }).required(),

    pwd: Joi.string().min(6).max(15).required()
})

module.exports = registerSchema
