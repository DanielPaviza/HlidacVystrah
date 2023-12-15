import { Counter } from "./components/Counter";
import { Home } from "./components/Home";
import { Hello } from "./components/Hello";

const AppRoutes = [
  {
    index: true,
    element: <Home />
  },
  {
    path: '/counter',
    element: <Counter />
  },
  {
    path: '/hello',
      element: <Hello />
  }
];

export default AppRoutes;
