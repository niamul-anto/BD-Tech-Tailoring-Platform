import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";
import useLogout from "../hooks/useLogout";
import useNotifications from "../hooks/useNotifications";
import useMessages from "../hooks/useMessages";

import "./TailorMeasurement.css";


const TailorMeasurement = () => {

    const navigate = useNavigate();

    const handleLogout = useLogout();


    // ==========================
    // GLOBAL NOTIFICATIONS
    // ==========================

    const {
        unreadCount: notificationUnreadCount
    } = useNotifications();

    // ==========================
    // GLOBAL MESSAGES
    // ==========================

    const {
        unreadCount: messageUnreadCount
    } = useMessages();

    const [message, setMessage] = useState("");

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");



    // ==========================
    // LOAD AI MEASUREMENT STATUS
    // ==========================

    useEffect(() => {

        const loadMeasurementStatus = async () => {

            try {

                setLoading(true);

                setError("");


                const response = await api.get(
                    "/measurements/ai"
                );


                setMessage(
                    response.data.message ||
                    "AI measurement feature coming soon"
                );

            }
            catch(error){

                console.log(error);


                setError(
                    error.response?.data?.message ||
                    "Failed to load AI measurement module"
                );

            }
            finally{

                setLoading(false);

            }

        };


        loadMeasurementStatus();

    }, []);



    return (

        <div className="tailor-measurement-page">


            {/* ==========================
                SIDEBAR
            ========================== */}

            <aside className="tailor-measurement-sidebar">


                <div className="tailor-measurement-logo">

                    BD Tailoring

                </div>


                <nav>


                    <button
                        onClick={() =>
                            navigate("/tailor")
                        }
                    >
                        Dashboard
                    </button>


                    <button
                        onClick={() =>
                            navigate("/tailor/profile")
                        }
                    >
                        My Profile
                    </button>


                    <button
                        onClick={() =>
                            navigate("/tailor/gigs")
                        }
                    >
                        My Gigs
                    </button>


                    <button
                        onClick={() =>
                            navigate("/tailor/orders")
                        }
                    >
                        Orders
                    </button>
                    
                    <button
                        onClick={() =>
                            navigate("/tailor/home-measurements")
                        }
                    >
                        Home Measurement
                    </button>

                    <button
                        onClick={() =>
                            navigate("/tailor/messages")
                        }
                    >
                        Messages

                        {
                            messageUnreadCount > 0
                            && (

                                <span className="message-nav-badge">

                                    {messageUnreadCount}

                                </span>

                            )
                        }

                    </button>

                    <button
                        onClick={() =>
                            navigate("/tailor/reviews")
                        }
                    >
                        Reviews
                    </button>

                    <button
                        onClick={() =>
                            navigate("/tailor/notifications")
                        }
                    >

                        Notifications


                        {
                            notificationUnreadCount > 0
                            && (

                                <span className="notification-nav-badge">

                                    {notificationUnreadCount}

                                </span>

                            )
                        }

                    </button>


                    <button
                        className="active"
                        onClick={() =>
                            navigate("/tailor/measurement")
                        }
                    >
                        AI Measurement
                    </button>


                    <button
                        onClick={() =>
                            navigate("/tailor/delivery")
                        }
                    >
                        Delivery
                    </button>


                </nav>



                {/* ==========================
                    LOGOUT
                ========================== */}

                <div className="tailor-measurement-sidebar-bottom">

                    <button
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>


            </aside>





            {/* ==========================
                MAIN
            ========================== */}

            <main className="tailor-measurement-main">


                <div className="tailor-measurement-header">


                    <div>

                        <h1>
                            AI Measurement
                        </h1>

                        <p>
                            Smart body measurement assistance
                        </p>

                    </div>


                </div>



                {/* ==========================
                    LOADING
                ========================== */}

                {loading && (

                    <div className="measurement-state">

                        Loading measurement module...

                    </div>

                )}



                {/* ==========================
                    ERROR
                ========================== */}

                {error && (

                    <div className="measurement-error">

                        {error}

                    </div>

                )}



                {/* ==========================
                    COMING SOON CONTENT
                ========================== */}

                {!loading && !error && (

                    <div className="measurement-coming-card">


                        <div className="measurement-coming-badge">

                            Coming Soon

                        </div>



                        <div className="measurement-icon">

                            AI

                        </div>



                        <h2>

                            AI Body Measurement

                        </h2>



                        <p className="measurement-api-message">

                            {message}

                        </p>



                        <p className="measurement-description">

                            Future versions of BD Tailoring will support
                            AI-assisted body measurement to help customers
                            provide measurement information more accurately
                            and help tailors prepare customized clothing more
                            efficiently.

                        </p>



                        {/* ==========================
                            FUTURE FEATURES
                        ========================== */}

                        <div className="measurement-feature-grid">


                            <div className="measurement-feature">

                                <strong>
                                    Smart Measurement
                                </strong>

                                <span>
                                    Estimate customer body measurements using AI
                                </span>

                            </div>



                            <div className="measurement-feature">

                                <strong>
                                    Measurement Profile
                                </strong>

                                <span>
                                    Store customer measurement information securely
                                </span>

                            </div>



                            <div className="measurement-feature">

                                <strong>
                                    Order Integration
                                </strong>

                                <span>
                                    Attach measurement information directly to tailoring orders
                                </span>

                            </div>



                            <div className="measurement-feature">

                                <strong>
                                    Measurement History
                                </strong>

                                <span>
                                    View previous customer measurement records
                                </span>

                            </div>


                        </div>


                    </div>

                )}


            </main>


        </div>

    );

};


export default TailorMeasurement;