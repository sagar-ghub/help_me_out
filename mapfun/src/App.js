import "./App.css";
import Map from "./components/Map";
import Login from "./Pages/Login";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import Register from "./Pages/Register";
import Home from "./Pages/Home";
const token = localStorage.getItem("token");

const router = createBrowserRouter([
  {
    path: "/",
    element: token ? <Navigate to={"/home"} /> : <Register />,
  },
  {
    path: "home",
    element: <Home />,
  },
  {
    path: "login",
    element: token ? <Navigate to={"/home"} /> : <Login />,
  },
  {
    path: "map",
    element: <Map />,
  },
]);
function App() {
  return (
    <div className="App ">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
