const express = require("express");

const router = express.Router();


const authMiddleware = require("../middleware/authMiddleware");

const roleMiddleware = require("../middleware/roleMiddleware");


const {

    createPayment,

    getMyPayments,

    getTailorEarnings

} = require("../controllers/paymentController");



// Create Payment

router.post(
    "/create",
    authMiddleware,
    roleMiddleware("customer"),
    createPayment
);

// Customer Payment History

router.get(

    "/my-payments",

    authMiddleware,

    roleMiddleware("customer"),

    getMyPayments

);

// Tailor Earnings

router.get(

    "/earnings",

    authMiddleware,

    roleMiddleware("tailor"),

    getTailorEarnings

);

module.exports = router;