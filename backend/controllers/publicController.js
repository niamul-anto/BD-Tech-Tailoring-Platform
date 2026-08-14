const User = require("../models/User");
const Gig = require("../models/Gig");
const Order = require("../models/Order");
const Message = require("../models/Message");


const getPublicStats = async(req,res)=>{

    try{

        const [
            totalUsers,
            totalGigs,
            totalOrders,
            totalMessages
        ] = await Promise.all([

            User.countDocuments(),

            Gig.countDocuments(),

            Order.countDocuments(),

            Message.countDocuments()

        ]);


        res.status(200).json({

            stats:{

                totalUsers,

                totalGigs,

                totalOrders,

                totalMessages

            }

        });

    }
    catch(error){

        console.log(error);


        res.status(500).json({

            message:"Server error"

        });

    }

};


module.exports = {

    getPublicStats

};