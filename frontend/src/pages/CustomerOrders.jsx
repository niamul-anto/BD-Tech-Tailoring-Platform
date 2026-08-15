import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";
import useLogout from "../hooks/useLogout";
import useNotifications from "../hooks/useNotifications";
import useMessages from "../hooks/useMessages";

import "./CustomerOrders.css";


const CustomerOrders = () => {

    const navigate = useNavigate();

    const handleLogout = useLogout();


    // ==========================
    // GLOBAL NOTIFICATIONS
    // ==========================

    const {
        unreadCount: notificationUnreadCount
    } = useNotifications();

    const {
        unreadCount: messageUnreadCount
    } = useMessages();


    const [orders, setOrders] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [cancelLoading, setCancelLoading] = useState("");

    const [paymentLoading, setPaymentLoading] = useState("");


    // ==========================
    // REVIEW STATE
    // ==========================

    const [reviewOrderId, setReviewOrderId] =
        useState("");

    const [reviewLoading, setReviewLoading] =
        useState("");

    const [reviewedOrders, setReviewedOrders] =
        useState([]);


    const [reviewForm, setReviewForm] = useState({

        rating:"",
        comment:""

    });



    // ==========================
    // LOAD ORDERS
    // ==========================

    const loadOrders = async () => {

        try {

            setLoading(true);

            setError("");


            const response = await api.get(
                "/orders/my-orders"
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
    // CANCEL ORDER
    // ==========================

    const handleCancelOrder = async (orderId) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to cancel this order?"
            );


        if(!confirmed){

            return;

        }


        try {

            setCancelLoading(orderId);


            const response = await api.put(
                `/orders/${orderId}/cancel`
            );


            setOrders(
                (previous) =>

                    previous.map(
                        (order) =>

                            order._id === orderId
                            ?
                            response.data.order
                            :
                            order

                    )
            );


            alert(
                response.data.message ||
                "Order cancelled successfully"
            );

        }
        catch(error){

            alert(
                error.response?.data?.message ||
                "Failed to cancel order"
            );

        }
        finally{

            setCancelLoading("");

        }

    };


    // ==========================
    // PAYMENT
    // ==========================

    const handlePayment = async (orderId) => {

        console.log(
            "Payment requested for order:",
            orderId
        );

        alert(
            "Payment gateway coming soon."
        );

    };



    // ==========================
    // OPEN REVIEW FORM
    // ==========================

    const handleOpenReview = (orderId) => {

        setReviewOrderId(orderId);


        setReviewForm({

            rating:"",
            comment:""

        });

    };



    // ==========================
    // CLOSE REVIEW FORM
    // ==========================

    const handleCloseReview = () => {

        setReviewOrderId("");


        setReviewForm({

            rating:"",
            comment:""

        });

    };



    // ==========================
    // REVIEW FORM CHANGE
    // ==========================

    const handleReviewChange = (e) => {

        setReviewForm({

            ...reviewForm,

            [e.target.name]:
                e.target.value

        });

    };



    // ==========================
    // SUBMIT REVIEW
    // ==========================

    const handleSubmitReview = async (
        e,
        orderId
    ) => {

        e.preventDefault();


        if(
            !reviewForm.rating ||
            !reviewForm.comment.trim()
        ){

            alert(
                "Please provide rating and comment"
            );

            return;

        }


        try {

            setReviewLoading(orderId);


            const response = await api.post(
                "/reviews",
                {

                    orderId,

                    rating:
                        Number(reviewForm.rating),

                    comment:
                        reviewForm.comment.trim()

                }
            );


            setReviewedOrders(
                (previous) => [

                    ...previous,

                    orderId

                ]
            );


            setReviewOrderId("");


            setReviewForm({

                rating:"",
                comment:""

            });


            alert(
                response.data.message ||
                "Review added successfully"
            );

        }
        catch(error){

            const message =
                error.response?.data?.message ||
                "Failed to submit review";


            if(
                message ===
                "You already reviewed this order"
            ){

                setReviewedOrders(
                    (previous) => [

                        ...previous,

                        orderId

                    ]
                );


                setReviewOrderId("");

            }


            alert(message);

        }
        finally{

            setReviewLoading("");

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
        ).toLocaleString();

    };



    // ==========================
    // STATUS CLASS
    // ==========================

    const getStatusClass = (status) => {

        return (
            `customer-order-status ${status || "pending"}`
        );

    };



    // ==========================
    // PAYMENT CLASS
    // ==========================

    const getPaymentClass = (status) => {

        return (
            status === "paid"
            ?
            "customer-payment-status paid"
            :
            "customer-payment-status unpaid"
        );

    };



    // ==========================
    // MEASUREMENT ENTRIES
    // ==========================

    const getMeasurementEntries = (measurement) => {

        if(!measurement){

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



    return (

        <div className="customer-orders-page">


            {/* ==========================
                SIDEBAR
            ========================== */}

            <aside className="customer-orders-sidebar">


                <div className="customer-orders-logo">

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
                        className="active"
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



                <div className="customer-orders-sidebar-bottom">

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

            <main className="customer-orders-main">


                <div className="customer-orders-header">


                    <div>

                        <h1>
                            My Orders
                        </h1>

                        <p>
                            Track your tailoring orders and payment status
                        </p>

                    </div>


                    <div className="customer-orders-count">

                        {orders.length} Orders

                    </div>


                </div>



                {error && (

                    <div className="customer-orders-error">

                        {error}

                    </div>

                )}



                {loading && (

                    <div className="customer-orders-state">

                        Loading orders...

                    </div>

                )}



                {!loading && !error && (

                    <div className="customer-orders-list">


                        {
                            orders.map(
                                (order) => {

                                    const measurementEntries =
                                        getMeasurementEntries(
                                            order.measurement
                                        );


                                    const isReviewed =
                                        reviewedOrders.includes(
                                            order._id
                                        );


                                    return (

                                        <article
                                            className="customer-order-card-item"
                                            key={order._id}
                                        >


                                            {/* TOP */}

                                            <div className="customer-order-card-header">


                                                <div>

                                                    <span className="customer-order-id">

                                                        Order #
                                                        {
                                                            order._id
                                                                ?.slice(-6)
                                                                ?.toUpperCase()
                                                        }

                                                    </span>


                                                    <h2>

                                                        {
                                                            order.gig?.title ||
                                                            "Tailoring Order"
                                                        }

                                                    </h2>


                                                    <p>

                                                        Ordered on{" "}
                                                        {
                                                            formatDate(
                                                                order.createdAt
                                                            )
                                                        }

                                                    </p>

                                                </div>



                                                <div className="customer-order-status-area">


                                                    <span
                                                        className={
                                                            getStatusClass(
                                                                order.status
                                                            )
                                                        }
                                                    >

                                                        {
                                                            order.status
                                                        }

                                                    </span>


                                                    <span
                                                        className={
                                                            getPaymentClass(
                                                                order.paymentStatus
                                                            )
                                                        }
                                                    >

                                                        {
                                                            order.paymentStatus
                                                        }

                                                    </span>


                                                </div>


                                            </div>





                                            {/* SUMMARY */}

                                            <div className="customer-order-summary-grid">


                                                <div>

                                                    <span>
                                                        Tailor
                                                    </span>

                                                    <strong>

                                                        {
                                                            order.tailor?.name ||
                                                            "Tailor"
                                                        }

                                                    </strong>

                                                    <small>

                                                        {
                                                            order.tailor?.email ||
                                                            ""
                                                        }

                                                    </small>

                                                </div>


                                                <div>

                                                    <span>
                                                        Price
                                                    </span>

                                                    <strong className="customer-order-price">

                                                        ৳{order.price}

                                                    </strong>

                                                </div>


                                                <div>

                                                    <span>
                                                        Current Status
                                                    </span>

                                                    <strong className="customer-capitalize">

                                                        {
                                                            order.status
                                                        }

                                                    </strong>

                                                </div>


                                                <div>

                                                    <span>
                                                        Payment
                                                    </span>

                                                    <strong className="customer-capitalize">

                                                        {
                                                            order.paymentStatus
                                                        }

                                                    </strong>

                                                </div>


                                            </div>





                                            {/* ADDRESS */}

                                            <div className="customer-order-detail-section">


                                                <h3>
                                                    Delivery Address
                                                </h3>


                                                <p>

                                                    {
                                                        formatAddress(
                                                            order.deliveryAddress
                                                        )
                                                    }

                                                </p>


                                            </div>





                                            {/* MEASUREMENT */}

                                            <div className="customer-order-detail-section">


                                                <h3>
                                                    Measurement
                                                </h3>


                                                {
                                                    measurementEntries.length > 0
                                                    ? (

                                                        <div className="customer-order-measurement-grid">


                                                            {
                                                                measurementEntries.map(
                                                                    (
                                                                        [key,value]
                                                                    ) => (

                                                                        <div
                                                                            key={key}
                                                                        >

                                                                            <span>

                                                                                {
                                                                                    key
                                                                                        .charAt(0)
                                                                                        .toUpperCase()
                                                                                    +
                                                                                    key.slice(1)
                                                                                }

                                                                            </span>

                                                                            <strong>
                                                                                {value}
                                                                            </strong>

                                                                        </div>

                                                                    )
                                                                )
                                                            }


                                                        </div>

                                                    )
                                                    : (

                                                        <p className="customer-order-empty-value">

                                                            No measurement provided

                                                        </p>

                                                    )
                                                }


                                            </div>





                                            {/* STATUS HISTORY */}

                                            <div className="customer-order-detail-section">


                                                <h3>
                                                    Order Progress
                                                </h3>


                                                <div className="customer-order-history">


                                                    {
                                                        order.statusHistory?.map(
                                                            (
                                                                history,
                                                                index
                                                            ) => (

                                                                <div
                                                                    className="customer-order-history-item"
                                                                    key={
                                                                        history._id ||
                                                                        index
                                                                    }
                                                                >


                                                                    <div className="customer-history-dot"></div>


                                                                    <div>

                                                                        <strong className="customer-capitalize">

                                                                            {
                                                                                history.status
                                                                            }

                                                                        </strong>


                                                                        <span>

                                                                            {
                                                                                formatDate(
                                                                                    history.changedAt
                                                                                )
                                                                            }

                                                                        </span>

                                                                    </div>


                                                                </div>

                                                            )
                                                        )
                                                    }


                                                </div>


                                            </div>





                                            {/* ==========================
                                                REVIEW FORM
                                            ========================== */}

                                            {
                                                reviewOrderId === order._id
                                                && (

                                                    <form
                                                        className="customer-review-form"
                                                        onSubmit={(e) =>
                                                            handleSubmitReview(
                                                                e,
                                                                order._id
                                                            )
                                                        }
                                                    >


                                                        <h3>
                                                            Give a Review
                                                        </h3>


                                                        <div className="customer-review-field">

                                                            <label>
                                                                Rating
                                                            </label>


                                                            <select
                                                                name="rating"
                                                                value={reviewForm.rating}
                                                                onChange={handleReviewChange}
                                                                required
                                                            >

                                                                <option value="">
                                                                    Select rating
                                                                </option>

                                                                <option value="5">
                                                                    5 - Excellent
                                                                </option>

                                                                <option value="4">
                                                                    4 - Very Good
                                                                </option>

                                                                <option value="3">
                                                                    3 - Good
                                                                </option>

                                                                <option value="2">
                                                                    2 - Fair
                                                                </option>

                                                                <option value="1">
                                                                    1 - Poor
                                                                </option>

                                                            </select>

                                                        </div>



                                                        <div className="customer-review-field">

                                                            <label>
                                                                Comment
                                                            </label>


                                                            <textarea
                                                                name="comment"
                                                                value={reviewForm.comment}
                                                                onChange={handleReviewChange}
                                                                rows="4"
                                                                placeholder="Share your experience with this tailor..."
                                                                required
                                                            />

                                                        </div>



                                                        <div className="customer-review-actions">


                                                            <button
                                                                type="button"
                                                                className="customer-review-cancel-btn"
                                                                onClick={handleCloseReview}
                                                                disabled={
                                                                    reviewLoading ===
                                                                    order._id
                                                                }
                                                            >
                                                                Cancel
                                                            </button>


                                                            <button
                                                                type="submit"
                                                                className="customer-review-submit-btn"
                                                                disabled={
                                                                    reviewLoading ===
                                                                    order._id
                                                                }
                                                            >

                                                                {
                                                                    reviewLoading ===
                                                                    order._id
                                                                    ?
                                                                    "Submitting..."
                                                                    :
                                                                    "Submit Review"
                                                                }

                                                            </button>


                                                        </div>


                                                    </form>

                                                )
                                            }





                                            {/* ACTIONS */}

                                            <div className="customer-order-actions">


                                                {
                                                    order.status === "pending"
                                                    && (

                                                        <button
                                                            className="customer-cancel-order-btn"
                                                            disabled={
                                                                cancelLoading ===
                                                                order._id
                                                            }
                                                            onClick={() =>
                                                                handleCancelOrder(
                                                                    order._id
                                                                )
                                                            }
                                                        >

                                                            {
                                                                cancelLoading ===
                                                                order._id
                                                                ?
                                                                "Cancelling..."
                                                                :
                                                                "Cancel Order"
                                                            }

                                                        </button>

                                                    )
                                                }



                                                {
                                                    order.status === "completed" &&
                                                    order.paymentStatus === "unpaid"
                                                    && (

                                                        <button
                                                            className="customer-pay-order-btn"
                                                            disabled={
                                                                paymentLoading ===
                                                                order._id
                                                            }
                                                            onClick={() =>
                                                                handlePayment(
                                                                    order._id
                                                                )
                                                            }
                                                        >

                                                            {
                                                                paymentLoading ===
                                                                order._id
                                                                ?
                                                                "Processing..."
                                                                :
                                                                `Pay ৳${order.price}`
                                                            }

                                                        </button>

                                                    )
                                                }



                                                {
                                                    order.paymentStatus === "paid"
                                                    && (

                                                        <div className="customer-order-paid-message">

                                                            Payment Completed

                                                        </div>

                                                    )
                                                }



                                                {
                                                    order.status === "completed" &&
                                                    order.paymentStatus === "paid" &&
                                                    !isReviewed &&
                                                    reviewOrderId !== order._id
                                                    && (

                                                        <button
                                                            type="button"
                                                            className="customer-review-order-btn"
                                                            onClick={() =>
                                                                handleOpenReview(
                                                                    order._id
                                                                )
                                                            }
                                                        >
                                                            Give Review
                                                        </button>

                                                    )
                                                }



                                                {
                                                    isReviewed
                                                    && (

                                                        <div className="customer-order-reviewed-message">

                                                            Reviewed

                                                        </div>

                                                    )
                                                }


                                            </div>


                                        </article>

                                    );

                                }
                            )
                        }



                        {
                            orders.length === 0
                            && (

                                <div className="customer-no-orders">


                                    <h3>
                                        No orders yet
                                    </h3>


                                    <p>
                                        Browse available tailoring gigs and place your first order.
                                    </p>


                                    <button
                                        onClick={() =>
                                            navigate("/customer/gigs")
                                        }
                                    >
                                        Browse Gigs
                                    </button>


                                </div>

                            )
                        }


                    </div>

                )}


            </main>


        </div>

    );

};


export default CustomerOrders;