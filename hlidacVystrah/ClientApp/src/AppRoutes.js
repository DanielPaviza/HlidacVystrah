
import { HomeController } from "./components/HomeController";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
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
        path: '*',
        element: <NotFound />
    }
];

export default AppRoutes;
