// external import
const router = require('express').Router();

// internal imports
const { 
    getInbox, 
    searchUsers, 
    addConversation, 
    getMessages, 
    sendMessage, 
    // searchConversation,
    removeConversation 
} = require('../controllers/inboxController');
const decorateHtmlResponse = require('../middlewares/commons/decorateHtmlResponse');
const { isLoggedIn } = require('../middlewares/commons/isLoggedIn');
const attachmentUploader = require('../middlewares/inbox/attachmentUploader')

// routes
router.get('/', decorateHtmlResponse("Inbox"), isLoggedIn, getInbox);

router.post('/search', isLoggedIn, searchUsers);
router.post('/conversation', isLoggedIn, addConversation);

// router.post('/conversation/search', isLoggedIn, searchConversation);

router.get('/messages/:conversation_id', isLoggedIn, getMessages);

router.post('/message', isLoggedIn, attachmentUploader, sendMessage);

// deleting a conversation
router.delete('/conversation/:id', isLoggedIn, removeConversation)

module.exports = router;