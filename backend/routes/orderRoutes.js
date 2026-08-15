const express = require("express");

const router = express.Router();


const authMiddleware =
    require("../middleware/authMiddleware");

const roleMiddleware =
    require("../middleware/roleMiddleware");

const upload =
    require("../middleware/upload");


const {

    createOrder,
    getMyOrders,
    getTailorOrders,
    updateOrderStatus,
    cancelOrder,
    updatePaymentStatus

} = require("../controllers/orderController");




// ==========================
// CUSTOMER CREATE ORDER
// WITH REFERENCE IMAGES
// ==========================

router.post(

    "/",

    authMiddleware,

    roleMiddleware("customer"),

    upload.array(
        "referenceImages",
        5
    ),

    createOrder

);





// ==========================
// CUSTOMER ORDERS
// ==========================

router.get(

    "/my-orders",

    authMiddleware,

    roleMiddleware("customer"),

    getMyOrders

);





// ==========================
// TAILOR RECEIVED ORDERS
// ==========================

router.get(

    "/tailor-orders",

    authMiddleware,

    roleMiddleware("tailor"),

    getTailorOrders

);





// ==========================
// TAILOR UPDATE STATUS
// ==========================

router.put(

    "/:orderId/status",

    authMiddleware,

    roleMiddleware("tailor"),

    updateOrderStatus

);





// ==========================
// CANCEL ORDER
// CUSTOMER ONLY
// ==========================

router.put(

    "/:orderId/cancel",

    authMiddleware,

    roleMiddleware("customer"),

    cancelOrder

);





// ==========================
// CUSTOMER PAYMENT
// ==========================

router.put(

    "/:orderId/payment",

    authMiddleware,

    roleMiddleware("customer"),

    updatePaymentStatus

);



module.exports = router;