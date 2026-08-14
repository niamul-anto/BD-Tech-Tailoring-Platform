const express = require("express");

const router = express.Router();


const authMiddleware = require("../middleware/authMiddleware");

const roleMiddleware = require("../middleware/roleMiddleware");


const {

    createOrder,
    getMyOrders,
    getTailorOrders,
    updateOrderStatus,
    cancelOrder,
    updatePaymentStatus

} = require("../controllers/orderController");




// Customer Create Order

router.post(
    "/",
    authMiddleware,
    roleMiddleware("customer"),
    createOrder
);





// Customer Orders

router.get(
    "/my-orders",
    authMiddleware,
    roleMiddleware("customer"),
    getMyOrders
);





// Tailor Received Orders

router.get(
    "/tailor-orders",
    authMiddleware,
    roleMiddleware("tailor"),
    getTailorOrders
);





// Tailor Update Status

router.put(
    "/:orderId/status",
    authMiddleware,
    roleMiddleware("tailor"),
    updateOrderStatus
);

// Cancel Order
// Only Customer

router.put(
    "/:orderId/cancel",
    authMiddleware,
    roleMiddleware("customer"),
    cancelOrder
);

// Customer Payment

router.put(
    "/:orderId/payment",
    authMiddleware,
    roleMiddleware("customer"),
    updatePaymentStatus
);


module.exports = router;