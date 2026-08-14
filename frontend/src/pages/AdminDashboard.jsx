import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import api from "../api/axios";

import "./AdminDashboard.css";

import useLogout from "../hooks/useLogout";


const AdminDashboard = () => {

    const navigate = useNavigate();

    const handleLogout = useLogout();

    const [dashboard, setDashboard] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    useEffect(() => {

        const fetchDashboard = async () => {

            try {

                const response = await api.get(
                    "/admin/dashboard"
                );


                setDashboard(
                    response.data
                );

            }
            catch (error) {

                console.log(error);


                setError(
                    error.response?.data?.message ||
                    "Failed to load dashboard"
                );

            }
            finally {

                setLoading(false);

            }

        };


        fetchDashboard();

    }, []);



    if (loading) {

        return (

            <div className="admin-loading">

                Loading dashboard...

            </div>

        );

    }



    if (error) {

        return (

            <div className="admin-error">

                {error}

            </div>

        );

    }



    return (

        <div className="admin-dashboard">


            {/* ==========================
                SIDEBAR
            ========================== */}

            <aside className="admin-sidebar">


                <div className="admin-logo">

                    BD Tailoring

                </div>



                <nav className="admin-nav">


                    <button
                        className="active"
                        onClick={() => navigate("/admin")}
                    >

                        Dashboard

                    </button>


                    <button
                        onClick={() => navigate("/admin/users")}
                    >

                        Users

                    </button>


                    <button
                        onClick={() => navigate("/admin/tailors")}
                    >

                        Tailors

                    </button>


                    <button
                        onClick={() => navigate("/admin/gigs")}
                    >

                        Gigs

                    </button>


                    <button
                        onClick={() => navigate("/admin/orders")}
                    >

                        Orders

                    </button>


                    <button
                        onClick={() => navigate("/admin/payments")}
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
                MAIN CONTENT
            ========================== */}

            <main className="admin-main">


                {/* ==========================
                    TOPBAR
                ========================== */}

                <div className="admin-topbar">


                    <div>


                        <h1>

                            Admin Dashboard

                        </h1>


                        <p>

                            Monitor and manage the platform

                        </p>


                    </div>



                    <div className="admin-profile">


                        <div className="admin-avatar">

                            A

                        </div>


                        <div>


                            <strong>

                                Admin

                            </strong>


                            <span>

                                Platform Administrator

                            </span>


                        </div>


                    </div>


                </div>





                {/* ==========================
                    STATS
                ========================== */}

                <div className="admin-stats-grid">


                    <div className="stat-card">

                        <span className="stat-title">

                            Total Users

                        </span>


                        <h2>

                            {dashboard.totalUsers}

                        </h2>


                        <p>

                            Registered users

                        </p>

                    </div>




                    <div className="stat-card">

                        <span className="stat-title">

                            Customers

                        </span>


                        <h2>

                            {dashboard.totalCustomers}

                        </h2>


                        <p>

                            Active customers

                        </p>

                    </div>




                    <div className="stat-card">

                        <span className="stat-title">

                            Tailors

                        </span>


                        <h2>

                            {dashboard.totalTailors}

                        </h2>


                        <p>

                            Registered tailors

                        </p>

                    </div>




                    <div className="stat-card">

                        <span className="stat-title">

                            Total Gigs

                        </span>


                        <h2>

                            {dashboard.totalGigs}

                        </h2>


                        <p>

                            Services available

                        </p>

                    </div>




                    <div className="stat-card">

                        <span className="stat-title">

                            Total Orders

                        </span>


                        <h2>

                            {dashboard.totalOrders}

                        </h2>


                        <p>

                            Orders placed

                        </p>

                    </div>




                    <div className="stat-card">

                        <span className="stat-title">

                            Completed Orders

                        </span>


                        <h2>

                            {dashboard.completedOrders}

                        </h2>


                        <p>

                            Successfully completed

                        </p>

                    </div>




                    <div className="stat-card">

                        <span className="stat-title">

                            Paid Orders

                        </span>


                        <h2>

                            {dashboard.paidOrders}

                        </h2>


                        <p>

                            Successful payments

                        </p>

                    </div>




                    <div className="stat-card revenue-card">

                        <span className="stat-title">

                            Total Revenue

                        </span>


                        <h2>

                            ৳ {dashboard.totalRevenue}

                        </h2>


                        <p>

                            Platform transaction value

                        </p>

                    </div>


                </div>





                {/* ==========================
                    OVERVIEW SECTION
                ========================== */}

                <div className="admin-overview-section">


                    <div className="overview-box">


                        <h3>

                            Platform Overview

                        </h3>



                        <div className="overview-row">


                            <span>

                                Customer Ratio

                            </span>


                            <strong>

                                {
                                    dashboard.totalUsers > 0
                                    ?
                                    Math.round(
                                        (
                                            dashboard.totalCustomers /
                                            dashboard.totalUsers
                                        ) * 100
                                    )
                                    :
                                    0
                                }%

                            </strong>


                        </div>




                        <div className="overview-row">


                            <span>

                                Tailor Ratio

                            </span>


                            <strong>

                                {
                                    dashboard.totalUsers > 0
                                    ?
                                    Math.round(
                                        (
                                            dashboard.totalTailors /
                                            dashboard.totalUsers
                                        ) * 100
                                    )
                                    :
                                    0
                                }%

                            </strong>


                        </div>




                        <div className="overview-row">


                            <span>

                                Completion Rate

                            </span>


                            <strong>

                                {
                                    dashboard.totalOrders > 0
                                    ?
                                    Math.round(
                                        (
                                            dashboard.completedOrders /
                                            dashboard.totalOrders
                                        ) * 100
                                    )
                                    :
                                    0
                                }%

                            </strong>


                        </div>


                    </div>





                    <div className="overview-box">


                        <h3>

                            Quick Summary

                        </h3>



                        <p>

                            The platform currently has{" "}

                            <strong>

                                {dashboard.totalUsers}

                            </strong>{" "}

                            users and{" "}

                            <strong>

                                {dashboard.totalGigs}

                            </strong>{" "}

                            active gigs.

                        </p>



                        <p>

                            <strong>

                                {dashboard.completedOrders}

                            </strong>{" "}

                            of{" "}

                            <strong>

                                {dashboard.totalOrders}

                            </strong>{" "}

                            orders have been completed.

                        </p>



                        <p>

                            Total recorded revenue is{" "}

                            <strong>

                                ৳{dashboard.totalRevenue}

                            </strong>.

                        </p>


                    </div>


                </div>


            </main>


        </div>

    );

};


export default AdminDashboard;