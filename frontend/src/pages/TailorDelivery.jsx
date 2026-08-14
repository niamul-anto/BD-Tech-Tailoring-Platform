import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";
import useLogout from "../hooks/useLogout";

import "./TailorDelivery.css";


const TailorDelivery = () => {

    const navigate = useNavigate();

    const handleLogout = useLogout();


    const [message, setMessage] = useState("");

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // ==========================
    // LOAD DELIVERY STATUS
    // ==========================

    useEffect(() => {

        const loadDeliveryStatus = async () => {

            try {

                setLoading(true);

                setError("");


                const response = await api.get(
                    "/delivery"
                );


                setMessage(
                    response.data.message ||
                    "Delivery module coming soon"
                );

            }
            catch(error){

                console.log(error);


                setError(
                    error.response?.data?.message ||
                    "Failed to load delivery module"
                );

            }
            finally{

                setLoading(false);

            }

        };


        loadDeliveryStatus();

    }, []);



    return (

        <div className="tailor-delivery-page">


            {/* ==========================
                SIDEBAR
            ========================== */}

            <aside className="tailor-delivery-sidebar">


                <div className="tailor-delivery-logo">

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
                    </button>


                    <button
                        onClick={() =>
                            navigate("/tailor/measurement")
                        }
                    >
                        AI Measurement
                    </button>


                    <button
                        className="active"
                        onClick={() =>
                            navigate("/tailor/delivery")
                        }
                    >
                        Delivery
                    </button>


                </nav>



                <div className="tailor-delivery-sidebar-bottom">

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

            <main className="tailor-delivery-main">


                <div className="tailor-delivery-header">

                    <div>

                        <h1>
                            Delivery Management
                        </h1>

                        <p>
                            Manage pickup and delivery services
                        </p>

                    </div>

                </div>



                {loading && (

                    <div className="delivery-state">

                        Loading delivery module...

                    </div>

                )}



                {error && (

                    <div className="delivery-error">

                        {error}

                    </div>

                )}



                {!loading && !error && (

                    <div className="delivery-coming-card">


                        <div className="delivery-coming-badge">

                            Coming Soon

                        </div>


                        <div className="delivery-icon">

                            D

                        </div>


                        <h2>
                            Delivery Module
                        </h2>


                        <p className="delivery-api-message">

                            {message}

                        </p>


                        <p className="delivery-description">

                            Pickup requests, rider assignment,
                            delivery tracking and order handover
                            will be available in a future update.

                        </p>



                        <div className="delivery-feature-grid">


                            <div className="delivery-feature">

                                <strong>
                                    Pickup Request
                                </strong>

                                <span>
                                    Request collection from the tailor shop
                                </span>

                            </div>


                            <div className="delivery-feature">

                                <strong>
                                    Rider Assignment
                                </strong>

                                <span>
                                    Assign delivery personnel to orders
                                </span>

                            </div>


                            <div className="delivery-feature">

                                <strong>
                                    Live Tracking
                                </strong>

                                <span>
                                    Track delivery progress
                                </span>

                            </div>


                            <div className="delivery-feature">

                                <strong>
                                    Delivery Confirmation
                                </strong>

                                <span>
                                    Confirm successful customer handover
                                </span>

                            </div>


                        </div>


                    </div>

                )}


            </main>


        </div>

    );

};


export default TailorDelivery;