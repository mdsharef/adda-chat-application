// external imports
const { check, validationResult } = require('express-validator');

const loginValidators = [
    check('username')
        .isLength({
            min: 1,
        })
        .withMessage('Mobile number or email must be provided as username to login.'),
    check('password')
        .isLength({
            min: 1,
        })
        .withMessage('Password is required to login')
]

const loginValidatorsHandler = (req, res, next) => {
    const errors = validationResult(req)
    const mappedErrors = errors.mapped();

    if(Object.keys(mappedErrors).length === 0) {
        next();
    } else {
        res.render('pages/index', {
            data: {
                username: req.body.username
            },
            errors: mappedErrors
        })
    }
}

module.exports = { 
    loginValidators,
    loginValidatorsHandler
}