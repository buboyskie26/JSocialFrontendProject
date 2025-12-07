import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function PublicRoute() {
  //
  const user = useSelector((w) => w.auth.user);
  const loading = useSelector((w) => w.auth.loading);
  const location = useLocation();

  if (loading) return <div>Loading Public Route...</div>;
  const from = location?.state?.from?.pathname || "messenger";
  //
  return user ? <Navigate to={from} replace /> : <Outlet />;
}
