const Joi  = require("joi");
const roles = require("../utils/roles");

module.exports.userValidator = (req, res, next) => {
    const schema = Joi.object({
        username: Joi.string().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
        age :Joi.number().min(16).required(),
        address : Joi.string(),
        roles: Joi.array().items(Joi.string().valid(roles).required())
    });

    // schema options
    const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: false // remove unknown props
    };

    // validate request body against schema
    const { error, value } = schema.validate(req.body, options);
    
    if (error) {
        // on fail return comma separated errors
        next(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
    } else {
        // on success replace req.body with validated value and trigger next middleware function
        req.body = value;
        next();
    }
}


module.exports.loginValidator = (req, res, next) => {
    const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().min(6).required()
    });

    // schema options
    const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true // remove unknown props
    };

    // validate request body against schema
    const { error, value } = schema.validate(req.body, options);
    
    if (error) {
        // on fail return comma separated errors
        next(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
    } else {
        // on success replace req.body with validated value and trigger next middleware function
        req.body = value;
        next();
    }
}


module.exports.registerValidator = (req, res, next) => {
    const schema = Joi.object({
        username: Joi.string().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
        age :Joi.number().min(16).required(),
        address : Joi.string(),
    });

    // schema options
    const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: false // remove unknown props
    };

    // validate request body against schema
    const { error, value } = schema.validate(req.body, options);
    
    if (error) {
        // on fail return comma separated errors
        next(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
    } else {
        // on success replace req.body with validated value and trigger next middleware function
        req.body = value;
        next();
    }
}

module.exports.chatroomValidator = (req, res, next) => {
    const schema = Joi.object({
        maxSize : Joi.number().min(2).max(10),
    });

    // schema options
    const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: false // remove unknown props
    };

    // validate request body against schema
    const { error, value } = schema.validate(req.body, options);
    
    if (error) {
        // on fail return comma separated errors
        next(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
    } else {
        // on success replace req.body with validated value and trigger next middleware function
        req.body = value;
        next();
    }
}