import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { lazy } from "react";


const Cars = lazy(() => import("./Pages/Dashboard/Cars"));
const Landing = lazy(() => import("./Pages/Landing"));
const Login = lazy(() => import("./Pages/Login"));
const Signup = lazy(() => import("./Pages/Signup"));
const Home = lazy(() => import("./Pages/Dashboard/Home"));
const Dashboard = lazy(() => import("./Pages/Dashboard/Dashboard"));
const Account = lazy(() => import("./Pages/Dashboard/Account"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <Home />,
    children: [
      {
        path: "/dashboard/users",
        element: <Dashboard />,
      },
      {
        path: "/dashboard/account",
        element: <Account />,
      },{
        path: "/dashboard/cars",
        element: <Cars />,
      },{
        path: "/dashboard/cars/:userCarsId",
        element: <Cars />,
      },
    ],
  },
]);

const App = () => {
  
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;
