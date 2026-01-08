import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { lazy } from "react";
import { SectionCards } from "./components/SectionCards";
import CarCard from "./components/CarCard";


const Roles = lazy(() => import("./Pages/Dashboard/Roles"));
const Cars = lazy(() => import("./Pages/Dashboard/Cars"));
const Landing = lazy(() => import("./Pages/Landing"));
const Login = lazy(() => import("./Pages/Login"));
const Signup = lazy(() => import("./Pages/Signup"));
const Home = lazy(() => import("./Pages/Dashboard/Home"));
const Dashboard = lazy(() => import("./Pages/Dashboard/Dashboard"));
const Account = lazy(() => import("./Pages/Dashboard/Account"));
const CarDetails = lazy(() => import("./Pages/CarDetails"));

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
    path: "/cars",
    element: <CarCard />,
  },{
    path:"/cars/:carId",
    element: <CarDetails />,
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
        path: "/dashboard/roles",
        element: <Roles />,
      },
      {
        path: "/dashboard/account",
        element: <Account />,
      },{
        path: "/dashboard/cars",  
        element: <Cars />,
      },{
        path: "/dashboard",
        element: <SectionCards />,
      }
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
