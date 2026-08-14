import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";

import useLogout from "../hooks/useLogout";

import "./AdminUsers.css";


const AdminUsers = () => {

    const navigate = useNavigate();

    const handleLogout = useLogout();

    const [users, setUsers] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [actionLoading, setActionLoading] = useState("");


    const fetchUsers = async () => {

        try {

            setLoading(true);

            const response = await api.get(
                "/admin/users"
            );

            setUsers(
                response.data.users || []
            );

        }
        catch (error) {

            console.log(error);

            setError(
                error.response?.data?.message ||
                "Failed to load users"
            );

        }
        finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchUsers();

    }, []);



    const handleBlock = async (userId) => {

        try {

            setActionLoading(userId);

            await api.put(
                `/admin/users/${userId}/block`
            );


            setUsers((prevUsers) =>

                prevUsers.map((user) =>

                    user._id === userId

                    ? {
                        ...user,
                        isBlocked:true
                    }

                    : user

                )

            );

        }
        catch (error) {

            alert(
                error.response?.data?.message ||
                "Failed to block user"
            );

        }
        finally {

            setActionLoading("");

        }

    };



    const handleUnblock = async (userId) => {

        try {

            setActionLoading(userId);

            await api.put(
                `/admin/users/${userId}/unblock`
            );


            setUsers((prevUsers) =>

                prevUsers.map((user) =>

                    user._id === userId

                    ? {
                        ...user,
                        isBlocked:false
                    }

                    : user

                )

            );

        }
        catch (error) {

            alert(
                error.response?.data?.message ||
                "Failed to unblock user"
            );

        }
        finally {

            setActionLoading("");

        }

    };



    return (

        <div className="admin-users-page">


            {/* ==========================
                SIDEBAR
            ========================== */}

            <aside className="admin-users-sidebar">


                <div className="admin-users-logo">

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
                        className="active"
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
                MAIN
            ========================== */}

            <main className="admin-users-main">


                <div className="admin-users-header">

                    <div>

                        <h1>
                            Users Management
                        </h1>

                        <p>
                            View and manage platform users
                        </p>

                    </div>

                </div>



                {loading && (

                    <div className="users-state">

                        Loading users...

                    </div>

                )}



                {error && (

                    <div className="users-state error">

                        {error}

                    </div>

                )}



                {!loading && !error && (

                    <div className="users-table-card">


                        <div className="users-table-top">

                            <h2>
                                All Users
                            </h2>

                            <span>
                                {users.length} users
                            </span>

                        </div>



                        <div className="users-table-wrapper">

                            <table className="users-table">

                                <thead>

                                    <tr>

                                        <th>Name</th>

                                        <th>Email</th>

                                        <th>Phone</th>

                                        <th>Role</th>

                                        <th>Status</th>

                                        <th>Action</th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {users.map((user) => (

                                        <tr key={user._id}>


                                            <td>

                                                <div className="user-name-cell">

                                                    <div className="user-avatar">

                                                        {
                                                            user.name
                                                                ?.charAt(0)
                                                                ?.toUpperCase()
                                                        }

                                                    </div>


                                                    <span>
                                                        {user.name}
                                                    </span>

                                                </div>

                                            </td>



                                            <td>

                                                {user.email}

                                            </td>



                                            <td>

                                                {user.phone}

                                            </td>



                                            <td>

                                                <span
                                                    className={`role-badge ${user.role}`}
                                                >

                                                    {user.role}

                                                </span>

                                            </td>



                                            <td>

                                                <span
                                                    className={
                                                        user.isBlocked
                                                        ? "status-badge blocked"
                                                        : "status-badge active"
                                                    }
                                                >

                                                    {
                                                        user.isBlocked
                                                        ? "Blocked"
                                                        : "Active"
                                                    }

                                                </span>

                                            </td>



                                            <td>

                                                {
                                                    user.role === "admin"
                                                    ? (

                                                        <span className="admin-protected">

                                                            Protected

                                                        </span>

                                                    )
                                                    :
                                                    user.isBlocked
                                                    ? (

                                                        <button
                                                            className="action-btn unblock"
                                                            disabled={
                                                                actionLoading === user._id
                                                            }
                                                            onClick={() =>
                                                                handleUnblock(user._id)
                                                            }
                                                        >

                                                            {
                                                                actionLoading === user._id
                                                                ? "Please wait..."
                                                                : "Unblock"
                                                            }

                                                        </button>

                                                    )
                                                    : (

                                                        <button
                                                            className="action-btn block"
                                                            disabled={
                                                                actionLoading === user._id
                                                            }
                                                            onClick={() =>
                                                                handleBlock(user._id)
                                                            }
                                                        >

                                                            {
                                                                actionLoading === user._id
                                                                ? "Please wait..."
                                                                : "Block"
                                                            }

                                                        </button>

                                                    )
                                                }

                                            </td>


                                        </tr>

                                    ))}


                                    {users.length === 0 && (

                                        <tr>

                                            <td
                                                colSpan="6"
                                                className="no-users"
                                            >

                                                No users found

                                            </td>

                                        </tr>

                                    )}

                                </tbody>

                            </table>

                        </div>


                    </div>

                )}


            </main>


        </div>

    );

};


export default AdminUsers;