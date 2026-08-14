import {
    useState
} from "react";

import { useNavigate } from "react-router-dom";

import useLogout from "../hooks/useLogout";

import useNotifications from "../hooks/useNotifications";

import useMessages from "../hooks/useMessages";

import "./TailorNotifications.css";


const TailorNotifications = () => {

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

    // ==========================
    // GLOBAL MESSAGES
    // ==========================

    const {
        unreadCount: messageUnreadCount
    } = useMessages();

    const [error, setError] =
        useState("");

    const [readLoading, setReadLoading] =
        useState("");



    // ==========================
    // MARK AS READ
    // ==========================

    const handleMarkAsRead = async (
        notificationId
    ) => {

        try {

            setReadLoading(
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

            setReadLoading("");

        }

    };



    // ==========================
    // FORMAT DATE
    // ==========================

    const formatDate = (date) => {

        if(!date){

            return "-";

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


        if(type === "message"){

            return "M";

        }


        if(type === "payment"){

            return "P";

        }


        if(type === "review"){

            return "R";

        }


        return "N";

    };



    return (

        <div className="tailor-notifications-page">


            {/* ==========================
                SIDEBAR
            ========================== */}

            <aside className="tailor-notifications-sidebar">


                <div className="tailor-notifications-logo">

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
                        className="active"
                        onClick={() =>
                            navigate(
                                "/tailor/notifications"
                            )
                        }
                    >

                        Notifications


                        {
                            unreadCount > 0
                            && (

                                <span className="notification-nav-badge">

                                    {unreadCount}

                                </span>

                            )
                        }

                    </button>


                    <button
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

                <div className="tailor-notifications-sidebar-bottom">

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

            <main className="tailor-notifications-main">


                <div className="tailor-notifications-header">


                    <div>

                        <h1>
                            Notifications
                        </h1>

                        <p>
                            Stay updated with orders, messages and platform activity
                        </p>

                    </div>



                    <div className="notification-header-right">


                        {/* ==========================
                            SOCKET STATUS
                        ========================== */}

                        <div
                            className={
                                socketConnected
                                ?
                                "notification-live connected"
                                :
                                "notification-live disconnected"
                            }
                        >

                            {
                                socketConnected
                                ?
                                "Live"
                                :
                                "Connecting..."
                            }

                        </div>



                        {/* ==========================
                            SUMMARY
                        ========================== */}

                        <div className="notification-summary">


                            <div>

                                <span>
                                    Total
                                </span>

                                <strong>
                                    {notifications.length}
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Unread
                                </span>

                                <strong>
                                    {unreadCount}
                                </strong>

                            </div>


                        </div>


                    </div>


                </div>



                {/* ==========================
                    ERROR
                ========================== */}

                {error && (

                    <div className="notifications-error">

                        {error}

                    </div>

                )}



                {/* ==========================
                    LOADING
                ========================== */}

                {loading && (

                    <div className="notifications-state">

                        Loading notifications...

                    </div>

                )}



                {/* ==========================
                    NOTIFICATION LIST
                ========================== */}

                {!loading && !error && (

                    <div className="notifications-list">


                        {
                            notifications.map(
                                (notification) => (

                                    <div
                                        key={notification._id}
                                        className={
                                            notification.isRead
                                            ?
                                            "notification-card read"
                                            :
                                            "notification-card unread"
                                        }
                                    >


                                        {/* ==========================
                                            LEFT
                                        ========================== */}

                                        <div className="notification-card-left">


                                            <div
                                                className={
                                                    `notification-icon ${notification.type || "general"}`
                                                }
                                            >

                                                {
                                                    getNotificationIcon(
                                                        notification.type
                                                    )
                                                }

                                            </div>



                                            <div className="notification-content">


                                                <div className="notification-meta">


                                                    <span
                                                        className={
                                                            `notification-type ${notification.type || "general"}`
                                                        }
                                                    >

                                                        {
                                                            notification.type ||
                                                            "notification"
                                                        }

                                                    </span>


                                                    {
                                                        !notification.isRead
                                                        && (

                                                            <span className="unread-label">

                                                                New

                                                            </span>

                                                        )
                                                    }


                                                </div>



                                                <p>

                                                    {
                                                        notification.message
                                                    }

                                                </p>



                                                <span className="notification-date">

                                                    {
                                                        formatDate(
                                                            notification.createdAt
                                                        )
                                                    }

                                                </span>


                                            </div>


                                        </div>





                                        {/* ==========================
                                            ACTION
                                        ========================== */}

                                        <div className="notification-action">


                                            {
                                                notification.isRead
                                                ? (

                                                    <span className="read-status">

                                                        Read

                                                    </span>

                                                )
                                                : (

                                                    <button
                                                        onClick={() =>
                                                            handleMarkAsRead(
                                                                notification._id
                                                            )
                                                        }
                                                        disabled={
                                                            readLoading ===
                                                            notification._id
                                                        }
                                                    >

                                                        {
                                                            readLoading ===
                                                            notification._id
                                                            ?
                                                            "Updating..."
                                                            :
                                                            "Mark as Read"
                                                        }

                                                    </button>

                                                )
                                            }


                                        </div>


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

                                <div className="notifications-empty">

                                    <h3>
                                        No notifications yet
                                    </h3>

                                    <p>
                                        New order, message and platform notifications will appear here.
                                    </p>

                                </div>

                            )
                        }


                    </div>

                )}


            </main>


        </div>

    );

};


export default TailorNotifications;