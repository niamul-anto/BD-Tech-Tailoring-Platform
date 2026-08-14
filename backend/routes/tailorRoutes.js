const express = require("express");


const router = express.Router();


const authMiddleware = 
require("../middleware/authMiddleware");


const upload = require("../middleware/upload");



const {
    createTailorProfile,

    getTailorProfile,

    updateTailorProfile,

    searchTailors,

    uploadProfileImage,

    uploadPortfolioImages,

    updateAvailability

} = require("../controllers/tailorController");







// Create Tailor Profile

router.post(

    "/profile",

    authMiddleware,

    createTailorProfile

);







// Search Tailors

router.get(

    "/search",

    searchTailors

);







// Upload Profile Image

router.put(

    "/profile/image",

    authMiddleware,

    upload.single("image"),

    uploadProfileImage

);







// ==========================
// UPLOAD PORTFOLIO IMAGES
// Only Tailor
// ==========================

router.put(

    "/profile/portfolio",

    authMiddleware,

    upload.array("images", 5),

    uploadPortfolioImages

);







// Get Tailor Profile
// View Tailor Profile

router.get(

    "/profile/:userId",

    getTailorProfile

);

// ==========================
// UPDATE TAILOR PROFILE
// Only Tailor
// ==========================

router.put(

    "/profile",

    authMiddleware,

    updateTailorProfile

);

// ==========================
// UPDATE Availability
//
// ==========================


router.put(

    "/availability",

    authMiddleware,

    updateAvailability

);

module.exports = router;