// external imports
const { check, validationResult } = require('express-validator');
const createError = require('http-errors');
const { unlink } = require('fs');
const path = require('path');

// internal imports
const User = require('../../models/User');

const userValidators = [
    check('name')
        .isLength({min: 2})
        .withMessage('Name is Required!')
        .isAlpha('en-US', { ignore: " -" })
        .withMessage('Name must not contain any thing other than alphabet!')
        .trim(),
    check('email')
        .isEmail()
        .withMessage('Invalid email address')
        .trim()
        .custom(async (value) => {
            try {
                const user = await User.findOne({ email: value})
                if(user) {
                    throw createError('Email Already Existed!')
                }
            } catch (error) {
                throw createError(error.message)
            }
        }),
    check('mobile')
        .isMobilePhone('bn-BD', {
            strictMode: true
        })
        .withMessage('Only Valid Bangladeshi Mobile Number is allowed and country code must be added!')
        .custom(async (value) => {
            try {
                const user = await User.findOne({ mobile: value})
                if(user) {
                    throw createError('Mobile Number already Existed!')
                }
            } catch (error) {
                throw createError(error.message)
            }
        }),
    check('password')
        .isStrongPassword()
        .withMessage('Password must be at least 8 characters long and must contain at least 1 uppercase, 1 lowercase, 1 number & 1 symbol'),
        
];

const userValidatorsHandler = (req, res, next) => {
    const errors = validationResult(req);
    const mappedErrors = errors.mapped();
    if(Object.keys(mappedErrors).length === 0) {
        next();
    } else{
        // remove uploades file
        if(req.files.length > 0) {
            const { filename } = req.files[0];
            unlink(
                path.join(__dirname, `/../public/uploads/avatars/${filename}`),
                (err) => {
                    if(err) console.log(err);
                }
            )
        }

        //response the errors
        if(res.locals.html) {         // for html response
            res.render('pages/signup', {
                errors: mappedErrors
            })
        } else {              // for json response
            res.status(500).json({
                errors: mappedErrors,
            })
        }
    }
}

const editUserValidators = [
    check('name')
        .isLength({min: 2})
        .withMessage('Name is Required!')
        .isAlpha('en-US', { ignore: " -" })
        .withMessage('Name must not contain any thing other than alphabet!')
        .trim(),
    check('email')
        .isEmail()
        .withMessage('Invalid email address')
        .trim()
        .custom(async (value, {req}) => {
            try {
                const user = await User.findById(req.params.id)

                // check whether the email is changed or unchanged
                let isChanged = value !== user.email;
                if(isChanged) {
                    const userHoldingThisMail = await User.findOne({ email: value})
                    if(userHoldingThisMail) {
                        throw createError('Email Already Existed!')
                    }
                }
            } catch (error) {
                throw createError(error.message)
            }
        }),
    check('mobile')
        .isMobilePhone('bn-BD', {
            strictMode: true
        })
        .withMessage('Only Valid Bangladeshi Mobile Number is allowed and country code must be added!')
        .custom(async (value, {req}) => {
            try {
                const user = await User.findById(req.params.id)

                // check whether the mobile is changed or unchanged
                let isChanged = value !== user.mobile;
                if(isChanged) {
                    const userHoldingThisMobile = await User.findOne({ mobile: value})
                    if(userHoldingThisMobile) {
                        throw createError('Mobile Number Already Existed!')
                    }
                }
            } catch (error) {
                throw createError(error.message)
            }
        }), 
];

// for edit User html response
const editUserValidatorsHandler = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        const mappedErrors = errors.mapped();
        if(Object.keys(mappedErrors).length === 0) {
            next();
        } else{
            // remove uploades file
            if(req.files.length > 0) {
                const { filename } = req.files[0];
                unlink(
                    path.join(__dirname, `/../public/uploads/avatars/${filename}`),
                    (err) => {
                        if(err) console.log(err);
                    }
                )
            }
            
            const user = await User.findById(req.params.id);  // to provide user._id for action attribute of form
            //response the errors
            res.render('pages/editUser', {
                errors: mappedErrors,
                user
            })
        }
    } catch (error) {
        next(error)
    }
}

module.exports = {
    userValidators,
    userValidatorsHandler,
    editUserValidators,
    editUserValidatorsHandler
}