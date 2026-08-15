import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";

import Home from "./pages/Home";
import Register from "./pages/Register";
import VerifyOTP from "./pages/VerifyOTP";

import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminTailors from "./pages/AdminTailors";
import AdminGigs from "./pages/AdminGigs";
import AdminOrders from "./pages/AdminOrders";
import AdminPayments from "./pages/AdminPayments";
import AdminReviews from "./pages/AdminReviews";

import TailorDashboard from "./pages/TailorDashboard";
import TailorProfile from "./pages/TailorProfile";
import TailorGigs from "./pages/TailorGigs";
import TailorOrders from "./pages/TailorOrders";
import TailorNotifications from "./pages/TailorNotifications";
import TailorMessages from "./pages/TailorMessages";
import TailorDelivery from "./pages/TailorDelivery";
import TailorMeasurement from "./pages/TailorMeasurement";
import TailorReviews from "./pages/TailorReviews";
import TailorHomeMeasurements from "./pages/TailorHomeMeasurements";

import CustomerDashboard from "./pages/CustomerDashboard";
import CustomerProfile from "./pages/CustomerProfile";
import CustomerGigs from "./pages/CustomerGigs";
import CustomerGigDetails from "./pages/CustomerGigDetails";
import CustomerOrders from "./pages/CustomerOrders";
import CustomerFavorites from "./pages/CustomerFavorites";
import CustomerMessages from "./pages/CustomerMessages";
import CustomerNotifications from "./pages/CustomerNotifications";
import CustomerTailors from "./pages/CustomerTailors";
import CustomerTailorDetails from "./pages/CustomerTailorDetails";
import CustomerHomeMeasurement from "./pages/CustomerHomeMeasurement";
import CustomerHomeMeasurements from "./pages/CustomerHomeMeasurements";


// ==========================
// PAYMENT PAGES
// ==========================

import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFail from "./pages/PaymentFail";
import PaymentCancel from "./pages/PaymentCancel";


import ProtectedRoute from "./routes/ProtectedRoute";



