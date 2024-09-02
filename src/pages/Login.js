import Base from "../components/Base";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/login.css";
import { toast } from "react-toastify";
import { USER_LOGIN_API } from "../services/user-service";
import { doLogin, isLoggedIn } from "../auth";
import { FaEnvelope, FaLock } from 'react-icons/fa';

const Login = () => {
    const [formError, setFormError] = useState("");

    const navigate = useNavigate();
    const [loginDetails, setLogindetails] = useState({
        email: "",
        password: ""
    })
    useEffect(() => {
        if (isLoggedIn()) {
            navigate('/user-routes/dashboard'); // Redirect to dashboard if already logged in
        }
    }, [navigate]);
    const handlechnage = (e, field) => {
        let actualValue = e.target.value;
        setLogindetails({
            ...loginDetails,
            [field]: actualValue
        })
    }
    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (!loginDetails.email || !loginDetails.password) {
            setFormError("All fields are required");
            return;
        }
        USER_LOGIN_API(loginDetails).then((jwtTokendata) => {
            doLogin(jwtTokendata, () => {
                console.log("Login detail saved to local storage");
            })
            navigate("/user-routes/dashboard");
            toast.success("Login Success");
        }).catch(error => {
            console.log(error)
            if(error.message==="Network Error"){
                setFormError("Backend Network Error");
            }else
            if (error.response?.status === 401) {
                setFormError(error.response.data);
            }else if(error.response?.status === 404){
                setFormError(error.response.data);
            } else {
                setFormError("Something Went Wrong");
            }
        })
    }

    const signup = () => {
        navigate("/signup");
    };
    return (
        <Base>
            <div>
                <div className="login-container">
                    <h3 className="Login_page_name">Login</h3>
                    <div className="login-form">
                     <div className="form-outer">
                     <div className="container">
                            <form className="form">
                             <div className="form-input">
                            <span className="icon"><FaEnvelope/></span>
                         <input
                             type="email"
                            placeholder="email"
                            value={loginDetails.email}
                            onChange={(e) => handlechnage(e, "email")}
                            className="icontext"
                        />
                        </div>
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
                               placeholder="password"
                               value={loginDetails.password}
                               onChange={(e) => handlechnage(e, "password")}
                               className="icontext"
                        />
                        </div>
                            </form>
                        </div>
                    </div>
                        <div className="error-message">
                            {formError}
                        </div>
                        <p className="donthaveaccount" onClick={signup}>
                            Don't Have an Account?<b > Signup</b>
                        </p>
                        <button className="sign2 mt-2" onClick={handleFormSubmit}>
                            Sign in
                        </button>
	    {/*<div className="create-account forgotpass"  >
                            <NavLink to="/forgot-password">Forgot Password</NavLink>
                        </div>*/}
                    </div>
                </div>
            </div>
        </Base>
    )
}
export default Login;
