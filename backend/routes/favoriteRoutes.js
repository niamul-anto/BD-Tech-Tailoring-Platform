const express = require("express");


const router = express.Router();


const authMiddleware = require("../middleware/authMiddleware");

const roleMiddleware = require("../middleware/roleMiddleware");


const {

    addFavoriteGig,

    getMyFavoriteGigs,

    removeFavoriteGig

} = require("../controllers/favoriteController");





// ==========================
// GET MY FAVORITE GIGS
// Only Customer
// ==========================

router.get(

    "/gigs",

    authMiddleware,

    roleMiddleware("customer"),

    getMyFavoriteGigs

);





// ==========================
// ADD GIG TO FAVORITES
// Only Customer
// ==========================

router.post(

    "/gigs/:gigId",

    authMiddleware,

    roleMiddleware("customer"),

    addFavoriteGig

);





// ==========================
// REMOVE GIG FROM FAVORITES
// Only Customer
// ==========================

router.delete(

    "/gigs/:gigId",

    authMiddleware,

    roleMiddleware("customer"),

    removeFavoriteGig

);


module.exports = router;