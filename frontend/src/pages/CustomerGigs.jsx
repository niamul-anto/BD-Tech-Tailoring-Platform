// src/pages/CustomerGigs.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";
import useLogout from "../hooks/useLogout";
import useNotifications from "../hooks/useNotifications";
import useMessages from "../hooks/useMessages";

import "./CustomerGigs.css";


const CustomerGigs = () => {

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


    // ==========================
    // STATE
    // ==========================

    const [gigs, setGigs] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    const [filters, setFilters] = useState({

        keyword:"",
        category:"",
        minPrice:"",
        maxPrice:""

    });


    const [selectedImages, setSelectedImages] =
        useState({});


    const [hoveredGigId, setHoveredGigId] =
        useState(null);



    // ==========================
    // LOAD ALL GIGS
    // ==========================

    const loadGigs = async () => {

        try {

            setLoading(true);

            setError("");


            const response = await api.get(
                "/gigs"
            );


            setGigs(
                response.data.gigs || []
            );

        }
        catch(error){

            console.log(error);


            setError(
                error.response?.data?.message ||
                "Failed to load gigs"
            );

        }
        finally{

            setLoading(false);

        }

    };



    useEffect(() => {

        loadGigs();

    }, []);



    // ==========================
    // HOVER IMAGE SLIDER
    // ==========================

    useEffect(() => {

        if(!hoveredGigId){

            return;

        }


        const hoveredGig =
            gigs.find(
                (gig) =>
                    gig._id === hoveredGigId
            );


        if(
            !hoveredGig ||
            !hoveredGig.images ||
            hoveredGig.images.length <= 1
        ){

            return;

        }


        const interval = setInterval(() => {

            setSelectedImages(
                (previous) => {

                    const currentIndex =
                        previous[hoveredGigId] || 0;


                    const nextIndex =
                        (
                            currentIndex + 1
                        ) %
                        hoveredGig.images.length;


                    return {

                        ...previous,

                        [hoveredGigId]:
                            nextIndex

                    };

                }
            );

        }, 3000);


        return () => {

            clearInterval(interval);

        };

    }, [
        hoveredGigId,
        gigs
    ]);



    // ==========================
    // FILTER CHANGE
    // ==========================

    const handleFilterChange = (e) => {

        setFilters({

            ...filters,

            [e.target.name]:
                e.target.value

        });

    };



    // ==========================
    // SEARCH GIGS
    // ==========================

    const handleSearch = async (e) => {

        e.preventDefault();


        try {

            setLoading(true);

            setError("");


            const params = {};


            if(filters.keyword.trim()){

                params.keyword =
                    filters.keyword.trim();

            }


            if(filters.category){

                params.category =
                    filters.category;

            }


            if(filters.minPrice){

                params.minPrice =
                    filters.minPrice;

            }


            if(filters.maxPrice){

                params.maxPrice =
                    filters.maxPrice;

            }


            const response = await api.get(
                "/gigs/search",
                {
                    params
                }
            );


            setGigs(
                response.data.gigs || []
            );


            // Reset hovered/selected image
            // after search results change

            setHoveredGigId(null);

            setSelectedImages({});

        }
        catch(error){

            console.log(error);


            setError(
                error.response?.data?.message ||
                "Failed to search gigs"
            );

        }
        finally{

            setLoading(false);

        }

    };



    // ==========================
    // RESET FILTER
    // ==========================

    const resetFilters = async () => {

        setFilters({

            keyword:"",
            category:"",
            minPrice:"",
            maxPrice:""

        });


        setHoveredGigId(null);

        setSelectedImages({});


        await loadGigs();

    };



    // ==========================
    // IMAGE SELECT
    // ==========================

    const handleImageSelect = (
        gigId,
        index
    ) => {

        setSelectedImages(
            (previous) => ({

                ...previous,

                [gigId]:index

            })
        );

    };



    // ==========================
    // MOUSE ENTER
    // ==========================

    const handleGigMouseEnter = (
        gigId
    ) => {

        setHoveredGigId(
            gigId
        );

    };



    // ==========================
    // MOUSE LEAVE
    // ==========================

    const handleGigMouseLeave = (
        gigId
    ) => {

        setHoveredGigId(
            (current) =>
                current === gigId
                ?
                null
                :
                current
        );

    };



    // ==========================
    // GET ACTIVE IMAGE
    // ==========================

    const getActiveImage = (gig) => {

        if(
            !gig.images ||
            gig.images.length === 0
        ){

            return null;

        }


        const selectedIndex =
            selectedImages[gig._id] || 0;


        return (
            gig.images[selectedIndex] ||
            gig.images[0]
        );

    };



    return (

        <div className="customer-gigs-page">


            {/* ==========================
                SIDEBAR
            ========================== */}

            <aside className="customer-gigs-sidebar">


                <div className="customer-gigs-logo">

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
                        className="active"
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



                <div className="customer-gigs-sidebar-bottom">

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

            <main className="customer-gigs-main">


                <div className="customer-gigs-header">


                    <div>

                        <h1>
                            Browse Gigs
                        </h1>

                        <p>
                            Discover tailoring services from approved tailors
                        </p>

                    </div>


                    <div className="customer-gigs-count">

                        {gigs.length} Gigs

                    </div>


                </div>





                {/* ==========================
                    FILTER CARD
                ========================== */}

                <section className="customer-gig-filter-card">


                    <form
                        className="customer-gig-filter-form"
                        onSubmit={handleSearch}
                    >


                        <div className="customer-gig-filter-field keyword">

                            <label>
                                Search
                            </label>

                            <input
                                type="text"
                                name="keyword"
                                value={filters.keyword}
                                onChange={handleFilterChange}
                                placeholder="Search title, category or description..."
                            />

                        </div>



                        <div className="customer-gig-filter-field">

                            <label>
                                Category
                            </label>

                            <input
                                type="text"
                                name="category"
                                value={filters.category}
                                onChange={handleFilterChange}
                                placeholder="e.g. Panjabi"
                            />

                        </div>



                        <div className="customer-gig-filter-field">

                            <label>
                                Min Price
                            </label>

                            <input
                                type="number"
                                name="minPrice"
                                value={filters.minPrice}
                                onChange={handleFilterChange}
                                placeholder="0"
                                min="0"
                            />

                        </div>



                        <div className="customer-gig-filter-field">

                            <label>
                                Max Price
                            </label>

                            <input
                                type="number"
                                name="maxPrice"
                                value={filters.maxPrice}
                                onChange={handleFilterChange}
                                placeholder="5000"
                                min="0"
                            />

                        </div>



                        <div className="customer-gig-filter-actions">

                            <button
                                type="submit"
                                className="customer-gig-search-btn"
                            >
                                Search
                            </button>


                            <button
                                type="button"
                                className="customer-gig-reset-btn"
                                onClick={resetFilters}
                            >
                                Reset
                            </button>

                        </div>


                    </form>


                </section>





                {/* ==========================
                    ERROR
                ========================== */}

                {
                    error
                    && (

                        <div className="customer-gigs-error">

                            {error}

                        </div>

                    )
                }



                {/* ==========================
                    LOADING
                ========================== */}

                {
                    loading
                    && (

                        <div className="customer-gigs-state">

                            Loading gigs...

                        </div>

                    )
                }



                {/* ==========================
                    GIG GRID
                ========================== */}

                {
                    !loading &&
                    !error
                    && (

                        <div className="customer-gigs-grid">


                            {
                                gigs.map(
                                    (gig) => {

                                        const activeImage =
                                            getActiveImage(
                                                gig
                                            );


                                        const selectedIndex =
                                            selectedImages[
                                                gig._id
                                            ] || 0;


                                        const averageRating =
                                            Number(
                                                gig.averageRating ||
                                                0
                                            );


                                        const totalReviews =
                                            Number(
                                                gig.totalReviews ||
                                                0
                                            );


                                        return (

                                            <article
                                                className="customer-gig-card"
                                                key={gig._id}

                                                onMouseEnter={() =>
                                                    handleGigMouseEnter(
                                                        gig._id
                                                    )
                                                }

                                                onMouseLeave={() =>
                                                    handleGigMouseLeave(
                                                        gig._id
                                                    )
                                                }
                                            >


                                                {/* ==========================
                                                    IMAGE
                                                ========================== */}

                                                <div className="customer-gig-gallery">


                                                    <div className="customer-gig-main-image">


                                                        {
                                                            activeImage
                                                            ? (

                                                                <img
                                                                    src={
                                                                        activeImage
                                                                    }
                                                                    alt={
                                                                        gig.title
                                                                    }
                                                                />

                                                            )
                                                            : (

                                                                <div className="customer-gig-no-image">

                                                                    No Image

                                                                </div>

                                                            )
                                                        }



                                                        {
                                                            gig.images?.length >
                                                            0
                                                            && (

                                                                <span className="customer-gig-image-count">

                                                                    {
                                                                        selectedIndex +
                                                                        1
                                                                    }
                                                                    /
                                                                    {
                                                                        gig.images.length
                                                                    }

                                                                </span>

                                                            )
                                                        }


                                                    </div>



                                                    {
                                                        gig.images?.length >
                                                        1
                                                        && (

                                                            <div className="customer-gig-thumbnails">


                                                                {
                                                                    gig.images.map(
                                                                        (
                                                                            image,
                                                                            index
                                                                        ) => (

                                                                            <button
                                                                                type="button"
                                                                                key={
                                                                                    `${gig._id}-${index}`
                                                                                }
                                                                                className={
                                                                                    selectedIndex ===
                                                                                    index
                                                                                    ?
                                                                                    "customer-gig-thumbnail active"
                                                                                    :
                                                                                    "customer-gig-thumbnail"
                                                                                }
                                                                                onClick={() =>
                                                                                    handleImageSelect(
                                                                                        gig._id,
                                                                                        index
                                                                                    )
                                                                                }
                                                                            >

                                                                                <img
                                                                                    src={
                                                                                        image
                                                                                    }
                                                                                    alt={
                                                                                        `${gig.title} ${index + 1}`
                                                                                    }
                                                                                />

                                                                            </button>

                                                                        )
                                                                    )
                                                                }


                                                            </div>

                                                        )
                                                    }


                                                </div>





                                                {/* ==========================
                                                    CONTENT
                                                ========================== */}

                                                <div className="customer-gig-content">


                                                    <div className="customer-gig-top-row">


                                                        <span className="customer-gig-category">

                                                            {
                                                                gig.category ||
                                                                "Tailoring"
                                                            }

                                                        </span>


                                                        <strong className="customer-gig-price">

                                                            ৳{gig.price}

                                                        </strong>


                                                    </div>



                                                    <h2>

                                                        {gig.title}

                                                    </h2>



                                                    {/* ==========================
                                                        RATING
                                                    ========================== */}

                                                    <div className="customer-gig-rating">


                                                        {
                                                            totalReviews >
                                                            0
                                                            ? (

                                                                <>


                                                                    <span className="customer-gig-rating-star">
                                                                        ★
                                                                    </span>


                                                                    <strong>

                                                                        {
                                                                            averageRating.toFixed(
                                                                                1
                                                                            )
                                                                        }

                                                                    </strong>


                                                                    <small>

                                                                        (
                                                                        {
                                                                            totalReviews
                                                                        } review
                                                                        {
                                                                            totalReviews !==
                                                                            1
                                                                            ?
                                                                            "s"
                                                                            :
                                                                            ""
                                                                        }
                                                                        )

                                                                    </small>


                                                                </>

                                                            )
                                                            : (

                                                                <>


                                                                    <span className="customer-gig-rating-star">
                                                                        ★
                                                                    </span>


                                                                    <strong className="customer-gig-new-rating">
                                                                        New
                                                                    </strong>


                                                                    <small>
                                                                        No reviews yet
                                                                    </small>


                                                                </>

                                                            )
                                                        }


                                                    </div>



                                                    <p className="customer-gig-description">

                                                        {
                                                            gig.description ||
                                                            "No description available."
                                                        }

                                                    </p>



                                                    <div className="customer-gig-meta">


                                                        <div>

                                                            <span>
                                                                Tailor
                                                            </span>

                                                            <strong>

                                                                {
                                                                    gig.tailor?.name ||
                                                                    "Tailor"
                                                                }

                                                            </strong>

                                                        </div>



                                                        <div>

                                                            <span>
                                                                Delivery
                                                            </span>

                                                            <strong>

                                                                {
                                                                    gig.deliveryTime
                                                                    ?
                                                                    `${gig.deliveryTime} day(s)`
                                                                    :
                                                                    "-"
                                                                }

                                                            </strong>

                                                        </div>


                                                    </div>



                                                    <button
                                                        className="customer-view-gig-btn"
                                                        onClick={() =>
                                                            navigate(
                                                                `/customer/gigs/${gig._id}`
                                                            )
                                                        }
                                                    >
                                                        View Details
                                                    </button>


                                                </div>


                                            </article>

                                        );

                                    }
                                )
                            }



                            {
                                gigs.length === 0
                                && (

                                    <div className="customer-no-gigs">

                                        <h3>
                                            No gigs found
                                        </h3>

                                        <p>
                                            Try changing your search or price filters.
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


export default CustomerGigs;