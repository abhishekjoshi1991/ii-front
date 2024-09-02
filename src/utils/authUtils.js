import { toast } from 'react-toastify';
import { doLogout } from '../auth';

export const handleSessionExpiration = (error, navigate) => {
    console.log(error)
    if (error?.response?.status === 403) {
        console.log(error)
        doLogout(() => {
            toast.error("Session Expired");
            navigate("/login");
        });
    } else {
        toast.error(error?.response?.data || error?.message ||"An error occurred");
    }
};