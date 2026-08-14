import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../api/axios";
import useLogout from "../hooks/useLogout";
import useNotifications from "../hooks/useNotifications";
import useMessages from "../hooks/useMessages";

import "./CustomerTailorDetails.css";


const CustomerTailorDetails = () => {

    const navigate = useNavigate();

    const { tailorId } = useParams();

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
    // ==========================
    // STATE
    // ==========================

    const [profile, setProfile] =
        useState(null);

    const [selectedImageIndex, setSelectedImageIndex] =
        useState(0);

    const [reviews, setReviews] =
        useState([]);

    const [averageRating, setAverageRating] =
        useState(0);

    const [totalReviews, setTotalReviews] =
        useState(0);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");



    // ==========================
    // LOAD TAILOR PROFILE
    // + REVIEWS
    // ==========================

    const loadTailorProfile = async () => {

        try {

            setLoading(true);

            setError("");


            const [
                profileResponse,
                reviewResponse
            ] = await Promise.all([

                api.get(
                    `/tailors/profile/${tailorId}`
                ),

                api.get(
                    `/reviews/tailor/${tailorId}`
                )

            ]);


            setProfile(
                profileResponse.data.profile
            );


            setReviews(
                reviewResponse.data.reviews || []
            );


            setAverageRating(
                reviewResponse.data.averageRating || 0
            );


            setTotalReviews(
                reviewResponse.data.totalReviews || 0
            );

        }
        catch(error){

            console.log(error);


            setError(
                error.response?.data?.message ||
                "Failed to load tailor profile"
            );

        }
        finally{

            setLoading(false);

        }

    };


    useEffect(() => {

        if(tailorId){

            loadTailorProfile();

        }

    }, [tailorId]);



    // ==========================
    // MESSAGE TAILOR
    // ==========================

    const handleMessageTailor = () => {

        const userId =
            profile?.user?._id ||
            profile?.user?.id;


        if(!userId){

            alert(
                "Tailor information not available"
            );

            return;

        }


        navigate(
            `/customer/messages/${userId}`,
            {
                state:{
                    tailor:{

                        _id:userId,

                        name:
                            profile.user?.name ||
                            "Tailor",

                        email:
                            profile.user?.email ||
                            "",

                        role:"tailor"

                    }
                }
            }
        );

    };



    // ==========================
    // HOME MEASUREMENT REQUEST
    // ==========================

    const handleHomeMeasurement = () => {

        const availability =
            profile?.availabilityStatus ||
            "available";


        if(availability !== "available"){

            alert(
                availability === "busy"
                ?
                "This tailor is currently busy and is not accepting home measurement requests."
                :
                "This tailor is currently unavailable for home measurement."
            );

            return;

        }


        navigate(
            `/customer/tailors/${tailorId}/home-measurement`
        );

    };



    // ==========================
    // FORMAT REVIEW DATE
    // ==========================

    const formatReviewDate = (date) => {

        if(!date){

            return "";

        }


        return new Date(
            date
        ).toLocaleDateString();

    };



    // ==========================
    // LOADING
    // ==========================

    if(loading){

        return (

            <div className="customer-tailor-details-state">

                Loading tailor profile...

            </div>

        );

    }



    // ==========================
    // ERROR
    // ==========================

    if(error){

        return (

            <div className="customer-tailor-details-state error">

                {error}

            </div>

        );

    }



    if(!profile){

        return (

            <div className="customer-tailor-details-state error">

                Tailor profile not found

            </div>

        );

    }



    const tailorUser =
        profile.user || {};


    const portfolioImages =
        profile.portfolioImages || [];


    const activeImage =
        portfolioImages[selectedImageIndex] ||
        portfolioImages[0];


    // ==========================
    // AVAILABILITY
    // ==========================

    const availabilityStatus =
        profile.availabilityStatus ||
        "available";


    const availabilityText =

        availabilityStatus === "busy"
        ?
        "Busy"
        :
        availabilityStatus === "unavailable"
        ?
        "Unavailable"
        :
        "Available";


    const canRequestHomeMeasurement =
        availabilityStatus === "available";



    return (

        <div className="customer-tailor-details-page">


            {/* ==========================
                SIDEBAR
            ========================== */}

            <aside className="customer-tailor-details-sidebar">


                <div className="customer-tailor-details-logo">

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
                        className="active"
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


                    {/* ==========================
                        HOME MEASUREMENT HISTORY
                    ========================== */}

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



                <div className="customer-tailor-details-sidebar-bottom">

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

            <main className="customer-tailor-details-main">


                <div className="customer-tailor-details-header">


                    <div>

                        <button
                            className="customer-tailor-back-btn"
                            onClick={() =>
                                navigate("/customer/tailors")
                            }
                        >
                            ← Back to Tailors
                        </button>


                        <h1>
                            Tailor Profile
                        </h1>


                        <p>
                            View tailor details, portfolio and customer reviews
                        </p>

                    </div>


                </div>





                {/* ==========================
                    PROFILE TOP
                ========================== */}

                <section className="customer-tailor-profile-card">


                    <div className="customer-tailor-profile-top">


                        <div className="customer-tailor-profile-identity">


                            {
                                profile.profileImage
                                ? (

                                    <img
                                        src={profile.profileImage}
                                        alt={profile.shopName}
                                        className="customer-tailor-profile-image"
                                    />

                                )
                                : (

                                    <div className="customer-tailor-profile-avatar">

                                        {
                                            tailorUser.name
                                                ?.charAt(0)
                                                ?.toUpperCase()
                                            ||
                                            "T"
                                        }

                                    </div>

                                )
                            }


                            <div>


                                <div className="customer-tailor-badge-row">


                                    <span className="customer-tailor-approved-badge">

                                        Approved Tailor

                                    </span>


                                    {/* ==========================
                                        AVAILABILITY BADGE
                                    ========================== */}

                                    <span
                                        className={
                                            `customer-tailor-availability-badge ${availabilityStatus}`
                                        }
                                    >

                                        {availabilityText}

                                    </span>


                                </div>


                                <h2>

                                    {
                                        profile.shopName ||
                                        "Tailor Shop"
                                    }

                                </h2>


                                <p>

                                    {
                                        tailorUser.name ||
                                        "Tailor"
                                    }

                                </p>


                                {/* ==========================
                                    RATING SUMMARY
                                ========================== */}

                                <div className="customer-tailor-profile-rating">

                                    <strong>

                                        ★ {
                                            Number(
                                                averageRating
                                            ).toFixed(1)
                                        }

                                    </strong>


                                    <span>

                                        {
                                            totalReviews
                                        } Review
                                        {
                                            totalReviews !== 1
                                            ?
                                            "s"
                                            :
                                            ""
                                        }

                                    </span>

                                </div>


                            </div>


                        </div>



                        {/* ==========================
                            MAIN ACTIONS
                        ========================== */}

                        <div className="customer-tailor-main-actions">


                            <button
                                className="customer-tailor-message-main-btn"
                                onClick={handleMessageTailor}
                            >
                                Message Tailor
                            </button>


                            <button
                                className={
                                    canRequestHomeMeasurement
                                    ?
                                    "customer-tailor-home-main-btn"
                                    :
                                    "customer-tailor-home-main-btn disabled"
                                }
                                onClick={handleHomeMeasurement}
                                disabled={!canRequestHomeMeasurement}
                            >

                                {
                                    canRequestHomeMeasurement
                                    ?
                                    "Request Home Measurement"
                                    :
                                    availabilityStatus === "busy"
                                    ?
                                    "Tailor Currently Busy"
                                    :
                                    "Home Measurement Unavailable"
                                }

                            </button>


                        </div>


                    </div>





                    {/* ==========================
                        INFORMATION
                    ========================== */}

                    <div className="customer-tailor-profile-info-grid">


                        <div>

                            <span>
                                Email
                            </span>

                            <strong>

                                {
                                    tailorUser.email ||
                                    "-"
                                }

                            </strong>

                        </div>



                        <div>

                            <span>
                                Phone
                            </span>

                            <strong>

                                {
                                    tailorUser.phone ||
                                    "-"
                                }

                            </strong>

                        </div>



                        <div>

                            <span>
                                Gender
                            </span>

                            <strong>

                                {
                                    tailorUser.gender
                                    ?
                                    tailorUser.gender
                                        .charAt(0)
                                        .toUpperCase()
                                    +
                                    tailorUser.gender.slice(1)
                                    :
                                    "-"
                                }

                            </strong>

                        </div>



                        <div>

                            <span>
                                Location
                            </span>

                            <strong>

                                {
                                    profile.location ||
                                    "-"
                                }

                            </strong>

                        </div>



                        <div>

                            <span>
                                Experience
                            </span>

                            <strong>

                                {
                                    profile.experience !== undefined
                                    ?
                                    `${profile.experience} years`
                                    :
                                    "-"
                                }

                            </strong>

                        </div>



                        <div>

                            <span>
                                Rating
                            </span>

                            <strong className="customer-tailor-rating-text">

                                ★ {
                                    Number(
                                        averageRating
                                    ).toFixed(1)
                                }

                                {" "}

                                ({totalReviews})

                            </strong>

                        </div>



                        <div>

                            <span>
                                Verification
                            </span>

                            <strong className="customer-tailor-verification-text">

                                {
                                    profile.verificationStatus ||
                                    "approved"
                                }

                            </strong>

                        </div>



                        {/* ==========================
                            HOME AVAILABILITY
                        ========================== */}

                        <div>

                            <span>
                                Home Measurement
                            </span>

                            <strong
                                className={
                                    `customer-tailor-availability-text ${availabilityStatus}`
                                }
                            >

                                {availabilityText}

                            </strong>

                        </div>


                    </div>


                </section>





                {/* ==========================
                    HOME MEASUREMENT CARD
                ========================== */}

                <section
                    className={
                        `customer-tailor-home-card ${availabilityStatus}`
                    }
                >


                    <div>


                        <span className="customer-tailor-home-label">
                            Home Measurement Service
                        </span>


                        <h2>

                            {
                                canRequestHomeMeasurement
                                ?
                                "Available for Home Measurement"
                                :
                                availabilityStatus === "busy"
                                ?
                                "Tailor is Currently Busy"
                                :
                                "Home Measurement Currently Unavailable"
                            }

                        </h2>


                        <p>

                            {
                                canRequestHomeMeasurement
                                ?
                                "You can request this tailor to visit your home and take your measurements."
                                :
                                availabilityStatus === "busy"
                                ?
                                "This tailor is currently busy. You can check again later when the tailor becomes available."
                                :
                                "This tailor is currently not accepting home measurement requests."
                            }

                        </p>


                    </div>


                    <button
                        onClick={handleHomeMeasurement}
                        disabled={!canRequestHomeMeasurement}
                    >

                        {
                            canRequestHomeMeasurement
                            ?
                            "Request Home Measurement"
                            :
                            "Not Available"
                        }

                    </button>


                </section>





                {/* ==========================
                    DETAILS
                ========================== */}

                <div className="customer-tailor-details-grid">


                    {/* ==========================
                        ABOUT
                    ========================== */}

                    <section className="customer-tailor-about-card">


                        <h2>
                            About
                        </h2>


                        <p>

                            {
                                profile.description ||
                                "No description provided."
                            }

                        </p>


                        <div className="customer-tailor-detail-specialization">


                            <span>
                                Specialization
                            </span>


                            <div>


                                {
                                    profile.specialization &&
                                    profile.specialization.length > 0
                                    ? (

                                        profile.specialization.map(
                                            (
                                                item,
                                                index
                                            ) => (

                                                <span
                                                    key={index}
                                                >
                                                    {item}
                                                </span>

                                            )
                                        )

                                    )
                                    : (

                                        <small>
                                            Not specified
                                        </small>

                                    )
                                }


                            </div>


                        </div>


                    </section>





                    {/* ==========================
                        CONTACT
                    ========================== */}

                    <section className="customer-tailor-contact-card">


                        <h2>
                            Contact Tailor
                        </h2>


                        <p>
                            Have questions about fitting, design or delivery? Start a direct conversation with this tailor.
                        </p>


                        <button
                            onClick={handleMessageTailor}
                        >
                            Send Message
                        </button>


                    </section>


                </div>





                {/* ==========================
                    PORTFOLIO
                ========================== */}

                <section className="customer-tailor-portfolio-card">


                    <div className="customer-tailor-portfolio-heading">


                        <div>

                            <h2>
                                Portfolio
                            </h2>

                            <p>
                                Previous tailoring work
                            </p>

                        </div>


                        {
                            portfolioImages.length > 0
                            && (

                                <span>

                                    {
                                        portfolioImages.length
                                    } Images

                                </span>

                            )
                        }


                    </div>



                    {
                        portfolioImages.length > 0
                        ? (

                            <>


                                {/* ==========================
                                    MAIN IMAGE
                                ========================== */}

                                <div className="customer-tailor-portfolio-main">


                                    <img
                                        src={activeImage}
                                        alt="Tailor Portfolio"
                                    />


                                    <span>

                                        {
                                            selectedImageIndex + 1
                                        }
                                        /
                                        {
                                            portfolioImages.length
                                        }

                                    </span>


                                </div>



                                {/* ==========================
                                    THUMBNAILS
                                ========================== */}

                                {
                                    portfolioImages.length > 1
                                    && (

                                        <div className="customer-tailor-portfolio-thumbnails">


                                            {
                                                portfolioImages.map(
                                                    (
                                                        image,
                                                        index
                                                    ) => (

                                                        <button
                                                            type="button"
                                                            key={index}
                                                            className={
                                                                selectedImageIndex === index
                                                                ?
                                                                "active"
                                                                :
                                                                ""
                                                            }
                                                            onClick={() =>
                                                                setSelectedImageIndex(
                                                                    index
                                                                )
                                                            }
                                                        >

                                                            <img
                                                                src={image}
                                                                alt={`Portfolio ${index + 1}`}
                                                            />

                                                        </button>

                                                    )
                                                )
                                            }


                                        </div>

                                    )
                                }


                            </>

                        )
                        : (

                            <div className="customer-tailor-no-portfolio">

                                <h3>
                                    No portfolio images
                                </h3>

                                <p>
                                    This tailor has not uploaded portfolio images yet.
                                </p>

                            </div>

                        )
                    }


                </section>





                {/* ==========================
                    CUSTOMER REVIEWS
                ========================== */}

                <section className="customer-tailor-reviews-card">


                    <div className="customer-tailor-reviews-heading">


                        <div>

                            <h2>
                                Customer Reviews
                            </h2>

                            <p>
                                Feedback from customers who completed orders
                            </p>

                        </div>


                        <div className="customer-tailor-rating-summary">


                            <strong>

                                ★ {
                                    Number(
                                        averageRating
                                    ).toFixed(1)
                                }

                            </strong>


                            <span>

                                {
                                    totalReviews
                                } Review
                                {
                                    totalReviews !== 1
                                    ?
                                    "s"
                                    :
                                    ""
                                }

                            </span>


                        </div>


                    </div>



                    {
                        reviews.length > 0
                        ? (

                            <div className="customer-tailor-reviews-list">


                                {
                                    reviews.map(
                                        (review) => {

                                            const rating =
                                                Number(
                                                    review.rating || 0
                                                );


                                            return (

                                                <article
                                                    className="customer-tailor-review-item"
                                                    key={review._id}
                                                >


                                                    <div className="customer-tailor-review-top">


                                                        <div className="customer-tailor-review-user">


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
                                                                        className="customer-tailor-review-avatar-image"
                                                                    />

                                                                )
                                                                : (

                                                                    <div className="customer-tailor-review-avatar">

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


                                                                <strong>

                                                                    {
                                                                        review.customer
                                                                            ?.name ||
                                                                        "Customer"
                                                                    }

                                                                </strong>


                                                                <span>

                                                                    {
                                                                        formatReviewDate(
                                                                            review.createdAt
                                                                        )
                                                                    }

                                                                </span>


                                                            </div>


                                                        </div>



                                                        <div className="customer-tailor-review-rating">


                                                            <span className="customer-review-stars-filled">

                                                                {
                                                                    "★".repeat(
                                                                        rating
                                                                    )
                                                                }

                                                            </span>


                                                            <span className="customer-review-stars-empty">

                                                                {
                                                                    "★".repeat(
                                                                        Math.max(
                                                                            0,
                                                                            5 - rating
                                                                        )
                                                                    )
                                                                }

                                                            </span>


                                                            <small>

                                                                {rating}/5

                                                            </small>


                                                        </div>


                                                    </div>



                                                    <p>

                                                        {
                                                            review.comment
                                                        }

                                                    </p>


                                                </article>

                                            );

                                        }
                                    )
                                }


                            </div>

                        )
                        : (

                            <div className="customer-tailor-no-reviews">


                                <h3>
                                    No reviews yet
                                </h3>


                                <p>
                                    This tailor has not received any customer reviews yet.
                                </p>


                            </div>

                        )
                    }


                </section>


            </main>


        </div>

    );

};


export default CustomerTailorDetails;