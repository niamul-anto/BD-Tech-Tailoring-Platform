import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";
import useLogout from "../hooks/useLogout";

import "./AdminReviews.css";


const AdminReviews = () => {

    const navigate = useNavigate();

    const handleLogout = useLogout();


    // ==========================
    // STATE
    // ==========================

    const [reviews, setReviews] =
        useState([]);

    const [totalReviews, setTotalReviews] =
        useState(0);

    const [averageRating, setAverageRating] =
        useState(0);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // ==========================
    // LOAD ALL REVIEWS
    // ==========================

    useEffect(() => {

        const loadReviews = async () => {

            try {

                setLoading(true);

                setError("");


                const response =
                    await api.get(
                        "/reviews"
                    );


                setReviews(
                    response.data.reviews || []
                );


                setTotalReviews(
                    Number(
                        response.data.totalReviews || 0
                    )
                );


                setAverageRating(
                    Number(
                        response.data.averageRating || 0
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

    }, []);


    // ==========================
    // FORMAT DATE
    // ==========================

    const formatDate = (date) => {

        if(!date){

            return "-";

        }


        return new Date(date)
        .toLocaleString();

    };


    // ==========================
    // STAR DISPLAY
    // ==========================

    const renderStars = (rating) => {

        const value =
            Number(rating || 0);


        return (

            <div className="admin-review-stars">

                {
                    [1,2,3,4,5].map(
                        (star) => (

                            <span
                                key={star}
                                className={
                                    star <= value
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


    return (

        <div className="admin-reviews-page">


            {/* ==========================
                SIDEBAR
            ========================== */}

            <aside className="admin-reviews-sidebar">


                <div className="admin-reviews-logo">

                    BD Tailoring

                </div>


                <nav>


                    <button
                        onClick={() =>
                            navigate("/admin")
                        }
                    >
                        Dashboard
                    </button>


                    <button
                        onClick={() =>
                            navigate("/admin/users")
                        }
                    >
                        Users
                    </button>


                    <button
                        onClick={() =>
                            navigate("/admin/tailors")
                        }
                    >
                        Tailors
                    </button>


                    <button
                        onClick={() =>
                            navigate("/admin/orders")
                        }
                    >
                        Orders
                    </button>


                    <button
                        onClick={() =>
                            navigate("/admin/gigs")
                        }
                    >
                        Gigs
                    </button>


                    <button
                        className="active"
                        onClick={() =>
                            navigate("/admin/reviews")
                        }
                    >
                        Reviews
                    </button>


                </nav>


                <div className="admin-reviews-sidebar-bottom">

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

            <main className="admin-reviews-main">


                {/* HEADER */}

                <div className="admin-reviews-header">


                    <div>

                        <h1>
                            Reviews
                        </h1>

                        <p>
                            Monitor customer ratings and feedback
                        </p>

                    </div>


                    <div className="admin-reviews-count">

                        {totalReviews} Reviews

                    </div>


                </div>



                {/* ==========================
                    ERROR
                ========================== */}

                {
                    error && (

                        <div className="admin-reviews-error">

                            {error}

                        </div>

                    )
                }



                {/* ==========================
                    LOADING
                ========================== */}

                {
                    loading && (

                        <div className="admin-reviews-state">

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

                            <div className="admin-review-summary-grid">


                                <div className="admin-review-summary-card">

                                    <span>
                                        Total Reviews
                                    </span>


                                    <h2>
                                        {totalReviews}
                                    </h2>


                                    <p>
                                        Reviews submitted by customers
                                    </p>

                                </div>



                                <div className="admin-review-summary-card">

                                    <span>
                                        Average Rating
                                    </span>


                                    <div className="admin-average-rating">

                                        <h2>

                                            {
                                                averageRating
                                                    .toFixed(1)
                                            }

                                        </h2>

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


                            </div>



                            {/* ==========================
                                REVIEWS
                            ========================== */}

                            <div className="admin-reviews-list">


                                {
                                    reviews.map(
                                        (review) => (

                                            <article
                                                className="admin-review-card"
                                                key={review._id}
                                            >


                                                {/* TOP */}

                                                <div className="admin-review-top">


                                                    {/* CUSTOMER */}

                                                    <div className="admin-review-person">


                                                        {
                                                            review.customer
                                                                ?.profileImage
                                                            ? (

                                                                <img
                                                                    src={
                                                                        review.customer
                                                                            .profileImage
                                                                    }
                                                                    alt={
                                                                        review.customer
                                                                            ?.name ||
                                                                        "Customer"
                                                                    }
                                                                />

                                                            )
                                                            : (

                                                                <div className="admin-review-avatar customer">

                                                                    {
                                                                        review.customer
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

                                                            <span>
                                                                Customer
                                                            </span>

                                                            <strong>

                                                                {
                                                                    review.customer
                                                                        ?.name ||
                                                                    "Customer"
                                                                }

                                                            </strong>

                                                            <small>

                                                                {
                                                                    review.customer
                                                                        ?.email ||
                                                                    ""
                                                                }

                                                            </small>

                                                        </div>


                                                    </div>



                                                    <div className="admin-review-arrow">

                                                        →

                                                    </div>



                                                    {/* TAILOR */}

                                                    <div className="admin-review-person">


                                                        {
                                                            review.tailor
                                                                ?.profileImage
                                                            ? (

                                                                <img
                                                                    src={
                                                                        review.tailor
                                                                            .profileImage
                                                                    }
                                                                    alt={
                                                                        review.tailor
                                                                            ?.name ||
                                                                        "Tailor"
                                                                    }
                                                                />

                                                            )
                                                            : (

                                                                <div className="admin-review-avatar tailor">

                                                                    {
                                                                        review.tailor
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

                                                            <span>
                                                                Tailor
                                                            </span>

                                                            <strong>

                                                                {
                                                                    review.tailor
                                                                        ?.name ||
                                                                    "Tailor"
                                                                }

                                                            </strong>

                                                            <small>

                                                                {
                                                                    review.tailor
                                                                        ?.email ||
                                                                    ""
                                                                }

                                                            </small>

                                                        </div>


                                                    </div>



                                                    {/* RATING */}

                                                    <div className="admin-review-rating-area">


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



                                                {/* COMMENT */}

                                                <div className="admin-review-comment">

                                                    <span>
                                                        Customer Feedback
                                                    </span>


                                                    <p>

                                                        {
                                                            review.comment
                                                        }

                                                    </p>

                                                </div>



                                                {/* ORDER INFO */}

                                                <div className="admin-review-meta">


                                                    <div>

                                                        <span>
                                                            Order
                                                        </span>

                                                        <strong>

                                                            #
                                                            {
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
                                                            Order Status
                                                        </span>

                                                        <strong className="admin-review-capitalize">

                                                            {
                                                                review.order?.status ||
                                                                "-"
                                                            }

                                                        </strong>

                                                    </div>



                                                    <div>

                                                        <span>
                                                            Payment
                                                        </span>

                                                        <strong className="admin-review-capitalize">

                                                            {
                                                                review.order
                                                                    ?.paymentStatus ||
                                                                "-"
                                                            }

                                                        </strong>

                                                    </div>



                                                    <div>

                                                        <span>
                                                            Price
                                                        </span>

                                                        <strong>

                                                            {
                                                                review.order?.price
                                                                !== undefined
                                                                ?
                                                                `৳${review.order.price}`
                                                                :
                                                                "-"
                                                            }

                                                        </strong>

                                                    </div>



                                                    <div>

                                                        <span>
                                                            Reviewed On
                                                        </span>

                                                        <strong>

                                                            {
                                                                formatDate(
                                                                    review.createdAt
                                                                )
                                                            }

                                                        </strong>

                                                    </div>


                                                </div>


                                            </article>

                                        )
                                    )
                                }



                                {
                                    reviews.length === 0
                                    && (

                                        <div className="admin-no-reviews">

                                            <h3>
                                                No reviews found
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


export default AdminReviews;