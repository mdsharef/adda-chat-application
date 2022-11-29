// external imports
const createError = require('http-errors');

// internal imports
const Conversation = require('../models/Conversation');
const User = require('../models/User');
const Message = require('../models/Message');
const escape = require('../utils/escape');

const getInbox = async (req, res, next) => {
    try {
        const conversations = await Conversation.find({
            $or: [{creator: req.user.id}, {participant: req.user.id}]
        })
        .populate('creator')
        .populate('participant')

        res.locals.data = conversations;

        // rendering inbox page 
        res.render('pages/inbox')
    } catch (error) {
        next(error);
    }
}

const searchUsers = async (req, res, next) => {
    const userId = req.user.id;
    const searchKeyword = req.body.searchKeyword;
    const searchQuery = searchKeyword.replace("+88", "");

    const name_search_regex = new RegExp(escape(searchQuery), "i");
    const mobile_search_regex = new RegExp("^" + escape("+88" + searchQuery));
    const email_search_regex = new RegExp("^" + escape(searchQuery) + "$", "i");

    try {
        if(searchQuery !== "") {
            const users = await User.find({
                $or: [
                    {name: name_search_regex},
                    {email: email_search_regex},
                    {mobile: mobile_search_regex}
                ]
            })

            res.json({
                users,
                userId
            })
        } else {
            throw createError('Search input can not be empty!')
        }  
    } catch (error) {
        res.status(500).json({
            errors: {
                common: {
                    msg: error.message
                }
            }
        })
    }
}

const addConversation = async (req, res, next) => {
    try {
        const isConversationExisted = await Conversation.find({
            creator: req.user.id,
            participant: req.body.id
        })
    
        if(isConversationExisted.length === 0) {
            const newConversation = new Conversation({
                creator: req.user.id,
                participant: req.body.id
            })
    
            const result = await newConversation.save();
            res.status(200).json({
                message: 'Conversation has been added successfully!'
            })
        } else {
            throw createError('User already added to your conversation')
        }   
    } catch (error) {
        res.status(500).json({
            errors: {
                common: {
                    msg: error.message
                }
            }
        })
    }
}

const getMessages = async (req, res, next) => {
    try {
        const messages = await Message.find({ 
            conversation_id: req.params.conversation_id
        })
        .populate('sender')
        .sort('-createdAt');

        const { participant } = await Conversation.findById(req.params.conversation_id)
                .populate('participant');

        res.status(200).json({
            data: {
                messages: messages,
                participant: participant
            },
            user: req.user.id,
            conversation_id: req.params.conversation_id
        })
    } catch (error) {
        res.status(500).json({
            errors: {
                common: {
                    msg: 'Unknown error occurred!'
                }
            }
        })
    }
}

const sendMessage = async (req, res, next) => {
    if(req.body.message || (req.files && req.files.length > 0)) {
        try {
            let attachments = null;

            if(req.files && req.files.length > 0) {
                attachments = [];
                
                req.files.forEach(file => {
                    attachments.push(file.filename)
                })
            }

            const newMessage = new Message({
                text: req.body.message,
                attachment: attachments,
                sender: req.user.id,
                receiver: req.body.receiverId,
                conversation_id: req.body.conversationId,
            })

            const result = await newMessage.save();

            // emit socket event
            global.io.emit("new_message", {
                message: {
                    conversation_id: req.body.conversationId,
                    sender: {
                        id: req.user.id,
                        name: req.user.username,
                        avatar: req.user.avatar
                    },
                    message: req.body.message,
                    attachment: attachments,
                    date_time: result.date_time
                },
            });

            res.status(200).json({
                message: 'Successful',
                data: result
            })
        } catch (error) {
            res.status(500).json({
                errors: {
                    common: {
                        msg: error.message
                    }
                }
            })
        }
    } else {
        res.status(500).json({
            errors: {
                common: 'message text or attachment is required!'
            }
        })
    }
}

// const searchConversation = async (req, res, next) => {
//     const searchKeyword = req.body.searchKeyword;
//     const searchQuery = searchKeyword.replace("+88", "");

//     const name_search_regex = new RegExp(escape(searchQuery), "i");
//     const mobile_search_regex = new RegExp("^" + escape("+88" + searchQuery));
//     const email_search_regex = new RegExp("^" + escape(searchQuery) + "$", "i");

//     try {
//         if(searchQuery !== "") {
//             const users = await User.find({
//                 $or: [
//                     {name: name_search_regex},
//                     {email: email_search_regex},
//                     {mobile: mobile_search_regex}
//                 ]
//             })
//             res.json(users)
//         } else {
//             throw createError('Search input can not be empty!')
//         }  
//     } catch (error) {
//         res.status(500).json({
//             errors: {
//                 common: {
//                     msg: error.message
//                 }
//             }
//         })
//     }
// }

// delete conversation
const removeConversation = async (req, res, next) => {
    try {
        const deletedMessages = await Message.deleteMany({
            conversation_id: req.params.id,
        });
        const conversation = await Conversation.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: 'Conversation has been removed successfully!'
        });
    } catch (error) {
        res.status(500).json({
            errors: {
                common: {
                    msg: 'Conversation could not be deleted!'
                }
            }
        })
    }
}

module.exports = {
    getInbox,
    searchUsers,
    addConversation,
    getMessages,
    sendMessage,
    // searchConversation,
    removeConversation
}