function App(){

    return (

        <Routes>


            {/* ==========================
                HOME
            ========================== */}

            <Route
                path="/"
                element={<Home />}
            />



            {/* ==========================
                LOGIN
            ========================== */}

            <Route
                path="/login"
                element={<Login />}
            />



            {/* ==========================
                REGISTER
            ========================== */}

            <Route
                path="/register"
                element={<Register />}
            />



            {/* ==========================
                VERIFY OTP
            ========================== */}

            <Route
                path="/verify-otp"
                element={<VerifyOTP />}
            />



            {/* ==========================
                CUSTOMER DASHBOARD
            ========================== */}

            <Route
                path="/customer"
                element={

                    <ProtectedRoute
                        allowedRoles={["customer"]}
                    >

                        <CustomerDashboard />

                    </ProtectedRoute>

                }
            />



            {/* ==========================
                CUSTOMER GIGS
            ========================== */}

            <Route
                path="/customer/gigs"
                element={

                    <ProtectedRoute
                        allowedRoles={["customer"]}
                    >

                        <CustomerGigs />

                    </ProtectedRoute>

                }
            />



            {/* ==========================
                CUSTOMER GIG DETAILS
            ========================== */}

            <Route
                path="/customer/gigs/:id"
                element={

                    <ProtectedRoute
                        allowedRoles={["customer"]}
                    >

                        <CustomerGigDetails />

                    </ProtectedRoute>

                }
            />



            {/* ==========================
                CUSTOMER ORDERS
            ========================== */}

            <Route
                path="/customer/orders"
                element={

                    <ProtectedRoute
                        allowedRoles={["customer"]}
                    >

                        <CustomerOrders />

                    </ProtectedRoute>

                }
            />



            {/* ==========================
                CUSTOMER FAVORITES
            ========================== */}

            <Route
                path="/customer/favorites"
                element={

                    <ProtectedRoute
                        allowedRoles={["customer"]}
                    >

                        <CustomerFavorites />

                    </ProtectedRoute>

                }
            />



            {/* ==========================
                CUSTOMER MESSAGES
            ========================== */}

            <Route
                path="/customer/messages"
                element={

                    <ProtectedRoute
                        allowedRoles={["customer"]}
                    >

                        <CustomerMessages />

                    </ProtectedRoute>

                }
            />



            <Route
                path="/customer/messages/:tailorId"
                element={

                    <ProtectedRoute
                        allowedRoles={["customer"]}
                    >

                        <CustomerMessages />

                    </ProtectedRoute>

                }
            />



            {/* ==========================
                CUSTOMER NOTIFICATIONS
            ========================== */}

            <Route
                path="/customer/notifications"
                element={

                    <ProtectedRoute
                        allowedRoles={["customer"]}
                    >

                        <CustomerNotifications />

                    </ProtectedRoute>

                }
            />



            {/* ==========================
                CUSTOMER PROFILE
            ========================== */}

            <Route
                path="/customer/profile"
                element={

                    <ProtectedRoute
                        allowedRoles={["customer"]}
                    >

                        <CustomerProfile />

                    </ProtectedRoute>

                }
            />



            {/* ==========================
                CUSTOMER TAILORS
            ========================== */}

            <Route
                path="/customer/tailors"
                element={

                    <ProtectedRoute
                        allowedRoles={["customer"]}
                    >

                        <CustomerTailors />

                    </ProtectedRoute>

                }
            />



            {/* ==========================
                CUSTOMER TAILOR DETAILS
            ========================== */}

            <Route
                path="/customer/tailors/:tailorId"
                element={

                    <ProtectedRoute
                        allowedRoles={["customer"]}
                    >

                        <CustomerTailorDetails />

                    </ProtectedRoute>

                }
            />



            {/* ==========================
                CUSTOMER HOME MEASUREMENT
                CREATE REQUEST
            ========================== */}

            <Route
                path="/customer/tailors/:tailorId/home-measurement"
                element={

                    <ProtectedRoute
                        allowedRoles={["customer"]}
                    >

                        <CustomerHomeMeasurement />

                    </ProtectedRoute>

                }
            />



            {/* ==========================
                CUSTOMER HOME MEASUREMENTS
                REQUEST HISTORY
            ========================== */}

            <Route
                path="/customer/home-measurements"
                element={

                    <ProtectedRoute
                        allowedRoles={["customer"]}
                    >

                        <CustomerHomeMeasurements />

                    </ProtectedRoute>

                }
            />



            {/* ==========================
                TAILOR DASHBOARD
            ========================== */}

            <Route
                path="/tailor"
                element={

                    <ProtectedRoute
                        allowedRoles={["tailor"]}
                    >

                        <TailorDashboard />

                    </ProtectedRoute>

                }
            />



            {/* ==========================
                TAILOR PROFILE
            ========================== */}

            <Route
                path="/tailor/profile"
                element={

                    <ProtectedRoute
                        allowedRoles={["tailor"]}
                    >

                        <TailorProfile />

                    </ProtectedRoute>

                }
            />



            {/* ==========================
                TAILOR GIGS
            ========================== */}

            <Route
                path="/tailor/gigs"
                element={

                    <ProtectedRoute
                        allowedRoles={["tailor"]}
                    >

                        <TailorGigs />

                    </ProtectedRoute>

                }
            />



            {/* ==========================
                TAILOR ORDERS
            ========================== */}

            <Route
                path="/tailor/orders"
                element={

                    <ProtectedRoute
                        allowedRoles={["tailor"]}
                    >

                        <TailorOrders />

                    </ProtectedRoute>

                }
            />



            {/* ==========================
                TAILOR HOME MEASUREMENTS
            ========================== */}

            <Route
                path="/tailor/home-measurements"
                element={

                    <ProtectedRoute
                        allowedRoles={["tailor"]}
                    >

                        <TailorHomeMeasurements />

                    </ProtectedRoute>

                }
            />



            {/* ==========================
                TAILOR REVIEWS
            ========================== */}

            <Route
                path="/tailor/reviews"
                element={

                    <ProtectedRoute
                        allowedRoles={["tailor"]}
                    >

                        <TailorReviews />

                    </ProtectedRoute>

                }
            />



            {/* ==========================
                TAILOR MESSAGES
            ========================== */}

            <Route
                path="/tailor/messages"
                element={

                    <ProtectedRoute
                        allowedRoles={["tailor"]}
                    >

                        <TailorMessages />

                    </ProtectedRoute>

                }
            />



            {/* ==========================
                TAILOR NOTIFICATIONS
            ========================== */}

            <Route
                path="/tailor/notifications"
                element={

                    <ProtectedRoute
                        allowedRoles={["tailor"]}
                    >

                        <TailorNotifications />

                    </ProtectedRoute>

                }
            />



            {/* ==========================
                TAILOR DELIVERY
            ========================== */}

            <Route
                path="/tailor/delivery"
                element={

                    <ProtectedRoute
                        allowedRoles={["tailor"]}
                    >

                        <TailorDelivery />

                    </ProtectedRoute>

                }
            />



            {/* ==========================
                TAILOR AI MEASUREMENT
            ========================== */}

            <Route
                path="/tailor/measurement"
                element={

                    <ProtectedRoute
                        allowedRoles={["tailor"]}
                    >

                        <TailorMeasurement />

                    </ProtectedRoute>

                }
            />



            {/* ==========================
                ADMIN DASHBOARD
            ========================== */}

            <Route
                path="/admin"
                element={

                    <ProtectedRoute
                        allowedRoles={["admin"]}
                    >

                        <AdminDashboard />

                    </ProtectedRoute>

                }
            />



            {/* ==========================
                ADMIN USERS
            ========================== */}

            <Route
                path="/admin/users"
                element={

                    <ProtectedRoute
                        allowedRoles={["admin"]}
                    >

                        <AdminUsers />

                    </ProtectedRoute>

                }
            />



            {/* ==========================
                ADMIN TAILORS
            ========================== */}

            <Route
                path="/admin/tailors"
                element={

                    <ProtectedRoute
                        allowedRoles={["admin"]}
                    >

                        <AdminTailors />

                    </ProtectedRoute>

                }
            />



            {/* ==========================
                ADMIN GIGS
            ========================== */}

            <Route
                path="/admin/gigs"
                element={

                    <ProtectedRoute
                        allowedRoles={["admin"]}
                    >

                        <AdminGigs />

                    </ProtectedRoute>

                }
            />



            {/* ==========================
                ADMIN ORDERS
            ========================== */}

            <Route
                path="/admin/orders"
                element={

                    <ProtectedRoute
                        allowedRoles={["admin"]}
                    >

                        <AdminOrders />

                    </ProtectedRoute>

                }
            />



            {/* ==========================
                ADMIN REVIEWS
            ========================== */}

            <Route
                path="/admin/reviews"
                element={

                    <ProtectedRoute
                        allowedRoles={["admin"]}
                    >

                        <AdminReviews />

                    </ProtectedRoute>

                }
            />



            {/* ==========================
                ADMIN PAYMENTS
            ========================== */}

            <Route
                path="/admin/payments"
                element={

                    <ProtectedRoute
                        allowedRoles={["admin"]}
                    >

                        <AdminPayments />

                    </ProtectedRoute>

                }
            />



            {/* ==========================
                PAYMENT SUCCESS
            ========================== */}

            <Route
                path="/payment/success"
                element={

                    <ProtectedRoute
                        allowedRoles={["customer"]}
                    >

                        <PaymentSuccess />

                    </ProtectedRoute>

                }
            />



            {/* ==========================
                PAYMENT FAILED
            ========================== */}

            <Route
                path="/payment/fail"
                element={

                    <ProtectedRoute
                        allowedRoles={["customer"]}
                    >

                        <PaymentFail />

                    </ProtectedRoute>

                }
            />



            {/* ==========================
                PAYMENT CANCELLED
            ========================== */}

            <Route
                path="/payment/cancel"
                element={

                    <ProtectedRoute
                        allowedRoles={["customer"]}
                    >

                        <PaymentCancel />

                    </ProtectedRoute>

                }
            />


        </Routes>

    );

}


export default App;