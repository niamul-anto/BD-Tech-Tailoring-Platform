import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";

import useLogout from "../hooks/useLogout";

import "./AdminGigs.css";


const AdminGigs = () => {

    const navigate = useNavigate();

    const handleLogout = useLogout();

    const [gigs, setGigs] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [deleteLoading, setDeleteLoading] = useState("");


    // ==========================
    // FETCH GIGS
    // ==========================

    const fetchGigs = async () => {

        try {

            setLoading(true);

            setError("");


            const response = await api.get(
                "/admin/gigs"
            );


            setGigs(
                response.data.gigs || []
            );

        }
        catch (error) {

            console.log(error);


            setError(
                error.response?.data?.message ||
                "Failed to load gigs"
            );

        }
        finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchGigs();

    }, []);



    // ==========================
    // DELETE GIG
    // ==========================

    const handleDelete = async (gigId) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this gig?"
        );


        if(!confirmed){

            return;

        }


        try {

            setDeleteLoading(gigId);


            await api.delete(
                `/admin/gigs/${gigId}`
            );


            setGigs(
                (previousGigs) =>
                    previousGigs.filter(
                        (gig) => gig._id !== gigId
                    )
            );


            alert(
                "Gig deleted successfully"
            );

        }
        catch (error) {

            alert(
                error.response?.data?.message ||
                "Failed to delete gig"
            );

        }
        finally {

            setDeleteLoading("");

        }

    };



    return (

        <div className="admin-gigs-page">


            {/* ==========================
                SIDEBAR
            ========================== */}

            <aside className="admin-gigs-sidebar">


                <div className="admin-gigs-logo">

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
                        className="active"
                        onClick={() =>
                            navigate("/admin/gigs")
                        }
                    >
                        Gigs
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
                            navigate("/admin/payments")
                        }
                    >
                        Payments
                    </button>
                    
                    <button
                        onClick={() =>
                            navigate("/admin/reviews")
                        }
                    >
                        Reviews
                    </button>

                </nav>


                <div className="admin-sidebar-bottom">

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

            <main className="admin-gigs-main">


                <div className="admin-gigs-header">


                    <div>

                        <h1>
                            Gigs Management
                        </h1>

                        <p>
                            Review and manage all service listings
                        </p>

                    </div>


                    <div className="admin-gig-count">

                        {gigs.length} Gigs

                    </div>


                </div>





                {loading && (

                    <div className="gig-state">

                        Loading gigs...

                    </div>

                )}



                {error && (

                    <div className="gig-state error">

                        {error}

                    </div>

                )}





                {!loading && !error && (

                    <div className="admin-gigs-grid">


                        {gigs.map((gig) => (

                            <div
                                className="admin-gig-card"
                                key={gig._id}
                            >


                                {/* IMAGE */}

                                <div className="admin-gig-image">


                                    {
                                        gig.images &&
                                        gig.images.length > 0
                                        ? (

                                            <img
                                                src={gig.images[0]}
                                                alt={gig.title}
                                            />

                                        )
                                        : (

                                            <div className="no-gig-image">

                                                No Image

                                            </div>

                                        )
                                    }


                                </div>





                                {/* CONTENT */}

                                <div className="admin-gig-content">


                                    <div className="gig-category">

                                        {gig.category}

                                    </div>


                                    <h2>

                                        {gig.title}

                                    </h2>


                                    <p className="gig-description">

                                        {gig.description}

                                    </p>



                                    <div className="gig-info-row">

                                        <span>
                                            Price
                                        </span>

                                        <strong>
                                            ৳{gig.price}
                                        </strong>

                                    </div>



                                    <div className="gig-info-row">

                                        <span>
                                            Delivery
                                        </span>

                                        <strong>
                                            {gig.deliveryTime} days
                                        </strong>

                                    </div>



                                    <div className="gig-tailor-info">

                                        <div className="gig-tailor-avatar">

                                            {
                                                gig.tailor
                                                    ?.name
                                                    ?.charAt(0)
                                                    ?.toUpperCase()
                                            }

                                        </div>


                                        <div>

                                            <strong>

                                                {
                                                    gig.tailor
                                                        ?.name ||
                                                    "Unknown Tailor"
                                                }

                                            </strong>


                                            <span>

                                                {
                                                    gig.tailor
                                                        ?.email
                                                }

                                            </span>

                                        </div>


                                    </div>



                                    <button
                                        className="delete-gig-btn"
                                        disabled={
                                            deleteLoading === gig._id
                                        }
                                        onClick={() =>
                                            handleDelete(gig._id)
                                        }
                                    >

                                        {
                                            deleteLoading === gig._id
                                            ?
                                            "Deleting..."
                                            :
                                            "Delete Gig"
                                        }

                                    </button>


                                </div>


                            </div>

                        ))}



                        {gigs.length === 0 && (

                            <div className="no-gigs">

                                No gigs found

                            </div>

                        )}


                    </div>

                )}


            </main>


        </div>

    );

};


export default AdminGigs;