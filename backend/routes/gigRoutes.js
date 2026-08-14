const express = require("express");

const router = express.Router();


const authMiddleware = require("../middleware/authMiddleware");

const roleMiddleware = require("../middleware/roleMiddleware");

const upload = require("../middleware/upload");


const {

    createGig,

    getAllGigs,

    getMyGigs,

    getSingleGig,

    updateGig,

    deleteGig,

    searchGigs,

    uploadGigImages

} = require("../controllers/gigController");






// ==========================
// CREATE GIG
// Only Tailor
// ==========================

router.post(
    "/",
    authMiddleware,
    roleMiddleware("tailor"),
    createGig
);







// ==========================
// GET ALL GIGS
// Public
// ==========================

router.get(
    "/",
    getAllGigs
);


// ==========================
// GET MY GIGS
// Only Logged In Tailor
// IMPORTANT:
// Must stay before /:id
// ==========================

router.get(

    "/my-gigs",

    authMiddleware,

    roleMiddleware("tailor"),

    getMyGigs

);





// ==========================
// SEARCH GIGS
// Public
// ==========================

router.get(
    "/search",
    searchGigs
);







// ==========================
// GET SINGLE GIG
// Public
// ==========================

router.get(
    "/:id",
    getSingleGig
);







// ==========================
// UPLOAD GIG IMAGES
// Only Tailor
// ==========================

router.put(
    "/:id/images",
    authMiddleware,
    roleMiddleware("tailor"),
    upload.array("images", 5),
    uploadGigImages
);







// ==========================
// UPDATE GIG
// Only Tailor
// ==========================

router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("tailor"),
    updateGig
);







// ==========================
// DELETE GIG
// Only Tailor
// ==========================

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("tailor"),
    deleteGig
);



module.exports = router;