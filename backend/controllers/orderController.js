const Order = require("../models/Order");
const Gig = require("../models/Gig");
const Notification = require("../models/Notification");
const Review = require("../models/Review");

const {
    uploadPortfolioImage
} = require("../utils/uploadToCloudinary");



// =======================
// CREATE ORDER
// =======================

const createOrder = async(req,res)=>{

    try{

        console.log(
            "========== CREATE ORDER START =========="
        );

        console.log(
            "BODY:",
            req.body
        );

        console.log(
            "FILES COUNT:",
            req.files?.length || 0
        );

        console.log(
            "USER:",
            req.user?._id
        );


        const {
            gigId,
            deliveryAddress,
            measurement
        } = req.body || {};


        // ==========================
        // CHECK GIG ID
        // ==========================

        if(!gigId){

            return res.status(400).json({

                message:"Gig ID is missing"

            });

        }


        // ==========================
        // FIND GIG
        // ==========================

        const gig =
            await Gig.findById(
                gigId
            );


        if(!gig){

            return res.status(404).json({

                message:"Gig not found"

            });

        }


        // ==========================
        // PARSE DELIVERY ADDRESS
        // ==========================

        let parsedDeliveryAddress =
            deliveryAddress;


        if(
            typeof deliveryAddress === "string"
        ){

            try{

                parsedDeliveryAddress =
                    JSON.parse(
                        deliveryAddress
                    );

            }
            catch(error){

                console.log(
                    "DELIVERY ADDRESS PARSE ERROR:",
                    deliveryAddress
                );


                return res.status(400).json({

                    message:
                        "Invalid delivery address"

                });

            }

        }


        if(
            !parsedDeliveryAddress ||
            typeof parsedDeliveryAddress !== "object"
        ){

            return res.status(400).json({

                message:
                    "Delivery address is required"

            });

        }


        // ==========================
        // PARSE MEASUREMENT
        // ==========================

        let parsedMeasurement = {};


        if(measurement){

            if(
                typeof measurement === "string"
            ){

                try{

                    parsedMeasurement =
                        JSON.parse(
                            measurement
                        );

                }
                catch(error){

                    console.log(
                        "MEASUREMENT PARSE ERROR:",
                        measurement
                    );


                    return res.status(400).json({

                        message:
                            "Invalid measurement data"

                    });

                }

            }
            else{

                parsedMeasurement =
                    measurement;

            }

        }


        // ==========================
        // REFERENCE IMAGES
        // ==========================

        const referenceImages = [];


        if(
            Array.isArray(req.files) &&
            req.files.length > 0
        ){

            for(const file of req.files){

                console.log(
                    "UPLOADING FILE:",
                    file.originalname
                );


                const imageUrl =
                    await uploadPortfolioImage(
                        file.buffer
                    );


                referenceImages.push(
                    imageUrl
                );

            }

        }


        // ==========================
        // CREATE ORDER
        // ==========================

        const order =
            await Order.create({

                customer:
                    req.user._id,

                tailor:
                    gig.tailor,

                gig:
                    gig._id,

                price:
                    gig.price,

                deliveryAddress:
                    parsedDeliveryAddress,

                measurement:
                    parsedMeasurement,

                referenceImages:
                    referenceImages,

                statusHistory:[
                    {
                        status:"pending"
                    }
                ]

            });


        console.log(
            "ORDER CREATED:",
            order._id
        );


        // ==========================
        // CREATE NOTIFICATION
        // ==========================

        const notification =
            await Notification.create({

                user:
                    gig.tailor,

                message:
                    "You received a new order",

                type:
                    "order"

            });


        // ==========================
        // SOCKET NOTIFICATION
        // ==========================

        const io =
            req.app.get("io");


        if(io){

            io.to(
                `user_${gig.tailor}`
            ).emit(

                "receive_notification",

                notification

            );

        }


        console.log(
            "========== CREATE ORDER SUCCESS =========="
        );


        return res.status(201).json({

            message:
                "Order created successfully",

            order

        });


    }
    catch(error){

        console.error(
            "========== CREATE ORDER ERROR =========="
        );

        console.error(error);

        console.error(
            "ERROR MESSAGE:",
            error.message
        );

        console.error(
            "ERROR STACK:",
            error.stack
        );


        return res.status(500).json({

            message:
                error.message ||
                "Server error"

        });

    }

};




// =======================
// GET CUSTOMER ORDERS
// =======================

