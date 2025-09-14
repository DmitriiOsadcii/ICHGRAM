import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";


import { selectToken,selectAuthUser } from "../../redux/auth/auth.selectors";

function PrivateRoute() {
  const user = useSelector(selectAuthUser);
  const token = useSelector(selectToken);

  if (!user && token) return <p>Loading...</p>;

  if (!user) return <Navigate to="/" />;

  return <Outlet />;
}

export default PrivateRoute;