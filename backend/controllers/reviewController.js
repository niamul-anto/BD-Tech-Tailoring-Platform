const Review = require("../models/Review");
const Order = require("../models/Order");
const Notification = require("../models/Notification");



// ==========================
// CREATE REVIEW
// ==========================

const createReview = async(req,res)=>{


try{


const {

    orderId,

    rating,

    comment

}=req.body;



// Find order

const order = await Order.findOne({

    _id:orderId,

    customer:req.user._id

});



if(!order){

    return res.status(404).json({

        message:"Order not found"

    });

}



// Check order completed

if(order.status !== "completed"){


    return res.status(400).json({

        message:"Review allowed only after completion"

    });


}



// Check payment

if(order.paymentStatus !== "paid"){


    return res.status(400).json({

        message:"Payment must be completed before review"

    });


}



// Check duplicate review

const existingReview = await Review.findOne({

    order:order._id

});



if(existingReview){


    return res.status(400).json({

        message:"You already reviewed this order"

    });


}



// Create review

const review = await Review.create({

    customer:req.user._id,

    tailor:order.tailor,

    order:order._id,

    rating,

    comment

});


// ==========================
// NOTIFY TAILOR ABOUT REVIEW
// ==========================

const notification =
    await Notification.create({

        user:order.tailor,

        message:
            `You received a new ${rating}-star review`,

        type:"review"

    });


const io =
    req.app.get("io");


if(io){

    io.to(
        `user_${order.tailor}`
    ).emit(

        "receive_notification",

        notification

    );

}


res.status(201).json({

    message:"Review added successfully",

    review

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
// GET TAILOR REVIEWS
// ==========================

const getTailorReviews = async(req,res)=>{

try{


    const reviews = await Review.find({

        tailor:req.params.tailorId

    })

    .populate(
        "customer",
        "name email profileImage"
    )

    .populate({
        path:"order",

        select:
            "_id price status paymentStatus gig",

        populate:{
            path:"gig",

            select:
                "title price"
        }
    })

    .sort({
        createdAt:-1
    });



    const totalReviews =
        reviews.length;



    const averageRating =
        totalReviews === 0
        ? 0
        : reviews.reduce(
            (sum,review)=>
                sum + review.rating,
            0
        ) / totalReviews;



    res.status(200).json({

        averageRating,

        totalReviews,

        reviews

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
// GET ALL REVIEWS
// ADMIN ONLY
// ==========================

const getAllReviews = async(req,res)=>{

try{


    const reviews = await Review.find()

    .populate(
        "customer",
        "name email phone profileImage"
    )

    .populate(
        "tailor",
        "name email phone profileImage"
    )

    .populate(
        "order",
        "_id status paymentStatus price"
    )

    .sort({
        createdAt:-1
    });



    const totalReviews =
        reviews.length;



    const averageRating =
        totalReviews === 0
        ? 0
        : reviews.reduce(
            (sum,review)=>
                sum + review.rating,
            0
        ) / totalReviews;



    res.status(200).json({

        totalReviews,

        averageRating,

        reviews

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

    createReview,

    getTailorReviews,

    getAllReviews

};