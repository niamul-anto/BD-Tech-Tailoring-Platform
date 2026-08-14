import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";

import useLogout from "../hooks/useLogout";

import "./AdminPayments.css";


const AdminPayments = () => {

    const navigate = useNavigate();

    const handleLogout = useLogout();

    const [payments, setPayments] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    const fetchPayments = async () => {

        try {

            setLoading(true);

            setError("");


            const response = await api.get(
                "/admin/payments"
            );


            setPayments(
                response.data.payments || []
            );

        }
        catch (error) {

            console.log(error);

            setError(
                error.response?.data?.message ||
                "Failed to load payments"
            );

        }
        finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchPayments();

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

        <div className="admin-payments-page">


            {/* ==========================
                SIDEBAR
            ========================== */}

            <aside className="admin-payments-sidebar">


                <div className="admin-payments-logo">

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
                        onClick={() =>
                            navigate("/admin/orders")
                        }
                    >
                        Orders
                    </button>


                    <button
                        className="active"
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

            <main className="admin-payments-main">


                <div className="admin-payments-header">


                    <div>

                        <h1>
                            Payments Management
                        </h1>

                        <p>
                            Monitor platform payment transactions
                        </p>

                    </div>


                    <div className="payments-count">

                        {payments.length} Transactions

                    </div>


                </div>




                {loading && (

                    <div className="payments-state">

                        Loading payments...

                    </div>

                )}



                {error && (

                    <div className="payments-state error">

                        {error}

                    </div>

                )}




                {!loading && !error && (

                    <div className="payments-table-card">


                        <div className="payments-table-wrapper">


                            <table className="payments-table">


                                <thead>

                                    <tr>

                                        <th>
                                            Customer
                                        </th>

                                        <th>
                                            Order
                                        </th>

                                        <th>
                                            Method
                                        </th>

                                        <th>
                                            Amount
                                        </th>

                                        <th>
                                            Payment Status
                                        </th>

                                        <th>
                                            Order Payment
                                        </th>

                                        <th>
                                            Transaction ID
                                        </th>

                                        <th>
                                            Date
                                        </th>

                                    </tr>

                                </thead>



                                <tbody>


                                    {payments.map(
                                        (payment) => (

                                            <tr
                                                key={payment._id}
                                            >


                                                <td>

                                                    <div className="payment-customer">


                                                        <div className="payment-avatar">

                                                            {
                                                                payment.customer
                                                                    ?.name
                                                                    ?.charAt(0)
                                                                    ?.toUpperCase()
                                                            }

                                                        </div>


                                                        <div>

                                                            <strong>

                                                                {
                                                                    payment.customer
                                                                        ?.name ||
                                                                    "Unknown Customer"
                                                                }

                                                            </strong>


                                                            <span>

                                                                {
                                                                    payment.customer
                                                                        ?.email
                                                                }

                                                            </span>

                                                        </div>


                                                    </div>

                                                </td>



                                                <td>

                                                    <div className="payment-order-cell">

                                                        <strong>

                                                            {
                                                                payment.order
                                                                    ?._id
                                                                    ?.slice(-8)
                                                            }

                                                        </strong>


                                                        <span>

                                                            {
                                                                payment.order
                                                                    ?.status
                                                            }

                                                        </span>

                                                    </div>

                                                </td>



                                                <td>

                                                    <span className="payment-method">

                                                        {
                                                            payment.paymentMethod
                                                        }

                                                    </span>

                                                </td>



                                                <td>

                                                    <strong className="payment-amount">

                                                        ৳{payment.amount}

                                                    </strong>

                                                </td>



                                                <td>

                                                    <span
                                                        className={`transaction-status ${payment.paymentStatus}`}
                                                    >

                                                        {
                                                            payment.paymentStatus
                                                        }

                                                    </span>

                                                </td>



                                                <td>

                                                    <span
                                                        className={
                                                            payment.order
                                                                ?.paymentStatus === "paid"
                                                            ?
                                                            "order-payment-status paid"
                                                            :
                                                            "order-payment-status unpaid"
                                                        }
                                                    >

                                                        {
                                                            payment.order
                                                                ?.paymentStatus ||
                                                            "unknown"
                                                        }

                                                    </span>

                                                </td>



                                                <td>

                                                    {
                                                        payment.transactionId
                                                        ||
                                                        "-"
                                                    }

                                                </td>



                                                <td>

                                                    {
                                                        formatDate(
                                                            payment.createdAt
                                                        )
                                                    }

                                                </td>


                                            </tr>

                                        )
                                    )}



                                    {
                                        payments.length === 0
                                        && (

                                            <tr>

                                                <td
                                                    colSpan="8"
                                                    className="no-payments"
                                                >

                                                    No payment transactions found

                                                </td>

                                            </tr>

                                        )
                                    }


                                </tbody>


                            </table>


                        </div>


                    </div>

                )}


            </main>


        </div>

    );

};


export default AdminPayments;