const { Resend } = require("resend");




const resend = new Resend(
    process.env.RESEND_API_KEY
);



const sendEmail = async(email, otp)=>{


    console.log("Sending email to:", email);
    console.log("OTP:", otp);


    try{


        const response = await resend.emails.send({

            from:
            "BD Tech Tailoring <onboarding@resend.dev>",


            to:[
                email
            ],


            subject:
            "BD Tech Tailoring Email Verification OTP",


            html:`

            <div>

                <h2>
                BD Tech Tailoring Platform
                </h2>


                <p>
                Your verification code is:
                </p>


                <h1>
                ${otp}
                </h1>


                <p>
                This OTP will expire in 5 minutes.
                </p>


            </div>

            `

        });



        console.log(
            "Resend response:",
            JSON.stringify(response)
        );


    }


    catch(error){


        console.log(
            "Email sending error:",
            error.message
        );


        throw error;


    }


};



module.exports = sendEmail;