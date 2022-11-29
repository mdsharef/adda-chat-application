// external imports
const express = require('express');

// internal imports
const { getLogin, login, logout } = require('../controllers/loginController');
const decorateHtmlResponse = require('../middlewares/commons/decorateHtmlResponse');
const { isLogout, isLoggedIn } = require('../middlewares/commons/isLoggedIn')
const { loginValidators, loginValidatorsHandler } = require('../middlewares/login/loginValidator')

// router function
const router = express.Router();

// storing parameter for decorateHtmlResponse function
const page_title = "Login"

// routes
router.get('/', decorateHtmlResponse(page_title), isLogout, getLogin);

router.post('/', decorateHtmlResponse(page_title), isLogout, loginValidators, loginValidatorsHandler, login);

router.delete('/', isLoggedIn, logout)

module.exports = router;