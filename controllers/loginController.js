// external imports
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');

// internal imports
const User = require('../models/User');

// get login page controller
const getLogin = (req, res, next) => {
    res.render('pages/index')
}

// login authentication controller
const login = async (req, res, next) => {
    try {
        // finding user matched with either mobile number or email
        const user = await User.findOne({
            $or: [{email: req.body.username}, {mobile: req.body.username}]
        })

        if(user && user._id) {
            // matching password
            const isValidPassword = await bcrypt.compare(req.body.password, user.password);

            if(isValidPassword) {
                // preparing obj for generating jwt token
                const userObj = {
                    id: user._id,
                    username: user.name,
                    email: user.email,
                    mobile: user.mobile,
                    avatar: user.avatar,
                    role: user.role || 'user',
                };

                // generating token
                const token = jwt.sign(userObj, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRY
                });

                // set cookie
                res.cookie(process.env.COOKIE_NAME, token, {
                    maxAge: process.env.JWT_EXPIRY,
                    signed: true,
                    httpOnly: true
                });

                // set loggedIn user info to locals variable so that it can be accessible from templete
                res.locals.loggedInUser = userObj; 
                res.redirect('/inbox');
            } else {
                throw createError('Login failed! Please try again.')
            }
        } else {
            throw createError('Login failed! Please try again.')
        }
    } catch (error) {
        res.render('pages/index', {
            data: {
                username: req.body.username
            },
            errors: {
                common: {
                    msg: error.message
                }
            }
        })
    }
}

const logout = (req, res, next) => {
    res.clearCookie(process.env.COOKIE_NAME);
    res.send('User logged out!')
}

module.exports = {
    getLogin,
    login,
    logout
}