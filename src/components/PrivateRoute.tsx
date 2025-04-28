import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function PrivateRoute({ children }: { children: JSX.Element }){
    const { authenticated } = useAuth();

    return authenticated ? children : <Navigate to={"/"}/>;
}

export default PrivateRoute