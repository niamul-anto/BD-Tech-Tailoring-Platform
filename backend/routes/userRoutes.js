const express = require("express");


const router = express.Router();


const authMiddleware =
require("../middleware/authMiddleware");


const upload =
require("../middleware/upload");


const {

    getProfile,

    updateProfile,

    uploadProfileImage,

    addAddress,

    getAddresses,

    updateAddress,

    deleteAddress

} = require("../controllers/userController");






// ==========================
// GET PROFILE
// ==========================

router.get(

    "/profile",

    authMiddleware,

    getProfile

);






// ==========================
// UPDATE PROFILE
// ==========================

router.put(

    "/profile",

    authMiddleware,

    updateProfile

);






// ==========================
// UPLOAD PROFILE IMAGE
// ==========================

router.put(

    "/profile/image",

    authMiddleware,

    upload.single("image"),

    uploadProfileImage

);






// ==========================
// ADD ADDRESS
// ==========================

router.post(

    "/address",

    authMiddleware,

    addAddress

);






// ==========================
// GET ALL ADDRESSES
// ==========================

router.get(

    "/address",

    authMiddleware,

    getAddresses

);






// ==========================
// UPDATE ADDRESS
// ==========================

router.put(

    "/address/:addressId",

    authMiddleware,

    updateAddress

);






// ==========================
// DELETE ADDRESS
// ==========================

router.delete(

    "/address/:addressId",

    authMiddleware,

    deleteAddress

);



module.exports = router;