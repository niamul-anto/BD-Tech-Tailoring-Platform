const Payment = require("../models/paymentModel");
const Order = require("../models/Order");
const Notification = require("../models/Notification");


const {

    getBkashToken,

    createBkashPayment,

    executeBkashPayment

} = require("../services/bkashService");





// ==========================
// CREATE PAYMENT
// ==========================

const createPayment = async(req,res)=>{

try{


    const {

        orderId,

        method

    } = req.body;




    // ==========================
    // FIND ORDER
    // ==========================

    const order = await Order.findOne({

        _id:orderId,

        customer:req.user._id

    });




    if(!order){

        return res.status(404).json({

            message:"Order not found"

        });

    }





    // ==========================
    // PAYMENT ONLY AFTER
    // ORDER COMPLETION
    // ==========================

    if(order.status !== "completed"){

        return res.status(400).json({

            message:
                "Payment only allowed after completion"

        });

    }





    // ==========================
    // ALREADY PAID CHECK
    // ==========================

    if(order.paymentStatus === "paid"){

        return res.status(400).json({

            message:
                "This order has already been paid"

        });

    }





    // ==========================
    // PAYMENT METHOD CHECK
    // ==========================

    if(
        method !== "bkash" &&
        method !== "nagad"
    ){

        return res.status(400).json({

            message:"Invalid payment method"

        });

    }





    // ==========================
    // NAGAD NOT AVAILABLE
    // ==========================

    if(method === "nagad"){

        return res.status(400).json({

            message:
                "Nagad payment coming soon"

        });

    }





    // ==========================
    // BKASH PAYMENT
    // ==========================


    // Get bKash token

    const token =
        await getBkashToken();





    // Create bKash payment

    const bkashResponse =
        await createBkashPayment(

            token,

            order.price,

            order._id

        );





    if(
        !bkashResponse.paymentID ||
        !bkashResponse.bkashURL
    ){

        console.log(
            "bKash create response:",
            bkashResponse
        );


        return res.status(400).json({

            message:
                "bKash payment creation failed"

        });

    }





    // ==========================
    // SAVE PAYMENT
    // ==========================

    const payment =
        await Payment.create({

            order:
                order._id,

            customer:
                req.user._id,

            paymentMethod:
                "bkash",

            paymentStatus:
                "initiated",

            amount:
                order.price,

            paymentId:
                bkashResponse.paymentID

        });





    res.status(201).json({

        message:
            "Payment initiated",

        checkoutURL:
            bkashResponse.bkashURL,

        payment

    });



}
catch(error){


    console.log(
        "Create payment error:",
        error.response?.data ||
        error.message
    );



    res.status(500).json({

        message:"Server error",

        error:
            error.response?.data ||
            error.message

    });


}


};





// ==========================
// BKASH CALLBACK
// ==========================

