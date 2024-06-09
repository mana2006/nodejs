import "./login.css";
import logo003 from "../../assets/desktop/logo003.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
    const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState();
    const [flagDisabled, setFlagDisabled] = useState(false);
    let navigate = useNavigate();
    const handleClick = async () => {
        if (email.match(isValidEmail) == null) {
            setMessage("Please, enter a valid email!");
        } else {
            setMessage("");
            setFlagDisabled(true);
            let data = await getData(email)
            if (data.status === 200) {
                localStorage.setItem('email', email)
                navigate('/auth-page', { state: { email: email } });
            }
        }

        async function getData(email) {
            const res = await axios({
                method: "post",
                url: process.env.REACT_APP_BACKEND_HOST_URL + ":" + process.env.REACT_APP_BACKEND_PORT + "/api/auth/before_signin",
                data: {
                    email: email
                }
            });
            return res;
        }
    }

    return (
        <section className="container login-form-content">
            <div className="row justify-content-md-center ">
                <img className="login-image-logo" src={logo003} alt="error" />
            </div>
            <div className="row justify-content-md-center">
                Log in to continue
            </div>
            <div className="row justify-content-md-center">
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" />
                <span className="login-valid-message">{message}</span>
            </div>
            <div className="row justify-content-md-center login-button-custom">
                <button type="button" disabled={flagDisabled} onClick={handleClick} className="btn btn-primary">Continue</button>
            </div>
            <div className="row justify-content-md-center login-font-size-privacy">
                Privacy Policy
            </div>
            <div className="row justify-content-md-center login-font-size">This site is protected by reCAPTCHA and the Google Privacy</div>
            <div className="row login-font-size">
                <a className="policy">Policy and Terms of Service apply.</a>
            </div>

        </section>
    )
}

export default Login;