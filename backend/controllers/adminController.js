const User = require("../models/User");
const Gig = require("../models/Gig");
const Order = require("../models/Order");
const Payment = require("../models/paymentModel");
const TailorProfile = require("../models/TailorProfile");
const Notification = require("../models/Notification");



// ==========================
// ADMIN DASHBOARD
// ==========================

const getAdminDashboard = async(req,res)=>{

try{


    const totalUsers =
        await User.countDocuments();


    const totalCustomers =
        await User.countDocuments({
            role:"customer"
        });


    const totalTailors =
        await User.countDocuments({
            role:"tailor"
        });


    const totalGigs =
        await Gig.countDocuments();


    const totalOrders =
        await Order.countDocuments();


    const completedOrders =
        await Order.countDocuments({
            status:"completed"
        });


    const paidOrders =
        await Order.countDocuments({
            paymentStatus:"paid"
        });



    const paidOrderData = await Order.find({

        paymentStatus:"paid"

    });



    const totalRevenue = paidOrderData.reduce(

        (sum,order)=>sum + order.price,

        0

    );



    res.status(200).json({

        totalUsers,

        totalCustomers,

        totalTailors,

        totalGigs,

        totalOrders,

        completedOrders,

        paidOrders,

        totalRevenue

    });


}
catch(error){


    console.log(error);


    res.status(500).json({

        message:"Server error"

    });


}

};



// ==========================
// GET ALL USERS
// ADMIN ONLY
// ==========================

const getAllUsers = async(req,res)=>{

try{

    const users = await User.find()
    .select("-password")
    .sort({
        createdAt:-1
    });


    res.status(200).json({

        totalUsers:users.length,

        users

    });

}
catch(error){

    console.log(error);

    res.status(500).json({

        message:"Server error"

    });

}

};



// ==========================
// GET ALL ORDERS
// ADMIN ONLY
// ==========================

const getAllOrders = async(req,res)=>{

try{


    const orders = await Order.find()

    .populate(
        "customer",
        "name email phone"
    )

    .populate(
        "tailor",
        "name email phone"
    )

    .populate(
        "gig",
        "title category price"
    )

    .sort({
        createdAt:-1
    });



    res.status(200).json({

        totalOrders:orders.length,

        orders

    });


}
catch(error){


    console.log(error);


    res.status(500).json({

        message:"Server error"

    });


}

};



// ==========================
// GET ALL GIGS
// ADMIN ONLY
// ==========================

const getAllGigsAdmin = async(req,res)=>{

try{


    const gigs = await Gig.find()

    .populate(
        "tailor",
        "name email phone"
    )

    .sort({
        createdAt:-1
    });



    res.status(200).json({

        totalGigs:gigs.length,

        gigs

    });


}
catch(error){


    console.log(error);


    res.status(500).json({

        message:"Server error"

    });


}

};



// ==========================
// BLOCK USER
// ADMIN ONLY
// ==========================

