import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";

import useLogout from "../hooks/useLogout";

import "./AdminOrders.css";


const AdminOrders = () => {

    const navigate = useNavigate();

    const handleLogout = useLogout();

    const [orders, setOrders] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    const fetchOrders = async () => {

        try {

            setLoading(true);

            setError("");


            const response = await api.get(
                "/admin/orders"
            );


            setOrders(
                response.data.orders || []
            );

        }
        catch (error) {

            console.log(error);

            setError(
                error.response?.data?.message ||
                "Failed to load orders"
            );

        }
        finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchOrders();

    }, []);



    const formatDate = (date) => {

        if(!date){

            return "-";

        }


        return new Date(
            date
        ).toLocaleString();

    };



    return (

        <div className="admin-orders-page">


            {/* ==========================
                SIDEBAR
            ========================== */}

            <aside className="admin-orders-sidebar">


                <div className="admin-orders-logo">

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
                            navigate("/admin/gigs")
                        }
                    >
                        Gigs
                    </button>


                    <button
                        className="active"
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

            <main className="admin-orders-main">


                <div className="admin-orders-header">


                    <div>

                        <h1>
                            Orders Management
                        </h1>

                        <p>
                            Monitor all customer orders and status history
                        </p>

                    </div>


                    <div className="orders-count">

                        {orders.length} Orders

                    </div>


                </div>




                {loading && (

                    <div className="orders-state">

                        Loading orders...

                    </div>

                )}



                {error && (

                    <div className="orders-state error">

                        {error}

                    </div>

                )}




                {!loading && !error && (

                    <div className="orders-list">


                        {orders.map((order) => (

                            <div
                                className="admin-order-card"
                                key={order._id}
                            >


                                <div className="order-card-top">


                                    <div>

                                        <span className="order-id-label">
                                            Order ID
                                        </span>

                                        <strong className="order-id">

                                            {order._id}

                                        </strong>

                                    </div>



                                    <div className="order-status-group">


                                        <span
                                            className={`order-status ${order.status}`}
                                        >

                                            {order.status}

                                        </span>


                                        <span
                                            className={
                                                order.paymentStatus === "paid"
                                                ?
                                                "payment-status paid"
                                                :
                                                "payment-status unpaid"
                                            }
                                        >

                                            {
                                                order.paymentStatus === "paid"
                                                ?
                                                "Paid"
                                                :
                                                "Unpaid"
                                            }

                                        </span>


                                    </div>


                                </div>




                                <div className="order-info-grid">


                                    <div className="order-info-box">

                                        <span>
                                            Customer
                                        </span>

                                        <strong>

                                            {
                                                order.customer
                                                    ?.name ||
                                                "Unknown Customer"
                                            }

                                        </strong>

                                        <small>

                                            {
                                                order.customer
                                                    ?.email
                                            }

                                        </small>

                                    </div>



                                    <div className="order-info-box">

                                        <span>
                                            Tailor
                                        </span>

                                        <strong>

                                            {
                                                order.tailor
                                                    ?.name ||
                                                "Unknown Tailor"
                                            }

                                        </strong>

                                        <small>

                                            {
                                                order.tailor
                                                    ?.email
                                            }

                                        </small>

                                    </div>



                                    <div className="order-info-box">

                                        <span>
                                            Gig
                                        </span>

                                        <strong>

                                            {
                                                order.gig
                                                    ?.title ||
                                                "Unknown Gig"
                                            }

                                        </strong>

                                        <small>

                                            {
                                                order.gig
                                                    ?.category
                                            }

                                        </small>

                                    </div>



                                    <div className="order-info-box">

                                        <span>
                                            Price
                                        </span>

                                        <strong>

                                            ৳{order.price}

                                        </strong>

                                    </div>


                                </div>




                                <div className="order-secondary-grid">


                                    <div>

                                        <span className="secondary-label">

                                            Delivery Address

                                        </span>


                                        <p>

                                            {
                                                order.deliveryAddress
                                                    ?.house
                                            }

                                            {
                                                order.deliveryAddress
                                                    ?.area
                                                ?
                                                `, ${order.deliveryAddress.area}`
                                                :
                                                ""
                                            }

                                            {
                                                order.deliveryAddress
                                                    ?.district
                                                ?
                                                `, ${order.deliveryAddress.district}`
                                                :
                                                ""
                                            }

                                        </p>

                                    </div>



                                    <div>

                                        <span className="secondary-label">

                                            Created

                                        </span>

                                        <p>

                                            {
                                                formatDate(
                                                    order.createdAt
                                                )
                                            }

                                        </p>

                                    </div>


                                </div>




                                {/* ==========================
                                    TRACKING HISTORY
                                ========================== */}

                                <div className="order-tracking-section">


                                    <h3>

                                        Order Tracking

                                    </h3>


                                    {
                                        order.statusHistory &&
                                        order.statusHistory.length > 0
                                        ? (

                                            <div className="tracking-list">


                                                {
                                                    order.statusHistory.map(
                                                        (
                                                            history,
                                                            index
                                                        ) => (

                                                            <div
                                                                className="tracking-item"
                                                                key={
                                                                    history._id ||
                                                                    index
                                                                }
                                                            >


                                                                <div className="tracking-dot">

                                                                </div>


                                                                <div>

                                                                    <strong>

                                                                        {history.status}

                                                                    </strong>


                                                                    <span>

                                                                        {
                                                                            formatDate(
                                                                                history.changedAt
                                                                            )
                                                                        }

                                                                    </span>

                                                                </div>


                                                            </div>

                                                        )
                                                    )
                                                }


                                            </div>

                                        )
                                        : (

                                            <p className="no-tracking">

                                                No tracking history available for this older order.

                                            </p>

                                        )
                                    }


                                </div>


                            </div>

                        ))}



                        {
                            orders.length === 0
                            && (

                                <div className="no-orders">

                                    No orders found

                                </div>

                            )
                        }


                    </div>

                )}


            </main>


        </div>

    );

};


export default AdminOrders;