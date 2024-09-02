import { Outlet,Navigate } from "react-router-dom";
import { isLoggedIn } from "../auth";
import PrivateNav from "./PrivateNav";
const PrivateRoutes=()=>{
    return isLoggedIn() ? <><PrivateNav /><Outlet /></> : <Navigate to="/login" />;
    
}
export default PrivateRoutes;