import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";

import api from "../api/axios";

import "./Home.css";


const Home = () => {

    const navigate = useNavigate();


    // ==========================
    // AUTH STATE
    // ==========================

    const {
        user,
        isAuthenticated
    } = useSelector(
        (state) => state.auth
    );



    // ==========================
    // PLATFORM STATS
    // ==========================

    const [stats, setStats] = useState({

        totalUsers:0,

        totalGigs:0,

        totalOrders:0,

        totalMessages:0

    });



    // ==========================
    // LOAD PLATFORM STATS
    // ==========================

    useEffect(() => {

        const loadStats = async () => {

            try{

                const response =
                    await api.get(
                        "/public/stats"
                    );


                setStats(
                    response.data.stats || {

                        totalUsers:0,

                        totalGigs:0,

                        totalOrders:0,

                        totalMessages:0

                    }
                );

            }
            catch(error){

                console.log(
                    "Failed to load public stats",
                    error
                );

            }

        };


        loadStats();

    }, []);



    // ==========================
    // SCROLL TO SECTION
    // ==========================

    const scrollToSection = (id) => {

        const section =
            document.getElementById(id);


        if(section){

            section.scrollIntoView({

                behavior:"smooth"

            });

        }

    };



    // ==========================
    // GO TO DASHBOARD
    // ==========================

    const goToDashboard = () => {

        if(
            !isAuthenticated ||
            !user
        ){

            navigate("/login");

            return;

        }


        if(user.role === "customer"){

            navigate("/customer");

        }

        else if(user.role === "tailor"){

            navigate("/tailor");

        }

        else if(user.role === "admin"){

            navigate("/admin");

        }

        else{

            navigate("/");

        }

    };



    return (

        <div className="home-page">


            {/* ==========================
                NAVBAR
            ========================== */}

            <header className="home-navbar">


                <div
                    className="home-logo"
                    onClick={() =>
                        navigate("/")
                    }
                >
                    BD Tailoring
                </div>


                <nav className="home-nav-links">


                    <button
                        className="active"
                        onClick={() =>
                            scrollToSection("home")
                        }
                    >
                        Home
                    </button>


                    <button
                        onClick={() =>
                            scrollToSection("tailors")
                        }
                    >
                        Find Tailors
                    </button>


                    <button
                        onClick={() =>
                            scrollToSection("how-it-works")
                        }
                    >
                        How It Works
                    </button>


                </nav>



                <div className="home-nav-actions">


                    {
                        isAuthenticated
                        ? (

                            <button
                                className="home-register-btn"
                                onClick={goToDashboard}
                            >
                                Dashboard
                            </button>

                        )
                        : (

                            <>


                                <button
                                    className="home-login-btn"
                                    onClick={() =>
                                        navigate("/login")
                                    }
                                >
                                    Login
                                </button>


                                <button
                                    className="home-register-btn"
                                    onClick={() =>
                                        navigate("/register")
                                    }
                                >
                                    Register
                                </button>


                            </>

                        )
                    }


                </div>


            </header>





            {/* ==========================
                HERO SECTION
            ========================== */}

            <main>


                <section
                    id="home"
                    className="home-hero"
                >


                    <div className="home-hero-inner">


                        {/* LEFT */}

                        <div className="home-hero-left">


                            <span className="home-badge">

                                MAKE LIFE EASIER

                            </span>


                            <h1>

                                Your perfect fit,

                                <span>
                                    without the hassle.
                                </span>

                            </h1>


                            <p className="home-hero-description">

                                Find skilled tailors from home,
                                save valuable time, place custom
                                clothing orders and stay connected
                                from measurement to delivery.

                            </p>



                            <div className="home-hero-actions">


                                <button
                                    className="home-primary-btn"
                                    onClick={() => {

                                        if(isAuthenticated){

                                            goToDashboard();

                                        }
                                        else{

                                            navigate("/register");

                                        }

                                    }}
                                >

                                    {
                                        isAuthenticated
                                        ?
                                        "Go to Dashboard"
                                        :
                                        "Get Started"
                                    }

                                </button>


                                <button
                                    className="home-secondary-btn"
                                    onClick={() =>
                                        scrollToSection(
                                            "how-it-works"
                                        )
                                    }
                                >
                                    Experience Tailoring Differently
                                </button>


                            </div>





                            {/* BENEFITS */}

                            <div className="home-benefit-grid">


                                <div className="home-benefit-item">


                                    <div className="home-benefit-icon">

                                        ⌂

                                    </div>


                                    <strong>
                                        From Home
                                    </strong>


                                    <span>
                                        Find trusted tailors
                                        without travelling
                                    </span>


                                </div>



                                <div className="home-benefit-item">


                                    <div className="home-benefit-icon">

                                        ◷

                                    </div>


                                    <strong>
                                        Save Time
                                    </strong>


                                    <span>
                                        Manage orders and
                                        communication online
                                    </span>


                                </div>



                                <div className="home-benefit-item">


                                    <div className="home-benefit-icon">

                                        ♢

                                    </div>


                                    <strong>
                                        Custom Fit
                                    </strong>


                                    <span>
                                        Clothing designed
                                        around your needs
                                    </span>


                                </div>


                            </div>


                        </div>





                        {/* RIGHT */}

                        <div className="home-process-card">


                            <div className="process-header">


                                <div className="process-logo">

                                    BD

                                </div>


                                <div>

                                    <strong>
                                        BD Tailoring
                                    </strong>

                                    <span>
                                        Tailoring made simple
                                    </span>

                                </div>


                            </div>





                            <div className="process-item">


                                <div className="process-number">

                                    01

                                </div>


                                <div>

                                    <strong>
                                        Find Your Tailor
                                    </strong>

                                    <p>
                                        Search trusted tailors based
                                        on service, experience and location.
                                    </p>

                                </div>


                            </div>



                            <div className="process-item">


                                <div className="process-number">

                                    02

                                </div>


                                <div>

                                    <strong>
                                        Choose a Service
                                    </strong>

                                    <p>
                                        Browse tailoring gigs,
                                        prices and delivery time.
                                    </p>

                                </div>


                            </div>



                            <div className="process-item">


                                <div className="process-number">

                                    03

                                </div>


                                <div>

                                    <strong>
                                        Stay Connected
                                    </strong>

                                    <p>
                                        Chat with your tailor and
                                        follow your order progress.
                                    </p>

                                </div>


                            </div>



                            <div className="process-item last">


                                <div className="process-number">

                                    04

                                </div>


                                <div>

                                    <strong>
                                        Receive Your Perfect Fit
                                    </strong>

                                    <p>
                                        Enjoy a smoother tailoring
                                        experience from start to finish.
                                    </p>

                                </div>


                            </div>


                        </div>


                    </div>


                </section>





                {/* ==========================
                    CUSTOMER + TAILOR
                ========================== */}

                <section
                    id="tailors"
                    className="home-role-section"
                >


                    <div className="home-role-wrapper">


                        {/* CUSTOMER */}

                        <div className="home-person-card customer">


                            <div className="person-avatar customer-avatar">

                                C

                            </div>



                            <div className="person-main-info">


                                <span className="person-type customer-text">

                                    FOR CUSTOMERS

                                </span>


                                <h2>
                                    Your tailor is now closer than ever.
                                </h2>


                                <p>

                                    Find the right tailor without
                                    leaving home, compare tailoring
                                    services, communicate directly
                                    and save valuable time throughout
                                    the process.

                                </p>


                                <button
                                    className="customer-join-btn"
                                    onClick={() => {

                                        if(isAuthenticated){

                                            goToDashboard();

                                        }
                                        else{

                                            navigate(
                                                "/register?role=customer"
                                            );

                                        }

                                    }}
                                >

                                    {
                                        isAuthenticated
                                        ?
                                        "Go to Dashboard"
                                        :
                                        "Join as Customer"
                                    }

                                </button>


                            </div>



                            <div className="person-feature-list">


                                <div>

                                    <span className="check customer-check">
                                        ✓
                                    </span>

                                    Browse trusted tailors

                                </div>


                                <div>

                                    <span className="check customer-check">
                                        ✓
                                    </span>

                                    Compare services and prices

                                </div>


                                <div>

                                    <span className="check customer-check">
                                        ✓
                                    </span>

                                    Place custom clothing orders

                                </div>


                                <div>

                                    <span className="check customer-check">
                                        ✓
                                    </span>

                                    Chat and track progress

                                </div>


                            </div>


                        </div>





                        {/* TAILOR */}

                        <div className="home-person-card tailor">


                            <div className="person-avatar tailor-avatar">

                                T

                            </div>



                            <div className="person-main-info">


                                <span className="person-type tailor-text">

                                    FOR TAILORS

                                </span>


                                <h2>
                                    Take your tailoring business further.
                                </h2>


                                <p>

                                    Showcase your skills, publish your
                                    services, reach more customers and
                                    manage your tailoring orders through
                                    one organized digital platform.

                                </p>


                                <button
                                    className="tailor-join-btn"
                                    onClick={() => {

                                        if(isAuthenticated){

                                            goToDashboard();

                                        }
                                        else{

                                            navigate(
                                                "/register?role=tailor"
                                            );

                                        }

                                    }}
                                >

                                    {
                                        isAuthenticated
                                        ?
                                        "Go to Dashboard"
                                        :
                                        "Join as Tailor"
                                    }

                                </button>


                            </div>



                            <div className="person-feature-list">


                                <div>

                                    <span className="check tailor-check">
                                        ✓
                                    </span>

                                    Build a professional profile

                                </div>


                                <div>

                                    <span className="check tailor-check">
                                        ✓
                                    </span>

                                    Publish tailoring services

                                </div>


                                <div>

                                    <span className="check tailor-check">
                                        ✓
                                    </span>

                                    Receive customer orders

                                </div>


                                <div>

                                    <span className="check tailor-check">
                                        ✓
                                    </span>

                                    Grow your customer reach

                                </div>


                            </div>


                        </div>


                    </div>


                </section>





                {/* ==========================
                    TRUST STRIP
                ========================== */}

                <section className="home-trust-section">


                    <div className="trust-item">


                        <div className="trust-icon">

                            ♙

                        </div>


                        <div>

                            <strong>
                                Trusted Platform
                            </strong>

                            <span>
                                Connecting customers and tailors
                                across Bangladesh
                            </span>

                        </div>


                    </div>



                    <div className="trust-divider"></div>



                    <div className="trust-item">


                        <div className="trust-icon">

                            ✓

                        </div>


                        <div>

                            <strong>
                                Safe & Secure
                            </strong>

                            <span>
                                Your account and information
                                stay protected
                            </span>

                        </div>


                    </div>



                    <div className="trust-divider"></div>



                    <div className="trust-item">


                        <div className="trust-icon">

                            ☆

                        </div>


                        <div>

                            <strong>
                                Quality You Can Trust
                            </strong>

                            <span>
                                Verified tailors and
                                quality services
                            </span>

                        </div>


                    </div>


                </section>





                {/* ==========================
                    PLATFORM STATS
                ========================== */}

                <section
                    id="how-it-works"
                    className="home-how-section"
                >


                    <div className="how-heading">


                        <span>
                            LIVE PLATFORM
                        </span>


                        <h2>
                            BD Tailoring at a Glance
                        </h2>


                        <p>
                            Live activity across the BD Tailoring platform.
                        </p>


                    </div>



                    <div className="how-grid">



                        {/* ==========================
                            CREATED ACCOUNTS
                        ========================== */}

                        <div className="how-card">


                            <span>
                                {stats.totalUsers}
                            </span>


                            <h3>
                                Created Accounts
                            </h3>


                            <p>
                                Total registered users on BD Tailoring.
                            </p>


                        </div>



                        {/* ==========================
                            AVAILABLE SERVICES
                        ========================== */}

                        <div className="how-card">


                            <span>
                                {stats.totalGigs}
                            </span>


                            <h3>
                                Available Services
                            </h3>


                            <p>
                                Total tailoring gigs available on the platform.
                            </p>


                        </div>



                        {/* ==========================
                            ORDERS
                        ========================== */}

                        <div className="how-card">


                            <span>
                                {stats.totalOrders}
                            </span>


                            <h3>
                                Orders Placed
                            </h3>


                            <p>
                                Total tailoring orders placed by customers.
                            </p>


                        </div>



                        {/* ==========================
                            MESSAGES
                        ========================== */}

                        <div className="how-card">


                            <span>
                                {stats.totalMessages}
                            </span>


                            <h3>
                                Stay Connected
                            </h3>


                            <p>
                                Total messages exchanged between customers and tailors.
                            </p>


                        </div>


                    </div>


                </section>


            </main>





            {/* ==========================
                FOOTER
            ========================== */}

            <footer className="home-footer">


                <div>

                    <strong>
                        BD Tailoring
                    </strong>

                    <span>
                        Your perfect fit, without the hassle.
                    </span>

                </div>


                <p>
                    © 2026 BD Tailoring
                </p>


            </footer>


        </div>

    );

};


export default Home;