const { Schema, model } = require('mongoose');

const conversationSchema = new Schema({
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    participant: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    last_updated: {
        type: Date,
        default: Date.now
    }
},{
    timestamps: true
});

const Conversation = model('Conversation', conversationSchema);

module.exports = Conversation;