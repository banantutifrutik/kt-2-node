const Joi = require('joi');

const productSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    price: Joi.number().greater(0).required(),
    category: Joi.string().valid('electronics', 'clothing', 'food', 'other').required(),
    stock: Joi.number().integer().min(0).default(0),
    description: Joi.string().max(500).allow('').optional(),
    imageUrl: Joi.string().optional()
});

const productPatchSchema = Joi.object({
    name: Joi.string().min(2).max(100),
    price: Joi.number().greater(0),
    category: Joi.string().valid('electronics', 'clothing', 'food', 'other'),
    stock: Joi.number().integer().min(0),
    description: Joi.string().max(500).allow(''),
    imageUrl: Joi.string()
}).min(1);

const validate = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
        return res.status(400).json({
            error: 'Validation failed',
            details: error.details.map(err => err.message)
        });
    }
    req.body = value;
    next();
};

module.exports = {
    validateProduct: validate(productSchema),
    validatePatch: validate(productPatchSchema)
};