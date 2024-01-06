
import { HomeController } from "./components/HomeController";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { ResetPassword } from "./components/ResetPassword";
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
        path: '*',
        element: <NotFound />
    }
];

export default AppRoutes;
