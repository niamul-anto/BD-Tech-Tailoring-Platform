import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import api from "../api/axios";
import useLogout from "../hooks/useLogout";
import useNotifications from "../hooks/useNotifications";

import useMessages from "../hooks/useMessages";

import "./TailorProfile.css";


const TailorProfile = () => {

    const navigate = useNavigate();

    const handleLogout = useLogout();

    const user = useSelector(
        (state) => state.auth.user
    );


    // ==========================
    // GLOBAL NOTIFICATIONS
    // ==========================

    const {
        unreadCount: notificationUnreadCount
    } = useNotifications();


    // ==========================
    // GLOBAL MESSAGES
    // ==========================

    const {
        unreadCount: messageUnreadCount
    } = useMessages();


    const [profile, setProfile] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [creating, setCreating] = useState(false);

    const [editing, setEditing] = useState(false);

    const [updating, setUpdating] = useState(false);

    const [imageUploading, setImageUploading] = useState(false);

    const [portfolioUploading, setPortfolioUploading] = useState(false);

    const [availabilityLoading, setAvailabilityLoading] =
        useState(false);


    const [formData, setFormData] = useState({

        shopName:"",
        experience:"",
        specialization:"",
        location:"",
        description:""

    });


    const [editFormData, setEditFormData] = useState({

        shopName:"",
        experience:"",
        specialization:"",
        location:"",
        description:""

    });



    // ==========================
    // LOAD PROFILE
    // ==========================

    const loadProfile = async () => {

        if(!user?.id){

            setLoading(false);

            return;

        }


        try {

            setLoading(true);

            setError("");


            const response = await api.get(
                `/tailors/profile/${user.id}`
            );


            setProfile(
                response.data.profile
            );

        }
        catch(error){

            if(error.response?.status === 404){

                setProfile(null);

            }
            else{

                setError(
                    error.response?.data?.message ||
                    "Failed to load tailor profile"
                );

            }

        }
        finally{

            setLoading(false);

        }

    };


    useEffect(() => {

        loadProfile();

    }, [user?.id]);



    // ==========================
    // CREATE FORM CHANGE
    // ==========================

    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]:e.target.value

        });

    };



    // ==========================
    // EDIT FORM CHANGE
    // ==========================

    const handleEditChange = (e) => {

        setEditFormData({

            ...editFormData,

            [e.target.name]:e.target.value

        });

    };



    // ==========================
    // CREATE PROFILE
    // ==========================

    const handleCreateProfile = async (e) => {

        e.preventDefault();


        try {

            setCreating(true);

            setError("");


            const specializationArray =
                formData.specialization
                    .split(",")
                    .map(
                        (item) => item.trim()
                    )
                    .filter(Boolean);


            const response = await api.post(
                "/tailors/profile",
                {

                    shopName:
                        formData.shopName,

                    experience:
                        Number(formData.experience),

                    specialization:
                        specializationArray,

                    location:
                        formData.location,

                    description:
                        formData.description

                }
            );


            setProfile(
                response.data.profile
            );


            alert(
                "Tailor profile created successfully"
            );

        }
        catch(error){

            setError(
                error.response?.data?.message ||
                "Failed to create profile"
            );

        }
        finally{

            setCreating(false);

        }

    };



    // ==========================
    // START EDIT
    // ==========================

    const handleStartEdit = () => {

        setEditFormData({

            shopName:
                profile.shopName || "",

            experience:
                profile.experience || "",

            specialization:
                profile.specialization
                    ?.join(", ") || "",

            location:
                profile.location || "",

            description:
                profile.description || ""

        });


        setEditing(true);

    };



    // ==========================
    // CANCEL EDIT
    // ==========================

    const handleCancelEdit = () => {

        setEditing(false);

    };



    // ==========================
    // UPDATE PROFILE
    // ==========================

    const handleUpdateProfile = async (e) => {

        e.preventDefault();


        try {

            setUpdating(true);

            setError("");


            const specializationArray =
                editFormData.specialization
                    .split(",")
                    .map(
                        (item) => item.trim()
                    )
                    .filter(Boolean);


            const response = await api.put(
                "/tailors/profile",
                {

                    shopName:
                        editFormData.shopName,

                    experience:
                        Number(editFormData.experience),

                    specialization:
                        specializationArray,

                    location:
                        editFormData.location,

                    description:
                        editFormData.description

                }
            );


            setProfile(
                (previous) => ({

                    ...previous,

                    ...response.data.profile,

                    user:
                        previous.user

                })
            );


            setEditing(false);


            alert(
                "Tailor profile updated successfully"
            );

        }
        catch(error){

            setError(
                error.response?.data?.message ||
                "Failed to update profile"
            );

        }
        finally{

            setUpdating(false);

        }

    };



    // ==========================
    // UPDATE AVAILABILITY
    // ==========================

    const handleAvailabilityChange = async (
        newStatus
    ) => {

        try {

            setAvailabilityLoading(true);


            const response = await api.put(
                "/tailors/availability",
                {

                    availabilityStatus:
                        newStatus

                }
            );


            setProfile(
                (previous) => ({

                    ...previous,

                    availabilityStatus:
                        response.data
                            .availabilityStatus ||
                        newStatus

                })
            );


            alert(
                response.data.message ||
                "Availability updated successfully"
            );

        }
        catch(error){

            alert(
                error.response?.data?.message ||
                "Failed to update availability"
            );

        }
        finally{

            setAvailabilityLoading(false);

        }

    };



    // ==========================
    // UPLOAD PROFILE IMAGE
    // ==========================

    const handleProfileImage = async (e) => {

        const file = e.target.files?.[0];


        if(!file){

            return;

        }


        try {

            setImageUploading(true);


            const data = new FormData();


            data.append(
                "image",
                file
            );


            const response = await api.put(
                "/tailors/profile/image",
                data
            );


            setProfile(
                (previous) => ({

                    ...previous,

                    profileImage:
                        response.data.profileImage

                })
            );


            alert(
                "Profile image uploaded successfully"
            );

        }
        catch(error){

            alert(
                error.response?.data?.message ||
                "Failed to upload profile image"
            );

        }
        finally{

            setImageUploading(false);

            e.target.value = "";

        }

    };



    // ==========================
    // UPLOAD PORTFOLIO
    // ==========================

    const handlePortfolioImages = async (e) => {

        const files =
            Array.from(
                e.target.files || []
            );


        if(files.length === 0){

            return;

        }


        if(files.length > 5){

            alert(
                "Maximum 5 images can be uploaded at once"
            );

            e.target.value = "";

            return;

        }


        try {

            setPortfolioUploading(true);


            const data = new FormData();


            files.forEach(
                (file) => {

                    data.append(
                        "images",
                        file
                    );

                }
            );


            const response = await api.put(
                "/tailors/profile/portfolio",
                data
            );


            setProfile(
                (previous) => ({

                    ...previous,

                    portfolioImages:
                        response.data.portfolioImages

                })
            );


            alert(
                "Portfolio images uploaded successfully"
            );

        }
        catch(error){

            alert(
                error.response?.data?.message ||
                "Failed to upload portfolio images"
            );

        }
        finally{

            setPortfolioUploading(false);

            e.target.value = "";

        }

    };



    if(loading){

        return (

            <div className="tailor-profile-state">

                Loading profile...

            </div>

        );

    }



    return (

        <div className="tailor-profile-page">


            {/* ==========================
                SIDEBAR
            ========================== */}

            <aside className="tailor-profile-sidebar">


                <div className="tailor-profile-logo">

                    BD Tailoring

                </div>


                <nav>


                    <button
                        onClick={() =>
                            navigate("/tailor")
                        }
                    >
                        Dashboard
                    </button>


                    <button
                        className="active"
                        onClick={() =>
                            navigate("/tailor/profile")
                        }
                    >
                        My Profile
                    </button>


                    <button
                        onClick={() =>
                            navigate("/tailor/gigs")
                        }
                    >
                        My Gigs
                    </button>


                    <button
                        onClick={() =>
                            navigate("/tailor/orders")
                        }
                    >
                        Orders
                    </button>


                    {/* ==========================
                        HOME MEASUREMENT
                    ========================== */}

                    <button
                        onClick={() =>
                            navigate(
                                "/tailor/home-measurements"
                            )
                        }
                    >
                        Home Measurement
                    </button>


                    <button
                        onClick={() =>
                            navigate("/tailor/messages")
                        }
                    >
                        Messages

                        {
                            messageUnreadCount > 0
                            && (

                                <span className="message-nav-badge">

                                    {messageUnreadCount}

                                </span>

                            )
                        }

                    </button>


                    <button
                        onClick={() =>
                            navigate("/tailor/reviews")
                        }
                    >
                        Reviews
                    </button>
                    

                    <button
                        onClick={() =>
                            navigate("/tailor/notifications")
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
                            navigate("/tailor/measurement")
                        }
                    >
                        AI Measurement
                    </button>


                    <button
                        onClick={() =>
                            navigate("/tailor/delivery")
                        }
                    >
                        Delivery
                    </button>


                </nav>



                <div className="tailor-profile-sidebar-bottom">

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

            <main className="tailor-profile-main">


                <div className="tailor-profile-header">


                    <div>

                        <h1>
                            My Tailor Profile
                        </h1>

                        <p>
                            Manage your public tailoring profile
                        </p>

                    </div>


                    {
                        profile &&
                        !editing &&
                        (

                            <button
                                className="edit-profile-btn"
                                onClick={handleStartEdit}
                            >
                                Edit Profile
                            </button>

                        )
                    }


                </div>



                {error && (

                    <div className="tailor-profile-error">

                        {error}

                    </div>

                )}



                {/* ==========================
                    CREATE PROFILE
                ========================== */}

                {!profile && (

                    <div className="create-profile-card">


                        <div className="create-profile-heading">

                            <h2>
                                Create Your Tailor Profile
                            </h2>

                            <p>
                                Complete your shop information to submit your profile for admin approval.
                            </p>

                        </div>



                        <form
                            onSubmit={handleCreateProfile}
                            className="tailor-profile-form"
                        >


                            <div className="profile-form-group">

                                <label>
                                    Shop Name
                                </label>

                                <input
                                    type="text"
                                    name="shopName"
                                    value={formData.shopName}
                                    onChange={handleChange}
                                    required
                                />

                            </div>



                            <div className="profile-form-group">

                                <label>
                                    Experience (Years)
                                </label>

                                <input
                                    type="number"
                                    name="experience"
                                    min="0"
                                    value={formData.experience}
                                    onChange={handleChange}
                                    required
                                />

                            </div>



                            <div className="profile-form-group full">

                                <label>
                                    Specialization
                                </label>

                                <input
                                    type="text"
                                    name="specialization"
                                    value={formData.specialization}
                                    onChange={handleChange}
                                    required
                                    placeholder="Panjabi, Suit, Shirt"
                                />

                                <small>
                                    Separate multiple specializations with commas
                                </small>

                            </div>



                            <div className="profile-form-group">

                                <label>
                                    Location
                                </label>

                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    required
                                />

                            </div>



                            <div className="profile-form-group full">

                                <label>
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="5"
                                />

                            </div>



                            <div className="profile-form-actions">

                                <button
                                    type="submit"
                                    disabled={creating}
                                >

                                    {
                                        creating
                                        ?
                                        "Creating Profile..."
                                        :
                                        "Create Profile"
                                    }

                                </button>

                            </div>


                        </form>


                    </div>

                )}





                {/* ==========================
                    EDIT PROFILE
                ========================== */}

                {profile && editing && (

                    <div className="create-profile-card edit-profile-card">


                        <div className="create-profile-heading">

                            <h2>
                                Edit Tailor Profile
                            </h2>

                            <p>
                                Update your shop and service information.
                            </p>

                        </div>



                        <form
                            onSubmit={handleUpdateProfile}
                            className="tailor-profile-form"
                        >


                            <div className="profile-form-group">

                                <label>
                                    Shop Name
                                </label>

                                <input
                                    type="text"
                                    name="shopName"
                                    value={editFormData.shopName}
                                    onChange={handleEditChange}
                                    required
                                />

                            </div>



                            <div className="profile-form-group">

                                <label>
                                    Experience (Years)
                                </label>

                                <input
                                    type="number"
                                    name="experience"
                                    min="0"
                                    value={editFormData.experience}
                                    onChange={handleEditChange}
                                    required
                                />

                            </div>



                            <div className="profile-form-group full">

                                <label>
                                    Specialization
                                </label>

                                <input
                                    type="text"
                                    name="specialization"
                                    value={editFormData.specialization}
                                    onChange={handleEditChange}
                                    required
                                />

                                <small>
                                    Separate multiple specializations with commas
                                </small>

                            </div>



                            <div className="profile-form-group">

                                <label>
                                    Location
                                </label>

                                <input
                                    type="text"
                                    name="location"
                                    value={editFormData.location}
                                    onChange={handleEditChange}
                                    required
                                />

                            </div>



                            <div className="profile-form-group full">

                                <label>
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={editFormData.description}
                                    onChange={handleEditChange}
                                    rows="5"
                                />

                            </div>



                            <div className="profile-edit-actions">


                                <button
                                    type="button"
                                    className="cancel-edit-btn"
                                    onClick={handleCancelEdit}
                                    disabled={updating}
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="save-edit-btn"
                                    disabled={updating}
                                >

                                    {
                                        updating
                                        ?
                                        "Saving..."
                                        :
                                        "Save Changes"
                                    }

                                </button>


                            </div>


                        </form>


                    </div>

                )}





                {/* ==========================
                    VIEW PROFILE
                ========================== */}

                {profile && !editing && (

                    <>


                        {/* ==========================
                            VERIFICATION STATUS
                        ========================== */}

                        <div
                            className={
                                `tailor-verification-panel ${
                                    profile.verificationStatus ||
                                    "pending"
                                }`
                            }
                        >


                            <div>

                                <span>
                                    Verification Status
                                </span>

                                <h3>

                                    {
                                        profile.verificationStatus === "approved"
                                        ?
                                        "Profile Approved"
                                        :
                                        profile.verificationStatus === "rejected"
                                        ?
                                        "Profile Rejected"
                                        :
                                        "Waiting for Admin Approval"
                                    }

                                </h3>

                            </div>


                            <div
                                className={
                                    `tailor-verification-status ${
                                        profile.verificationStatus ||
                                        "pending"
                                    }`
                                }
                            >

                                {
                                    profile.verificationStatus ||
                                    "pending"
                                }

                            </div>


                        </div>



                        {/* ==========================
                            AVAILABILITY STATUS
                        ========================== */}

                        <div
                            className={
                                `tailor-availability-panel ${
                                    profile.availabilityStatus ||
                                    "available"
                                }`
                            }
                        >


                            <div className="tailor-availability-info">

                                <span>
                                    Home Measurement Availability
                                </span>


                                <h3>

                                    {
                                        profile.availabilityStatus ===
                                        "busy"
                                        ?
                                        "Currently Busy"
                                        :
                                        profile.availabilityStatus ===
                                        "unavailable"
                                        ?
                                        "Currently Unavailable"
                                        :
                                        "Available for Home Measurement"
                                    }

                                </h3>


                                <p>

                                    {
                                        profile.availabilityStatus ===
                                        "available"
                                        ?
                                        "Customers can send you home measurement requests."
                                        :
                                        profile.availabilityStatus ===
                                        "busy"
                                        ?
                                        "Customers can see that you are currently busy."
                                        :
                                        "Home measurement requests are currently disabled."
                                    }

                                </p>


                            </div>



                            <div className="tailor-availability-control">


                                <label>
                                    Availability
                                </label>


                                <select
                                    value={
                                        profile.availabilityStatus ||
                                        "available"
                                    }
                                    disabled={
                                        availabilityLoading
                                    }
                                    onChange={(e) =>
                                        handleAvailabilityChange(
                                            e.target.value
                                        )
                                    }
                                >

                                    <option value="available">
                                        Available
                                    </option>

                                    <option value="busy">
                                        Busy
                                    </option>

                                    <option value="unavailable">
                                        Unavailable
                                    </option>

                                </select>


                                {
                                    availabilityLoading
                                    && (

                                        <small>
                                            Updating...
                                        </small>

                                    )
                                }


                            </div>


                        </div>



                        <div className="tailor-profile-content-grid">


                            <div className="tailor-public-profile-card">


                                <div className="tailor-profile-image-box">


                                    {
                                        profile.profileImage
                                        ? (

                                            <img
                                                src={profile.profileImage}
                                                alt={profile.shopName}
                                            />

                                        )
                                        : (

                                            <div className="tailor-profile-placeholder">

                                                {
                                                    user?.name
                                                        ?.charAt(0)
                                                        ?.toUpperCase() ||
                                                    "T"
                                                }

                                            </div>

                                        )
                                    }


                                </div>



                                <label className="profile-upload-btn">

                                    {
                                        imageUploading
                                        ?
                                        "Uploading..."
                                        :
                                        profile.profileImage
                                        ?
                                        "Change Profile Image"
                                        :
                                        "Upload Profile Image"
                                    }


                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleProfileImage}
                                        disabled={imageUploading}
                                    />

                                </label>



                                <h2>

                                    {profile.shopName}

                                </h2>


                                <p className="tailor-owner-name">

                                    {
                                        profile.user?.name ||
                                        user?.name
                                    }

                                </p>


                                <div className="profile-detail-row">

                                    <span>
                                        Location
                                    </span>

                                    <strong>
                                        {profile.location}
                                    </strong>

                                </div>


                                <div className="profile-detail-row">

                                    <span>
                                        Experience
                                    </span>

                                    <strong>
                                        {profile.experience} years
                                    </strong>

                                </div>


                                {/* AVAILABILITY QUICK STATUS */}

                                <div className="profile-detail-row">

                                    <span>
                                        Home Measurement
                                    </span>

                                    <strong
                                        className={
                                            `tailor-profile-availability-text ${
                                                profile.availabilityStatus ||
                                                "available"
                                            }`
                                        }
                                    >

                                        {
                                            profile.availabilityStatus ===
                                            "busy"
                                            ?
                                            "Busy"
                                            :
                                            profile.availabilityStatus ===
                                            "unavailable"
                                            ?
                                            "Unavailable"
                                            :
                                            "Available"
                                        }

                                    </strong>

                                </div>


                            </div>





                            <div className="tailor-profile-details-card">


                                <h2>
                                    Profile Information
                                </h2>


                                <div className="profile-info-block">

                                    <span>
                                        Email
                                    </span>

                                    <strong>
                                        {
                                            profile.user?.email ||
                                            user?.email
                                        }
                                    </strong>

                                </div>


                                <div className="profile-info-block">

                                    <span>
                                        Phone
                                    </span>

                                    <strong>
                                        {
                                            profile.user?.phone ||
                                            "-"
                                        }
                                    </strong>

                                </div>


                                <div className="profile-info-block">

                                    <span>
                                        Gender
                                    </span>

                                    <strong>

                                        {
                                            profile.user?.gender
                                            ?
                                            profile.user.gender
                                                .charAt(0)
                                                .toUpperCase() +
                                            profile.user.gender
                                                .slice(1)
                                            :
                                            "-"
                                        }

                                    </strong>

                                </div>


                                <div className="profile-info-block">

                                    <span>
                                        Specialization
                                    </span>


                                    <div className="profile-specialization">

                                        {
                                            profile.specialization
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

                                </div>


                                <div className="profile-info-block">

                                    <span>
                                        Description
                                    </span>

                                    <p>

                                        {
                                            profile.description ||
                                            "No description added"
                                        }

                                    </p>

                                </div>


                            </div>


                        </div>





                        {/* ==========================
                            PORTFOLIO
                        ========================== */}

                        <div className="tailor-portfolio-card">


                            <div className="tailor-portfolio-heading">


                                <div>

                                    <h2>
                                        Portfolio
                                    </h2>

                                    <p>
                                        Showcase your tailoring work
                                    </p>

                                </div>


                                <label className="portfolio-upload-btn">

                                    {
                                        portfolioUploading
                                        ?
                                        "Uploading..."
                                        :
                                        "Add Portfolio Images"
                                    }


                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handlePortfolioImages}
                                        disabled={portfolioUploading}
                                    />

                                </label>


                            </div>



                            <div className="portfolio-grid">


                                {
                                    profile.portfolioImages &&
                                    profile.portfolioImages.length > 0
                                    ? (

                                        profile.portfolioImages.map(
                                            (
                                                image,
                                                index
                                            ) => (

                                                <div
                                                    className="portfolio-image-card"
                                                    key={index}
                                                >

                                                    <img
                                                        src={image}
                                                        alt={`Portfolio ${index + 1}`}
                                                    />

                                                </div>

                                            )
                                        )

                                    )
                                    : (

                                        <div className="portfolio-empty">

                                            No portfolio images uploaded yet

                                        </div>

                                    )
                                }


                            </div>


                        </div>


                    </>

                )}


            </main>


        </div>

    );

};


export default TailorProfile;