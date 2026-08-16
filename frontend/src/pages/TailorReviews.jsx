import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import api from "../api/axios";

import useLogout from "../hooks/useLogout";
import useNotifications from "../hooks/useNotifications";
import useMessages from "../hooks/useMessages";

import "./TailorReviews.css";


const TailorReviews = () => {

    const navigate = useNavigate();

    const handleLogout = useLogout();


    const user = useSelector(
        (state) => state.auth.user
    );


    // ==========================
    // NOTIFICATIONS
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
    // STATE
    // ==========================

    const [reviews, setReviews] = useState([]);

    const [averageRating, setAverageRating] =
        useState(0);

    const [totalReviews, setTotalReviews] =
        useState(0);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // ==========================
    // LOAD REVIEWS
    // ==========================

    useEffect(() => {

        const loadReviews = async () => {

            try {

                setLoading(true);

                setError("");


                if(!user?.id){

                    setError(
                        "Tailor information not found"
                    );

                    return;

                }


                const response =
                    await api.get(
                        `/reviews/tailor/${user.id}`
                    );


                setReviews(
                    response.data.reviews || []
                );


                setAverageRating(
                    Number(
                        response.data.averageRating || 0
                    )
                );


                setTotalReviews(
                    Number(
                        response.data.totalReviews || 0
                    )
                );

            }
            catch(error){

                console.log(error);


                setError(
                    error.response?.data?.message ||
                    "Failed to load reviews"
                );

            }
            finally{

                setLoading(false);

            }

        };


        loadReviews();


    }, [user?.id]);


    // ==========================
    // STAR DISPLAY
    // ==========================

    const renderStars = (rating) => {

        const numericRating =
            Number(rating || 0);


        return (

            <div className="tailor-review-stars">

                {
                    [1,2,3,4,5].map(
                        (star) => (

                            <span
                                key={star}
                                className={
                                    star <= numericRating
                                    ?
                                    "filled"
                                    :
                                    ""
                                }
                            >
                                ★
                            </span>

                        )
                    )
                }

            </div>

        );

    };


    // ==========================
    // DATE FORMAT
    // ==========================

    const formatDate = (date) => {

        if(!date){

            return "-";

        }


        return new Date(date)
        .toLocaleDateString(
            "en-GB",
            {
                day:"2-digit",
                month:"short",
                year:"numeric"
            }
        );

    };


    return (

        <div className="tailor-reviews-page">


            {/* ==========================
                SIDEBAR
            ========================== */}

            <aside className="tailor-reviews-sidebar">


                <div className="tailor-reviews-logo">

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
                            navigate(
                                "/tailor/home-measurements"
                            )
                        }
                    >
                        Home Measurement
                    </button>


                    {/* ==========================
                        MESSAGES
                    ========================== */}

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
                        className="active"
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


                <div className="tailor-reviews-sidebar-bottom">

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

            <main className="tailor-reviews-main">


                {/* HEADER */}

                <div className="tailor-reviews-header">

                    <div>

                        <h1>
                            Customer Reviews
                        </h1>

                        <p>
                            See ratings and feedback from your customers
                        </p>

                    </div>


                    <div className="tailor-reviews-count">

                        {totalReviews} Reviews

                    </div>

                </div>



                {/* ==========================
                    ERROR
                ========================== */}

                {
                    error && (

                        <div className="tailor-reviews-error">

                            {error}

                        </div>

                    )
                }



                {/* ==========================
                    LOADING
                ========================== */}

                {
                    loading && (

                        <div className="tailor-reviews-state">

                            Loading reviews...

                        </div>

                    )
                }



                {
                    !loading &&
                    !error &&
                    (

                        <>


                            {/* ==========================
                                SUMMARY
                            ========================== */}

                            <div className="tailor-review-summary">


                                <div className="tailor-review-summary-card">

                                    <span>
                                        Average Rating
                                    </span>


                                    <div className="tailor-average-rating">

                                        <strong>

                                            {
                                                averageRating.toFixed(1)
                                            }

                                        </strong>

                                        <span>
                                            / 5
                                        </span>

                                    </div>


                                    {
                                        renderStars(
                                            Math.round(
                                                averageRating
                                            )
                                        )
                                    }

                                </div>



                                <div className="tailor-review-summary-card">

                                    <span>
                                        Total Reviews
                                    </span>


                                    <strong className="tailor-total-review-number">

                                        {totalReviews}

                                    </strong>


                                    <p>
                                        Customer feedback received
                                    </p>

                                </div>


                            </div>



                            {/* ==========================
                                REVIEW LIST
                            ========================== */}

                            <div className="tailor-review-list">


                                {
                                    reviews.map(
                                        (review) => (

                                            <article
                                                className="tailor-review-card"
                                                key={review._id}
                                            >


                                                <div className="tailor-review-card-top">


                                                    <div className="tailor-review-customer">


                                                        {
                                                            review.customer?.profileImage
                                                            ? (

                                                                <img
                                                                    src={
                                                                        review.customer.profileImage
                                                                    }
                                                                    alt={
                                                                        review.customer?.name ||
                                                                        "Customer"
                                                                    }
                                                                    className="tailor-review-avatar-image"
                                                                />

                                                            )
                                                            : (

                                                                <div className="tailor-review-avatar">

                                                                    {
                                                                        review.customer?.name
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
                                                                    review.customer?.name ||
                                                                    "Customer"
                                                                }

                                                            </strong>


                                                            <span>

                                                                {
                                                                    formatDate(
                                                                        review.createdAt
                                                                    )
                                                                }

                                                            </span>

                                                        </div>


                                                    </div>



                                                    <div className="tailor-review-rating-area">


                                                        {
                                                            renderStars(
                                                                review.rating
                                                            )
                                                        }


                                                        <strong>

                                                            {
                                                                Number(
                                                                    review.rating
                                                                ).toFixed(1)
                                                            }

                                                        </strong>


                                                    </div>


                                                </div>

                                                {/* ==========================
                                                    REVIEW ORDER / GIG INFO
                                                ========================== */}

                                                <div className="tailor-review-order-info">

                                                    <div>

                                                        <span>
                                                            Gig
                                                        </span>

                                                        <strong>

                                                            {
                                                                review.order?.gig?.title ||
                                                                "Unknown Gig"
                                                            }

                                                        </strong>

                                                    </div>


                                                    <div>

                                                        <span>
                                                            Order
                                                        </span>

                                                        <strong>

                                                            #{
                                                                review.order?._id
                                                                ?.slice(-6)
                                                                ?.toUpperCase()
                                                                ||
                                                                "-"
                                                            }

                                                        </strong>

                                                    </div>


                                                    <div>

                                                        <span>
                                                            Order Price
                                                        </span>

                                                        <strong>

                                                            ৳{
                                                                review.order?.price ||
                                                                "-"
                                                            }

                                                        </strong>

                                                    </div>

                                                </div>


                                                <div className="tailor-review-comment">

                                                    <p>

                                                        {
                                                            review.comment
                                                        }

                                                    </p>

                                                </div>


                                            </article>

                                        )
                                    )
                                }



                                {
                                    reviews.length === 0
                                    && (

                                        <div className="tailor-no-reviews">

                                            <h3>
                                                No reviews yet
                                            </h3>

                                            <p>
                                                Customer reviews will appear here after completed and paid orders are reviewed.
                                            </p>

                                        </div>

                                    )
                                }


                            </div>


                        </>

                    )
                }


            </main>


        </div>

    );

};


export default TailorReviews;