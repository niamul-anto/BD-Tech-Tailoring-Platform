const Payment = require("../models/paymentModel");
const Order = require("../models/Order");


const {
    getBkashToken,
    createBkashPayment
} = require("../services/bkashService");




// ==========================
// CREATE PAYMENT
// ==========================

const createPayment = async(req,res)=>{

try{


const {
    orderId,
    method
}=req.body;




// Find Order

const order = await Order.findOne({

    _id:orderId,

    customer:req.user._id

});




if(!order){

    return res.status(404).json({

        message:"Order not found"

    });

}





// Payment only after completion

if(order.status !== "completed"){


    return res.status(400).json({

        message:"Payment only allowed after completion"

    });


}



if(method !== "bkash" && method !== "nagad"){

    return res.status(400).json({

        message:"Invalid payment method"

    });

}

// Nagad not available

if(method === "nagad"){


    return res.status(400).json({

        message:"Nagad payment coming soon"

    });


}





// ==========================
// BKASH PAYMENT
// ==========================


// Get bKash token

const token = await getBkashToken();




// Create bKash payment

const bkashResponse = await createBkashPayment(

    token,

    order.price,

    order._id

);


if(!bkashResponse.paymentID){

    return res.status(400).json({

        message:"bKash payment creation failed"

    });

}


// Save Payment

const payment = await Payment.create({

    order:order._id,

    customer:req.user._id,

    paymentMethod:"bkash",

    paymentStatus:"initiated",

    amount:order.price,

    paymentId:bkashResponse.paymentID

});





res.status(201).json({

    message:"Payment initiated",


    checkoutURL:bkashResponse.bkashURL,


    payment

});



}


catch(error){


console.log(error);



res.status(500).json({

    message:"Server error",

    error:error.message

});


}



};


// ==========================
// GET CUSTOMER PAYMENTS
// ==========================

const getMyPayments = async(req,res)=>{

try{


    const payments = await Payment.find({

        customer:req.user._id

    })
    .populate("order","price status");



    res.status(200).json({

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
// GET TAILOR EARNINGS
// ==========================

const getTailorEarnings = async(req,res)=>{

try{


    const orders = await Order.find({

        tailor:req.user._id,

        status:"completed",

        paymentStatus:"paid"

    });



    const totalOrders = orders.length;



    const totalIncome = orders.reduce(

        (sum,order)=>sum + order.price,

        0

    );



    res.status(200).json({

        totalOrders,

        totalIncome,

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


module.exports={

    createPayment,

    getMyPayments,

    getTailorEarnings

};