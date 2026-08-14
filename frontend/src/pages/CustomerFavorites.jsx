import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";
import useLogout from "../hooks/useLogout";
import useNotifications from "../hooks/useNotifications";
import useMessages from "../hooks/useMessages";

import "./CustomerFavorites.css";


const CustomerFavorites = () => {

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

    const [favorites, setFavorites] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [removingId, setRemovingId] = useState("");



    // ==========================
    // LOAD FAVORITES
    // ==========================

    const loadFavorites = async () => {

        try {

            setLoading(true);

            setError("");


            const response = await api.get(
                "/favorites/gigs"
            );


            setFavorites(
                response.data.favorites || []
            );

        }
        catch(error){

            console.log(error);


            setError(
                error.response?.data?.message ||
                "Failed to load favorites"
            );

        }
        finally{

            setLoading(false);

        }

    };


    useEffect(() => {

        loadFavorites();

    }, []);



    // ==========================
    // REMOVE FAVORITE
    // ==========================

    const handleRemoveFavorite = async (
        gigId
    ) => {

        const confirmed =
            window.confirm(
                "Remove this gig from favorites?"
            );


        if(!confirmed){

            return;

        }


        try {

            setRemovingId(gigId);


            await api.delete(
                `/favorites/gigs/${gigId}`
            );


            setFavorites(
                (previous) =>

                    previous.filter(
                        (favorite) =>
                            favorite.gig?._id !== gigId
                    )

            );

        }
        catch(error){

            alert(
                error.response?.data?.message ||
                "Failed to remove favorite"
            );

        }
        finally{

            setRemovingId("");

        }

    };



    return (

        <div className="customer-favorites-page">


            {/* ==========================
                SIDEBAR
            ========================== */}

            <aside className="customer-favorites-sidebar">


                <div className="customer-favorites-logo">

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
                        onClick={() =>
                            navigate("/customer/home-measurements")
                        }
                    >
                        Home Measurement
                    </button>

                    <button
                        className="active"
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



                <div className="customer-favorites-sidebar-bottom">

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

            <main className="customer-favorites-main">


                <div className="customer-favorites-header">


                    <div>

                        <h1>
                            Favorites
                        </h1>

                        <p>
                            Your saved tailoring services
                        </p>

                    </div>


                    <div className="customer-favorites-count">

                        {favorites.length} Saved

                    </div>


                </div>



                {error && (

                    <div className="customer-favorites-error">

                        {error}

                    </div>

                )}



                {loading && (

                    <div className="customer-favorites-state">

                        Loading favorites...

                    </div>

                )}



                {!loading && !error && (

                    <div className="customer-favorites-grid">


                        {
                            favorites.map(
                                (favorite) => {

                                    const gig =
                                        favorite.gig;


                                    if(!gig){

                                        return null;

                                    }


                                    const image =
                                        gig.images?.[0];


                                    return (

                                        <article
                                            className="customer-favorite-card"
                                            key={favorite._id}
                                        >


                                            <div className="customer-favorite-image">


                                                {
                                                    image
                                                    ? (

                                                        <img
                                                            src={image}
                                                            alt={gig.title}
                                                        />

                                                    )
                                                    : (

                                                        <div className="customer-favorite-no-image">

                                                            No Image

                                                        </div>

                                                    )
                                                }


                                                <button
                                                    className="customer-remove-heart"
                                                    disabled={
                                                        removingId === gig._id
                                                    }
                                                    onClick={() =>
                                                        handleRemoveFavorite(
                                                            gig._id
                                                        )
                                                    }
                                                >

                                                    {
                                                        removingId === gig._id
                                                        ?
                                                        "..."
                                                        :
                                                        "♥"
                                                    }

                                                </button>


                                            </div>



                                            <div className="customer-favorite-content">


                                                <div className="customer-favorite-top">


                                                    <span>

                                                        {
                                                            gig.category ||
                                                            "Tailoring"
                                                        }

                                                    </span>


                                                    <strong>

                                                        ৳{gig.price}

                                                    </strong>


                                                </div>



                                                <h2>
                                                    {gig.title}
                                                </h2>



                                                <p>

                                                    {
                                                        gig.description ||
                                                        "No description available."
                                                    }

                                                </p>



                                                <div className="customer-favorite-meta">


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



                                                <div className="customer-favorite-actions">


                                                    <button
                                                        className="customer-favorite-view-btn"
                                                        onClick={() =>
                                                            navigate(
                                                                `/customer/gigs/${gig._id}`
                                                            )
                                                        }
                                                    >
                                                        View Details
                                                    </button>


                                                    <button
                                                        className="customer-favorite-remove-btn"
                                                        disabled={
                                                            removingId === gig._id
                                                        }
                                                        onClick={() =>
                                                            handleRemoveFavorite(
                                                                gig._id
                                                            )
                                                        }
                                                    >

                                                        {
                                                            removingId === gig._id
                                                            ?
                                                            "Removing..."
                                                            :
                                                            "Remove"
                                                        }

                                                    </button>


                                                </div>


                                            </div>


                                        </article>

                                    );

                                }
                            )
                        }



                        {
                            favorites.length === 0
                            && (

                                <div className="customer-no-favorites">


                                    <h3>
                                        No favorite gigs yet
                                    </h3>


                                    <p>
                                        Save gigs you like and find them quickly later.
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


export default CustomerFavorites;