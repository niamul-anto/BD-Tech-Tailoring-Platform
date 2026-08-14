import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";

import useLogout from "../hooks/useLogout";

import "./AdminTailors.css";


const AdminTailors = () => {

    const navigate = useNavigate();

    const handleLogout = useLogout();

    const [pendingTailors, setPendingTailors] = useState([]);

    const [allTailorUsers, setAllTailorUsers] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [actionLoading, setActionLoading] = useState("");


    // ==========================
    // FETCH TAILOR DATA
    // ==========================

    const fetchTailors = async () => {

        try {

            setLoading(true);

            setError("");


            const [
                pendingResponse,
                usersResponse
            ] = await Promise.all([

                api.get(
                    "/admin/tailors/pending"
                ),

                api.get(
                    "/admin/users"
                )

            ]);


            setPendingTailors(
                pendingResponse.data.tailors || []
            );


            const tailorUsers =
                (usersResponse.data.users || [])
                .filter(
                    (user) =>
                        user.role === "tailor"
                );


            setAllTailorUsers(
                tailorUsers
            );

        }
        catch (error) {

            console.log(error);

            setError(
                error.response?.data?.message ||
                "Failed to load tailors"
            );

        }
        finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchTailors();

    }, []);



    // ==========================
    // APPROVE TAILOR
    // ==========================

    const handleApprove = async (tailorId) => {

        try {

            setActionLoading(
                `approve-${tailorId}`
            );


            await api.put(
                `/admin/tailors/${tailorId}/approve`
            );


            setPendingTailors(
                (previousTailors) =>
                    previousTailors.filter(
                        (tailor) =>
                            tailor.user?._id !== tailorId
                    )
            );


            alert(
                "Tailor approved successfully"
            );

        }
        catch (error) {

            alert(
                error.response?.data?.message ||
                "Failed to approve tailor"
            );

        }
        finally {

            setActionLoading("");

        }

    };



    // ==========================
    // REJECT TAILOR
    // ==========================

    const handleReject = async (tailorId) => {

        try {

            setActionLoading(
                `reject-${tailorId}`
            );


            await api.put(
                `/admin/tailors/${tailorId}/reject`
            );


            setPendingTailors(
                (previousTailors) =>
                    previousTailors.filter(
                        (tailor) =>
                            tailor.user?._id !== tailorId
                    )
            );


            alert(
                "Tailor rejected successfully"
            );

        }
        catch (error) {

            alert(
                error.response?.data?.message ||
                "Failed to reject tailor"
            );

        }
        finally {

            setActionLoading("");

        }

    };



    return (

        <div className="admin-tailors-page">


            {/* ==========================
                SIDEBAR
            ========================== */}

            <aside className="admin-tailors-sidebar">


                <div className="admin-tailors-logo">

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
                        className="active"
                        onClick={() =>
                            navigate("/admin/tailors")
                        }
                    >
                        Tailors
                    </button>


                    <button
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



                </nav>


                {/* ==========================
                    LOGOUT
                ========================== */}

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

            <main className="admin-tailors-main">


                <div className="admin-tailors-header">


                    <div>

                        <h1>
                            Tailor Management
                        </h1>

                        <p>
                            Review and manage tailor accounts
                        </p>

                    </div>


                </div>





                {/* ==========================
                    SUMMARY CARDS
                ========================== */}

                <div className="tailor-summary-grid">


                    <div className="tailor-summary-card">

                        <span>
                            Registered Tailors
                        </span>

                        <h2>
                            {allTailorUsers.length}
                        </h2>

                    </div>


                    <div className="tailor-summary-card pending">

                        <span>
                            Pending Approval
                        </span>

                        <h2>
                            {pendingTailors.length}
                        </h2>

                    </div>


                </div>





                {loading && (

                    <div className="tailor-state">

                        Loading tailors...

                    </div>

                )}



                {error && (

                    <div className="tailor-state error">

                        {error}

                    </div>

                )}





                {!loading && !error && (

                    <>


                        {/* ==========================
                            PENDING TAILORS
                        ========================== */}

                        <div className="tailor-table-card">


                            <div className="tailor-table-heading">

                                <div>

                                    <h2>
                                        Pending Tailor Applications
                                    </h2>

                                    <p>
                                        Review newly created tailor profiles
                                    </p>

                                </div>


                                <span>

                                    {pendingTailors.length} pending

                                </span>

                            </div>



                            <div className="tailor-table-wrapper">


                                <table className="tailor-table">


                                    <thead>

                                        <tr>

                                            <th>
                                                Tailor
                                            </th>

                                            <th>
                                                Shop
                                            </th>

                                            <th>
                                                Location
                                            </th>

                                            <th>
                                                Experience
                                            </th>

                                            <th>
                                                Specialization
                                            </th>

                                            <th>
                                                Action
                                            </th>

                                        </tr>

                                    </thead>



                                    <tbody>


                                        {pendingTailors.map(
                                            (tailor) => (

                                                <tr
                                                    key={tailor._id}
                                                >


                                                    <td>

                                                        <div className="tailor-user-cell">


                                                            <div className="tailor-avatar">

                                                                {
                                                                    tailor.user
                                                                        ?.name
                                                                        ?.charAt(0)
                                                                        ?.toUpperCase()
                                                                }

                                                            </div>


                                                            <div>

                                                                <strong>

                                                                    {
                                                                        tailor.user
                                                                            ?.name
                                                                    }

                                                                </strong>


                                                                <span>

                                                                    {
                                                                        tailor.user
                                                                            ?.email
                                                                    }

                                                                </span>

                                                            </div>


                                                        </div>

                                                    </td>



                                                    <td>

                                                        {tailor.shopName}

                                                    </td>



                                                    <td>

                                                        {tailor.location}

                                                    </td>



                                                    <td>

                                                        {tailor.experience} years

                                                    </td>



                                                    <td>

                                                        <div className="specialization-list">

                                                            {
                                                                tailor
                                                                    .specialization
                                                                    ?.map(
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
                                                            }

                                                        </div>

                                                    </td>



                                                    <td>

                                                        <div className="tailor-actions">


                                                            <button
                                                                className="approve-btn"
                                                                disabled={
                                                                    actionLoading !== ""
                                                                }
                                                                onClick={() =>
                                                                    handleApprove(
                                                                        tailor.user._id
                                                                    )
                                                                }
                                                            >

                                                                {
                                                                    actionLoading ===
                                                                    `approve-${tailor.user._id}`
                                                                    ?
                                                                    "Approving..."
                                                                    :
                                                                    "Approve"
                                                                }

                                                            </button>



                                                            <button
                                                                className="reject-btn"
                                                                disabled={
                                                                    actionLoading !== ""
                                                                }
                                                                onClick={() =>
                                                                    handleReject(
                                                                        tailor.user._id
                                                                    )
                                                                }
                                                            >

                                                                {
                                                                    actionLoading ===
                                                                    `reject-${tailor.user._id}`
                                                                    ?
                                                                    "Rejecting..."
                                                                    :
                                                                    "Reject"
                                                                }

                                                            </button>


                                                        </div>

                                                    </td>


                                                </tr>

                                            )
                                        )}



                                        {
                                            pendingTailors.length === 0
                                            && (

                                                <tr>

                                                    <td
                                                        colSpan="6"
                                                        className="no-tailors"
                                                    >

                                                        No pending tailor applications

                                                    </td>

                                                </tr>

                                            )
                                        }


                                    </tbody>


                                </table>


                            </div>


                        </div>





                        {/* ==========================
                            REGISTERED TAILORS
                        ========================== */}

                        <div className="tailor-table-card second-card">


                            <div className="tailor-table-heading">

                                <div>

                                    <h2>
                                        Registered Tailor Users
                                    </h2>

                                    <p>
                                        Tailor accounts currently registered
                                    </p>

                                </div>


                                <span>

                                    {allTailorUsers.length} tailors

                                </span>

                            </div>



                            <div className="tailor-table-wrapper">


                                <table className="tailor-table">


                                    <thead>

                                        <tr>

                                            <th>
                                                Name
                                            </th>

                                            <th>
                                                Email
                                            </th>

                                            <th>
                                                Phone
                                            </th>

                                            <th>
                                                Account Status
                                            </th>

                                        </tr>

                                    </thead>



                                    <tbody>


                                        {allTailorUsers.map(
                                            (tailor) => (

                                                <tr
                                                    key={tailor._id}
                                                >


                                                    <td>

                                                        <div className="tailor-user-cell">

                                                            <div className="tailor-avatar">

                                                                {
                                                                    tailor.name
                                                                        ?.charAt(0)
                                                                        ?.toUpperCase()
                                                                }

                                                            </div>


                                                            <strong>

                                                                {tailor.name}

                                                            </strong>

                                                        </div>

                                                    </td>



                                                    <td>

                                                        {tailor.email}

                                                    </td>



                                                    <td>

                                                        {tailor.phone}

                                                    </td>



                                                    <td>

                                                        <span
                                                            className={
                                                                tailor.isBlocked
                                                                ?
                                                                "account-status blocked"
                                                                :
                                                                "account-status active"
                                                            }
                                                        >

                                                            {
                                                                tailor.isBlocked
                                                                ?
                                                                "Blocked"
                                                                :
                                                                "Active"
                                                            }

                                                        </span>

                                                    </td>


                                                </tr>

                                            )
                                        )}


                                        {
                                            allTailorUsers.length === 0
                                            && (

                                                <tr>

                                                    <td
                                                        colSpan="4"
                                                        className="no-tailors"
                                                    >

                                                        No tailor users found

                                                    </td>

                                                </tr>

                                            )
                                        }


                                    </tbody>


                                </table>


                            </div>


                        </div>


                    </>

                )}


            </main>


        </div>

    );

};


export default AdminTailors;