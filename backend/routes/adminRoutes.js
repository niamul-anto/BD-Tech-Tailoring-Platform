const express = require("express");

const router = express.Router();


const authMiddleware =
require("../middleware/authMiddleware");

const roleMiddleware =
require("../middleware/roleMiddleware");


const {

    getAdminDashboard,

    getAllUsers,

    getAllOrders,

    getAllGigsAdmin,

    blockUser,

    unblockUser,

    deleteGigAdmin,

    getAllPayments,

    approveTailor,

    rejectTailor,

    getPendingTailors

} = require("../controllers/adminController");


// ==========================
// ADMIN DASHBOARD
// Only Admin
// ==========================


// router.get(
//     "/dashboard",
//     getAdminDashboard
// );


router.get(
    "/dashboard",
    authMiddleware,
    roleMiddleware("admin"),
    getAdminDashboard
);
// router.get(
//     "/dashboard",
//     authMiddleware,
//     roleMiddleware("admin"),
//     getAdminDashboard
// );

// ==========================
// GET ALL USERS
// Only Admin
// ==========================

router.get(
    "/users",
    authMiddleware,
    roleMiddleware("admin"),
    getAllUsers
);


// ==========================
// GET ALL ORDERS
// Only Admin
// ==========================

router.get(
    "/orders",
    authMiddleware,
    roleMiddleware("admin"),
    getAllOrders
);

// ==========================
// GET ALL GIGS
// Only Admin
// ==========================

router.get(
    "/gigs",
    authMiddleware,
    roleMiddleware("admin"),
    getAllGigsAdmin
);


// ==========================
// BLOCK USER
// Only Admin
// ==========================

router.put(
    "/users/:userId/block",
    authMiddleware,
    roleMiddleware("admin"),
    blockUser
);



// ==========================
// UNBLOCK USER
// Only Admin
// ==========================

router.put(
    "/users/:userId/unblock",
    authMiddleware,
    roleMiddleware("admin"),
    unblockUser
);



// ==========================
// DELETE GIG
// Only Admin
// ==========================

router.delete(
    "/gigs/:gigId",
    authMiddleware,
    roleMiddleware("admin"),
    deleteGigAdmin
);

// ==========================
// GET ALL PAYMENTS
// Only Admin
// ==========================

router.get(
    "/payments",
    authMiddleware,
    roleMiddleware("admin"),
    getAllPayments
);



// ==========================
// APPROVE TAILOR
// Only Admin
// ==========================

router.put(
    "/tailors/:tailorId/approve",
    authMiddleware,
    roleMiddleware("admin"),
    approveTailor
);


// ==========================
// REJECT TAILOR
// Only Admin
// ==========================

router.put(
    "/tailors/:tailorId/reject",
    authMiddleware,
    roleMiddleware("admin"),
    rejectTailor
);


// ==========================
// GET PENDING TAILORS
// Only Admin
// ==========================

router.get(
    "/tailors/pending",
    authMiddleware,
    roleMiddleware("admin"),
    getPendingTailors
);



module.exports = router;