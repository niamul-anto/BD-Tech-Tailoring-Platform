const express = require("express");

const router = express.Router();


const authMiddleware = require("../middleware/authMiddleware");


const {

    getMyNotifications,

    markAsRead

}=require("../controllers/notificationController");




router.get(

    "/",

    authMiddleware,

    getMyNotifications

);


// Mark notification as read

router.put(

    "/:notificationId/read",

    authMiddleware,

    markAsRead

);

module.exports = router;