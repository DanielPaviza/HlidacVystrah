
import { HomeController } from "./components/HomeController";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { ResetPassword } from "./components/ResetPassword";
import { NotFound } from "./components/NotFound";
import { UserAccount } from "./components/UserAccount";
import { NewPassword } from "./components/NewPassword";
import ActivateAccount from "./components/ActivateAccount";

const AppRoutes = [
    {
        index: true,
        element: <HomeController />
    },
    {
        path: '/login',
        element: <Login />
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
        path: '/account',
        element: <UserAccount />
    },
    {
        path: '*',
        element: <NotFound />
    }
];

export default AppRoutes;
