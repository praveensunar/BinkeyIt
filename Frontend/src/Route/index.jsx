import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../Pages/Home";
import SearchPage from "../Pages/SearchPage";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import ForgotPassword from "../Pages/ForgotPassword";
import OtpVerification from "../Pages/OtpVerification";
import ResetPasswod from "../Pages/ResetPasswod";
import UserMenuMobile from "../Pages/UserMenuMobile";
import Dashboard from "../Layouts/Dashboard";
import Profile from "../Pages/Profile";
import Myorders from "../Pages/Myorders";
import Address from "../Pages/Address";

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
            },{
                path : 'user',
                element : <UserMenuMobile/>
            },{
                path : 'dashboard',
                element : <Dashboard/>,
                children : [
                    {
                        path : "profile",
                        element : <Profile/>
                    },{
                        path : "myorders",
                        element : <Myorders />
                    },{
                        path : "address",
                        element : <Address />
                    }
                ] 
            }
        ]
    }
])
export default router