import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import api from "../api/axios";
import useLogout from "../hooks/useLogout";
import useNotifications from "../hooks/useNotifications";
import useMessages from "../hooks/useMessages";

import "./CustomerDashboard.css";


const CustomerDashboard = () => {

    const navigate = useNavigate();

    const handleLogout = useLogout();


    const authUser = useSelector(
        (state) => state.auth.user
    );


    // ==========================
    // GLOBAL NOTIFICATIONS
    // ==========================

    const {
        unreadCount: notificationUnreadCount
    } = useNotifications();

    const {
        unreadCount: messageUnreadCount
    } = useMessages();

    const [profile, setProfile] = useState(null);

    const [addresses, setAddresses] = useState([]);

    const [orders, setOrders] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");



    // ==========================
    // LOAD DASHBOARD DATA
    // ==========================

    useEffect(() => {

        const loadDashboard = async () => {

            try {

                setLoading(true);

                setError("");


                const [
                    profileResponse,
                    addressResponse,
                    orderResponse
                ] = await Promise.all([

                    api.get(
                        "/users/profile"
                    ),

                    api.get(
                        "/users/address"
                    ),

                    api.get(
                        "/orders/my-orders"
                    )

                ]);


                setProfile(
                    profileResponse.data.user
                );


                setAddresses(
                    addressResponse.data.addresses || []
                );


                setOrders(
                    orderResponse.data.orders || []
                );

            }
            catch(error){

                console.log(error);


                setError(
                    error.response?.data?.message ||
                    "Failed to load customer dashboard"
                );

            }
            finally{

                setLoading(false);

            }

        };


        loadDashboard();

    }, []);



    // ==========================
    // ORDER STATISTICS
    // ==========================

    const pendingOrders =
        orders.filter(
            (order) =>
                order.status === "pending"
        ).length;


    const activeOrders =
        orders.filter(
            (order) =>
                order.status === "accepted" ||
                order.status === "processing"
        ).length;


    const completedOrders =
        orders.filter(
            (order) =>
                order.status === "completed"
        ).length;


    const cancelledOrders =
        orders.filter(
            (order) =>
                order.status === "cancelled"
        ).length;



    // ==========================
    // LOADING
    // ==========================

    if(loading){

        return (

            <div className="customer-dashboard-state">

                Loading dashboard...

            </div>

        );

    }



    // ==========================
    // ERROR
    // ==========================

    if(error){

        return (

            <div className="customer-dashboard-state error">

                {error}

            </div>

        );

    }



    return (

        <div className="customer-dashboard-page">


            {/* ==========================
                SIDEBAR
            ========================== */}

            <aside className="customer-sidebar">


                <div className="customer-logo">

                    BD Tailoring

                </div>


                <nav className="customer-nav">


                    <button
                        className="active"
                        onClick={() =>
                            navigate("/customer")
                        }
                    >
                        Dashboard
                    </button>


                    <button
                        onClick={() =>
                            navigate("/customer/gigs")
                        }
                    >
                        Browse Gigs
                    </button>


                    <button
                        onClick={() =>
                            navigate("/customer/tailors")
                        }
                    >
                        Tailors
                    </button>


                    <button
                        onClick={() =>
                            navigate(
                                "/customer/home-measurements"
                            )
                        }
                    >
                        Home Measurement
                    </button>


                    <button
                        onClick={() =>
                            navigate("/customer/orders")
                        }
                    >
                        My Orders
                    </button>


                    <button
                        onClick={() =>
                            navigate("/customer/favorites")
                        }
                    >
                        Favorites
                    </button>


                    <button
                        onClick={() =>
                            navigate("/customer/messages")
                        }
                    >
                        Messages

                        {
                            messageUnreadCount > 0
                            && (

                                <span className="customer-message-nav-badge">

                                    {messageUnreadCount}

                                </span>

                            )
                        }

                    </button>


                    <button
                        onClick={() =>
                            navigate("/customer/notifications")
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
                        onClick={() =>
                            navigate("/customer/profile")
                        }
                    >
                        My Profile
                    </button>


                </nav>



                {/* ==========================
                    LOGOUT
                ========================== */}

                <div className="customer-sidebar-bottom">

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

            <main className="customer-main">


                {/* ==========================
                    HEADER
                ========================== */}

                <div className="customer-header">


                    <div>

                        <h1>
                            Customer Dashboard
                        </h1>

                        <p>
                            Find tailors and manage your tailoring orders
                        </p>

                    </div>



                    <div className="customer-header-profile">


                        {
                            profile?.profileImage
                            ? (

                                <img
                                    src={profile.profileImage}
                                    alt={profile.name}
                                    className="customer-header-image"
                                />

                            )
                            : (

                                <div className="customer-header-avatar">

                                    {
                                        profile?.name
                                            ?.charAt(0)
                                            ?.toUpperCase()
                                        ||
                                        authUser?.name
                                            ?.charAt(0)
                                            ?.toUpperCase()
                                        ||
                                        "C"
                                    }

                                </div>

                            )
                        }


                        <div>

                            <strong>

                                {
                                    profile?.name ||
                                    authUser?.name ||
                                    "Customer"
                                }

                            </strong>


                            <span>

                                Customer Account

                            </span>

                        </div>


                    </div>


                </div>





                {/* ==========================
                    PROFILE WELCOME
                ========================== */}

                <div className="customer-welcome-card">


                    <div>

                        <span className="customer-welcome-label">

                            Welcome back

                        </span>


                        <h2>

                            {
                                profile?.name ||
                                authUser?.name ||
                                "Customer"
                            }

                        </h2>


                        <p>

                            Browse tailoring services, manage your orders,
                            and communicate directly with tailors.

                        </p>

                    </div>


                    <button
                        onClick={() =>
                            navigate("/customer/gigs")
                        }
                    >
                        Browse Gigs
                    </button>


                </div>





                {/* ==========================
                    STAT CARDS
                ========================== */}

                <div className="customer-stats-grid">


                    <div className="customer-stat-card">

                        <span>
                            Total Orders
                        </span>

                        <h2>
                            {orders.length}
                        </h2>

                        <p>
                            All tailoring orders
                        </p>

                    </div>



                    <div className="customer-stat-card pending">

                        <span>
                            Pending
                        </span>

                        <h2>
                            {pendingOrders}
                        </h2>

                        <p>
                            Waiting for tailor acceptance
                        </p>

                    </div>



                    <div className="customer-stat-card active">

                        <span>
                            Active Orders
                        </span>

                        <h2>
                            {activeOrders}
                        </h2>

                        <p>
                            Accepted or processing
                        </p>

                    </div>



                    <div className="customer-stat-card completed">

                        <span>
                            Completed
                        </span>

                        <h2>
                            {completedOrders}
                        </h2>

                        <p>
                            Successfully completed
                        </p>

                    </div>



                    <div className="customer-stat-card cancelled">

                        <span>
                            Cancelled
                        </span>

                        <h2>
                            {cancelledOrders}
                        </h2>

                        <p>
                            Cancelled tailoring orders
                        </p>

                    </div>


                </div>





                {/* ==========================
                    QUICK ACTIONS
                ========================== */}

                <div className="customer-section-title">

                    <h2>
                        Quick Actions
                    </h2>

                </div>


                <div className="customer-quick-grid">


                    <button
                        className="customer-quick-card"
                        onClick={() =>
                            navigate("/customer/gigs")
                        }
                    >

                        <strong>
                            Browse Gigs
                        </strong>

                        <span>
                            Explore tailoring services and prices
                        </span>

                    </button>



                    <button
                        className="customer-quick-card"
                        onClick={() =>
                            navigate("/customer/tailors")
                        }
                    >

                        <strong>
                            Find Tailors
                        </strong>

                        <span>
                            Search approved tailors by location and service
                        </span>

                    </button>



                    <button
                        className="customer-quick-card"
                        onClick={() =>
                            navigate("/customer/orders")
                        }
                    >

                        <strong>
                            My Orders
                        </strong>

                        <span>
                            Track pending and active tailoring orders
                        </span>

                    </button>



                    <button
                        className="customer-quick-card"
                        onClick={() =>
                            navigate("/customer/messages")
                        }
                    >

                        <strong>
                            Messages
                        </strong>

                        <span>
                            Chat directly with your tailors
                        </span>

                    </button>


                </div>





                {/* ==========================
                    ACCOUNT OVERVIEW
                ========================== */}

                <div className="customer-section-title">

                    <h2>
                        Account Overview
                    </h2>

                </div>


                <div className="customer-overview-grid">


                    <div className="customer-overview-card">

                        <h3>
                            Profile Information
                        </h3>


                        <div className="customer-overview-row">

                            <span>
                                Email
                            </span>

                            <strong>
                                {profile?.email || "-"}
                            </strong>

                        </div>


                        <div className="customer-overview-row">

                            <span>
                                Phone
                            </span>

                            <strong>
                                {profile?.phone || "-"}
                            </strong>

                        </div>


                        <div className="customer-overview-row">

                            <span>
                                Gender
                            </span>

                            <strong>

                                {
                                    profile?.gender
                                    ? profile.gender
                                        .charAt(0)
                                        .toUpperCase()
                                    +
                                        profile.gender.slice(1)
                                    : "-"
                                }

                            </strong>

                        </div>


                        <button
                            className="customer-overview-btn"
                            onClick={() =>
                                navigate("/customer/profile")
                            }
                        >
                            Manage Profile
                        </button>

                    </div>



                    <div className="customer-overview-card">

                        <h3>
                            Saved Addresses
                        </h3>


                        <div className="address-count">

                            {addresses.length}

                        </div>


                        <p className="address-description">

                            {
                                addresses.length === 0
                                ?
                                "No delivery address added yet."
                                :
                                `${addresses.length} delivery address(es) saved to your account.`
                            }

                        </p>


                        <button
                            className="customer-overview-btn"
                            onClick={() =>
                                navigate("/customer/profile")
                            }
                        >
                            Manage Addresses
                        </button>

                    </div>


                </div>


            </main>


        </div>

    );

};


export default CustomerDashboard;