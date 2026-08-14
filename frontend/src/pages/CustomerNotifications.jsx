import {
    useState
} from "react";

import { useNavigate } from "react-router-dom";

import useLogout from "../hooks/useLogout";
import useNotifications from "../hooks/useNotifications";
import useMessages from "../hooks/useMessages";

import "./CustomerNotifications.css";


const CustomerNotifications = () => {

    const navigate = useNavigate();

    const handleLogout = useLogout();


    // ==========================
    // GLOBAL NOTIFICATIONS
    // ==========================

    const {

        notifications,

        unreadCount,

        loading,

        socketConnected,

        markNotificationAsRead

    } = useNotifications();

    const {
        unreadCount: messageUnreadCount
    } = useMessages();

    const [error, setError] =
        useState("");

    const [markingId, setMarkingId] =
        useState("");



    // ==========================
    // MARK AS READ
    // ==========================

    const handleMarkAsRead = async (
        notificationId
    ) => {

        try {

            setMarkingId(
                notificationId
            );

            setError("");


            await markNotificationAsRead(
                notificationId
            );

        }
        catch(error){

            console.log(error);


            const errorMessage =
                error.response?.data?.message ||
                "Failed to mark notification as read";


            setError(
                errorMessage
            );


            alert(
                errorMessage
            );

        }
        finally{

            setMarkingId("");

        }

    };



    // ==========================
    // FORMAT DATE
    // ==========================

    const formatDate = (date) => {

        if(!date){

            return "";

        }


        return new Date(
            date
        ).toLocaleString();

    };



    // ==========================
    // NOTIFICATION ICON
    // ==========================

    const getNotificationIcon = (
        type
    ) => {

        if(type === "order"){

            return "O";

        }


        if(type === "payment"){

            return "P";

        }


        if(type === "review"){

            return "R";

        }


        if(type === "message"){

            return "M";

        }


        return "!";

    };



    return (

        <div className="customer-notifications-page">


            {/* ==========================
                SIDEBAR
            ========================== */}

            <aside className="customer-notifications-sidebar">


                <div className="customer-notifications-logo">

                    BD Tailoring

                </div>


                <nav>


                    <button
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
                            navigate("/customer/orders")
                        }
                    >
                        My Orders
                    </button>


                    <button
                        onClick={() =>
                            navigate("/customer/home-measurements")
                        }
                    >
                        Home Measurement
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
                        className="active"
                        onClick={() =>
                            navigate(
                                "/customer/notifications"
                            )
                        }
                    >

                        Notifications


                        {
                            unreadCount > 0
                            && (

                                <span className="customer-notification-nav-badge">

                                    {unreadCount}

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



                <div className="customer-notifications-sidebar-bottom">

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

            <main className="customer-notifications-main">


                <div className="customer-notifications-header">


                    <div>

                        <h1>
                            Notifications
                        </h1>

                        <p>
                            Stay updated about your orders and messages
                        </p>

                    </div>


                    <div className="customer-notification-header-right">


                        {/* ==========================
                            LIVE STATUS
                        ========================== */}

                        <span
                            className={
                                socketConnected
                                ?
                                "customer-notification-live connected"
                                :
                                "customer-notification-live disconnected"
                            }
                        >

                            {
                                socketConnected
                                ?
                                "Live"
                                :
                                "Connecting..."
                            }

                        </span>


                        {/* ==========================
                            UNREAD COUNT
                        ========================== */}

                        <div className="customer-notification-count">

                            {unreadCount} Unread

                        </div>


                    </div>


                </div>



                {/* ==========================
                    ERROR
                ========================== */}

                {error && (

                    <div className="customer-notifications-error">

                        {error}

                    </div>

                )}



                {/* ==========================
                    LOADING
                ========================== */}

                {
                    loading
                    ? (

                        <div className="customer-notifications-state">

                            Loading notifications...

                        </div>

                    )
                    : (

                        <div className="customer-notifications-list">


                            {/* ==========================
                                NOTIFICATION LIST
                            ========================== */}

                            {
                                notifications.map(
                                    (
                                        notification
                                    ) => (

                                        <div
                                            key={
                                                notification._id
                                            }
                                            className={
                                                notification.isRead
                                                ?
                                                "customer-notification-card"
                                                :
                                                "customer-notification-card unread"
                                            }
                                        >


                                            {/* ==========================
                                                ICON
                                            ========================== */}

                                            <div
                                                className={
                                                    `customer-notification-icon ${notification.type || "system"}`
                                                }
                                            >

                                                {
                                                    getNotificationIcon(
                                                        notification.type
                                                    )
                                                }

                                            </div>



                                            {/* ==========================
                                                CONTENT
                                            ========================== */}

                                            <div className="customer-notification-content">


                                                <div className="customer-notification-title-row">


                                                    <span className="customer-notification-type">

                                                        {
                                                            notification.type ||
                                                            "system"
                                                        }

                                                    </span>


                                                    {
                                                        !notification.isRead
                                                        && (

                                                            <span className="customer-unread-dot"></span>

                                                        )
                                                    }


                                                </div>


                                                <p>

                                                    {
                                                        notification.message
                                                    }

                                                </p>


                                                <small>

                                                    {
                                                        formatDate(
                                                            notification.createdAt
                                                        )
                                                    }

                                                </small>


                                            </div>



                                            {/* ==========================
                                                MARK READ
                                            ========================== */}

                                            {
                                                !notification.isRead
                                                && (

                                                    <button
                                                        className="customer-mark-read-btn"
                                                        disabled={
                                                            markingId ===
                                                            notification._id
                                                        }
                                                        onClick={() =>
                                                            handleMarkAsRead(
                                                                notification._id
                                                            )
                                                        }
                                                    >

                                                        {
                                                            markingId ===
                                                            notification._id
                                                            ?
                                                            "..."
                                                            :
                                                            "Mark as Read"
                                                        }

                                                    </button>

                                                )
                                            }


                                        </div>

                                    )
                                )
                            }



                            {/* ==========================
                                EMPTY
                            ========================== */}

                            {
                                notifications.length === 0
                                && (

                                    <div className="customer-no-notifications">


                                        <h3>
                                            No notifications yet
                                        </h3>


                                        <p>
                                            Order updates and new message notifications will appear here.
                                        </p>


                                    </div>

                                )
                            }


                        </div>

                    )
                }


            </main>


        </div>

    );

};


export default CustomerNotifications;