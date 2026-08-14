import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";


const ProtectedRoute = ({
    children,
    allowedRoles
}) => {

    const {
        user,
        isAuthenticated
    } = useSelector(
        (state) => state.auth
    );


    if(!isAuthenticated){

        return <Navigate to="/login" replace />;

    }


    if(
        allowedRoles &&
        !allowedRoles.includes(user?.role)
    ){

        return <Navigate to="/" replace />;

    }


    return children;

};


export default ProtectedRoute;