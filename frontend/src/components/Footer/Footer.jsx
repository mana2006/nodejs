import logo001 from "../../assets/desktop/logo001.png";
import logo002 from "../../assets/desktop/logo002.png";
import './footer.css';
const Footer = () => {
    return (
        <div className="row">
            <div className="col-3"><img className="footer-logo001" src={logo001} alt="error" /></div>
            <div className="col-3"></div>
            <div className="col-3"></div>
            <div className="col-3"><img className="footer-logo002" src={logo002} alt="error" /></div>
        </div>
    );
}

export default Footer;