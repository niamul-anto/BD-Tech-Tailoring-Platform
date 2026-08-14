const Order = require("../models/Order");
const Notification = require("../models/Notification");

const Gig = require("../models/Gig");
const Review = require("../models/Review");



// ==========================
// CUSTOMER DASHBOARD
// ==========================

const getCustomerDashboard = async(req,res)=>{


try{


    const orders = await Order.find({

        customer:req.user._id

    });



    const totalOrders = orders.length;



    const pendingOrders = orders.filter(

        order => order.status === "pending"

    ).length;



    const completedOrders = orders.filter(

        order => order.status === "completed"

    ).length;



    const totalSpent = orders
    .filter(
        order => order.paymentStatus === "paid"
    )
    .reduce(

        (sum,order)=>sum + order.price,

        0

    );




    const unreadNotifications = await Notification.countDocuments({

        user:req.user._id,

        isRead:false

    });





    res.status(200).json({

        totalOrders,

        pendingOrders,

        completedOrders,

        totalSpent,

        unreadNotifications

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
// TAILOR DASHBOARD
// ==========================

const getTailorDashboard = async(req,res)=>{

try{


    const gigs = await Gig.find({

        tailor:req.user._id

    });



    const orders = await Order.find({

        tailor:req.user._id

    });



    const completedOrders = orders.filter(

        order=>order.status==="completed"

    ).length;



    const pendingOrders = orders.filter(

        order=>order.status==="pending"

    ).length;



    const acceptedOrders = orders.filter(

        order=>order.status==="accepted"

    ).length;



    const processingOrders = orders.filter(

        order=>order.status==="processing"

    ).length;



    // ==========================
    // TOTAL REVENUE
    // PAID ORDERS ONLY
    // ==========================

    const totalRevenue = orders
    .filter(

        order=>order.paymentStatus==="paid"

    )
    .reduce(

        (sum,order)=>sum + Number(order.price || 0),

        0

    );





    const reviews = await Review.find({

        tailor:req.user._id

    });



    const totalReviews = reviews.length;



    const averageRating = totalReviews === 0

    ? 0

    : reviews.reduce(

        (sum,review)=>sum + review.rating,

        0

    ) / totalReviews;





    res.status(200).json({

        totalGigs:gigs.length,

        totalOrders:orders.length,

        pendingOrders,

        acceptedOrders,

        processingOrders,

        completedOrders,

        totalRevenue,

        averageRating,

        totalReviews

    });



}
catch(error){


    console.log(error);


    res.status(500).json({

        message:"Server error"

    });


}


};


module.exports={

    getCustomerDashboard,

    getTailorDashboard

};