const express = require("express");

const router = express.Router();


const authMiddleware = require("../middleware/authMiddleware");


const {

    sendMessage,

    getConversation,

    markMessagesAsRead,

    getMyConversations

} = require("../controllers/messageController");


// ==========================
// SEND MESSAGE
// ==========================

router.post(
    "/send",
    authMiddleware,
    sendMessage
);

// ==========================
// GET MY CONVERSATIONS
// ==========================

router.get(
    "/conversations",
    authMiddleware,
    getMyConversations
);


// ==========================
// GET CONVERSATION
// ==========================

router.get(
    "/conversation/:userId",
    authMiddleware,
    getConversation
);

router.put(
    "/conversation/:userId/read",
    authMiddleware,
    markMessagesAsRead
);

module.exports = router;