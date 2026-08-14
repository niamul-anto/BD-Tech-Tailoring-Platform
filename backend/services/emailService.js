const { Resend } = require("resend");



const resend = new Resend(
    process.env.RESEND_API_KEY
);



// ==========================
// SEND EMAIL
// ==========================

const sendEmail = async(email, otp)=>{


    console.log(
        "Sending email to:",
        email
    );


    try{


        const {
            data,
            error
        } = await resend.emails.send({


            // ==========================
            // SENDER
            // ==========================

            from:
                process.env.RESEND_FROM_EMAIL ||
                "BD Tech Tailoring <onboarding@resend.dev>",


            // ==========================
            // RECEIVER
            // ==========================

            to:[
                email
            ],


            // ==========================
            // SUBJECT
            // ==========================

            subject:
                "BD Tech Tailoring Email Verification OTP",


            // ==========================
            // EMAIL BODY
            // ==========================

            html:`

                <div
                    style="
                        font-family:Arial,sans-serif;
                        max-width:500px;
                        margin:auto;
                        padding:25px;
                        border:1px solid #e5e7eb;
                        border-radius:10px;
                    "
                >

                    <h2
                        style="
                            color:#111827;
                            margin-bottom:20px;
                        "
                    >
                        BD Tech Tailoring Platform
                    </h2>


                    <p
                        style="
                            color:#4b5563;
                            font-size:15px;
                        "
                    >
                        Your verification code is:
                    </p>


                    <h1
                        style="
                            color:#2563eb;
                            font-size:36px;
                            letter-spacing:6px;
                            margin:20px 0;
                        "
                    >
                        ${otp}
                    </h1>


                    <p
                        style="
                            color:#6b7280;
                            font-size:14px;
                        "
                    >
                        This OTP will expire in 5 minutes.
                    </p>


                    <p
                        style="
                            color:#9ca3af;
                            font-size:12px;
                            margin-top:25px;
                        "
                    >
                        If you did not request this verification code,
                        you can ignore this email.
                    </p>

                </div>

            `

        });



        // ==========================
        // RESEND ERROR
        // ==========================

        if(error){


            console.log(
                "Resend email error:",
                error
            );


            throw new Error(
                error.message ||
                "Failed to send verification email"
            );


        }



        // ==========================
        // SUCCESS
        // ==========================

        console.log(
            "Email sent successfully:",
            data?.id
        );


        return data;


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