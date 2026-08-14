import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";
import { logout } from "../redux/authSlice";


const useLogout = () => {

    const dispatch = useDispatch();

    const navigate = useNavigate();


    const handleLogout = async () => {

        try {

            await api.post(
                "/auth/logout"
            );

        }
        catch (error) {

            console.log(
                "Logout API error:",
                error
            );

        }
        finally {

            dispatch(
                logout()
            );

            navigate(
                "/login",
                {
                    replace:true
                }
            );

        }

    };


    return handleLogout;

};


export default useLogout;