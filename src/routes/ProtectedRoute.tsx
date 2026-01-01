// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchCurrentUser } from "../features/auth/authSlice";
// import { Navigate } from "react-router-dom";

// interface ProtectedRouteProps {
//   children: React.ReactNode;
// }
// export default function ProtectedRoute({ children }: ProtectedRouteProps) {
//   const dispatch = useDispatch();

//   const user = useSelector((state) => state.auth.user);
//   const loading = useSelector((state) => state.auth.loading);

//   console.log({ user });

//   //   useEffect(() => {
//   //     if (!user) dispatch(fetchCurrentUser());
//   //   }, [dispatch, user]);

//   //
//   if (loading) return <div>Loading...</div>;

//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }

//   return <>{children}</>;
// }

// src/components/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export const ProtectedRoute = () => {
  //
  const user = useSelector((w) => w.auth.user);
  const loading = useSelector((w) => w.auth.loading);
  //
  const location = useLocation();
  //
  if (loading) return <div>Loading...</div>;
  //

  // console.log({ user });
  //
  // return user ? <Outlet /> : <Navigate to="/login" replace />;

  if (!user) {
    // Save the page the user tried to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
