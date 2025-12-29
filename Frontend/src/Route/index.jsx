import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../Pages/Home";
import SearchPage from "../Pages/SearchPage";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import ForgotPassword from "../Pages/ForgotPassword";
import OtpVerification from "../Pages/OtpVerification";
import ResetPasswod from "../Pages/ResetPasswod";

const router = createBrowserRouter([
    {
        path : '/',
        element : <App/>,
        children : [
            {
               path : "",
               element : <Home/> 
            },{
                path : "search",
                element : <SearchPage/> 
            },{
                path : "login",
                element : <Login />
            },
            {
                path : "register",
                element : <Register/>
            },
            {
                path : "forgot-password",
                element : <ForgotPassword />
            },
            {
                path : "verify-forgot-password-otp",
                element : <OtpVerification />
            },{
                path : "reset-password",
                element : <ResetPasswod />
            }
        ]
    }
])
export default router