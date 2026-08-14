import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";
import useLogout from "../hooks/useLogout";
import useNotifications from "../hooks/useNotifications";
import useMessages from "../hooks/useMessages";

import "./CustomerHomeMeasurements.css";


const CustomerHomeMeasurements = () => {

    const navigate = useNavigate();

    const handleLogout = useLogout();


    const {
        unreadCount: notificationUnreadCount
    } = useNotifications();

    const {
        unreadCount: messageUnreadCount
    } = useMessages();

    // ==========================
    // STATE
    // ==========================

    const [requests, setRequests] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [cancelLoading, setCancelLoading] =
        useState("");


    // ==========================
    // LOAD REQUESTS
    // ==========================

    const loadRequests = async () => {

        try {

            setLoading(true);

            setError("");


            const response =
                await api.get(
                    "/home-measurements/customer"
                );


            setRequests(
                response.data.requests || []
            );

        }
        catch(error){

            console.log(error);


            setError(
                error.response?.data?.message ||
                "Failed to load home measurement requests"
            );

        }
        finally{

            setLoading(false);

        }

    };


    useEffect(() => {

        loadRequests();

    }, []);


    // ==========================
    // CANCEL REQUEST
    // ==========================

    const handleCancelRequest = async (
        requestId
    ) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to cancel this request?"
            );


        if(!confirmed){

            return;

        }


        try {

            setCancelLoading(
                requestId
            );


            const response =
                await api.put(
                    `/home-measurements/${requestId}/cancel`
                );


            setRequests(
                previous =>

                    previous.map(
                        request =>

                            request._id === requestId
                            ? {
                                ...request,
                                ...response.data.request
                            }
                            : request

                    )
            );


            alert(
                response.data.message ||
                "Request cancelled successfully"
            );

        }
        catch(error){

            alert(
                error.response?.data?.message ||
                "Failed to cancel request"
            );

        }
        finally{

            setCancelLoading("");

        }

    };


    // ==========================
    // FORMAT ADDRESS
    // ==========================

    const formatAddress = (address) => {

        if(!address){

            return "-";

        }


        return [

            address.house,
            address.street,
            address.area,
            address.district,
            address.division,
            address.postalCode

        ]
        .filter(Boolean)
        .join(", ");

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
        ).toLocaleDateString(
            "en-GB",
            {
                day:"2-digit",
                month:"short",
                year:"numeric"
            }
        );

    };


    return (

        <div className="customer-home-list-page">


            {/* ==========================
                SIDEBAR
            ========================== */}

            <aside className="customer-home-list-sidebar">


                <div className="customer-home-list-logo">

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
                        className="active"
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
                            navigate(
                                "/customer/notifications"
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
                            navigate("/customer/profile")
                        }
                    >
                        My Profile
                    </button>


                </nav>


                <div className="customer-home-list-sidebar-bottom">

                    <button onClick={handleLogout}>
                        Logout
                    </button>

                </div>


            </aside>



            {/* ==========================
                MAIN
            ========================== */}

            <main className="customer-home-list-main">


                <div className="customer-home-list-header">


                    <div>

                        <h1>
                            Home Measurement
                        </h1>

                        <p>
                            Track your home measurement requests
                        </p>

                    </div>


                    <div className="customer-home-list-count">

                        {requests.length} Requests

                    </div>


                </div>



                {/* ERROR */}

                {
                    error && (

                        <div className="customer-home-list-error">

                            {error}

                        </div>

                    )
                }


                {/* LOADING */}

                {
                    loading && (

                        <div className="customer-home-list-state">

                            Loading requests...

                        </div>

                    )
                }


                {/* REQUEST LIST */}

                {
                    !loading &&
                    !error &&
                    (

                        <div className="customer-home-request-list">


                            {
                                requests.map(
                                    request => (

                                        <article
                                            className="customer-home-request-card"
                                            key={request._id}
                                        >


                                            <div className="customer-home-request-top">


                                                <div className="customer-home-request-tailor">


                                                    {
                                                        request.tailor
                                                            ?.profileImage
                                                        ? (

                                                            <img
                                                                src={
                                                                    request.tailor
                                                                        .profileImage
                                                                }
                                                                alt={
                                                                    request.tailor
                                                                        ?.name ||
                                                                    "Tailor"
                                                                }
                                                            />

                                                        )
                                                        : (

                                                            <div className="customer-home-request-avatar">

                                                                {
                                                                    request.tailor
                                                                        ?.name
                                                                        ?.charAt(0)
                                                                        ?.toUpperCase()
                                                                    ||
                                                                    "T"
                                                                }

                                                            </div>

                                                        )
                                                    }


                                                    <div>

                                                        <strong>

                                                            {
                                                                request.tailor
                                                                    ?.name ||
                                                                "Tailor"
                                                            }

                                                        </strong>


                                                        <span>

                                                            {
                                                                request.tailor
                                                                    ?.email ||
                                                                "-"
                                                            }

                                                        </span>


                                                        <span>

                                                            {
                                                                request.tailor
                                                                    ?.phone ||
                                                                "-"
                                                            }

                                                        </span>

                                                    </div>


                                                </div>


                                                <span
                                                    className={
                                                        `customer-home-request-status ${request.status}`
                                                    }
                                                >
                                                    {request.status}
                                                </span>


                                            </div>



                                            <div className="customer-home-request-info-grid">


                                                <div>

                                                    <span>
                                                        Preferred Date
                                                    </span>

                                                    <strong>

                                                        {
                                                            formatDate(
                                                                request.preferredDate
                                                            )
                                                        }

                                                    </strong>

                                                </div>


                                                <div>

                                                    <span>
                                                        Preferred Time
                                                    </span>

                                                    <strong>

                                                        {
                                                            request.preferredTime ||
                                                            "-"
                                                        }

                                                    </strong>

                                                </div>


                                                <div>

                                                    <span>
                                                        Address
                                                    </span>

                                                    <strong>

                                                        {
                                                            formatAddress(
                                                                request.address
                                                            )
                                                        }

                                                    </strong>

                                                </div>


                                            </div>



                                            {
                                                request.note
                                                && (

                                                    <div className="customer-home-request-note">

                                                        <span>
                                                            Your Note
                                                        </span>

                                                        <p>
                                                            {request.note}
                                                        </p>

                                                    </div>

                                                )
                                            }



                                            <div className="customer-home-request-actions">


                                                {
                                                    request.status === "pending"
                                                    && (

                                                        <button
                                                            className="customer-home-cancel-btn"
                                                            disabled={
                                                                cancelLoading ===
                                                                request._id
                                                            }
                                                            onClick={() =>
                                                                handleCancelRequest(
                                                                    request._id
                                                                )
                                                            }
                                                        >

                                                            {
                                                                cancelLoading ===
                                                                request._id
                                                                ?
                                                                "Cancelling..."
                                                                :
                                                                "Cancel Request"
                                                            }

                                                        </button>

                                                    )
                                                }


                                                {
                                                    request.status === "accepted"
                                                    && (

                                                        <span className="customer-home-accepted-message">

                                                            Tailor accepted your request

                                                        </span>

                                                    )
                                                }


                                                {
                                                    request.status === "completed"
                                                    && (

                                                        <span className="customer-home-completed-message">

                                                            Measurement visit completed

                                                        </span>

                                                    )
                                                }


                                                {
                                                    request.status === "rejected"
                                                    && (

                                                        <span className="customer-home-rejected-message">

                                                            Request rejected

                                                        </span>

                                                    )
                                                }


                                                {
                                                    request.status === "cancelled"
                                                    && (

                                                        <span className="customer-home-cancelled-message">

                                                            Request cancelled

                                                        </span>

                                                    )
                                                }


                                            </div>


                                        </article>

                                    )
                                )
                            }



                            {
                                requests.length === 0
                                && (

                                    <div className="customer-home-list-empty">


                                        <h3>
                                            No home measurement requests
                                        </h3>


                                        <p>
                                            Choose an available tailor and request a home measurement visit.
                                        </p>


                                        <button
                                            onClick={() =>
                                                navigate(
                                                    "/customer/tailors"
                                                )
                                            }
                                        >
                                            Browse Tailors
                                        </button>


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


export default CustomerHomeMeasurements;