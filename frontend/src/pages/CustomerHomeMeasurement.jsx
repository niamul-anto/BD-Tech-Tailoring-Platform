import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../api/axios";
import useLogout from "../hooks/useLogout";
import useNotifications from "../hooks/useNotifications";
import useMessages from "../hooks/useMessages";

import "./CustomerHomeMeasurement.css";


const CustomerHomeMeasurement = () => {

    const navigate = useNavigate();

    const { tailorId } = useParams();

    const handleLogout = useLogout();


    const {
        unreadCount: notificationUnreadCount
    } = useNotifications();

    const {
        unreadCount: messageUnreadCount
    } = useMessages();

    const [tailor, setTailor] = useState(null);

    const [addresses, setAddresses] = useState([]);

    const [selectedAddressId, setSelectedAddressId] =
        useState("");


    const [form, setForm] = useState({

        preferredDate:"",
        preferredTime:"",
        note:""

    });


    const [loading, setLoading] =
        useState(true);

    const [submitting, setSubmitting] =
        useState(false);

    const [error, setError] =
        useState("");



    // ==========================
    // LOAD PAGE DATA
    // ==========================

    useEffect(() => {

        const loadData = async () => {

            try {

                setLoading(true);

                setError("");


                const [
                    tailorResponse,
                    addressResponse
                ] = await Promise.all([

                    api.get(
                        `/tailors/profile/${tailorId}`
                    ),

                    api.get(
                        "/users/address"
                    )

                ]);


                setTailor(
                    tailorResponse.data.profile
                );


                const addressData =
                    addressResponse.data.addresses || [];


                setAddresses(
                    addressData
                );


                const defaultAddress =
                    addressData.find(
                        address =>
                            address.isDefault
                    );


                if(defaultAddress){

                    setSelectedAddressId(
                        defaultAddress._id
                    );

                }
                else if(addressData.length > 0){

                    setSelectedAddressId(
                        addressData[0]._id
                    );

                }

            }
            catch(error){

                console.log(error);


                setError(
                    error.response?.data?.message ||
                    "Failed to load home measurement page"
                );

            }
            finally{

                setLoading(false);

            }

        };


        loadData();

    }, [tailorId]);



    // ==========================
    // FORM CHANGE
    // ==========================

    const handleChange = (e) => {

        setForm({

            ...form,

            [e.target.name]:
                e.target.value

        });

    };



    // ==========================
    // FORMAT ADDRESS
    // ==========================

    const formatAddress = (address) => {

        return [

            address.house,
            address.street,
            address.area,
            address.district,
            address.division,
            address.postalCode

        ]
        .filter(Boolean)
        .join(", ");

    };



    // ==========================
    // EDIT ADDRESS
    // ==========================

    const handleEditAddress = (
        e,
        addressId
    ) => {

        e.preventDefault();

        e.stopPropagation();


        navigate(
            "/customer/profile",
            {
                state:{
                    editAddressId:
                        addressId
                }
            }
        );

    };



    // ==========================
    // ADD NEW ADDRESS
    // ==========================

    const handleAddAddress = () => {

        navigate(
            "/customer/profile",
            {
                state:{
                    openAddressForm:true
                }
            }
        );

    };



    // ==========================
    // SUBMIT REQUEST
    // ==========================

    const handleSubmit = async (e) => {

        e.preventDefault();


        if(
            tailor?.availabilityStatus !==
            "available"
        ){

            alert(
                "This tailor is currently not available for home measurement"
            );

            return;

        }


        if(!selectedAddressId){

            alert(
                "Please select a delivery address"
            );

            return;

        }


        if(
            !form.preferredDate ||
            !form.preferredTime
        ){

            alert(
                "Please select preferred date and time"
            );

            return;

        }


        const selectedAddress =
            addresses.find(
                address =>
                    address._id ===
                    selectedAddressId
            );


        if(!selectedAddress){

            alert(
                "Selected address not found"
            );

            return;

        }


        try {

            setSubmitting(true);


            const response = await api.post(
                "/home-measurements",
                {

                    tailorId,

                    address:
                        selectedAddress,

                    preferredDate:
                        form.preferredDate,

                    preferredTime:
                        form.preferredTime,

                    note:
                        form.note.trim()

                }
            );


            alert(
                response.data.message ||
                "Home measurement request sent successfully"
            );


            navigate(
                "/customer/home-measurements"
            );

        }
        catch(error){

            alert(
                error.response?.data?.message ||
                "Failed to send request"
            );

        }
        finally{

            setSubmitting(false);

        }

    };



    if(loading){

        return (

            <div className="customer-home-state">

                Loading...

            </div>

        );

    }



    if(error){

        return (

            <div className="customer-home-state error">

                {error}

            </div>

        );

    }



    const availability =
        tailor?.availabilityStatus ||
        "available";


    return (

        <div className="customer-home-page">


            {/* ==========================
                SIDEBAR
            ========================== */}

            <aside className="customer-home-sidebar">


                <div className="customer-home-logo">

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
                        className="active"
                        onClick={() =>
                            navigate(
                                "/customer/home-measurements"
                            )
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
                            navigate(
                                "/customer/notifications"
                            )
                        }
                    >

                        Notifications

                        {
                            notificationUnreadCount > 0
                            && (

                                <span className="notification-nav-badge">

                                    {
                                        notificationUnreadCount
                                    }

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


                <div className="customer-home-sidebar-bottom">

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

            <main className="customer-home-main">


                <div className="customer-home-header">


                    <div>


                        <button
                            className="customer-home-back"
                            onClick={() =>
                                navigate(
                                    `/customer/tailors/${tailorId}`
                                )
                            }
                        >
                            ← Back to Tailor
                        </button>


                        <h1>
                            Request Home Measurement
                        </h1>


                        <p>
                            Request the tailor to visit your address for body measurement.
                        </p>


                    </div>


                </div>



                {/* ==========================
                    TAILOR CARD
                ========================== */}

                <section className="customer-home-tailor-card">


                    <div>


                        {
                            tailor?.profileImage
                            ? (

                                <img
                                    src={tailor.profileImage}
                                    alt={tailor.shopName}
                                />

                            )
                            : (

                                <div className="customer-home-avatar">

                                    {
                                        tailor?.user?.name
                                            ?.charAt(0)
                                            ?.toUpperCase()
                                        ||
                                        "T"
                                    }

                                </div>

                            )
                        }


                        <div>

                            <h2>
                                {tailor?.shopName}
                            </h2>

                            <p>
                                {tailor?.user?.name}
                            </p>

                        </div>


                    </div>


                    <span
                        className={
                            `customer-home-availability ${availability}`
                        }
                    >

                        {
                            availability === "available"
                            ?
                            "Available"
                            :
                            availability === "busy"
                            ?
                            "Busy"
                            :
                            "Unavailable"
                        }

                    </span>


                </section>



                {
                    availability !== "available"
                    && (

                        <div className="customer-home-unavailable">

                            This tailor is currently not accepting home measurement requests.

                        </div>

                    )
                }



                <form
                    className="customer-home-form"
                    onSubmit={handleSubmit}
                >


                    {/* ==========================
                        SELECT ADDRESS
                    ========================== */}

                    <section className="customer-home-card">


                        <h2>
                            Select Address
                        </h2>


                        {
                            addresses.length > 0
                            ? (

                                <>


                                    <div className="customer-home-address-list">


                                        {
                                            addresses.map(
                                                address => (

                                                    <label
                                                        key={address._id}
                                                        className={
                                                            selectedAddressId ===
                                                            address._id
                                                            ?
                                                            "customer-home-address active"
                                                            :
                                                            "customer-home-address"
                                                        }
                                                    >


                                                        {/* RADIO LEFT */}

                                                        <input
                                                            className="customer-home-address-radio"
                                                            type="radio"
                                                            name="address"
                                                            checked={
                                                                selectedAddressId ===
                                                                address._id
                                                            }
                                                            onChange={() =>
                                                                setSelectedAddressId(
                                                                    address._id
                                                                )
                                                            }
                                                        />



                                                        {/* ADDRESS CENTER */}

                                                        <div className="customer-home-address-info">


                                                            <strong>

                                                                {
                                                                    address.title ||
                                                                    "Address"
                                                                }

                                                            </strong>


                                                            <p>

                                                                {
                                                                    formatAddress(
                                                                        address
                                                                    )
                                                                }

                                                            </p>


                                                            {
                                                                address.isDefault
                                                                && (

                                                                    <span className="customer-home-default-address">

                                                                        Default

                                                                    </span>

                                                                )
                                                            }


                                                        </div>



                                                        {/* EDIT RIGHT */}

                                                        <button
                                                            type="button"
                                                            className="customer-home-address-edit-btn"
                                                            onClick={(e) =>
                                                                handleEditAddress(
                                                                    e,
                                                                    address._id
                                                                )
                                                            }
                                                        >
                                                            Edit
                                                        </button>


                                                    </label>

                                                )
                                            )
                                        }


                                    </div>



                                    <button
                                        type="button"
                                        className="customer-home-add-address-btn"
                                        onClick={handleAddAddress}
                                    >
                                        + Add New Address
                                    </button>


                                </>

                            )
                            : (

                                <div className="customer-home-no-address">


                                    <p>
                                        No saved address found.
                                    </p>


                                    <button
                                        type="button"
                                        onClick={handleAddAddress}
                                    >
                                        Add Address
                                    </button>


                                </div>

                            )
                        }


                    </section>



                    {/* ==========================
                        PREFERRED SCHEDULE
                    ========================== */}

                    <section className="customer-home-card">


                        <h2>
                            Preferred Schedule
                        </h2>


                        <div className="customer-home-form-grid">


                            <div>


                                <label>
                                    Preferred Date
                                </label>


                                <input
                                    type="date"
                                    name="preferredDate"
                                    value={
                                        form.preferredDate
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />


                            </div>


                            <div>


                                <label>
                                    Preferred Time
                                </label>


                                <input
                                    type="time"
                                    name="preferredTime"
                                    value={
                                        form.preferredTime
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />


                            </div>


                        </div>



                        <div className="customer-home-note">


                            <label>
                                Note
                            </label>


                            <textarea
                                name="note"
                                value={form.note}
                                onChange={handleChange}
                                rows="4"
                                placeholder="Any instructions for the tailor..."
                            />


                        </div>


                    </section>



                    {/* ==========================
                        SUBMIT
                    ========================== */}

                    <button
                        type="submit"
                        className="customer-home-submit"
                        disabled={
                            submitting ||
                            availability !==
                            "available" ||
                            addresses.length === 0
                        }
                    >

                        {
                            submitting
                            ?
                            "Sending Request..."
                            :
                            "Send Home Measurement Request"
                        }

                    </button>


                </form>


            </main>


        </div>

    );

};


export default CustomerHomeMeasurement;