const bkashCallback = async(req,res)=>{

try{


    const {

        paymentID,

        status

    } = req.query;




    console.log(
        "bKash callback:",
        req.query
    );





    // ==========================
    // PAYMENT ID CHECK
    // ==========================

    if(!paymentID){

        return res.redirect(

            `${process.env.FRONTEND_URL}/payment/fail?reason=missing_payment_id`

        );

    }





    // ==========================
    // FIND PAYMENT
    // ==========================

    const payment =
        await Payment.findOne({

            paymentId:paymentID

        });





    if(!payment){

        return res.redirect(

            `${process.env.FRONTEND_URL}/payment/fail?reason=payment_not_found`

        );

    }





    // ==========================
    // ALREADY PAID
    // ==========================

    if(payment.paymentStatus === "paid"){

        return res.redirect(

            `${process.env.FRONTEND_URL}/payment/success?paymentId=${payment._id}`

        );

    }





    // ==========================
    // CANCELLED PAYMENT
    // ==========================

    if(status === "cancel"){

        payment.paymentStatus =
            "failed";


        await payment.save();


        return res.redirect(

            `${process.env.FRONTEND_URL}/payment/cancel`

        );

    }





    // ==========================
    // FAILED PAYMENT
    // ==========================

    if(status !== "success"){

        payment.paymentStatus =
            "failed";


        await payment.save();


        return res.redirect(

            `${process.env.FRONTEND_URL}/payment/fail`

        );

    }





    // ==========================
    // GET NEW BKASH TOKEN
    // ==========================

    const token =
        await getBkashToken();





    // ==========================
    // EXECUTE PAYMENT
    // ==========================

    const executeResponse =
        await executeBkashPayment(

            token,

            paymentID

        );





    console.log(
        "bKash execute response:",
        executeResponse
    );





    // ==========================
    // VERIFY EXECUTION
    // ==========================

    if(

        executeResponse.statusCode !==
            "0000"

        ||

        executeResponse.transactionStatus !==
            "Completed"

        ||

        !executeResponse.trxID

    ){

        payment.paymentStatus =
            "failed";


        await payment.save();


        return res.redirect(

            `${process.env.FRONTEND_URL}/payment/fail`

        );

    }





    // ==========================
    // AMOUNT VERIFICATION
    // ==========================

    const paidAmount =
        Number(executeResponse.amount);


    const expectedAmount =
        Number(payment.amount);



    if(
        !Number.isFinite(paidAmount) ||
        paidAmount !== expectedAmount
    ){

        console.log(
            "Payment amount mismatch:",
            {
                expectedAmount,
                paidAmount
            }
        );


        payment.paymentStatus =
            "failed";


        await payment.save();


        return res.redirect(

            `${process.env.FRONTEND_URL}/payment/fail?reason=amount_mismatch`

        );

    }





    // ==========================
    // PAYMENT SUCCESS
    // ==========================

    payment.paymentStatus =
        "paid";


    payment.transactionId =
        executeResponse.trxID;


    await payment.save();





    // ==========================
    // UPDATE ORDER
    // ==========================

    const order =
        await Order.findById(

            payment.order

        );





    if(!order){

        return res.redirect(

            `${process.env.FRONTEND_URL}/payment/fail?reason=order_not_found`

        );

    }





    order.paymentStatus =
        "paid";


    await order.save();





    // ==========================
    // CUSTOMER NOTIFICATION
    // ==========================

    try{


        const customerNotification =
            await Notification.create({

                user:
                    payment.customer,

                message:
                    `Payment of ৳${payment.amount} completed successfully`,

                type:
                    "payment"

            });




        const io =
            req.app.get("io");



        if(io){

            io.to(
                `user_${payment.customer}`
            ).emit(

                "receive_notification",

                customerNotification

            );

        }


    }
    catch(notificationError){


        console.log(
            "Customer payment notification error:",
            notificationError
        );


    }





    // ==========================
    // TAILOR NOTIFICATION
    // ==========================

    try{


        if(order.tailor){


            const tailorNotification =
                await Notification.create({

                    user:
                        order.tailor,

                    message:
                        `Payment of ৳${payment.amount} has been completed for an order`,

                    type:
                        "payment"

                });




            const io =
                req.app.get("io");



            if(io){

                io.to(
                    `user_${order.tailor}`
                ).emit(

                    "receive_notification",

                    tailorNotification

                );

            }


        }


    }
    catch(notificationError){


        console.log(
            "Tailor payment notification error:",
            notificationError
        );


    }





    // ==========================
    // REDIRECT FRONTEND
    // ==========================

    return res.redirect(

        `${process.env.FRONTEND_URL}/payment/success?paymentId=${payment._id}`

    );



}
catch(error){


    console.log(
        "bKash callback error:",
        error.response?.data ||
        error.message
    );


    return res.redirect(

        `${process.env.FRONTEND_URL}/payment/fail`

    );


}


};





// ==========================
// GET CUSTOMER PAYMENTS
// ==========================

const getMyPayments = async(req,res)=>{

try{


    const payments =
        await Payment.find({

            customer:req.user._id

        })

        .populate(
            "order",
            "price status paymentStatus"
        )

        .sort({
            createdAt:-1
        });





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


    const orders =
        await Order.find({

            tailor:req.user._id,

            status:"completed",

            paymentStatus:"paid"

        });





    const totalOrders =
        orders.length;





    const totalIncome =
        orders.reduce(

            (sum,order)=>
                sum + order.price,

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

    bkashCallback,

    getMyPayments,

    getTailorEarnings

};