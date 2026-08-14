const express = require("express");

const router = express.Router();


const authMiddleware = require("../middleware/authMiddleware");

const roleMiddleware = require("../middleware/roleMiddleware");


const {

    getCustomerDashboard,

    getTailorDashboard

}=require("../controllers/dashboardController");





// Customer Dashboard

router.get(

    "/customer",

    authMiddleware,

    roleMiddleware("customer"),

    getCustomerDashboard

);


// Tailor Dashboard

router.get(

    "/tailor",

    authMiddleware,

    roleMiddleware("tailor"),

    getTailorDashboard

);



module.exports = router;