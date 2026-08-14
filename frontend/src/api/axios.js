import axios from "axios";


const api = axios.create({

    baseURL:
        import.meta.env.VITE_API_URL ||
        "http://localhost:5000/api"

});



// ==========================
// REQUEST INTERCEPTOR
// ==========================

api.interceptors.request.use(

    (config)=>{

        const token =
            localStorage.getItem("token");


        if(token){

            config.headers.Authorization =
                `Bearer ${token}`;

        }


        return config;

    },

    (error)=>{

        return Promise.reject(
            error
        );

    }

);



// ==========================
// RESPONSE INTERCEPTOR
// AUTO LOGOUT BLOCKED USER
// ==========================

api.interceptors.response.use(

    (response)=>{

        return response;

    },

    (error)=>{


        const status =
            error.response?.status;


        const message =
            error.response?.data?.message;



        // ==========================
        // BLOCKED USER
        // ==========================

        if(
            status === 403 &&
            message ===
            "Your account has been blocked"
        ){

            // Remove authentication data

            localStorage.removeItem(
                "user"
            );

            localStorage.removeItem(
                "token"
            );


            // Redirect to login page

            window.location.href =
                "/login";

        }



        // ==========================
        // INVALID / EXPIRED TOKEN
        // OPTIONAL AUTO LOGOUT
        // ==========================

        if(
            status === 401 &&
            (
                message === "Unauthorized" ||
                message === "No token provided" ||
                message === "Invalid token format"
            )
        ){

            localStorage.removeItem(
                "user"
            );

            localStorage.removeItem(
                "token"
            );


            window.location.href =
                "/login";

        }



        return Promise.reject(
            error
        );

    }

);


export default api;