import { useState } from "react";
import { useDispatch } from "react-redux";
import {
    Link,
    useLocation,
    useNavigate
} from "react-router-dom";

import api from "../api/axios";
import { loginSuccess } from "../redux/authSlice";

import "./Login.css";


const Login = () => {

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const location = useLocation();


    const [formData,setFormData] = useState({

        email:"",
        password:""

    });


    const [error,setError] = useState("");

    const [loading,setLoading] = useState(false);



    const handleChange = (e)=>{

        setFormData({

            ...formData,

            [e.target.name]:
                e.target.value

        });

    };



    const handleSubmit = async(e)=>{

        e.preventDefault();

        setError("");

        setLoading(true);


        try{


            const response = await api.post(

                "/auth/login",

                formData

            );


            dispatch(

                loginSuccess({

                    user:
                        response.data.user,

                    token:
                        response.data.token

                })

            );



            const role =
                response.data.user.role;


            if(role === "admin"){

                navigate(
                    "/admin",
                    {
                        replace:true
                    }
                );

            }

            else if(role === "tailor"){

                navigate(
                    "/tailor",
                    {
                        replace:true
                    }
                );

            }

            else if(role === "customer"){

                navigate(
                    "/customer",
                    {
                        replace:true
                    }
                );

            }

            else{

                navigate(
                    "/",
                    {
                        replace:true
                    }
                );

            }


        }

        catch(error){


            setError(

                error.response?.data?.message
                ||
                "Login failed"

            );


        }

        finally{

            setLoading(false);

        }

    };



    return (

        <div className="login-page">


            <div className="login-card">


                <div
                    className="login-logo"
                    onClick={() =>
                        navigate("/")
                    }
                >

                    BD Tailoring

                </div>


                <div className="login-heading">

                    <h1>
                        Welcome back
                    </h1>

                    <p>
                        Login to continue to your account.
                    </p>

                </div>



                {location.state?.message && (

                    <div className="login-success">

                        {
                            location.state.message
                        }

                    </div>

                )}



                {error && (

                    <div className="login-error">

                        {error}

                    </div>

                )}



                <form
                    onSubmit={handleSubmit}
                    className="login-form"
                >


                    <div className="login-field">

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



                    <div className="login-field">

                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter password"
                            required
                        />

                    </div>



                    <button
                        type="submit"
                        className="login-submit"
                        disabled={loading}
                    >

                        {
                            loading
                            ? "Logging in..."
                            : "Login"
                        }

                    </button>


                </form>



                <div className="login-register">

                    Don't have an account?{" "}

                    <Link to="/register">
                        Register
                    </Link>

                </div>


            </div>


        </div>

    );

};


export default Login;