// external imports
const mongoose = require('mongoose');

// creating schema
const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    mobile: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
    }
}, {
    timestamps: true,
});

// creating model using schema
const User = mongoose.model('User', UserSchema);

module.exports = User;