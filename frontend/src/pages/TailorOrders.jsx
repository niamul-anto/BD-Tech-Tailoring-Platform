import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";
import useLogout from "../hooks/useLogout";
import useNotifications from "../hooks/useNotifications";
import useMessages from "../hooks/useMessages";

import "./TailorOrders.css";


const TailorOrders = () => {

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



    const [orders, setOrders] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [statusLoading, setStatusLoading] = useState("");



    // ==========================
    // LOAD TAILOR ORDERS
    // ==========================

    const loadOrders = async () => {

        try {

            setLoading(true);

            setError("");


            const response = await api.get(
                "/orders/tailor-orders"
            );


            console.log(
                "TAILOR ORDERS:",
                response.data.orders
            );


            setOrders(
                response.data.orders || []
            );

        }
        catch(error){

            console.log(error);


            setError(
                error.response?.data?.message ||
                "Failed to load orders"
            );

        }
        finally{

            setLoading(false);

        }

    };


    useEffect(() => {

        loadOrders();

    }, []);



    // ==========================
    // UPDATE ORDER STATUS
    // ==========================

    const handleStatusUpdate = async (
        orderId,
        newStatus
    ) => {

        try {

            setStatusLoading(orderId);


            const response = await api.put(
                `/orders/${orderId}/status`,
                {
                    status:newStatus
                }
            );


            setOrders(
                (previous) =>

                    previous.map(
                        (order) =>

                            order._id === orderId
                            ? {

                                ...order,

                                ...response.data.order,

                                customer:
                                    order.customer,

                                gig:
                                    order.gig

                            }
                            : order

                    )

            );


            alert(
                "Order status updated successfully"
            );

        }
        catch(error){

            alert(
                error.response?.data?.message ||
                "Failed to update order status"
            );

        }
        finally{

            setStatusLoading("");

        }

    };



    // ==========================
    // NEXT STATUS
    // ==========================

    const getNextStatus = (status) => {

        if(status === "pending"){

            return "accepted";

        }


        if(status === "accepted"){

            return "processing";

        }


        if(status === "processing"){

            return "completed";

        }


        return null;

    };



    // ==========================
    // BUTTON TEXT
    // ==========================

    const getStatusButtonText = (status) => {

        if(status === "pending"){

            return "Accept Order";

        }


        if(status === "accepted"){

            return "Start Processing";

        }


        if(status === "processing"){

            return "Mark Completed";

        }


        return "";

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
    // FORMAT ADDRESS
    // ==========================

    const formatAddress = (address) => {

        if(!address){

            return "No delivery address";

        }


        const values =
            Object.values(address)
                .filter(
                    (value) =>
                        value &&
                        typeof value !== "object"
                );


        return values.length > 0
            ? values.join(", ")
            : "No delivery address";

    };



    // ==========================
    // GET MEASUREMENT ENTRIES
    // ==========================

    const getMeasurementEntries = (measurement) => {

        if(
            !measurement ||
            typeof measurement !== "object"
        ){

            return [];

        }


        return Object.entries(
            measurement
        ).filter(
            ([, value]) =>

                value !== "" &&
                value !== null &&
                value !== undefined

        );

    };



    // ==========================
    // FORMAT MEASUREMENT LABEL
    // ==========================

    const formatMeasurementLabel = (key) => {

        if(key === "notes"){

            return "Additional Notes";

        }


        if(key === "additionalNotes"){

            return "Additional Notes";

        }


        return key
            .replace(
                /([A-Z])/g,
                " $1"
            )
            .replace(
                /^./,
                (character) =>
                    character.toUpperCase()
            );

    };



    return (

        <div className="tailor-orders-page">


            {/* ==========================
                SIDEBAR
            ========================== */}

            <aside className="tailor-orders-sidebar">


                <div className="tailor-orders-logo">

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
                        className="active"
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



                <div className="tailor-orders-sidebar-bottom">

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

            <main className="tailor-orders-main">


                <div className="tailor-orders-header">


                    <div>

                        <h1>
                            Orders
                        </h1>

                        <p>
                            Manage customer orders and update their progress
                        </p>

                    </div>


                    <div className="tailor-orders-count">

                        {orders.length} Orders

                    </div>


                </div>



                {error && (

                    <div className="tailor-orders-error">

                        {error}

                    </div>

                )}



                {loading && (

                    <div className="tailor-orders-state">

                        Loading orders...

                    </div>

                )}



                {!loading && !error && (

                    <div className="tailor-orders-list">


                        {orders.map((order) => {

                            const nextStatus =
                                getNextStatus(
                                    order.status
                                );


                            const measurementEntries =
                                getMeasurementEntries(
                                    order.measurement
                                );


                            return (

                                <div
                                    className="tailor-order-card"
                                    key={order._id}
                                >


                                    {/* ==========================
                                        ORDER TOP
                                    ========================== */}

                                    <div className="tailor-order-top">


                                        <div>

                                            <span className="tailor-order-id-label">

                                                Order ID

                                            </span>


                                            <strong className="tailor-order-id">

                                                {order._id}

                                            </strong>

                                        </div>



                                        <div className="tailor-order-status-group">


                                            <span
                                                className={
                                                    `tailor-order-status ${order.status}`
                                                }
                                            >

                                                {order.status}

                                            </span>


                                            <span
                                                className={
                                                    order.paymentStatus === "paid"
                                                    ?
                                                    "tailor-payment-status paid"
                                                    :
                                                    "tailor-payment-status unpaid"
                                                }
                                            >

                                                {
                                                    order.paymentStatus === "paid"
                                                    ?
                                                    "Paid"
                                                    :
                                                    "Unpaid"
                                                }

                                            </span>


                                        </div>


                                    </div>





                                    {/* ==========================
                                        INFORMATION
                                    ========================== */}

                                    <div className="tailor-order-info-grid">


                                        <div className="tailor-order-info-box">

                                            <span>
                                                Customer
                                            </span>

                                            <strong>

                                                {
                                                    order.customer?.name ||
                                                    "Unknown Customer"
                                                }

                                            </strong>

                                            <small>

                                                {
                                                    order.customer?.email ||
                                                    "-"
                                                }

                                            </small>

                                            <small>

                                                {
                                                    order.customer?.phone ||
                                                    "-"
                                                }

                                            </small>

                                        </div>



                                        <div className="tailor-order-info-box">

                                            <span>
                                                Gig
                                            </span>

                                            <strong>

                                                {
                                                    order.gig?.title ||
                                                    "Unknown Gig"
                                                }

                                            </strong>

                                            <small>

                                                Gig Price: ৳{
                                                    order.gig?.price ||
                                                    order.price
                                                }

                                            </small>

                                        </div>



                                        <div className="tailor-order-info-box">

                                            <span>
                                                Order Price
                                            </span>

                                            <strong className="tailor-order-price">

                                                ৳{order.price}

                                            </strong>

                                        </div>



                                        <div className="tailor-order-info-box">

                                            <span>
                                                Created
                                            </span>

                                            <strong>

                                                {
                                                    formatDate(
                                                        order.createdAt
                                                    )
                                                }

                                            </strong>

                                        </div>


                                    </div>





                                    {/* ==========================
                                        ADDRESS + MEASUREMENT
                                    ========================== */}

                                    <div className="tailor-order-extra-grid">


                                        <div className="tailor-order-extra-box">

                                            <span>
                                                Delivery Address
                                            </span>

                                            <p>

                                                {
                                                    formatAddress(
                                                        order.deliveryAddress
                                                    )
                                                }

                                            </p>

                                        </div>



                                        {/* ==========================
                                            MEASUREMENT
                                        ========================== */}

                                        <div className="tailor-order-extra-box">

                                            <span>
                                                Measurement
                                            </span>


                                            {
                                                measurementEntries.length > 0
                                                ? (

                                                    <div className="tailor-measurement-grid">


                                                        {
                                                            measurementEntries.map(
                                                                (
                                                                    [key, value]
                                                                ) => (

                                                                    <div
                                                                        className={
                                                                            key === "notes" ||
                                                                            key === "additionalNotes"
                                                                            ?
                                                                            "tailor-measurement-item notes"
                                                                            :
                                                                            "tailor-measurement-item"
                                                                        }
                                                                        key={key}
                                                                    >


                                                                        <span>

                                                                            {
                                                                                formatMeasurementLabel(
                                                                                    key
                                                                                )
                                                                            }

                                                                        </span>


                                                                        <strong>

                                                                            {String(value)}

                                                                        </strong>


                                                                    </div>

                                                                )
                                                            )
                                                        }


                                                    </div>

                                                )
                                                : (

                                                    <p className="tailor-no-measurement">

                                                        No measurement provided

                                                    </p>

                                                )
                                            }


                                        </div>


                                    </div>





                                    {/* ==========================
                                        TRACKING HISTORY
                                    ========================== */}

                                    <div className="tailor-order-tracking">


                                        <h3>
                                            Order Tracking
                                        </h3>


                                        {
                                            order.statusHistory &&
                                            order.statusHistory.length > 0
                                            ? (

                                                <div className="tailor-tracking-list">


                                                    {
                                                        order.statusHistory.map(
                                                            (
                                                                history,
                                                                index
                                                            ) => (

                                                                <div
                                                                    className="tailor-tracking-item"
                                                                    key={
                                                                        history._id ||
                                                                        index
                                                                    }
                                                                >


                                                                    <div className="tailor-tracking-dot">

                                                                    </div>


                                                                    <div>

                                                                        <strong>

                                                                            {
                                                                                history.status
                                                                            }

                                                                        </strong>


                                                                        <span>

                                                                            {
                                                                                formatDate(
                                                                                    history.changedAt ||
                                                                                    history.createdAt
                                                                                )
                                                                            }

                                                                        </span>

                                                                    </div>


                                                                </div>

                                                            )
                                                        )
                                                    }


                                                </div>

                                            )
                                            : (

                                                <p className="tailor-no-history">

                                                    No tracking history available

                                                </p>

                                            )
                                        }


                                    </div>





                                    {/* ==========================
                                        ACTION
                                    ========================== */}

                                    <div className="tailor-order-actions">


                                        {
                                            nextStatus
                                            ? (

                                                <button
                                                    className={
                                                        `tailor-status-action ${nextStatus}`
                                                    }
                                                    disabled={
                                                        statusLoading === order._id
                                                    }
                                                    onClick={() =>
                                                        handleStatusUpdate(
                                                            order._id,
                                                            nextStatus
                                                        )
                                                    }
                                                >

                                                    {
                                                        statusLoading === order._id
                                                        ?
                                                        "Updating..."
                                                        :
                                                        getStatusButtonText(
                                                            order.status
                                                        )
                                                    }

                                                </button>

                                            )
                                            :
                                            order.status === "completed"
                                            ? (

                                                <span className="tailor-order-finished">

                                                    Order Completed

                                                </span>

                                            )
                                            :
                                            order.status === "cancelled"
                                            ? (

                                                <span className="tailor-order-cancelled">

                                                    Order Cancelled

                                                </span>

                                            )
                                            :
                                            null
                                        }


                                    </div>


                                </div>

                            );

                        })}



                        {
                            orders.length === 0
                            && (

                                <div className="tailor-no-orders">

                                    You have not received any orders yet.

                                </div>

                            )
                        }


                    </div>

                )}


            </main>


        </div>

    );

};


export default TailorOrders;