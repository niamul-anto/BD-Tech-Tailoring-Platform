const axios = require("axios");


let bkashToken = "";



// ==========================
// GET BKASH TOKEN
// ==========================

const getBkashToken = async()=>{


    const response = await axios.post(

        `${process.env.BKASH_BASE_URL}/tokenized/checkout/token/grant`,


        {
            app_key:
                process.env.BKASH_APP_KEY,

            app_secret:
                process.env.BKASH_APP_SECRET
        },


        {
            headers:{

                "Content-Type":
                    "application/json",

                "Accept":
                    "application/json",

                username:
                    process.env.BKASH_USERNAME,

                password:
                    process.env.BKASH_PASSWORD

            }
        }

    );


    bkashToken =
        response.data.id_token;


    return bkashToken;


};






// ==========================
// CREATE BKASH PAYMENT
// ==========================

const createBkashPayment = async(

    token,

    amount,

    orderId

)=>{


    const callbackURL =
        `${process.env.BACKEND_URL}/api/payment/callback`;



    const response = await axios.post(


        `${process.env.BKASH_BASE_URL}/tokenized/checkout/create`,


        {

            mode:"0011",

            payerReference:
                orderId.toString(),

            callbackURL,

            amount:
                amount.toString(),

            currency:"BDT",

            intent:"sale",

            merchantInvoiceNumber:
                orderId.toString()

        },


        {

            headers:{

                "Content-Type":
                    "application/json",

                "Accept":
                    "application/json",

                Authorization:
                    token,

                "X-APP-Key":
                    process.env.BKASH_APP_KEY

            }

        }


    );


    return response.data;


};






// ==========================
// EXECUTE BKASH PAYMENT
// ==========================

const executeBkashPayment = async(

    token,

    paymentID

)=>{


    const response = await axios.post(


        `${process.env.BKASH_BASE_URL}/tokenized/checkout/execute`,


        {

            paymentID

        },


        {

            headers:{

                "Content-Type":
                    "application/json",

                "Accept":
                    "application/json",

                Authorization:
                    token,

                "X-APP-Key":
                    process.env.BKASH_APP_KEY

            }

        }


    );


    return response.data;


};






module.exports={

    getBkashToken,

    createBkashPayment,

    executeBkashPayment

};