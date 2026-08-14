import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";
import useLogout from "../hooks/useLogout";
import useNotifications from "../hooks/useNotifications";
import useMessages from "../hooks/useMessages";

import "./CustomerProfile.css";


const CustomerProfile = () => {

    const navigate = useNavigate();

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

    // ==========================
    // PROFILE STATE
    // ==========================

    const [profile, setProfile] = useState(null);

    const [profileForm, setProfileForm] = useState({

        name:"",
        phone:"",
        gender:""

    });


    const [editingProfile, setEditingProfile] =
        useState(false);



    // ==========================
    // ADDRESS STATE
    // ==========================

    const [addresses, setAddresses] = useState([]);

    const [showAddressForm, setShowAddressForm] =
        useState(false);

    const [editingAddressId, setEditingAddressId] =
        useState(null);


    const emptyAddress = {

        title:"",
        division:"",
        district:"",
        area:"",
        street:"",
        house:"",
        postalCode:"",
        isDefault:false

    };


    const [addressForm, setAddressForm] =
        useState(emptyAddress);



    // ==========================
    // GENERAL STATE
    // ==========================

    const [loading, setLoading] = useState(true);

    const [profileSaving, setProfileSaving] =
        useState(false);

    const [imageUploading, setImageUploading] =
        useState(false);

    const [addressSaving, setAddressSaving] =
        useState(false);

    const [deletingAddressId, setDeletingAddressId] =
        useState("");

    const [error, setError] = useState("");



    // ==========================
    // LOAD PROFILE + ADDRESSES
    // ==========================

    const loadCustomerData = async () => {

        try {

            setLoading(true);

            setError("");


            const [
                profileResponse,
                addressResponse
            ] = await Promise.all([

                api.get(
                    "/users/profile"
                ),

                api.get(
                    "/users/address"
                )

            ]);


            const user =
                profileResponse.data.user;


            setProfile(user);


            setProfileForm({

                name:
                    user?.name || "",

                phone:
                    user?.phone || "",

                gender:
                    user?.gender || ""

            });


            setAddresses(
                addressResponse.data.addresses || []
            );

        }
        catch(error){

            console.log(error);


            setError(
                error.response?.data?.message ||
                "Failed to load profile"
            );

        }
        finally{

            setLoading(false);

        }

    };


    useEffect(() => {

        loadCustomerData();

    }, []);



    // ==========================
    // PROFILE CHANGE
    // ==========================

    const handleProfileChange = (e) => {

        setProfileForm({

            ...profileForm,

            [e.target.name]:
                e.target.value

        });

    };



    // ==========================
    // UPDATE PROFILE
    // ==========================

    const handleProfileSubmit = async (e) => {

        e.preventDefault();


        try {

            setProfileSaving(true);


            const response = await api.put(
                "/users/profile",
                {

                    name:
                        profileForm.name,

                    phone:
                        profileForm.phone,

                    gender:
                        profileForm.gender

                }
            );


            setProfile(
                (previous) => ({

                    ...previous,

                    ...response.data.user,

                    email:
                        previous?.email

                })
            );


            setEditingProfile(false);


            alert(
                "Profile updated successfully"
            );

        }
        catch(error){

            alert(
                error.response?.data?.message ||
                "Failed to update profile"
            );

        }
        finally{

            setProfileSaving(false);

        }

    };



    // ==========================
    // CANCEL PROFILE EDIT
    // ==========================

    const cancelProfileEdit = () => {

        setProfileForm({

            name:
                profile?.name || "",

            phone:
                profile?.phone || "",

            gender:
                profile?.gender || ""

        });


        setEditingProfile(false);

    };



    // ==========================
    // UPLOAD PROFILE IMAGE
    // ==========================

    const handleProfileImageUpload = async (e) => {

        const file =
            e.target.files?.[0];


        if(!file){

            return;

        }


        if(file.size > 5 * 1024 * 1024){

            alert(
                "Image size must be less than 5 MB"
            );

            e.target.value = "";

            return;

        }


        try {

            setImageUploading(true);


            const data =
                new FormData();


            data.append(
                "image",
                file
            );


            const response = await api.put(
                "/users/profile/image",
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
    // ADDRESS CHANGE
    // ==========================

    const handleAddressChange = (e) => {

        const {
            name,
            value,
            type,
            checked
        } = e.target;


        setAddressForm({

            ...addressForm,

            [name]:
                type === "checkbox"
                ?
                checked
                :
                value

        });

    };



    // ==========================
    // OPEN ADD ADDRESS
    // ==========================

    const openAddAddress = () => {

        setEditingAddressId(null);

        setAddressForm(
            emptyAddress
        );

        setShowAddressForm(true);

    };



    // ==========================
    // OPEN EDIT ADDRESS
    // ==========================

    const openEditAddress = (address) => {

        setEditingAddressId(
            address._id
        );


        setAddressForm({

            title:
                address.title || "",

            division:
                address.division || "",

            district:
                address.district || "",

            area:
                address.area || "",

            street:
                address.street || "",

            house:
                address.house || "",

            postalCode:
                address.postalCode || "",

            isDefault:
                address.isDefault || false

        });


        setShowAddressForm(true);

    };



    // ==========================
    // CANCEL ADDRESS FORM
    // ==========================

    const cancelAddressForm = () => {

        setShowAddressForm(false);

        setEditingAddressId(null);

        setAddressForm(
            emptyAddress
        );

    };



    // ==========================
    // SAVE ADDRESS
    // ==========================

    const handleAddressSubmit = async (e) => {

        e.preventDefault();


        try {

            setAddressSaving(true);


            if(editingAddressId){

                await api.put(
                    `/users/address/${editingAddressId}`,
                    addressForm
                );

            }
            else{

                await api.post(
                    "/users/address",
                    addressForm
                );

            }


            const response = await api.get(
                "/users/address"
            );


            setAddresses(
                response.data.addresses || []
            );


            cancelAddressForm();


            alert(
                editingAddressId
                ?
                "Address updated successfully"
                :
                "Address added successfully"
            );

        }
        catch(error){

            alert(
                error.response?.data?.message ||
                "Failed to save address"
            );

        }
        finally{

            setAddressSaving(false);

        }

    };



    // ==========================
    // DELETE ADDRESS
    // ==========================

    const handleDeleteAddress = async (
        addressId
    ) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this address?"
            );


        if(!confirmed){

            return;

        }


        try {

            setDeletingAddressId(
                addressId
            );


            const response = await api.delete(
                `/users/address/${addressId}`
            );


            setAddresses(
                response.data.addresses || []
            );

        }
        catch(error){

            alert(
                error.response?.data?.message ||
                "Failed to delete address"
            );

        }
        finally{

            setDeletingAddressId("");

        }

    };



    // ==========================
    // FORMAT ADDRESS
    // ==========================

    const getAddressLine = (address) => {

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
    // LOADING
    // ==========================

    if(loading){

        return (

            <div className="customer-profile-state">

                Loading profile...

            </div>

        );

    }



    // ==========================
    // ERROR
    // ==========================

    if(error){

        return (

            <div className="customer-profile-state error">

                {error}

            </div>

        );

    }



    return (

        <div className="customer-profile-page">


            {/* ==========================
                SIDEBAR
            ========================== */}

            <aside className="customer-profile-sidebar">


                <div className="customer-profile-logo">

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
                        onClick={() =>
                            navigate("/customer/home-measurements")
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
                        className="active"
                        onClick={() =>
                            navigate("/customer/profile")
                        }
                    >
                        My Profile
                    </button>


                </nav>



                <div className="customer-profile-sidebar-bottom">

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

            <main className="customer-profile-main">


                <div className="customer-profile-header">


                    <div>

                        <h1>
                            My Profile
                        </h1>

                        <p>
                            Manage your personal information and delivery addresses
                        </p>

                    </div>


                </div>





                {/* ==========================
                    PROFILE CARD
                ========================== */}

                <section className="customer-profile-card">


                    <div className="customer-profile-card-top">


                        <div className="customer-profile-identity">


                            <div className="customer-profile-image-wrapper">


                                {
                                    profile?.profileImage
                                    ? (

                                        <img
                                            src={profile.profileImage}
                                            alt={profile.name}
                                            className="customer-profile-image"
                                        />

                                    )
                                    : (

                                        <div className="customer-profile-avatar">

                                            {
                                                profile?.name
                                                    ?.charAt(0)
                                                    ?.toUpperCase()
                                                ||
                                                "C"
                                            }

                                        </div>

                                    )
                                }


                                <label className="customer-profile-upload-btn">

                                    {
                                        imageUploading
                                        ?
                                        "Uploading..."
                                        :
                                        profile?.profileImage
                                        ?
                                        "Change Photo"
                                        :
                                        "Upload Photo"
                                    }


                                    <input
                                        type="file"
                                        accept="image/*"
                                        disabled={imageUploading}
                                        onChange={handleProfileImageUpload}
                                    />

                                </label>


                            </div>


                            <div>

                                <h2>
                                    {profile?.name}
                                </h2>

                                <p>
                                    {profile?.email}
                                </p>

                                <span>
                                    Customer Account
                                </span>

                            </div>


                        </div>



                        {
                            !editingProfile
                            && (

                                <button
                                    className="customer-edit-profile-btn"
                                    onClick={() =>
                                        setEditingProfile(true)
                                    }
                                >
                                    Edit Profile
                                </button>

                            )
                        }


                    </div>





                    {
                        editingProfile
                        ? (

                            <form
                                className="customer-profile-form"
                                onSubmit={handleProfileSubmit}
                            >


                                <div className="customer-profile-field">

                                    <label>
                                        Full Name
                                    </label>

                                    <input
                                        type="text"
                                        name="name"
                                        value={profileForm.name}
                                        onChange={handleProfileChange}
                                        required
                                    />

                                </div>



                                <div className="customer-profile-field">

                                    <label>
                                        Email
                                    </label>

                                    <input
                                        type="email"
                                        value={profile?.email || ""}
                                        disabled
                                    />

                                </div>



                                <div className="customer-profile-field">

                                    <label>
                                        Phone
                                    </label>

                                    <input
                                        type="text"
                                        name="phone"
                                        value={profileForm.phone}
                                        onChange={handleProfileChange}
                                        required
                                    />

                                </div>



                                <div className="customer-profile-field">

                                    <label>
                                        Gender
                                    </label>

                                    <select
                                        name="gender"
                                        value={profileForm.gender}
                                        onChange={handleProfileChange}
                                    >

                                        <option value="">
                                            Select gender
                                        </option>

                                        <option value="male">
                                            Male
                                        </option>

                                        <option value="female">
                                            Female
                                        </option>

                                        <option value="other">
                                            Other
                                        </option>

                                    </select>

                                </div>



                                <div className="customer-profile-actions">

                                    <button
                                        type="button"
                                        className="customer-cancel-btn"
                                        onClick={cancelProfileEdit}
                                        disabled={profileSaving}
                                    >
                                        Cancel
                                    </button>


                                    <button
                                        type="submit"
                                        className="customer-save-btn"
                                        disabled={profileSaving}
                                    >

                                        {
                                            profileSaving
                                            ?
                                            "Saving..."
                                            :
                                            "Save Changes"
                                        }

                                    </button>

                                </div>


                            </form>

                        )
                        : (

                            <div className="customer-profile-info-grid">


                                <div>

                                    <span>
                                        Full Name
                                    </span>

                                    <strong>
                                        {profile?.name || "-"}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Email
                                    </span>

                                    <strong>
                                        {profile?.email || "-"}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Phone
                                    </span>

                                    <strong>
                                        {profile?.phone || "-"}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Gender
                                    </span>

                                    <strong>

                                        {
                                            profile?.gender
                                            ?
                                            profile.gender
                                                .charAt(0)
                                                .toUpperCase()
                                            +
                                            profile.gender.slice(1)
                                            :
                                            "-"
                                        }

                                    </strong>

                                </div>


                            </div>

                        )
                    }


                </section>





                {/* ==========================
                    ADDRESS HEADER
                ========================== */}

                <div className="customer-address-heading">


                    <div>

                        <h2>
                            Delivery Addresses
                        </h2>

                        <p>
                            Save multiple addresses for faster checkout
                        </p>

                    </div>


                    <button
                        onClick={openAddAddress}
                    >
                        + Add Address
                    </button>


                </div>





                {/* ==========================
                    ADDRESS FORM
                ========================== */}

                {
                    showAddressForm
                    && (

                        <section className="customer-address-form-card">


                            <h3>

                                {
                                    editingAddressId
                                    ?
                                    "Edit Address"
                                    :
                                    "Add New Address"
                                }

                            </h3>


                            <form
                                className="customer-address-form"
                                onSubmit={handleAddressSubmit}
                            >


                                <div className="customer-address-field">

                                    <label>
                                        Address Title
                                    </label>

                                    <input
                                        type="text"
                                        name="title"
                                        value={addressForm.title}
                                        onChange={handleAddressChange}
                                        placeholder="Home / Office"
                                    />

                                </div>



                                <div className="customer-address-field">

                                    <label>
                                        Division
                                    </label>

                                    <input
                                        type="text"
                                        name="division"
                                        value={addressForm.division}
                                        onChange={handleAddressChange}
                                        placeholder="Dhaka"
                                    />

                                </div>



                                <div className="customer-address-field">

                                    <label>
                                        District
                                    </label>

                                    <input
                                        type="text"
                                        name="district"
                                        value={addressForm.district}
                                        onChange={handleAddressChange}
                                    />

                                </div>



                                <div className="customer-address-field">

                                    <label>
                                        Area
                                    </label>

                                    <input
                                        type="text"
                                        name="area"
                                        value={addressForm.area}
                                        onChange={handleAddressChange}
                                    />

                                </div>



                                <div className="customer-address-field">

                                    <label>
                                        Street
                                    </label>

                                    <input
                                        type="text"
                                        name="street"
                                        value={addressForm.street}
                                        onChange={handleAddressChange}
                                    />

                                </div>



                                <div className="customer-address-field">

                                    <label>
                                        House
                                    </label>

                                    <input
                                        type="text"
                                        name="house"
                                        value={addressForm.house}
                                        onChange={handleAddressChange}
                                    />

                                </div>



                                <div className="customer-address-field">

                                    <label>
                                        Postal Code
                                    </label>

                                    <input
                                        type="text"
                                        name="postalCode"
                                        value={addressForm.postalCode}
                                        onChange={handleAddressChange}
                                    />

                                </div>



                                <label className="customer-default-address">

                                    <input
                                        type="checkbox"
                                        name="isDefault"
                                        checked={addressForm.isDefault}
                                        onChange={handleAddressChange}
                                    />

                                    <span>
                                        Set as default address
                                    </span>

                                </label>



                                <div className="customer-address-actions">

                                    <button
                                        type="button"
                                        className="customer-cancel-btn"
                                        onClick={cancelAddressForm}
                                        disabled={addressSaving}
                                    >
                                        Cancel
                                    </button>


                                    <button
                                        type="submit"
                                        className="customer-save-btn"
                                        disabled={addressSaving}
                                    >

                                        {
                                            addressSaving
                                            ?
                                            "Saving..."
                                            :
                                            editingAddressId
                                            ?
                                            "Update Address"
                                            :
                                            "Save Address"
                                        }

                                    </button>

                                </div>


                            </form>


                        </section>

                    )
                }





                {/* ==========================
                    ADDRESS LIST
                ========================== */}

                <div className="customer-address-grid">


                    {
                        addresses.map(
                            (address) => (

                                <div
                                    className={
                                        address.isDefault
                                        ?
                                        "customer-address-card default"
                                        :
                                        "customer-address-card"
                                    }
                                    key={address._id}
                                >


                                    <div className="customer-address-card-top">


                                        <div>

                                            <h3>

                                                {
                                                    address.title ||
                                                    "Address"
                                                }

                                            </h3>


                                            {
                                                address.isDefault
                                                && (

                                                    <span className="customer-default-badge">

                                                        Default

                                                    </span>

                                                )
                                            }

                                        </div>


                                    </div>



                                    <p>

                                        {
                                            getAddressLine(address)
                                            ||
                                            "Address information not provided"
                                        }

                                    </p>



                                    <div className="customer-address-card-actions">


                                        <button
                                            className="customer-address-edit-btn"
                                            onClick={() =>
                                                openEditAddress(
                                                    address
                                                )
                                            }
                                        >
                                            Edit
                                        </button>


                                        <button
                                            className="customer-address-delete-btn"
                                            disabled={
                                                deletingAddressId ===
                                                address._id
                                            }
                                            onClick={() =>
                                                handleDeleteAddress(
                                                    address._id
                                                )
                                            }
                                        >

                                            {
                                                deletingAddressId ===
                                                address._id
                                                ?
                                                "Deleting..."
                                                :
                                                "Delete"
                                            }

                                        </button>


                                    </div>


                                </div>

                            )
                        )
                    }



                    {
                        addresses.length === 0
                        && (

                            <div className="customer-no-address">

                                <h3>
                                    No addresses saved
                                </h3>

                                <p>
                                    Add your first delivery address to make ordering easier.
                                </p>

                            </div>

                        )
                    }


                </div>


            </main>


        </div>

    );

};


export default CustomerProfile;