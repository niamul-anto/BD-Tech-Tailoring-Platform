import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import api from "../api/axios";
import useLogout from "../hooks/useLogout";
import useNotifications from "../hooks/useNotifications";
import useMessages from "../hooks/useMessages";

import "./TailorGigs.css";


const TailorGigs = () => {

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

    const [gigs, setGigs] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [creating, setCreating] = useState(false);

    const [editingId, setEditingId] = useState(null);

    const [updating, setUpdating] = useState(false);

    const [deleteLoading, setDeleteLoading] = useState("");

    const [imageUploading, setImageUploading] = useState("");


    // Each gig can have its own selected image
    const [selectedImages, setSelectedImages] = useState({});


    const [formData, setFormData] = useState({

        title:"",
        category:"",
        description:"",
        price:"",
        deliveryTime:""

    });


    const [editFormData, setEditFormData] = useState({

        title:"",
        category:"",
        description:"",
        price:"",
        deliveryTime:""

    });



    // ==========================
    // LOAD MY GIGS
    // ==========================

    const loadGigs = async () => {

        try {

            setLoading(true);

            setError("");


            const response = await api.get(
                "/gigs/my-gigs"
            );


            setGigs(
                response.data.gigs || []
            );

        }
        catch(error){

            console.log(error);


            setError(
                error.response?.data?.message ||
                "Failed to load gigs"
            );

        }
        finally{

            setLoading(false);

        }

    };


    useEffect(() => {

        if(user?.id){

            loadGigs();

        }

    }, [user?.id]);



    // ==========================
    // SELECT GALLERY IMAGE
    // ==========================

    const handleSelectImage = (
        gigId,
        imageIndex
    ) => {

        setSelectedImages(
            (previous) => ({

                ...previous,

                [gigId]:imageIndex

            })
        );

    };



    // ==========================
    // CREATE FORM CHANGE
    // ==========================

    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]:
                e.target.value

        });

    };



    // ==========================
    // EDIT FORM CHANGE
    // ==========================

    const handleEditChange = (e) => {

        setEditFormData({

            ...editFormData,

            [e.target.name]:
                e.target.value

        });

    };



    // ==========================
    // CREATE GIG
    // ==========================

    const handleCreateGig = async (e) => {

        e.preventDefault();


        try {

            setCreating(true);

            setError("");


            const response = await api.post(
                "/gigs",
                {

                    title:
                        formData.title,

                    category:
                        formData.category,

                    description:
                        formData.description,

                    price:
                        Number(formData.price),

                    deliveryTime:
                        Number(formData.deliveryTime),

                    images:[]

                }
            );


            const newGig = {

                ...response.data.gig,

                tailor:{

                    _id:user.id,

                    name:user.name,

                    email:user.email

                }

            };


            setGigs(
                (previous) => [

                    newGig,

                    ...previous

                ]
            );


            setFormData({

                title:"",
                category:"",
                description:"",
                price:"",
                deliveryTime:""

            });


            alert(
                "Gig created successfully"
            );

        }
        catch(error){

            setError(
                error.response?.data?.message ||
                "Failed to create gig"
            );

        }
        finally{

            setCreating(false);

        }

    };



    // ==========================
    // START EDIT
    // ==========================

    const handleStartEdit = (gig) => {

        setEditingId(
            gig._id
        );


        setEditFormData({

            title:
                gig.title || "",

            category:
                gig.category || "",

            description:
                gig.description || "",

            price:
                gig.price || "",

            deliveryTime:
                gig.deliveryTime || ""

        });

    };



    // ==========================
    // CANCEL EDIT
    // ==========================

    const handleCancelEdit = () => {

        setEditingId(null);

    };



    // ==========================
    // UPDATE GIG
    // ==========================

    const handleUpdateGig = async (
        e,
        gigId
    ) => {

        e.preventDefault();


        try {

            setUpdating(true);


            const response = await api.put(
                `/gigs/${gigId}`,
                {

                    title:
                        editFormData.title,

                    category:
                        editFormData.category,

                    description:
                        editFormData.description,

                    price:
                        Number(editFormData.price),

                    deliveryTime:
                        Number(editFormData.deliveryTime)

                }
            );


            setGigs(
                (previous) =>

                    previous.map(
                        (gig) =>

                            gig._id === gigId
                            ? {

                                ...gig,

                                ...response.data.gig

                            }
                            : gig

                    )

            );


            setEditingId(null);


            alert(
                "Gig updated successfully"
            );

        }
        catch(error){

            alert(
                error.response?.data?.message ||
                "Failed to update gig"
            );

        }
        finally{

            setUpdating(false);

        }

    };



    // ==========================
    // DELETE GIG
    // ==========================

    const handleDeleteGig = async (
        gigId
    ) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this gig?"
            );


        if(!confirmed){

            return;

        }


        try {

            setDeleteLoading(
                gigId
            );


            await api.delete(
                `/gigs/${gigId}`
            );


            setGigs(
                (previous) =>

                    previous.filter(
                        (gig) =>
                            gig._id !== gigId
                    )

            );


            setSelectedImages(
                (previous) => {

                    const updated = {
                        ...previous
                    };

                    delete updated[gigId];

                    return updated;

                }
            );


            alert(
                "Gig deleted successfully"
            );

        }
        catch(error){

            alert(
                error.response?.data?.message ||
                "Failed to delete gig"
            );

        }
        finally{

            setDeleteLoading("");

        }

    };



    // ==========================
    // UPLOAD GIG IMAGES
    // ==========================

    const handleGigImages = async (
        e,
        gigId
    ) => {

        const files =
            Array.from(
                e.target.files || []
            );


        if(files.length === 0){

            return;

        }


        const currentGig = gigs.find(
            (gig) => gig._id === gigId
        );


        const currentImageCount =
            currentGig?.images?.length || 0;


        const remainingSlots =
            5 - currentImageCount;


        if(remainingSlots <= 0){

            alert(
                "This gig already has the maximum 5 images"
            );

            e.target.value = "";

            return;

        }


        if(files.length > remainingSlots){

            alert(
                `You can upload only ${remainingSlots} more image(s). Maximum 5 images per gig.`
            );

            e.target.value = "";

            return;

        }


        try {

            setImageUploading(
                gigId
            );


            const data =
                new FormData();


            files.forEach(
                (file) => {

                    data.append(
                        "images",
                        file
                    );

                }
            );


            const response = await api.put(
                `/gigs/${gigId}/images`,
                data
            );


            setGigs(
                (previous) =>

                    previous.map(
                        (gig) =>

                            gig._id === gigId
                            ? {

                                ...gig,

                                images:
                                    response.data.images

                            }
                            : gig

                    )

            );


            // Show first image after upload
            setSelectedImages(
                (previous) => ({

                    ...previous,

                    [gigId]:0

                })
            );


            alert(
                "Gig images uploaded successfully"
            );

        }
        catch(error){

            alert(
                error.response?.data?.message ||
                "Failed to upload gig images"
            );

        }
        finally{

            setImageUploading("");

            e.target.value = "";

        }

    };



    return (

        <div className="tailor-gigs-page">


            {/* ==========================
                SIDEBAR
            ========================== */}

            <aside className="tailor-gigs-sidebar">


                <div className="tailor-gigs-logo">

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
                        onClick={() =>
                            navigate("/tailor/profile")
                        }
                    >
                        My Profile
                    </button>


                    <button
                        className="active"
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
                    
                    <button
                        onClick={() =>
                            navigate("/tailor/home-measurements")
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



                <div className="tailor-gigs-sidebar-bottom">

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

            <main className="tailor-gigs-main">


                <div className="tailor-gigs-header">


                    <div>

                        <h1>
                            My Gigs
                        </h1>

                        <p>
                            Create and manage your tailoring services
                        </p>

                    </div>


                    <div className="tailor-gig-count">

                        {gigs.length} Gigs

                    </div>


                </div>



                {error && (

                    <div className="tailor-gigs-error">

                        {error}

                    </div>

                )}





                {/* ==========================
                    CREATE GIG
                ========================== */}

                <div className="create-gig-card">


                    <div className="create-gig-heading">

                        <h2>
                            Create New Gig
                        </h2>

                        <p>
                            Only approved tailor profiles can create gigs.
                        </p>

                    </div>



                    <form
                        className="gig-form"
                        onSubmit={handleCreateGig}
                    >


                        <div className="gig-form-group">

                            <label>
                                Gig Title
                            </label>

                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                placeholder="Premium Panjabi Stitching"
                            />

                        </div>



                        <div className="gig-form-group">

                            <label>
                                Category
                            </label>

                            <input
                                type="text"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                                placeholder="Panjabi"
                            />

                        </div>



                        <div className="gig-form-group">

                            <label>
                                Price
                            </label>

                            <input
                                type="number"
                                name="price"
                                min="0"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                placeholder="1800"
                            />

                        </div>



                        <div className="gig-form-group">

                            <label>
                                Delivery Time (Days)
                            </label>

                            <input
                                type="number"
                                name="deliveryTime"
                                min="1"
                                value={formData.deliveryTime}
                                onChange={handleChange}
                                required
                                placeholder="7"
                            />

                        </div>



                        <div className="gig-form-group full">

                            <label>
                                Description
                            </label>

                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="4"
                                required
                                placeholder="Describe your tailoring service"
                            />

                        </div>



                        <div className="gig-form-actions">

                            <button
                                type="submit"
                                disabled={creating}
                            >

                                {
                                    creating
                                    ?
                                    "Creating..."
                                    :
                                    "Create Gig"
                                }

                            </button>

                        </div>


                    </form>


                </div>





                {/* ==========================
                    GIG LIST
                ========================== */}

                <div className="tailor-gigs-section-heading">

                    <h2>
                        Your Service Listings
                    </h2>

                </div>



                {loading && (

                    <div className="tailor-gigs-state">

                        Loading gigs...

                    </div>

                )}



                {!loading && (

                    <div className="tailor-gigs-grid">


                        {gigs.map((gig) => {

                            const selectedIndex =
                                selectedImages[gig._id] ?? 0;


                            const selectedImage =
                                gig.images?.[
                                    selectedIndex
                                ];


                            return (

                                <div
                                    key={gig._id}
                                    className="tailor-gig-card"
                                >


                                    {/* ==========================
                                        IMAGE GALLERY
                                    ========================== */}

                                    <div className="gig-gallery">


                                        <div className="gig-main-image">


                                            {
                                                selectedImage
                                                ? (

                                                    <img
                                                        src={selectedImage}
                                                        alt={gig.title}
                                                    />

                                                )
                                                : (

                                                    <div className="tailor-no-image">

                                                        No Image

                                                    </div>

                                                )
                                            }


                                            {
                                                gig.images?.length > 1
                                                && (

                                                    <span className="gig-image-count">

                                                        {
                                                            selectedIndex + 1
                                                        }
                                                        /
                                                        {
                                                            gig.images.length
                                                        }

                                                    </span>

                                                )
                                            }


                                        </div>



                                        {
                                            gig.images &&
                                            gig.images.length > 1
                                            && (

                                                <div className="gig-thumbnails">


                                                    {
                                                        gig.images.map(
                                                            (
                                                                image,
                                                                index
                                                            ) => (

                                                                <button
                                                                    type="button"
                                                                    key={index}
                                                                    className={
                                                                        selectedIndex === index
                                                                        ?
                                                                        "gig-thumbnail active"
                                                                        :
                                                                        "gig-thumbnail"
                                                                    }
                                                                    onClick={() =>
                                                                        handleSelectImage(
                                                                            gig._id,
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


                                    </div>





                                    {
                                        editingId === gig._id
                                        ? (

                                            <form
                                                className="edit-gig-form"
                                                onSubmit={(e) =>
                                                    handleUpdateGig(
                                                        e,
                                                        gig._id
                                                    )
                                                }
                                            >


                                                <div className="gig-form-group">

                                                    <label>
                                                        Title
                                                    </label>

                                                    <input
                                                        name="title"
                                                        value={editFormData.title}
                                                        onChange={handleEditChange}
                                                        required
                                                    />

                                                </div>


                                                <div className="gig-form-group">

                                                    <label>
                                                        Category
                                                    </label>

                                                    <input
                                                        name="category"
                                                        value={editFormData.category}
                                                        onChange={handleEditChange}
                                                        required
                                                    />

                                                </div>


                                                <div className="gig-form-group">

                                                    <label>
                                                        Price
                                                    </label>

                                                    <input
                                                        type="number"
                                                        name="price"
                                                        value={editFormData.price}
                                                        onChange={handleEditChange}
                                                        required
                                                    />

                                                </div>


                                                <div className="gig-form-group">

                                                    <label>
                                                        Delivery Time
                                                    </label>

                                                    <input
                                                        type="number"
                                                        name="deliveryTime"
                                                        value={editFormData.deliveryTime}
                                                        onChange={handleEditChange}
                                                        required
                                                    />

                                                </div>


                                                <div className="gig-form-group full">

                                                    <label>
                                                        Description
                                                    </label>

                                                    <textarea
                                                        name="description"
                                                        rows="4"
                                                        value={editFormData.description}
                                                        onChange={handleEditChange}
                                                        required
                                                    />

                                                </div>


                                                <div className="edit-gig-actions">


                                                    <button
                                                        type="button"
                                                        className="cancel-gig-btn"
                                                        onClick={handleCancelEdit}
                                                        disabled={updating}
                                                    >
                                                        Cancel
                                                    </button>


                                                    <button
                                                        type="submit"
                                                        className="save-gig-btn"
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

                                        )
                                        : (

                                            <div className="tailor-gig-content">


                                                <span className="tailor-gig-category">

                                                    {gig.category}

                                                </span>


                                                <h3>

                                                    {gig.title}

                                                </h3>


                                                <p>

                                                    {gig.description}

                                                </p>


                                                <div className="tailor-gig-info">

                                                    <span>
                                                        Price
                                                    </span>

                                                    <strong>
                                                        ৳{gig.price}
                                                    </strong>

                                                </div>


                                                <div className="tailor-gig-info">

                                                    <span>
                                                        Delivery
                                                    </span>

                                                    <strong>
                                                        {gig.deliveryTime} days
                                                    </strong>

                                                </div>



                                                <label className="gig-image-upload-btn">

                                                    {
                                                        imageUploading === gig._id
                                                        ?
                                                        "Uploading..."
                                                        :
                                                        "Add Images"
                                                    }


                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        multiple
                                                        disabled={
                                                            imageUploading === gig._id
                                                        }
                                                        onChange={(e) =>
                                                            handleGigImages(
                                                                e,
                                                                gig._id
                                                            )
                                                        }
                                                    />

                                                </label>



                                                <div className="tailor-gig-actions">


                                                    <button
                                                        className="edit-gig-btn"
                                                        onClick={() =>
                                                            handleStartEdit(gig)
                                                        }
                                                    >
                                                        Edit
                                                    </button>


                                                    <button
                                                        className="delete-tailor-gig-btn"
                                                        disabled={
                                                            deleteLoading === gig._id
                                                        }
                                                        onClick={() =>
                                                            handleDeleteGig(
                                                                gig._id
                                                            )
                                                        }
                                                    >

                                                        {
                                                            deleteLoading === gig._id
                                                            ?
                                                            "Deleting..."
                                                            :
                                                            "Delete"
                                                        }

                                                    </button>


                                                </div>


                                            </div>

                                        )
                                    }


                                </div>

                            );

                        })}



                        {
                            gigs.length === 0 &&
                            !loading &&
                            (

                                <div className="tailor-no-gigs">

                                    You have not created any gigs yet.

                                </div>

                            )
                        }


                    </div>

                )}


            </main>


        </div>

    );

};


export default TailorGigs;