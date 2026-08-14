import { useEffect, useState } from "react";
import {
    Link,
    useLocation,
    useNavigate
} from "react-router-dom";

import api from "../api/axios";

import "./VerifyOTP.css";


const VerifyOTP = () => {

    const navigate = useNavigate();

    const location = useLocation();


    const [otp,setOtp] = useState("");

    const [error,setError] = useState("");

    const [message,setMessage] = useState("");

    const [loading,setLoading] = useState(false);

    const [resending,setResending] = useState(false);


    const storedRegistration =
        sessionStorage.getItem(
            "pendingRegistration"
        );


    const registrationData =
        storedRegistration
        ?
        JSON.parse(
            storedRegistration
        )
        :
        null;


    const email =
        location.state?.email ||
        registrationData?.email;



    useEffect(() => {

        if(!registrationData){

            navigate(
                "/register",
                {
                    replace:true
                }
            );

        }

    }, []);



    // ==========================
    // VERIFY
    // ==========================

    const handleVerify = async (e) => {

        e.preventDefault();

        setError("");

        setMessage("");


        if(otp.length !== 6){

            setError(
                "Please enter the 6 digit OTP"
            );

            return;

        }


        try {

            setLoading(true);


            await api.post(
                "/auth/verify-otp",
                {

                    ...registrationData,

                    otp

                }
            );


            sessionStorage.removeItem(
                "pendingRegistration"
            );


            navigate(
                "/login",
                {
                    replace:true,

                    state:{
                        message:
                            "Registration completed successfully. Please login."
                    }
                }
            );

        }
        catch(error){

            setError(
                error.response?.data?.message ||
                "OTP verification failed"
            );

        }
        finally{

            setLoading(false);

        }

    };



    // ==========================
    // RESEND OTP
    // ==========================

    const handleResend = async () => {

        if(!registrationData){

            return;

        }


        try {

            setResending(true);

            setError("");

            setMessage("");


            const response = await api.post(
                "/auth/register",
                registrationData
            );


            setMessage(
                response.data.message
            );

        }
        catch(error){

            setError(
                error.response?.data?.message ||
                "Failed to resend OTP"
            );

        }
        finally{

            setResending(false);

        }

    };



    if(!registrationData){

        return null;

    }



    return (

        <div className="otp-page">


            <div className="otp-card">


                <div
                    className="otp-logo"
                    onClick={() =>
                        navigate("/")
                    }
                >

                    BD Tailoring

                </div>


                <div className="otp-icon">

                    ✓

                </div>


                <h1>
                    Verify your email
                </h1>


                <p>

                    We sent a 6 digit OTP to

                    <strong>
                        {" "}{email}
                    </strong>

                </p>


                {error && (

                    <div className="otp-error">

                        {error}

                    </div>

                )}


                {message && (

                    <div className="otp-success">

                        {message}

                    </div>

                )}



                <form
                    onSubmit={handleVerify}
                >


                    <input
                        className="otp-input"
                        type="text"
                        inputMode="numeric"
                        maxLength="6"
                        value={otp}
                        onChange={(e) =>
                            setOtp(
                                e.target.value
                                    .replace(
                                        /\D/g,
                                        ""
                                    )
                            )
                        }
                        placeholder="000000"
                        required
                    />


                    <button
                        className="otp-submit"
                        type="submit"
                        disabled={loading}
                    >

                        {
                            loading
                            ?
                            "Verifying..."
                            :
                            "Verify & Create Account"
                        }

                    </button>


                </form>



                <button
                    className="otp-resend"
                    onClick={handleResend}
                    disabled={resending}
                >

                    {
                        resending
                        ?
                        "Sending..."
                        :
                        "Resend OTP"
                    }

                </button>


                <Link
                    className="otp-back"
                    to="/register"
                >
                    Change registration information
                </Link>


            </div>


        </div>

    );

};


export default VerifyOTP;