const blockUser = async(req,res)=>{

try{


    const user = await User.findById(
        req.params.userId
    );


    if(!user){

        return res.status(404).json({

            message:"User not found"

        });

    }



    // Admin cannot block himself

    if(
        user._id.toString() ===
        req.user._id.toString()
    ){

        return res.status(400).json({

            message:"You cannot block yourself"

        });

    }



    // Prevent blocking another admin

    if(user.role === "admin"){

        return res.status(403).json({

            message:"Admin users cannot be blocked"

        });

    }



    if(user.isBlocked === true){

        return res.status(400).json({

            message:"User is already blocked"

        });

    }



    user.isBlocked = true;


    await user.save();



    res.status(200).json({

        message:"User blocked successfully",

        user:{
            id:user._id,
            name:user.name,
            email:user.email,
            role:user.role,
            isBlocked:user.isBlocked
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





// ==========================
// UNBLOCK USER
// ADMIN ONLY
// ==========================

const unblockUser = async(req,res)=>{

try{


    const user = await User.findById(
        req.params.userId
    );


    if(!user){

        return res.status(404).json({

            message:"User not found"

        });

    }



    if(user.role === "admin"){

        return res.status(403).json({

            message:"Admin users cannot be modified here"

        });

    }



    if(user.isBlocked !== true){

        return res.status(400).json({

            message:"User is not blocked"

        });

    }



    user.isBlocked = false;


    await user.save();



    res.status(200).json({

        message:"User unblocked successfully",

        user:{
            id:user._id,
            name:user.name,
            email:user.email,
            role:user.role,
            isBlocked:user.isBlocked
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



// ==========================
// DELETE GIG
// ADMIN ONLY
// ==========================

const deleteGigAdmin = async(req,res)=>{

try{


    const gig = await Gig.findById(
        req.params.gigId
    );


    if(!gig){

        return res.status(404).json({

            message:"Gig not found"

        });

    }


    await Gig.findByIdAndDelete(
        req.params.gigId
    );


    res.status(200).json({

        message:"Gig deleted successfully by admin"

    });


}
catch(error){


    console.log(error);


    res.status(500).json({

        message:"Server error"

    });


}

};



// ==========================
// GET ALL PAYMENTS
// ADMIN ONLY
// ==========================

const getAllPayments = async(req,res)=>{

try{


    const payments = await Payment.find()

    .populate(
        "customer",
        "name email phone"
    )

    .populate(
        "order",
        "price status paymentStatus"
    )

    .sort({
        createdAt:-1
    });



    res.status(200).json({

        totalPayments:payments.length,

        payments

    });


}
catch(error){


    console.log(error);


    res.status(500).json({

        message:"Server error"

    });


}

};



// ==========================
// APPROVE TAILOR
// ADMIN ONLY
// ==========================

const approveTailor = async(req,res)=>{

try{


    const tailorProfile =
        await TailorProfile.findOne({

            user:req.params.tailorId

        })
        .populate(
            "user",
            "name email phone role"
        );


    if(!tailorProfile){

        return res.status(404).json({

            message:"Tailor profile not found"

        });

    }



    if(
        tailorProfile.verificationStatus ===
        "approved"
    ){

        return res.status(400).json({

            message:"Tailor is already approved"

        });

    }



    tailorProfile.verificationStatus =
        "approved";


    await tailorProfile.save();





    // ==========================
    // CREATE TAILOR NOTIFICATION
    // ==========================

    try{


        const notification =
            await Notification.create({

                user:
                    tailorProfile.user._id,

                message:
                    "Your tailor account has been approved by admin",

                type:
                    "tailor_approved"

            });



        // ==========================
        // LIVE SOCKET NOTIFICATION
        // ==========================

        const io =
            req.app.get("io");


        if(io){

            io.to(
                `user_${tailorProfile.user._id}`
            ).emit(

                "receive_notification",

                {

                    _id:
                        notification._id,

                    user:
                        tailorProfile.user._id,

                    message:
                        notification.message,

                    type:
                        notification.type,

                    isRead:
                        notification.isRead,

                    createdAt:
                        notification.createdAt

                }

            );

        }


    }
    catch(notificationError){


        console.log(
            "Tailor approval notification error:",
            notificationError
        );


    }





    res.status(200).json({

        message:"Tailor approved successfully",

        tailorProfile

    });


}
catch(error){


    console.log(error);


    res.status(500).json({

        message:"Server error"

    });


}

};




// ==========================
// REJECT TAILOR
// ADMIN ONLY
// ==========================

const rejectTailor = async(req,res)=>{

try{


    const tailorProfile =
        await TailorProfile.findOne({

            user:req.params.tailorId

        })
        .populate(
            "user",
            "name email phone role"
        );


    if(!tailorProfile){

        return res.status(404).json({

            message:"Tailor profile not found"

        });

    }



    if(
        tailorProfile.verificationStatus ===
        "rejected"
    ){

        return res.status(400).json({

            message:"Tailor is already rejected"

        });

    }



    tailorProfile.verificationStatus =
        "rejected";


    await tailorProfile.save();





    // ==========================
    // CREATE TAILOR NOTIFICATION
    // ==========================

    try{


        const notification =
            await Notification.create({

                user:
                    tailorProfile.user._id,

                message:
                    "Your tailor account verification has been rejected by admin",

                type:
                    "tailor_rejected"

            });



        // ==========================
        // LIVE SOCKET NOTIFICATION
        // ==========================

        const io =
            req.app.get("io");


        if(io){

            io.to(
                `user_${tailorProfile.user._id}`
            ).emit(

                "receive_notification",

                {

                    _id:
                        notification._id,

                    user:
                        tailorProfile.user._id,

                    message:
                        notification.message,

                    type:
                        notification.type,

                    isRead:
                        notification.isRead,

                    createdAt:
                        notification.createdAt

                }

            );

        }


    }
    catch(notificationError){


        console.log(
            "Tailor rejection notification error:",
            notificationError
        );


    }





    res.status(200).json({

        message:"Tailor rejected successfully",

        tailorProfile

    });


}
catch(error){


    console.log(error);


    res.status(500).json({

        message:"Server error"

    });


}

};



// ==========================
// GET PENDING TAILORS
// ADMIN ONLY
// ==========================

const getPendingTailors = async(req,res)=>{

try{


    const tailors = await TailorProfile.find({

        verificationStatus:"pending"

    })

    .populate(
        "user",
        "name email phone role"
    )

    .sort({
        createdAt:-1
    });



    res.status(200).json({

        totalPending:tailors.length,

        tailors

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

};