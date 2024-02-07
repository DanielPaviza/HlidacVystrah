import React, { Component } from 'react';
import { Route, Routes } from 'react-router-dom';
import { HomeController } from "./components/HomeController";
import { Register } from "./components/Register";
import { ResetPassword } from "./components/ResetPassword";
import { NotFound } from "./components/NotFound";
import { UserAccount } from "./components/UserAccount";
import { NewPassword } from "./components/NewPassword";
import { Adm } from "./components/adm/Adm";
import { Logs } from "./components/adm/Logs";
import { Users } from "./components/adm/Users";
import ActivateAccount from "./components/ActivateAccount";
import LocalityController from './components/LocalityController';
import { BrowserRouter as Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './styles/shared.scss';

const LoginRedirect = () => {
    const navigate = useNavigate();

    React.useEffect(() => {
        navigate('/account', { replace: true });
    }, [navigate]);

    return null;
};

const App = () => {
    const AppRoutes = [
        {
            index: true,
            element: <HomeController />
        },
        {
            path: '/obec/:cisorp',
            element: <LocalityController />,
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
            path: '/_adm/users',
            element: <Users />
        },
        {
            path: '*',
            element: <NotFound />
        },
    ];

    return (
        <Routes>
            {AppRoutes.map((route, index) => {
                const { path, element, ...rest } = route;
                return <Route key={index} path={path} element={element} {...rest} />;
            })}
        </Routes>
    );
}

export default App;