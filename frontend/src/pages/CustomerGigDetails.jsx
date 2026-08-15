import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../api/axios";
import useLogout from "../hooks/useLogout";
import useNotifications from "../hooks/useNotifications";
import useMessages from "../hooks/useMessages";

import "./CustomerGigDetails.css";


const CustomerGigDetails = () => {

    const navigate = useNavigate();

    const { id } = useParams();

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

    const [gig, setGig] = useState(null);

    const [tailorProfile, setTailorProfile] =
        useState(null);

    const [addresses, setAddresses] = useState([]);

    const [selectedAddressId, setSelectedAddressId] =
        useState("");

    const [selectedImageIndex, setSelectedImageIndex] =
        useState(0);

    const [isFavorite, setIsFavorite] =
        useState(false);


    // ==========================
    // REFERENCE IMAGES
    // ==========================

    const [referenceImages, setReferenceImages] =
        useState([]);

    const [referencePreviews, setReferencePreviews] =
        useState([]);


    const [measurement, setMeasurement] = useState({

        chest:"",
        waist:"",
        hip:"",
        shoulder:"",
        sleeve:"",
        length:"",
        neck:"",
        notes:""

    });


    const [loading, setLoading] =
        useState(true);

    const [favoriteLoading, setFavoriteLoading] =
        useState(false);

    const [orderLoading, setOrderLoading] =
        useState(false);

    const [error, setError] =
        useState("");



    // ==========================
    // LOAD PAGE DATA
    // ==========================

    const loadPageData = async () => {

        try {

            setLoading(true);

            setError("");


            const [
                gigResponse,
                addressResponse,
                favoriteResponse
            ] = await Promise.all([

                api.get(
                    `/gigs/${id}`
                ),

                api.get(
                    "/users/address"
                ),

                api.get(
                    "/favorites/gigs"
                )

            ]);


            const gigData =
                gigResponse.data.gig;


            setGig(
                gigData
            );


            // ==========================
            // LOAD TAILOR PROFILE
            // ==========================

            const tailorId =
                gigData?.tailor?._id ||
                gigData?.tailor?.id;


            if(tailorId){

                try{

                    const tailorResponse =
                        await api.get(
                            `/tailors/profile/${tailorId}`
                        );


                    setTailorProfile(
                        tailorResponse.data.profile
                    );

                }
                catch(error){

                    console.log(
                        "Failed to load tailor profile",
                        error
                    );


                    setTailorProfile(null);

                }

            }



            const addressData =
                addressResponse.data.addresses || [];


            setAddresses(
                addressData
            );


            const defaultAddress =
                addressData.find(
                    (address) =>
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



            const favorites =
                favoriteResponse.data.favorites || [];


            const favoriteExists =
                favorites.some(
                    (favorite) =>
                        favorite.gig?._id === id
                );


            setIsFavorite(
                favoriteExists
            );

        }
        catch(error){

            console.log(error);


            setError(
                error.response?.data?.message ||
                "Failed to load gig details"
            );

        }
        finally{

            setLoading(false);

        }

    };


    useEffect(() => {

        setSelectedImageIndex(0);

        loadPageData();

    }, [id]);

    useEffect(() => {

        const images =
            gig?.images || [];


        if(images.length <= 1){

            return;

        }


        const interval = setInterval(() => {

            setSelectedImageIndex(
                (previousIndex) => {

                    return (
                        previousIndex + 1
                    ) % images.length;

                }
            );

        }, 3000);


        return () => {

            clearInterval(interval);

        };

    }, [gig?.images]);


    // ==========================
    // MEASUREMENT CHANGE
    // ==========================

    const handleMeasurementChange = (e) => {

        setMeasurement({

            ...measurement,

            [e.target.name]:
                e.target.value

        });

    };



    // ==========================
    // REFERENCE IMAGE CHANGE
    // ==========================

    const handleReferenceImagesChange = (e) => {

        const selectedFiles =
            Array.from(
                e.target.files || []
            );


        const allowedTypes = [

            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp"

        ];


        const validFiles =
            selectedFiles.filter(
                (file) => {

                    if(
                        !allowedTypes.includes(
                            file.type
                        )
                    ){

                        alert(
                            `${file.name} is not a supported image.`
                        );

                        return false;

                    }


                    if(
                        file.size >
                        5 * 1024 * 1024
                    ){

                        alert(
                            `${file.name} is larger than 5 MB.`
                        );

                        return false;

                    }


                    return true;

                }
            );


        const remainingSlots =
            5 - referenceImages.length;


        if(remainingSlots <= 0){

            alert(
                "You can upload maximum 5 reference images."
            );

            e.target.value = "";

            return;

        }


        const filesToAdd =
            validFiles.slice(
                0,
                remainingSlots
            );


        if(
            validFiles.length >
            remainingSlots
        ){

            alert(
                "You can upload maximum 5 reference images."
            );

        }


        setReferenceImages(
            (previous) => [
                ...previous,
                ...filesToAdd
            ]
        );


        const previews =
            filesToAdd.map(
                (file) =>
                    URL.createObjectURL(file)
            );


        setReferencePreviews(
            (previous) => [
                ...previous,
                ...previews
            ]
        );


        e.target.value = "";

    };



    // ==========================
    // REMOVE REFERENCE IMAGE
    // ==========================

    const handleRemoveReferenceImage = (
        index
    ) => {

        setReferencePreviews(
            (previous) => {

                const preview =
                    previous[index];


                if(preview){

                    URL.revokeObjectURL(
                        preview
                    );

                }


                return previous.filter(
                    (_, currentIndex) =>
                        currentIndex !== index
                );

            }
        );


        setReferenceImages(
            (previous) =>
                previous.filter(
                    (_, currentIndex) =>
                        currentIndex !== index
                )
        );

    };



    // ==========================
    // FAVORITE TOGGLE
    // ==========================

    const handleFavoriteToggle = async () => {

        try {

            setFavoriteLoading(true);


            if(isFavorite){

                await api.delete(
                    `/favorites/gigs/${id}`
                );


                setIsFavorite(false);

            }
            else{

                await api.post(
                    `/favorites/gigs/${id}`
                );


                setIsFavorite(true);

            }

        }
        catch(error){

            alert(
                error.response?.data?.message ||
                "Failed to update favorite"
            );

        }
        finally{

            setFavoriteLoading(false);

        }

    };



    // ==========================
    // HOME MEASUREMENT REQUEST
    // ==========================

    const handleHomeMeasurement = () => {

        const tailorId =
            gig?.tailor?._id ||
            gig?.tailor?.id;


        if(!tailorId){

            alert(
                "Tailor information not available"
            );

            return;

        }


        const availabilityStatus =
            tailorProfile?.availabilityStatus ||
            "unavailable";


        if(
            availabilityStatus !==
            "available"
        ){

            alert(
                availabilityStatus === "busy"
                ?
                "This tailor is currently busy and is not accepting home measurement requests."
                :
                "This tailor is currently unavailable for home measurement."
            );

            return;

        }


        navigate(
            `/customer/tailors/${tailorId}/home-measurement`
        );

    };



    // ==========================
    // PLACE ORDER
    // ==========================

    const handlePlaceOrder = async () => {

        if(!selectedAddressId){

            alert(
                "Please select a delivery address"
            );

            return;

        }


        const selectedAddress =
            addresses.find(
                (address) =>
                    address._id === selectedAddressId
            );


        if(!selectedAddress){

            alert(
                "Selected address not found"
            );

            return;

        }


        const confirmed =
            window.confirm(
                `Place this order for ৳${gig.price}?`
            );


        if(!confirmed){

            return;

        }


        try {

            setOrderLoading(true);


            const cleanedMeasurement = {};


            Object.entries(
                measurement
            ).forEach(
                ([key, value]) => {

                    if(
                        value !== "" &&
                        value !== null &&
                        value !== undefined
                    ){

                        cleanedMeasurement[key] =
                            value;

                    }

                }
            );


            // ==========================
            // CREATE FORM DATA
            // ==========================

            const formData =
                new FormData();


            formData.append(
                "gigId",
                gig._id
            );


            formData.append(
                "deliveryAddress",
                JSON.stringify(
                    selectedAddress
                )
            );


            formData.append(
                "measurement",
                JSON.stringify(
                    cleanedMeasurement
                )
            );


            referenceImages.forEach(
                (file) => {

                    formData.append(
                        "referenceImages",
                        file
                    );

                }
            );


            // ==========================
            // CREATE ORDER
            // ==========================

            const response = await api.post(
                "/orders",
                formData
            );


            alert(
                response.data.message ||
                "Order placed successfully"
            );


            navigate(
                "/customer/orders"
            );

        }
        catch(error){

            alert(
                error.response?.data?.message ||
                "Failed to place order"
            );

        }
        finally{

            setOrderLoading(false);

        }

    };



    // ==========================
    // FORMAT ADDRESS
    // ==========================

    const formatAddress = (address) => {

        if(!address){

            return "";

        }


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



    if(loading){

        return (

            <div className="customer-gig-details-state">

                Loading gig details...

            </div>

        );

    }



    if(error){

        return (

            <div className="customer-gig-details-state error">

                {error}

            </div>

        );

    }



    if(!gig){

        return (

            <div className="customer-gig-details-state error">

                Gig not found

            </div>

        );

    }



    const images =
        gig.images || [];


    const activeImage =
        images[selectedImageIndex] ||
        images[0];



    // ==========================
    // HOME MEASUREMENT
    // AVAILABILITY
    // ==========================

    const availabilityStatus =
        tailorProfile?.availabilityStatus ||
        "unavailable";


    const canRequestHomeMeasurement =
        availabilityStatus === "available";


    const availabilityText =
        availabilityStatus === "available"
        ?
        "Available"
        :
        availabilityStatus === "busy"
        ?
        "Busy"
        :
        "Unavailable";



    return (

        <div className="customer-gig-details-page">


            {/* ==========================
                SIDEBAR
            ========================== */}

            <aside className="customer-gig-details-sidebar">


                <div className="customer-gig-details-logo">

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
                        className="active"
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



                <div className="customer-gig-details-sidebar-bottom">

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

            <main className="customer-gig-details-main">


                <div className="customer-gig-details-header">


                    <div>


                        <button
                            className="customer-back-btn"
                            onClick={() =>
                                navigate("/customer/gigs")
                            }
                        >
                            ← Back to Gigs
                        </button>


                        <h1>
                            Gig Details
                        </h1>


                    </div>


                </div>





                <div className="customer-gig-details-layout">


                    {/* ==========================
                        LEFT
                    ========================== */}

                    <div className="customer-gig-left-column">


                        {/* ==========================
                            GALLERY
                        ========================== */}

                        <section className="customer-detail-gallery-card">


                            <div className="customer-detail-main-image">


                                {
                                    activeImage
                                    ? (

                                        <img
                                            src={activeImage}
                                            alt={gig.title}
                                        />

                                    )
                                    : (

                                        <div className="customer-detail-no-image">

                                            No Image Available

                                        </div>

                                    )
                                }


                                {
                                    images.length > 0
                                    && (

                                        <span className="customer-detail-image-count">

                                            {
                                                selectedImageIndex + 1
                                            }
                                            /
                                            {
                                                images.length
                                            }

                                        </span>

                                    )
                                }


                            </div>



                            {
                                images.length > 1
                                && (

                                    <div className="customer-detail-thumbnails">


                                        {
                                            images.map(
                                                (
                                                    image,
                                                    index
                                                ) => (

                                                    <button
                                                        key={index}
                                                        type="button"
                                                        className={
                                                            selectedImageIndex === index
                                                            ?
                                                            "customer-detail-thumbnail active"
                                                            :
                                                            "customer-detail-thumbnail"
                                                        }
                                                        onClick={() =>
                                                            setSelectedImageIndex(
                                                                index
                                                            )
                                                        }
                                                    >

                                                        <img
                                                            src={image}
                                                            alt={`${gig.title} ${index + 1}`}
                                                        />

                                                    </button>

                                                )
                                            )
                                        }


                                    </div>

                                )
                            }


                        </section>





                        {/* ==========================
                            INFORMATION
                        ========================== */}

                        <section className="customer-detail-info-card">


                            <div className="customer-detail-title-row">


                                <div>

                                    <span className="customer-detail-category">

                                        {
                                            gig.category ||
                                            "Tailoring"
                                        }

                                    </span>


                                    <h2>
                                        {gig.title}
                                    </h2>

                                </div>


                                <strong className="customer-detail-price">

                                    ৳{gig.price}

                                </strong>


                            </div>



                            <p className="customer-detail-description">

                                {
                                    gig.description ||
                                    "No description available."
                                }

                            </p>



                            <div className="customer-detail-meta-grid">


                                <div>

                                    <span>
                                        Delivery Time
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
                                        Tailor Email
                                    </span>

                                    <strong>

                                        {
                                            gig.tailor?.email ||
                                            "-"
                                        }

                                    </strong>

                                </div>



                                {/* ==========================
                                    HOME MEASUREMENT STATUS
                                ========================== */}

                                <div>

                                    <span>
                                        Home Measurement
                                    </span>

                                    <strong
                                        className={
                                            `customer-gig-availability ${availabilityStatus}`
                                        }
                                    >

                                        {availabilityText}

                                    </strong>

                                </div>


                            </div>



                            {/* ==========================
                                MESSAGE TAILOR
                            ========================== */}

                            <button
                                className="customer-message-tailor-btn"
                                onClick={() => {

                                    const tailorId =
                                        gig.tailor?._id ||
                                        gig.tailor?.id;


                                    if(!tailorId){

                                        alert(
                                            "Tailor information not available"
                                        );

                                        return;

                                    }


                                    navigate(
                                        `/customer/messages/${tailorId}`,
                                        {
                                            state:{
                                                tailor:{
                                                    _id:tailorId,

                                                    name:
                                                        gig.tailor?.name ||
                                                        "Tailor",

                                                    email:
                                                        gig.tailor?.email ||
                                                        "",

                                                    role:"tailor"
                                                }
                                            }
                                        }
                                    );

                                }}
                            >
                                Message Tailor
                            </button>



                            {/* ==========================
                                HOME MEASUREMENT
                            ========================== */}

                            <button
                                className={
                                    `customer-home-measurement-btn ${
                                        canRequestHomeMeasurement
                                        ?
                                        "available"
                                        :
                                        "disabled"
                                    }`
                                }
                                onClick={handleHomeMeasurement}
                                disabled={
                                    !canRequestHomeMeasurement
                                }
                            >

                                {
                                    canRequestHomeMeasurement
                                    ?
                                    "Request Home Measurement"
                                    :
                                    availabilityStatus === "busy"
                                    ?
                                    "Tailor Currently Busy"
                                    :
                                    "Home Measurement Unavailable"
                                }

                            </button>



                            {/* ==========================
                                FAVORITE
                            ========================== */}

                            <button
                                className={
                                    isFavorite
                                    ?
                                    "customer-favorite-btn active"
                                    :
                                    "customer-favorite-btn"
                                }
                                onClick={handleFavoriteToggle}
                                disabled={favoriteLoading}
                            >

                                {
                                    favoriteLoading
                                    ?
                                    "Updating..."
                                    :
                                    isFavorite
                                    ?
                                    "♥ Remove from Favorites"
                                    :
                                    "♡ Add to Favorites"
                                }

                            </button>


                        </section>


                    </div>





                    {/* ==========================
                        RIGHT
                    ========================== */}

                    <div className="customer-gig-right-column">


                        {/* ==========================
                            ADDRESS
                        ========================== */}

                        <section className="customer-order-card">


                            <h2>
                                Delivery Address
                            </h2>


                            <p className="customer-order-card-subtitle">

                                Choose where the finished clothing should be delivered.

                            </p>



                            {
                                addresses.length > 0
                                ? (

                                    <div className="customer-address-selection">


                                        {
                                            addresses.map(
                                                (address) => (

                                                    <label
                                                        key={address._id}
                                                        className={
                                                            selectedAddressId === address._id
                                                            ?
                                                            "customer-order-address active"
                                                            :
                                                            "customer-order-address"
                                                        }
                                                    >


                                                        <input
                                                            type="radio"
                                                            name="deliveryAddress"
                                                            value={address._id}
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


                                                        <div>


                                                            <div className="customer-order-address-title">


                                                                <strong>

                                                                    {
                                                                        address.title ||
                                                                        "Address"
                                                                    }

                                                                </strong>


                                                                {
                                                                    address.isDefault
                                                                    && (

                                                                        <span>
                                                                            Default
                                                                        </span>

                                                                    )
                                                                }


                                                            </div>


                                                            <p>

                                                                {
                                                                    formatAddress(
                                                                        address
                                                                    )
                                                                }

                                                            </p>


                                                        </div>


                                                    </label>

                                                )
                                            )
                                        }


                                    </div>

                                )
                                : (

                                    <div className="customer-no-order-address">


                                        <p>
                                            You have no saved delivery address.
                                        </p>


                                        <button
                                            onClick={() =>
                                                navigate(
                                                    "/customer/profile"
                                                )
                                            }
                                        >
                                            Add Address
                                        </button>


                                    </div>

                                )
                            }


                        </section>





                        {/* ==========================
                            MEASUREMENT
                        ========================== */}

                        <section className="customer-order-card">


                            <h2>
                                Measurement
                            </h2>


                            <p className="customer-order-card-subtitle">

                                Add measurements if needed for this order.

                            </p>



                            <div className="customer-measurement-grid">


                                <div className="customer-measurement-field">

                                    <label>
                                        Chest
                                    </label>

                                    <input
                                        type="text"
                                        name="chest"
                                        value={measurement.chest}
                                        onChange={handleMeasurementChange}
                                        placeholder="e.g. 40 inch"
                                    />

                                </div>



                                <div className="customer-measurement-field">

                                    <label>
                                        Waist
                                    </label>

                                    <input
                                        type="text"
                                        name="waist"
                                        value={measurement.waist}
                                        onChange={handleMeasurementChange}
                                        placeholder="e.g. 34 inch"
                                    />

                                </div>



                                <div className="customer-measurement-field">

                                    <label>
                                        Hip
                                    </label>

                                    <input
                                        type="text"
                                        name="hip"
                                        value={measurement.hip}
                                        onChange={handleMeasurementChange}
                                    />

                                </div>



                                <div className="customer-measurement-field">

                                    <label>
                                        Shoulder
                                    </label>

                                    <input
                                        type="text"
                                        name="shoulder"
                                        value={measurement.shoulder}
                                        onChange={handleMeasurementChange}
                                    />

                                </div>



                                <div className="customer-measurement-field">

                                    <label>
                                        Sleeve
                                    </label>

                                    <input
                                        type="text"
                                        name="sleeve"
                                        value={measurement.sleeve}
                                        onChange={handleMeasurementChange}
                                    />

                                </div>



                                <div className="customer-measurement-field">

                                    <label>
                                        Length
                                    </label>

                                    <input
                                        type="text"
                                        name="length"
                                        value={measurement.length}
                                        onChange={handleMeasurementChange}
                                    />

                                </div>



                                <div className="customer-measurement-field">

                                    <label>
                                        Neck
                                    </label>

                                    <input
                                        type="text"
                                        name="neck"
                                        value={measurement.neck}
                                        onChange={handleMeasurementChange}
                                    />

                                </div>



                                <div className="customer-measurement-field full">

                                    <label>
                                        Additional Notes
                                    </label>

                                    <textarea
                                        name="notes"
                                        value={measurement.notes}
                                        onChange={handleMeasurementChange}
                                        placeholder="Any fitting or design instructions..."
                                        rows="4"
                                    />

                                </div>


                            </div>


                        </section>





                        {/* ==========================
                            REFERENCE DESIGN
                        ========================== */}

                        <section className="customer-order-card">


                            <h2>
                                Reference Design
                            </h2>


                            <p className="customer-order-card-subtitle">

                                Upload photos of the dress or design
                                you want the tailor to follow.
                                This is optional.

                            </p>


                            <div className="customer-reference-upload">

                                <label
                                    className="customer-reference-upload-btn"
                                    htmlFor="referenceImages"
                                >

                                    + Add Reference Images

                                </label>


                                <input
                                    id="referenceImages"
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    multiple
                                    onChange={
                                        handleReferenceImagesChange
                                    }
                                />


                                <span className="customer-reference-help">

                                    Maximum 5 images,
                                    5 MB per image

                                </span>

                            </div>



                            {
                                referencePreviews.length > 0
                                && (

                                    <div className="customer-reference-preview-grid">

                                        {
                                            referencePreviews.map(
                                                (preview,index) => (

                                                    <div
                                                        key={preview}
                                                        className="customer-reference-preview"
                                                    >

                                                        <img
                                                            src={preview}
                                                            alt={
                                                                `Reference ${index + 1}`
                                                            }
                                                        />


                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleRemoveReferenceImage(
                                                                    index
                                                                )
                                                            }
                                                        >

                                                            ×

                                                        </button>

                                                    </div>

                                                )
                                            )
                                        }

                                    </div>

                                )
                            }


                            <div className="customer-reference-count">

                                {referenceImages.length}/5 selected

                            </div>

                        </section>





                        {/* ==========================
                            ORDER SUMMARY
                        ========================== */}

                        <section className="customer-order-summary">


                            <h2>
                                Order Summary
                            </h2>


                            <div className="customer-order-summary-row">

                                <span>
                                    Service
                                </span>

                                <strong>
                                    {gig.title}
                                </strong>

                            </div>


                            <div className="customer-order-summary-row">

                                <span>
                                    Delivery Time
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


                            <div className="customer-order-total">

                                <span>
                                    Total
                                </span>

                                <strong>
                                    ৳{gig.price}
                                </strong>

                            </div>



                            <button
                                className="customer-place-order-btn"
                                onClick={handlePlaceOrder}
                                disabled={
                                    orderLoading ||
                                    addresses.length === 0
                                }
                            >

                                {
                                    orderLoading
                                    ?
                                    "Placing Order..."
                                    :
                                    "Place Order"
                                }

                            </button>


                        </section>


                    </div>


                </div>


            </main>


        </div>

    );

};


export default CustomerGigDetails;