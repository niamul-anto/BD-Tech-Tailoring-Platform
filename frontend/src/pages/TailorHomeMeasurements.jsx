import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";
import useLogout from "../hooks/useLogout";
import useNotifications from "../hooks/useNotifications";
import useMessages from "../hooks/useMessages";

import "./TailorHomeMeasurements.css";


const TailorHomeMeasurements = () => {

    const navigate = useNavigate();

    const handleLogout = useLogout();


    const {
        unreadCount: notificationUnreadCount
    } = useNotifications();

    // ==========================
    // GLOBAL MESSAGES
    // ==========================

    const {
        unreadCount: messageUnreadCount
    } = useMessages();

    const [requests, setRequests] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [statusLoading, setStatusLoading] =
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
                    "/home-measurements/tailor"
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
    // UPDATE STATUS
    // ==========================

    const updateStatus = async (
        requestId,
        status
    ) => {

        try {

            setStatusLoading(
                requestId
            );


            const response =
                await api.put(
                    `/home-measurements/${requestId}/status`,
                    {
                        status
                    }
                );


            setRequests(
                previous =>

                    previous.map(
                        request =>

                            request._id ===
                            requestId

                            ? {
                                ...request,
                                ...response.data.request
                            }

                            : request

                    )
            );


            alert(
                response.data.message ||
                "Request updated"
            );

        }
        catch(error){

            alert(
                error.response?.data?.message ||
                "Failed to update request"
            );

        }
        finally{

            setStatusLoading("");

        }

    };



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


    const formatDate = date => {

        if(!date){

            return "-";

        }


        return new Date(
            date
        ).toLocaleDateString();

    };


    return (

        <div className="tailor-home-page">


            <aside className="tailor-home-sidebar">


                <div className="tailor-home-logo">

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
                        className="active"
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


                </nav>


                <div className="tailor-home-sidebar-bottom">

                    <button onClick={handleLogout}>
                        Logout
                    </button>

                </div>


            </aside>



            <main className="tailor-home-main">


                <div className="tailor-home-header">

                    <div>

                        <h1>
                            Home Measurement Requests
                        </h1>

                        <p>
                            Manage customer home measurement visits
                        </p>

                    </div>


                    <div className="tailor-home-count">

                        {requests.length} Requests

                    </div>

                </div>



                {error && (

                    <div className="tailor-home-error">

                        {error}

                    </div>

                )}



                {loading && (

                    <div className="tailor-home-state">

                        Loading requests...

                    </div>

                )}



                {!loading && !error && (

                    <div className="tailor-home-list">


                        {
                            requests.map(
                                request => (

                                    <article
                                        className="tailor-home-card"
                                        key={request._id}
                                    >


                                        <div className="tailor-home-card-top">


                                            <div className="tailor-home-customer">


                                                {
                                                    request.customer
                                                        ?.profileImage
                                                    ? (

                                                        <img
                                                            src={
                                                                request.customer
                                                                    .profileImage
                                                            }
                                                            alt={
                                                                request.customer
                                                                    ?.name
                                                            }
                                                        />

                                                    )
                                                    : (

                                                        <div className="tailor-home-avatar">

                                                            {
                                                                request.customer
                                                                    ?.name
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
                                                            request.customer
                                                                ?.name ||
                                                            "Customer"
                                                        }
                                                    </strong>

                                                    <span>
                                                        {
                                                            request.customer
                                                                ?.phone ||
                                                            "-"
                                                        }
                                                    </span>

                                                    <span>
                                                        {
                                                            request.customer
                                                                ?.email ||
                                                            "-"
                                                        }
                                                    </span>

                                                </div>


                                            </div>


                                            <span
                                                className={
                                                    `tailor-home-status ${request.status}`
                                                }
                                            >
                                                {request.status}
                                            </span>


                                        </div>



                                        <div className="tailor-home-info-grid">


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
                                                        request.preferredTime
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

                                                <div className="tailor-home-note">

                                                    <span>
                                                        Customer Note
                                                    </span>

                                                    <p>
                                                        {request.note}
                                                    </p>

                                                </div>

                                            )
                                        }



                                        <div className="tailor-home-actions">


                                            {
                                                request.status ===
                                                "pending"
                                                && (

                                                    <>

                                                        <button
                                                            className="accept"
                                                            disabled={
                                                                statusLoading ===
                                                                request._id
                                                            }
                                                            onClick={() =>
                                                                updateStatus(
                                                                    request._id,
                                                                    "accepted"
                                                                )
                                                            }
                                                        >
                                                            Accept
                                                        </button>


                                                        <button
                                                            className="reject"
                                                            disabled={
                                                                statusLoading ===
                                                                request._id
                                                            }
                                                            onClick={() =>
                                                                updateStatus(
                                                                    request._id,
                                                                    "rejected"
                                                                )
                                                            }
                                                        >
                                                            Reject
                                                        </button>

                                                    </>

                                                )
                                            }


                                            {
                                                request.status ===
                                                "accepted"
                                                && (

                                                    <button
                                                        className="complete"
                                                        disabled={
                                                            statusLoading ===
                                                            request._id
                                                        }
                                                        onClick={() =>
                                                            updateStatus(
                                                                request._id,
                                                                "completed"
                                                            )
                                                        }
                                                    >
                                                        Mark Visit Completed
                                                    </button>

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

                                <div className="tailor-home-empty">

                                    No home measurement requests yet.

                                </div>

                            )
                        }


                    </div>

                )}


            </main>


        </div>

    );

};


export default TailorHomeMeasurements;