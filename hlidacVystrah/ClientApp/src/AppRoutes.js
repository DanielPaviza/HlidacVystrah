
import { HomeController } from "./components/HomeController";
import { Register } from "./components/Register";
import { ResetPassword } from "./components/ResetPassword";
import { NotFound } from "./components/NotFound";
import { UserAccount } from "./components/UserAccount";
import { NewPassword } from "./components/NewPassword";
import { Adm } from "./components/adm/Adm";
import { Logs } from "./components/adm/Logs";
import ActivateAccount from "./components/ActivateAccount";
import { BrowserRouter as Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import React from 'react';

const LoginRedirect = () => {
    const navigate = useNavigate();

    React.useEffect(() => {
        navigate('/account', { replace: true });
    }, [navigate]);

    return null;
};

const AppRoutes = [
    {
        index: true,
        element: <HomeController />
    },
    {
        path: '/register',
        element: <Register />
    },
    {
        path: '/resetpassword',
        element: <ResetPassword />
    },
    {
        path: '/newpassword',
        element: <NewPassword />
    },
    {
        path: '/activateaccount',
        element: <ActivateAccount />
    },
    {
        path: '/login',
        element: <LoginRedirect />
    },
    {
        path: '/account',
        element: <UserAccount />
    },
    {
        path: '/_adm',
        element: <Adm />
    },
    {
        path: '/_adm/logs',
        element: <Logs />
    },
    {
        path: '*',
        element: <NotFound />
    },
];

export default AppRoutes;
