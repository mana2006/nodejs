import './auth.css';
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Auth = () => {
    useEffect(() => {
        if (!emailUser) {
            navigate('/');
        }
    }, []);
    let navigate = useNavigate();
    const emailUser = localStorage.getItem("email");
    const [code, setCode] = useState('');
    const [flagDisabled, setFlagDisabled] = useState(false);
    const handleClick = async () => {
        setFlagDisabled(true);
        const userInfo = { email: emailUser, verify_code: code }
        let data = await signIn(userInfo)
        if (data.status === 200) {
            localStorage.removeItem("email");
            localStorage.setItem('accessToken', data.data.accessToken);
            let path = '/boards';
            navigate(path);
        }

        async function signIn(userInfo) {
            const data = await axios({
                method: "post",
                url: "http://localhost:8000/api/auth/signin",
                data: userInfo
            });
            return data;
        }
    };

    

    return (
        <section className="container auth-form-content">
            <div className="row justify-content-md-center">
            </div>
            <div className="row justify-content-md-center">
                <h1>Email Verification</h1>
                Please enter your code that send to your email address
            </div>
            <div className="row justify-content-md-center">
                <input type="text" value={code} onChange={e => setCode(e.target.value)} placeholder="Enter code verification" />
            </div>
            <div className="row justify-content-md-center auth-button-custom">
                <button type="button" disabled={flagDisabled} onClick={handleClick} className="btn btn-primary">Submit</button>
            </div>
            <div className="row justify-content-md-center auth-font-size-privacy">
                Privacy Policy
            </div>
            <div className="row justify-content-md-center auth-font-size">This site is protected by reCAPTCHA and the Google Privacy</div>
            <div className="row home-font-size">
                <a className="policy">Policy and Terms of Service apply.</a>
            </div>

        </section>
    );
}

export default Auth;