const getMyOrders = async(req,res)=>{

try{


    const orders = await Order.find({

        customer:req.user._id

    })

    .populate(
        "gig",
        "title price"
    )

    .populate(
        "tailor",
        "name email"
    )

    // ==========================
    // NEWEST ORDER FIRST
    // ==========================
    .sort({
        createdAt:-1
    });



    // ==========================
    // GET REVIEWED ORDERS
    // ==========================

    const orderIds =
        orders.map(
            (order) => order._id
        );



    const reviews = await Review.find({

        customer:req.user._id,

        order:{
            $in:orderIds
        }

    })
    .select("order");



    const reviewedOrderIds =
        new Set(

            reviews.map(
                (review) =>
                    review.order.toString()
            )

        );



    // ==========================
    // ADD REVIEW STATUS
    // ==========================

    const ordersWithReviewStatus =
        orders.map(
            (order) => {

                const orderObject =
                    order.toObject();


                return {

                    ...orderObject,

                    reviewed:
                        reviewedOrderIds.has(
                            order._id.toString()
                        )

                };

            }
        );



    res.status(200).json({

        orders:ordersWithReviewStatus

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
// GET TAILOR ORDERS
// ==========================

const getTailorOrders = async(req,res)=>{

try{


    const orders = await Order.find({

        tailor:req.user._id

    })

    .populate(
        "customer",
        "name email phone"
    )

    .populate(
        "gig",
        "title price"
    )

    // ==========================
    // NEWEST ORDER FIRST
    // ==========================
    .sort({
        createdAt:-1
    });



    res.status(200).json({

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
// UPDATE ORDER STATUS
// ==========================

const updateOrderStatus = async(req,res)=>{

try{

    const {status}=req.body;


    const allowedStatus = [

        "pending",
        "accepted",
        "processing",
        "completed",
        "cancelled"

    ];


    if(!allowedStatus.includes(status)){

        return res.status(400).json({

            message:"Invalid order status"

        });

    }



    const order = await Order.findOne({

        _id:req.params.orderId,

        tailor:req.user._id

    });



    if(!order){

        return res.status(404).json({

            message:"Order not found"

        });

    }



    // Status Transition Validation

    const validTransitions = {

        pending:["accepted"],

        accepted:["processing"],

        processing:["completed"],

        completed:[],

        cancelled:[]

    };



    if(!validTransitions[order.status].includes(status)){


        return res.status(400).json({

            message:`Cannot change status from ${order.status} to ${status}`

        });


    }



    // Update current status

    order.status = status;



    // Add tracking history

    order.statusHistory.push({

        status:status

    });



    await order.save();



    // Create notification for customer

    let message = "";


    if(status === "accepted"){

        message = "Your order has been accepted by the tailor";

    }

    else if(status === "processing"){

        message = "Your order is now being processed";

    }

    else if(status === "completed"){

        message = "Your order has been completed";

    }



    if(message){

        const notification =
            await Notification.create({

                user:order.customer,

                message:message,

                type:"order"

            });


        const io =
            req.app.get("io");


        if(io){

            io.to(
                `user_${order.customer}`
            ).emit(

                "receive_notification",

                notification

            );

        }

    }



    res.status(200).json({

        message:"Order status updated successfully",

        order

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
// CANCEL ORDER (CUSTOMER)
// ==========================

const cancelOrder = async(req,res)=>{

try{


    const order = await Order.findOne({

        _id:req.params.orderId,

        customer:req.user._id

    });



    if(!order){

        return res.status(404).json({

            message:"Order not found"

        });

    }




    // Only pending order can be cancelled

    if(order.status !== "pending"){


        return res.status(400).json({

            message:"Only pending orders can be cancelled"

        });


    }



    order.status = "cancelled";



    // Add cancelled status to history

    order.statusHistory.push({

        status:"cancelled"

    });



    await order.save();



    res.status(200).json({

        message:"Order cancelled successfully",

        order

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
// UPDATE PAYMENT STATUS
// ==========================

const updatePaymentStatus = async(req,res)=>{

try{


    const order = await Order.findOne({

        _id:req.params.orderId,

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

            message:"Payment allowed only after order completion"

        });

    }



    order.paymentStatus = "paid";


    await order.save();

    // ==========================
    // NOTIFY TAILOR ABOUT PAYMENT
    // ==========================

    const notification =
        await Notification.create({

            user:order.tailor,

            message:
                `Payment of ৳${order.price} has been completed for your order`,

            type:"payment"

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


    res.status(200).json({

        message:"Payment completed successfully",

        order

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

    createOrder,

    getMyOrders,

    getTailorOrders,

    updateOrderStatus,

    cancelOrder,

    updatePaymentStatus

};