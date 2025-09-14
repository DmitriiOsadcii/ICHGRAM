import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import {selectAuthUser ,selectToken } from "../../redux/auth/auth.selectors";

const PublicRoute=()=> {
  const isLoggedIn = useSelector(selectAuthUser);
  const authToken = useSelector(selectToken);

  if (!isLoggedIn && authToken) return <p>Loading...</p>;

  if (isLoggedIn) return <Navigate to="/main" />;

  return <Outlet />;
}

export default PublicRoute;