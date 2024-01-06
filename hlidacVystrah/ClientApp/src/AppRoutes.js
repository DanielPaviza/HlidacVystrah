
import { HomeController } from "./components/HomeController";
import { Login } from "./components/Login";

const AppRoutes = [
    {
        index: true,
        element: <HomeController />
    },
    {
        path: '/login',
        element: <Login />
    }
];

export default AppRoutes;
