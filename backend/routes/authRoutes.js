const express = require("express");

const router = express.Router();


const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");


const {
    registerUser,
    verifyOTP,
    loginUser,
    logout
} = require("../controllers/authController");



// Register API

router.post(
    "/register",
    registerUser
);



// Verify OTP API

router.post(
    "/verify-otp",
    verifyOTP
);



// Login API

router.post(
    "/login",
    loginUser
);



// Protected Profile Route

router.get(
    "/profile",
    authMiddleware,
    (req,res)=>{

        res.json({

            message:"Profile data",

            user:req.user

        });

    }
);



// Customer Only Route

router.get(
    "/customer-only",
    authMiddleware,
    roleMiddleware("customer"),
    (req,res)=>{

        res.json({

            message:"Welcome Customer",

            user:req.user

        });

    }
);

// ==========================
// LOGOUT
// ==========================

router.post(
    "/logout",
    authMiddleware,
    logout
);

module.exports = router;