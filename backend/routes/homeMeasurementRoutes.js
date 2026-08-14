const express = require("express");

const router = express.Router();


const authMiddleware =
require("../middleware/authMiddleware");

const roleMiddleware =
require("../middleware/roleMiddleware");


const {

    createHomeMeasurementRequest,

    getCustomerRequests,

    getTailorRequests,

    updateRequestStatus,

    cancelHomeMeasurementRequest

} =
require("../controllers/homeMeasurementController");


// ==========================
// CUSTOMER CREATE REQUEST
// ==========================

router.post(

    "/",

    authMiddleware,

    roleMiddleware("customer"),

    createHomeMeasurementRequest

);


// ==========================
// CUSTOMER REQUEST LIST
// ==========================

router.get(

    "/customer",

    authMiddleware,

    roleMiddleware("customer"),

    getCustomerRequests

);


// ==========================
// TAILOR REQUEST LIST
// ==========================

router.get(

    "/tailor",

    authMiddleware,

    roleMiddleware("tailor"),

    getTailorRequests

);


// ==========================
// TAILOR UPDATE STATUS
// ==========================

router.put(

    "/:id/status",

    authMiddleware,

    roleMiddleware("tailor"),

    updateRequestStatus

);


// ==========================
// CUSTOMER CANCEL
// ==========================

router.put(

    "/:id/cancel",

    authMiddleware,

    roleMiddleware("customer"),

    cancelHomeMeasurementRequest

);


module.exports = router;