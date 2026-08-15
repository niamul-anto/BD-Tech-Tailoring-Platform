const express = require("express");


const router = express.Router();


const authMiddleware =
    require("../middleware/authMiddleware");


const roleMiddleware =
    require("../middleware/roleMiddleware");



const {

    createPayment,

    bkashCallback,

    getMyPayments,

    getTailorEarnings

} = require("../controllers/paymentController");





// ==========================
// CREATE PAYMENT
// CUSTOMER ONLY
// ==========================

router.post(

    "/create",

    authMiddleware,

    roleMiddleware("customer"),

    createPayment

);





// ==========================
// BKASH CALLBACK
// PUBLIC ROUTE
// ==========================

// IMPORTANT:
// Do NOT put authMiddleware here.
// bKash redirects the browser to this URL.

router.get(

    "/callback",

    bkashCallback

);





// ==========================
// CUSTOMER PAYMENT HISTORY
// ==========================

router.get(

    "/my-payments",

    authMiddleware,

    roleMiddleware("customer"),

    getMyPayments

);





// ==========================
// TAILOR EARNINGS
// ==========================

router.get(

    "/earnings",

    authMiddleware,

    roleMiddleware("tailor"),

    getTailorEarnings

);



module.exports = router;