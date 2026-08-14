import { useEffect, useState } from "react";
import {
    Link,
    useNavigate,
    useSearchParams
} from "react-router-dom";

import api from "../api/axios";

import "./Register.css";


const Register = () => {

    const navigate = useNavigate();

    const [searchParams] =
        useSearchParams();


    const roleFromUrl =
        searchParams.get("role");


    const [formData,setFormData] = useState({

        name:"",
        email:"",
        phone:"",
        gender:"",
        role:"",
        password:"",
        confirmPassword:""

    });


    const [error,setError] = useState("");

    const [loading,setLoading] = useState(false);



    // ==========================
    // ROLE FROM HOME PAGE
    // ==========================

    useEffect(() => {

        if(
            roleFromUrl === "customer" ||
            roleFromUrl === "tailor"
        ){

            setFormData(
                (previous) => ({

                    ...previous,

                    role:roleFromUrl

                })
            );

        }

    }, [roleFromUrl]);



    // ==========================
    // CHANGE
    // ==========================

    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]:
                e.target.value

        });

    };



    // ==========================
    // SUBMIT
    // ==========================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");


        if(!formData.role){

            setError(
                "Please select a role"
            );

            return;

        }


        if(
            ![
                "customer",
                "tailor"
            ].includes(formData.role)
        ){

            setError(
                "Invalid registration role"
            );

            return;

        }


        if(
            formData.password !==
            formData.confirmPassword
        ){

            setError(
                "Passwords do not match"
            );

            return;

        }


        try {

            setLoading(true);


            const registrationData = {

                name:
                    formData.name.trim(),

                email:
                    formData.email
                        .trim()
                        .toLowerCase(),

                phone:
                    formData.phone.trim(),

                gender:
                    formData.gender,

                role:
                    formData.role,

                password:
                    formData.password

            };


            const response = await api.post(
                "/auth/register",
                registrationData
            );


            sessionStorage.setItem(
                "pendingRegistration",
                JSON.stringify(
                    registrationData
                )
            );


            navigate(
                "/verify-otp",
                {
                    state:{
                        email:
                            response.data.email
                    }
                }
            );

        }
        catch(error){

            setError(
                error.response?.data?.message ||
                "Registration failed"
            );

        }
        finally{

            setLoading(false);

        }

    };



    return (

        <div className="register-page">


            <div className="register-left">


                <div
                    className="register-logo"
                    onClick={() =>
                        navigate("/")
                    }
                >
                    BD Tailoring
                </div>


                <div className="register-left-content">

                    <span>
                        YOUR TAILORING, YOUR WAY
                    </span>

                    <h1>
                        From fabric to perfect fit, made simple.
                    </h1>

                    <p>
                        Find the right tailor without leaving home,
                        save valuable time and turn your favourite
                        fabric into clothing made just for you.
                    </p>

                    <p>
                        For tailors, BD Tailoring opens the door to
                        more customers, more orders and a smarter way
                        to grow your business.
                    </p>

                </div>


            </div>



            <div className="register-right">


                <div className="register-card">


                    <div className="register-heading">

                        <h2>
                            Create your account
                        </h2>

                        <p>
                            Enter your information to get started.
                        </p>

                    </div>



                    {error && (

                        <div className="register-error">

                            {error}

                        </div>

                    )}



                    <form
                        onSubmit={handleSubmit}
                        className="register-form"
                    >


                        <div className="register-field">

                            <label>
                                Full Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                required
                            />

                        </div>


                        <div className="register-field">

                            <label>
                                Email
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="example@email.com"
                                required
                            />

                        </div>


                        <div className="register-field">

                            <label>
                                Phone
                            </label>

                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="01XXXXXXXXX"
                                required
                            />

                        </div>


                        <div className="register-field">

                            <label>
                                Gender
                            </label>

                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                required
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



                        <div className="register-field full">

                            <label>
                                Register As
                            </label>

                            <div className="register-role-grid">


                                <label
                                    className={
                                        formData.role === "customer"
                                        ?
                                        "register-role active"
                                        :
                                        "register-role"
                                    }
                                >

                                    <input
                                        type="radio"
                                        name="role"
                                        value="customer"
                                        checked={
                                            formData.role ===
                                            "customer"
                                        }
                                        onChange={handleChange}
                                    />

                                    <strong>
                                        Customer
                                    </strong>

                                    <span>
                                        Find tailors and place orders
                                    </span>

                                </label>



                                <label
                                    className={
                                        formData.role === "tailor"
                                        ?
                                        "register-role active"
                                        :
                                        "register-role"
                                    }
                                >

                                    <input
                                        type="radio"
                                        name="role"
                                        value="tailor"
                                        checked={
                                            formData.role ===
                                            "tailor"
                                        }
                                        onChange={handleChange}
                                    />

                                    <strong>
                                        Tailor
                                    </strong>

                                    <span>
                                        Offer tailoring services
                                    </span>

                                </label>


                            </div>

                        </div>



                        <div className="register-field">

                            <label>
                                Password
                            </label>

                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="register-field">

                            <label>
                                Confirm Password
                            </label>

                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="password-help full">

                            Minimum 8 characters with uppercase,
                            lowercase, number and special character.

                        </div>



                        <button
                            type="submit"
                            className="register-submit"
                            disabled={loading}
                        >

                            {
                                loading
                                ?
                                "Sending OTP..."
                                :
                                "Continue with Email Verification"
                            }

                        </button>


                    </form>



                    <div className="register-login">

                        Already have an account?{" "}

                        <Link to="/login">
                            Login
                        </Link>

                    </div>


                </div>


            </div>


        </div>

    );

};


export default Register;