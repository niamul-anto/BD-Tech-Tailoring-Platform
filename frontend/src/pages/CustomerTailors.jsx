import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";
import useLogout from "../hooks/useLogout";
import useNotifications from "../hooks/useNotifications";
import useMessages from "../hooks/useMessages";

import "./CustomerTailors.css";


const CustomerTailors = () => {

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

    // ==========================
    // STATE
    // ==========================

    const [tailors, setTailors] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    const [filters, setFilters] = useState({

        keyword:"",
        location:"",
        minExperience:"",
        specialization:""

    });



    // ==========================
    // LOAD TAILORS
    // ==========================

    const loadTailors = async (customFilters = null) => {

        try {

            setLoading(true);

            setError("");


            const currentFilters =
                customFilters || filters;


            const params = {};


            if(currentFilters.keyword.trim()){

                params.keyword =
                    currentFilters.keyword.trim();

            }


            if(currentFilters.location.trim()){

                params.location =
                    currentFilters.location.trim();

            }


            if(currentFilters.minExperience){

                params.minExperience =
                    currentFilters.minExperience;

            }


            if(currentFilters.specialization.trim()){

                params.specialization =
                    currentFilters.specialization.trim();

            }


            const response = await api.get(
                "/tailors/search",
                {
                    params
                }
            );


            setTailors(
                response.data.tailors || []
            );

        }
        catch(error){

            console.log(error);


            setError(
                error.response?.data?.message ||
                "Failed to load tailors"
            );

        }
        finally{

            setLoading(false);

        }

    };



    // ==========================
    // INITIAL LOAD
    // ==========================

    useEffect(() => {

        loadTailors({

            keyword:"",
            location:"",
            minExperience:"",
            specialization:""

        });

    }, []);



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
    // SEARCH
    // ==========================

    const handleSearch = async (e) => {

        e.preventDefault();


        await loadTailors();

    };



    // ==========================
    // RESET
    // ==========================

    const handleReset = async () => {

        const emptyFilters = {

            keyword:"",
            location:"",
            minExperience:"",
            specialization:""

        };


        setFilters(
            emptyFilters
        );


        await loadTailors(
            emptyFilters
        );

    };



    // ==========================
    // GET USER
    // ==========================

    const getTailorUser = (tailor) => {

        return tailor.user || {};

    };



    // ==========================
    // GET TAILOR USER ID
    // ==========================

    const getTailorUserId = (tailor) => {

        return (
            tailor.user?._id ||
            tailor.user?.id ||
            ""
        );

    };



    return (

        <div className="customer-tailors-page">


            {/* ==========================
                SIDEBAR
            ========================== */}

            <aside className="customer-tailors-sidebar">


                <div className="customer-tailors-logo">

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

                    <button
                        onClick={() =>
                            navigate("/customer/home-measurements")
                        }
                    >
                        Home Measurement
                    </button>  

                    <button
                        className="active"
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



                <div className="customer-tailors-sidebar-bottom">

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

            <main className="customer-tailors-main">


                {/* ==========================
                    HEADER
                ========================== */}

                <div className="customer-tailors-header">


                    <div>

                        <h1>
                            Tailors
                        </h1>

                        <p>
                            Discover approved tailors and their services
                        </p>

                    </div>


                    <div className="customer-tailors-count">

                        {tailors.length} Tailors

                    </div>


                </div>





                {/* ==========================
                    FILTER
                ========================== */}

                <section className="customer-tailor-filter-card">


                    <form
                        className="customer-tailor-filter-form"
                        onSubmit={handleSearch}
                    >


                        <div className="customer-tailor-filter-field">

                            <label>
                                Search
                            </label>

                            <input
                                type="text"
                                name="keyword"
                                value={filters.keyword}
                                onChange={handleFilterChange}
                                placeholder="Shop name or description"
                            />

                        </div>



                        <div className="customer-tailor-filter-field">

                            <label>
                                Location
                            </label>

                            <input
                                type="text"
                                name="location"
                                value={filters.location}
                                onChange={handleFilterChange}
                                placeholder="e.g. Dhaka"
                            />

                        </div>



                        <div className="customer-tailor-filter-field">

                            <label>
                                Minimum Experience
                            </label>

                            <input
                                type="number"
                                name="minExperience"
                                value={filters.minExperience}
                                onChange={handleFilterChange}
                                placeholder="Years"
                                min="0"
                            />

                        </div>



                        <div className="customer-tailor-filter-field">

                            <label>
                                Specialization
                            </label>

                            <input
                                type="text"
                                name="specialization"
                                value={filters.specialization}
                                onChange={handleFilterChange}
                                placeholder="e.g. Panjabi"
                            />

                        </div>



                        <div className="customer-tailor-filter-actions">


                            <button
                                type="submit"
                                className="customer-tailor-search-btn"
                            >
                                Search
                            </button>


                            <button
                                type="button"
                                className="customer-tailor-reset-btn"
                                onClick={handleReset}
                            >
                                Reset
                            </button>


                        </div>


                    </form>


                </section>





                {/* ==========================
                    ERROR
                ========================== */}

                {error && (

                    <div className="customer-tailors-error">

                        {error}

                    </div>

                )}



                {/* ==========================
                    LOADING
                ========================== */}

                {loading && (

                    <div className="customer-tailors-state">

                        Loading tailors...

                    </div>

                )}



                {/* ==========================
                    TAILOR GRID
                ========================== */}

                {!loading && !error && (

                    <div className="customer-tailors-grid">


                        {
                            tailors.map(
                                (tailor) => {

                                    const tailorUser =
                                        getTailorUser(
                                            tailor
                                        );


                                    const tailorUserId =
                                        getTailorUserId(
                                            tailor
                                        );


                                    const tailorName =
                                        tailorUser.name ||
                                        "Tailor";


                                    const tailorEmail =
                                        tailorUser.email ||
                                        "";


                                    return (

                                        <article
                                            className="customer-tailor-card"
                                            key={tailor._id}
                                        >


                                            {/* ==========================
                                                TOP
                                            ========================== */}

                                            <div className="customer-tailor-card-top">


                                                {
                                                    tailor.profileImage
                                                    ? (

                                                        <img
                                                            src={tailor.profileImage}
                                                            alt={tailorName}
                                                            className="customer-tailor-image"
                                                        />

                                                    )
                                                    : (

                                                        <div className="customer-tailor-avatar">

                                                            {
                                                                tailorName
                                                                    .charAt(0)
                                                                    .toUpperCase()
                                                            }

                                                        </div>

                                                    )
                                                }



                                                <div className="customer-tailor-heading">


                                                    <h2>

                                                        {
                                                            tailor.shopName ||
                                                            "Tailor Shop"
                                                        }

                                                    </h2>


                                                    <p>
                                                        {tailorName}
                                                    </p>


                                                    <span className="customer-tailor-approved">

                                                        Approved

                                                    </span>


                                                </div>


                                            </div>





                                            {/* ==========================
                                                INFO
                                            ========================== */}

                                            <div className="customer-tailor-info-grid">


                                                <div>

                                                    <span>
                                                        Location
                                                    </span>

                                                    <strong>

                                                        {
                                                            tailor.location ||
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
                                                            tailor.experience !== undefined
                                                            ?
                                                            `${tailor.experience} years`
                                                            :
                                                            "-"
                                                        }

                                                    </strong>

                                                </div>


                                                <div>

                                                    <span>
                                                        Email
                                                    </span>

                                                    <strong>

                                                        {
                                                            tailorEmail ||
                                                            "-"
                                                        }

                                                    </strong>

                                                </div>


                                            </div>





                                            {/* ==========================
                                                SPECIALIZATION
                                            ========================== */}

                                            <div className="customer-tailor-specialization">


                                                <span>
                                                    Specialization
                                                </span>


                                                <div>


                                                    {
                                                        tailor.specialization &&
                                                        tailor.specialization.length > 0
                                                        ? (

                                                            tailor.specialization.map(
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





                                            {/* ==========================
                                                DESCRIPTION
                                            ========================== */}

                                            <p className="customer-tailor-description">

                                                {
                                                    tailor.description ||
                                                    "No description available."
                                                }

                                            </p>





                                            {/* ==========================
                                                PORTFOLIO PREVIEW
                                            ========================== */}

                                            {
                                                tailor.portfolioImages &&
                                                tailor.portfolioImages.length > 0
                                                && (

                                                    <div className="customer-tailor-portfolio-preview">


                                                        {
                                                            tailor.portfolioImages
                                                                .slice(0,3)
                                                                .map(
                                                                    (
                                                                        image,
                                                                        index
                                                                    ) => (

                                                                        <img
                                                                            key={index}
                                                                            src={image}
                                                                            alt={`Portfolio ${index + 1}`}
                                                                        />

                                                                    )
                                                                )
                                                        }


                                                    </div>

                                                )
                                            }





                                            {/* ==========================
                                                ACTIONS
                                            ========================== */}

                                            <div className="customer-tailor-actions">


                                                <button
                                                    type="button"
                                                    className="customer-tailor-view-btn"
                                                    disabled={!tailorUserId}
                                                    onClick={() => {

                                                        if(!tailorUserId){

                                                            alert(
                                                                "Tailor information not available"
                                                            );

                                                            return;

                                                        }


                                                        navigate(
                                                            `/customer/tailors/${tailorUserId}`
                                                        );

                                                    }}
                                                >
                                                    View Profile
                                                </button>



                                                <button
                                                    type="button"
                                                    className="customer-tailor-message-btn"
                                                    disabled={!tailorUserId}
                                                    onClick={() => {

                                                        if(!tailorUserId){

                                                            alert(
                                                                "Tailor information not available"
                                                            );

                                                            return;

                                                        }


                                                        navigate(
                                                            `/customer/messages/${tailorUserId}`,
                                                            {
                                                                state:{
                                                                    tailor:{

                                                                        _id:
                                                                            tailorUserId,

                                                                        name:
                                                                            tailorName,

                                                                        email:
                                                                            tailorEmail,

                                                                        role:
                                                                            "tailor"

                                                                    }
                                                                }
                                                            }
                                                        );

                                                    }}
                                                >
                                                    Message
                                                </button>


                                            </div>


                                        </article>

                                    );

                                }
                            )
                        }



                        {/* ==========================
                            EMPTY
                        ========================== */}

                        {
                            tailors.length === 0
                            && (

                                <div className="customer-no-tailors">


                                    <h3>
                                        No approved tailors found
                                    </h3>


                                    <p>
                                        Try changing your search filters.
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


export default CustomerTailors;