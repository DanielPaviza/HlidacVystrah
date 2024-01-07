
import { HomeController } from "./components/HomeController";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { ResetPassword } from "./components/ResetPassword";
import { NewPassword } from "./components/NewPassword";
import { NotFound } from "./components/NotFound";

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
        path: '/newpassword/:id/:token',
        element: <NewPassword />
    },
    {
        path: '*',
        element: <NotFound />
    }
];

export default AppRoutes;
