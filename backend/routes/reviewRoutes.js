const express = require("express");

const router = express.Router();


const authMiddleware =
require("../middleware/authMiddleware");

const roleMiddleware =
require("../middleware/roleMiddleware");


const {

    createReview,

    getTailorReviews,

    getAllReviews

} = require("../controllers/reviewController");



// ==========================
// CREATE REVIEW
// Only Customer
// ==========================

router.post(

    "/",

    authMiddleware,

    roleMiddleware("customer"),

    createReview

);



// ==========================
// GET ALL REVIEWS
// Only Admin
// ==========================

router.get(

    "/",

    authMiddleware,

    roleMiddleware("admin"),

    getAllReviews

);



// ==========================
// GET TAILOR REVIEWS
// Public
// ==========================

router.get(

    "/tailor/:tailorId",

    getTailorReviews

);


module.exports = router;