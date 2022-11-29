const { Schema, model} = require('mongoose');

const messageSchema = new Schema({
    text: {
        type: String,
        maxlength: 1000
    },
    attachment: [
        { 
            type: String,
        },
    ],
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date_time: {
        type: Date,
        default: Date.now
    },
    conversation_id: {
        type: Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true
    }
}, {
    timestamps: true
});

const Message = model('Message', messageSchema);

module.exports = Message