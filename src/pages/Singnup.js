import Base from "../components/Base";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isEmpty, isEmail, isMatch } from '../utils/validation';
import { SIGN_UP_API } from "../services/user-service";
import "./css/signup.css";
import { toast } from "react-toastify";
import { doLogin, isLoggedIn } from "../auth";
import { FaEnvelope, FaUser, FaLock } from 'react-icons/fa';
const Signup = () => {
    const [serverError, setServerError] = useState(null);
    const [data, setData] = useState({
        user_name: "",
        password: "",
        email: "",
        confirmpasword: ""
    })
    const navigate = useNavigate();
    useEffect(() => {
        if (isLoggedIn()) {
            navigate('/user-routes/dashboard'); 
        }
    }, [navigate]);

    

    const [error, setError] = useState({
        errors: {},
        isError: false,

    })
    const handleChange = (e, property) => {
        e.preventDefault();
        setData({ ...data, [property]: e.target.value })

    }
    const register = (e) => {
        e.preventDefault();
        // Initialize an errors object
        let errors = {};

        // Validation
        if (isEmpty(data.user_name)) errors.user_name = "Name is required";
        if (isEmpty(data.email) || !isEmail(data.email)) errors.email = "Invalid email";
        if (isEmpty(data.password)) errors.password = "Password must be at least 6 characters";
        if (!isMatch(data.password, data.confirmpasword)) errors.confirmpasword = "Passwords do not match";

        if (Object.keys(errors).length > 0) {
            setError({
                errors: errors,
                isError: true,
            });
            setTimeout(() => {
                setError({
                    errors: {},
                    isError: false
                });
            }, 6000);
            return;
        }
        SIGN_UP_API(data).then((resp) => {
            doLogin(resp, () => {
                toast.success("User signed up successfully");
                navigate('/user-routes/dashboard'); 
            })
            setServerError(null);
        }).catch((error) => {
            if (error.response) {
                const errorCode = error.response.status;
                console.log(error.response.data)
                switch (errorCode) {
                    case 400:
                        setServerError(error.response.data || "Email Already Registered");
                        break;
                    case 401:
                        setServerError("Unauthorized: Access is denied.");
                        break;
                    case 403:
                        setServerError("Forbidden: You don't have permission to access this resource.");
                        break;
                    case 404:
                        setServerError("Not Found: The resource you are looking for could not be found.");
                        break;
                    case 409:
                        setServerError(error.response.data||"Not Found: The resource you are looking for could not be found.");
                        break;
                    case 500:
                        setServerError("Internal Server Error: An error occurred on the server.");
                        break;
                    default:
                        setServerError(`An error occurred: ${errorCode}`);
                }
            } else {
                setServerError("An error occurred");
            }
        })
        setError({
            errors: {},
            isError: false
        });

    }
    const handleLogin = () => {
        navigate("/login");
    }
    return (
        <Base>
            <div className="login-container">
                <h3 className="Login_page_name">Signup</h3>
                <div className="login-form">
                    <div className="form-outer">
                     <div className="container">
                            <form className="form">
                             <div className="form-input">
                            <span className="icon"><FaEnvelope/></span>
                         <input
                            type="email"
                            placeholder="Email"
                            value={data.email}
                            onChange={(e) => handleChange(e, "email")}
                            className="icontext"
                        />
                        </div>
                        {error.errors.email && <div className="error-message">{error.errors.email}</div>}
                            </form>
                        </div>
                    </div>
             <div className="form-outer">
                     <div className="container">
                            <form className="form">
                             <div className="form-input">
                            <span className="icon"><FaUser/></span>
                            <input
                              type="text"
                              id="username"
                              placeholder="Enter Username"
                             value={data.user_name}
                             onChange={(e) => handleChange(e, "user_name")}
                              className="icontext"
                        />
                        </div>
                         {error.errors.user_name && <div className="error-message">{error.errors.user_name}</div>}
                            </form>
                        </div>
                    </div>
                      <div className="form-outer">
                     <div className="container">
                            <form className="form">
                             <div className="form-input">
                            <span className="icon"><FaLock /></span>
                            <input
                            type="password"
                            placeholder="Password"
                            value={data.password}
                            onChange={(e) => handleChange(e, "password")}
                            className="icontext"
                            
                        />
                        </div>
                             {error.errors.password && <div className="error-message">{error.errors.password}</div>}
                            </form>
                        </div>
                    </div>
                      <div className="form-outer">
                     <div className="container">
                            <form className="form">
                             <div className="form-input">
                            <span className="icon"><FaLock /></span>
                            <input
                            type="password"
                            placeholder="Confirm Password"
                            value={data.confirmpasword}
                            onChange={(e) => handleChange(e, "confirmpasword")}
                            className="icontext"
                        />
                        </div>
                          {error.errors.confirmpasword && <div className="error-message">{error.errors.confirmpasword}</div>} 
                            </form>
                        </div>
                    </div>
                    <div className="server-error-message error-message">
                        {serverError}
                    </div>
                    <p className="donthaveaccount" onClick={handleLogin}>
                    Already Have an Account?<b > Login</b>
                        </p>
                    <button className="sign2 mt-2" onClick={register}>
                        Signup
                    </button>
                </div>
            </div>
        </Base>
    )
}
export default Signup;