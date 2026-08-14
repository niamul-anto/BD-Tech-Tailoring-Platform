const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");


// ==========================
// AI MEASUREMENT
// COMING SOON
// ==========================

router.get(
    "/ai",
    authMiddleware,
    (req,res)=>{

        res.status(200).json({

            message:"AI measurement feature coming soon"

        });

    }
);


module.exports = router;