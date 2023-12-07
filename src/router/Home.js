import { Link } from "react-router-dom";
import { FIND_ACCOUNT, LOGIN, PET_ADD, REGISTER } from "../constants/UrlPath";

function Home() {
    return(
        <div>
            <h1>HOME PAGE</h1>
            <Link to={LOGIN}>LOGIN</Link>
            <Link to={REGISTER}>SIGN UP</Link>
            <Link to={PET_ADD}>PET ADD</Link>
            <Link to={FIND_ACCOUNT}>FIND ACCOUNT</Link>
        </div>
    )
};

export default Home;