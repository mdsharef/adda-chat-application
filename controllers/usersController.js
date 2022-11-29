// external imports
const bcrypt = require('bcrypt');
const path = require('path');
const { unlink } = require('fs');

// internal imports
const User = require('../models/User');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

// routes
const getUser = async (req, res, next) => {
    try {
        const users = await User.find();

        res.render('pages/users', {
            users,
        })
    } catch (error) {
        next(error);
    }
}

const addUser = async (req, res, next) => {
    let newUser;
    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    if(req.files && req.files.length > 0) {
        newUser = new User({
            ...req.body,
            avatar: req.files[0].filename,
            password: hashedPassword
        })
    } else {
        newUser = new User({
            ...req.body,
            password: hashedPassword
        })
    }
     try {
        const result = await newUser.save();
        
        res.status(200).json({
            result,
            message: 'User created successfully!'
        })
     } catch (error) {
        res.status(500).json({
            errors: {
                common: {
                    msg: 'Unknown error occurred!',
                }
            }
        })
     }
}

const removeUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete({
            _id: req.params.id,
        })

        const deleteConversations = await Conversation.deleteMany({
            $or: [{creator: req.params.id}, {participant: req.params.id}]
        })

        const deleteMessages = await Message.deleteMany({
            $or: [{sender: req.params.id}, {receiver: req.params.id}]
        })

        // removing user avatar if have
        if(user.avatar) {
            unlink(
                path.join(__dirname, `/../public/uploads/avatars/${user.avatar}`),
                (err) => {
                    if(err) console.log(err);
                }
            )
        }

        res.status(200).json({
            message: 'User has been removed successfully!'
        });
    } catch (error) {
        res.status(500).json({
            errors: {
                common: {
                    msg: 'User could not be deleted!'
                }
            }
        })
    }
}

const getSignup = (req, res, next) => {
    res.render('pages/signup')
}

const postSignup = async (req, res, next) => {
    let newUser;
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    if(req.files && req.files.length > 0) {
        newUser = new User({
            ...req.body,
            avatar: req.files[0].filename,
            password: hashedPassword
        })
    } else {
        newUser = new User({
            ...req.body,
            password: hashedPassword
        })
    }
    try {
        const result = await newUser.save();
        
        if(res.locals.html) {
            return res.redirect('/')
        }
        res.status(200).json({
            result,
            message: 'User created successfully!'
        })
    } catch (error) {
        res.render('pages/signup', {
            errors: {
                common: {
                    msg: 'Unknown error occurred!'
                }
            }
        })
        res.status(500).json({
            errors: {
                common: {
                    msg: 'Unknown error occurred!',
                }
            }
        })
    }  
}

const getEditUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id)
        res.render('pages/editUser', {user})
    } catch (error) {
        next(error)
    }
}

const postEditUser = async (req, res, next) => {
    let { name, email, mobile } = req.body;
    let updatedUser;
    if(req.files && req.files.length > 0) {
        updatedUser = {
            name,
            email,
            mobile,
            avatar: req.files[0].filename,
        };
    } else {
        updatedUser = {
            name, email, mobile,
        }
    }
    try {
        const result = await User.findOneAndUpdate(
            {_id: req.params.id},
            {$set: updatedUser},
            {new: true}
        );
        
        if(res.locals.html) {
            if(req.user.id === req.params.id) {
                return res.redirect('/inbox')
            } else {
                return res.redirect('/users')
            }
        }
        res.status(200).json({
            result,
            message: 'User created successfully!'
        })
    } catch (error) {
        res.render('pages/editUser', {
            errors: {
                common: {
                    msg: 'Unknown error occurred!'
                }
            }
        })
        res.status(500).json({
            errors: {
                common: {
                    msg: 'Unknown error occurred!',
                }
            }
        })
    } 
}

// exporting modules
module.exports = {
    getUser,
    addUser,
    removeUser,
    getSignup,
    postSignup,
    getEditUser,
    postEditUser,
}