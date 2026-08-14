const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const roleMiddleware = require("../middleware/roleMiddleware");


// ==========================
// DELIVERY MODULE
// COMING SOON
// ==========================

router.get(
    "/",
    authMiddleware,
    (req,res)=>{

        res.status(200).json({

            message:"Delivery module coming soon"

        });

    }
);


module.exports = router;