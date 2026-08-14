import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import api from "../api/axios";

import useLogout from "../hooks/useLogout";

import useNotifications from "../hooks/useNotifications";

import useMessages from "../hooks/useMessages";

import "./TailorDashboard.css";


const TailorDashboard = () => {

    const navigate = useNavigate();

    const handleLogout = useLogout();


    const user = useSelector(
        (state) => state.auth.user
    );


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



    // ==========================
    // DASHBOARD STATE
    // ==========================

    const [dashboard, setDashboard] = useState({

        totalOrders:0,

        pendingOrders:0,

        acceptedOrders:0,

        processingOrders:0,

        completedOrders:0,

        totalGigs:0,

        totalRevenue:0

    });


    const [profile, setProfile] =
        useState(null);


    const [loading, setLoading] =
        useState(true);


    const [error, setError] =
        useState("");



    // ==========================
    // LOAD TAILOR DASHBOARD
    // ==========================

    useEffect(() => {

        const loadDashboard = async () => {

            try {

                setLoading(true);

                setError("");


                if(!user?.id){

                    setError(
                        "Tailor information not found"
                    );

                    return;

                }



                // ==========================
                // LOAD DASHBOARD + PROFILE
                // AT THE SAME TIME
                // ==========================

                const [
                    dashboardResult,
                    profileResult
                ] = await Promise.allSettled([

                    api.get(
                        "/dashboard/tailor"
                    ),

                    api.get(
                        `/tailors/profile/${user.id}`
                    )

                ]);



                // ==========================
                // DASHBOARD RESULT
                // ==========================

                if(
                    dashboardResult.status ===
                    "fulfilled"
                ){

                    const dashboardData =
                        dashboardResult.value.data;


                    setDashboard({

                        totalOrders:
                            dashboardData.totalOrders || 0,

                        pendingOrders:
                            dashboardData.pendingOrders || 0,

                        acceptedOrders:
                            dashboardData.acceptedOrders || 0,

                        processingOrders:
                            dashboardData.processingOrders || 0,

                        completedOrders:
                            dashboardData.completedOrders || 0,

                        totalGigs:
                            dashboardData.totalGigs || 0,

                        totalRevenue:
                            dashboardData.totalRevenue || 0

                    });

                }
                else{

                    console.log(
                        "Dashboard load error:",
                        dashboardResult.reason
                    );


                    setError(
                        dashboardResult.reason
                            ?.response
                            ?.data
                            ?.message
                        ||
                        "Failed to load tailor dashboard"
                    );

                }



                // ==========================
                // PROFILE RESULT
                // ==========================

                if(
                    profileResult.status ===
                    "fulfilled"
                ){

                    const profileResponse =
                        profileResult.value;


                    setProfile(

                        profileResponse.data.tailorProfile ||

                        profileResponse.data.profile ||

                        profileResponse.data

                    );

                }
                else{

                    console.log(
                        "Profile load error:",
                        profileResult.reason
                    );

                }

            }
            catch(error){

                console.log(error);


                setError(
                    error.response?.data?.message ||
                    "Failed to load tailor dashboard"
                );

            }
            finally{

                setLoading(false);

            }

        };


        loadDashboard();

    }, [user?.id]);



    // ==========================
    // VERIFICATION STATUS
    // ==========================

    const verificationStatus =
        profile?.verificationStatus ||
        "pending";



    // ==========================
    // LOADING
    // ==========================

    if(loading){

        return (

            <div className="tailor-dashboard-state">

                Loading dashboard...

            </div>

        );

    }



    // ==========================
    // ERROR
    // ==========================

    if(error){

        return (

            <div className="tailor-dashboard-state error">

                {error}

            </div>

        );

    }



    return (

        <div className="tailor-dashboard-page">


            {/* ==========================
                SIDEBAR
            ========================== */}

            <aside className="tailor-sidebar">


                <div className="tailor-logo">

                    BD Tailoring

                </div>


                <nav className="tailor-nav">


                    <button
                        className="active"
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
                            navigate(
                                "/tailor/home-measurements"
                            )
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
                            navigate(
                                "/tailor/notifications"
                            )
                        }
                    >

                        Notifications


                        {
                            notificationUnreadCount > 0
                            && (

                                <span className="notification-nav-badge">

                                    {
                                        notificationUnreadCount
                                    }

                                </span>

                            )
                        }

                    </button>


                    <button
                        onClick={() =>
                            navigate(
                                "/tailor/measurement"
                            )
                        }
                    >

                        AI Measurement

                        <span className="coming-soon-small">
                            Soon
                        </span>

                    </button>


                    <button
                        onClick={() =>
                            navigate(
                                "/tailor/delivery"
                            )
                        }
                    >

                        Delivery

                        <span className="coming-soon-small">
                            Soon
                        </span>

                    </button>


                </nav>



                {/* ==========================
                    LOGOUT
                ========================== */}

                <div className="tailor-sidebar-bottom">

                    <button
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>


            </aside>





            {/* ==========================
                MAIN CONTENT
            ========================== */}

            <main className="tailor-main">


                {/* ==========================
                    HEADER
                ========================== */}

                <div className="tailor-header">


                    <div>

                        <h1>

                            Tailor Dashboard

                        </h1>


                        <p>

                            Manage your tailoring business and orders

                        </p>

                    </div>



                    <div className="tailor-header-profile">


                        <div className="tailor-header-avatar">

                            {
                                user?.name
                                    ?.charAt(0)
                                    ?.toUpperCase()
                                ||
                                "T"
                            }

                        </div>


                        <div>

                            <strong>

                                {
                                    user?.name ||
                                    "Tailor"
                                }

                            </strong>


                            <span>

                                Tailor Account

                            </span>

                        </div>


                    </div>


                </div>





                {/* ==========================
                    VERIFICATION
                ========================== */}

                <div
                    className={
                        `verification-box ${verificationStatus}`
                    }
                >


                    <div>

                        <span className="verification-label">

                            Account Verification

                        </span>


                        <h3>

                            {
                                verificationStatus === "approved"
                                ?
                                "Your tailor profile is approved"
                                :
                                verificationStatus === "rejected"
                                ?
                                "Your tailor profile was rejected"
                                :
                                "Your tailor profile is waiting for admin approval"
                            }

                        </h3>


                        <p>

                            {
                                verificationStatus === "approved"
                                ?
                                "You can create gigs and receive customer orders."
                                :
                                verificationStatus === "rejected"
                                ?
                                "Please review your profile information before contacting support."
                                :
                                "You can manage your profile while the administrator reviews your application."
                            }

                        </p>

                    </div>


                    <span
                        className={
                            `verification-badge ${verificationStatus}`
                        }
                    >

                        {verificationStatus}

                    </span>


                </div>





                {/* ==========================
                    STAT CARDS
                ========================== */}

                <div className="tailor-stats-grid">


                    <div className="tailor-stat-card">

                        <span>

                            Total Gigs

                        </span>


                        <h2>

                            {dashboard.totalGigs}

                        </h2>


                        <p>

                            Your service listings

                        </p>

                    </div>



                    <div className="tailor-stat-card">

                        <span>

                            Total Orders

                        </span>


                        <h2>

                            {dashboard.totalOrders}

                        </h2>


                        <p>

                            Customer orders received

                        </p>

                    </div>



                    <div className="tailor-stat-card pending-card">

                        <span>

                            Pending Orders

                        </span>


                        <h2>

                            {dashboard.pendingOrders}

                        </h2>


                        <p>

                            Waiting for acceptance

                        </p>

                    </div>



                    <div className="tailor-stat-card accepted-card">

                        <span>

                            Accepted Orders

                        </span>


                        <h2>

                            {dashboard.acceptedOrders}

                        </h2>


                        <p>

                            Accepted orders

                        </p>

                    </div>



                    <div className="tailor-stat-card processing-card">

                        <span>

                            Processing

                        </span>


                        <h2>

                            {dashboard.processingOrders}

                        </h2>


                        <p>

                            Currently being stitched

                        </p>

                    </div>



                    <div className="tailor-stat-card completed-card">

                        <span>

                            Completed

                        </span>


                        <h2>

                            {dashboard.completedOrders}

                        </h2>


                        <p>

                            Successfully completed

                        </p>

                    </div>



                    <div className="tailor-stat-card revenue-card">

                        <span>

                            Total Revenue

                        </span>


                        <h2>

                            ৳{dashboard.totalRevenue}

                        </h2>


                        <p>

                            Completed order value

                        </p>

                    </div>


                </div>





                {/* ==========================
                    QUICK ACTIONS
                ========================== */}

                <div className="tailor-section-title">

                    <h2>

                        Quick Actions

                    </h2>

                </div>


                <div className="tailor-quick-grid">


                    <button
                        className="tailor-quick-card"
                        onClick={() =>
                            navigate("/tailor/profile")
                        }
                    >

                        <strong>

                            My Profile

                        </strong>


                        <span>

                            Update shop and portfolio information

                        </span>

                    </button>



                    <button
                        className="tailor-quick-card"
                        onClick={() =>
                            navigate("/tailor/gigs")
                        }
                    >

                        <strong>

                            Manage Gigs

                        </strong>


                        <span>

                            Create and manage tailoring services

                        </span>

                    </button>



                    <button
                        className="tailor-quick-card"
                        onClick={() =>
                            navigate("/tailor/orders")
                        }
                    >

                        <strong>

                            Manage Orders

                        </strong>


                        <span>

                            Accept and update customer orders

                        </span>

                    </button>



                    <button
                        className="tailor-quick-card"
                        onClick={() =>
                            navigate("/tailor/messages")
                        }
                    >

                        <strong>

                            Messages

                        </strong>


                        <span>

                            Chat with your customers

                        </span>

                    </button>


                </div>





                {/* ==========================
                    COMING SOON
                ========================== */}

                <div className="tailor-section-title">

                    <h2>

                        Coming Soon

                    </h2>

                </div>


                <div className="tailor-coming-grid">


                    <div className="tailor-coming-card">

                        <span className="soon-badge">

                            Coming Soon

                        </span>


                        <h3>

                            AI Body Measurement

                        </h3>


                        <p>

                            AI assisted customer measurement
                            functionality will be available in
                            a future update.

                        </p>

                    </div>



                    <div className="tailor-coming-card">

                        <span className="soon-badge">

                            Coming Soon

                        </span>


                        <h3>

                            Delivery Management

                        </h3>


                        <p>

                            Pickup, rider assignment and delivery
                            tracking will be added later.

                        </p>

                    </div>


                </div>


            </main>


        </div>

    );

};


export default TailorDashboard;