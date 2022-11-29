// external import
const router = require('express').Router();

// internal imports
const { 
    getUser, 
    addUser, 
    removeUser, 
    getSignup, 
    postSignup,
    getEditUser,
    postEditUser 
} = require('../controllers/usersController');
const decorateHtmlResponse = require('../middlewares/commons/decorateHtmlResponse');
const { isLoggedIn, isLogout, requireRole } = require('../middlewares/commons/isLoggedIn')
const avatarUpload = require('../middlewares/user/avatarUpload');
const { userValidators, 
    userValidatorsHandler, 
    editUserValidators,
    editUserValidatorsHandler 
} = require('../middlewares/user/userValidator')

// routes
// users routers controlled by user
router.get('/signup', decorateHtmlResponse("Signup"), isLogout, getSignup);
router.post('/signup', decorateHtmlResponse("Signup"), isLogout, avatarUpload, userValidators, userValidatorsHandler, postSignup);

// users routers controlled by admin
router.get('/', decorateHtmlResponse("Users"), isLoggedIn, requireRole(['admin']), getUser);
router.post('/', isLoggedIn, requireRole(['admin']), avatarUpload, userValidators, userValidatorsHandler, addUser);
router.delete('/:id', isLoggedIn, requireRole(['admin']), removeUser);

// edit user router
router.get('/edit/:id', decorateHtmlResponse("Edit-User"), isLoggedIn, getEditUser);
router.post('/edit/:id', decorateHtmlResponse("Edit-User"), isLoggedIn, avatarUpload, editUserValidators, editUserValidatorsHandler, postEditUser);

module.exports = router;