import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import MessengerDashboardPage from "../pages/MessengerDashboardPage";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser } from "../app/slices/authSlice";
import { ProtectedRoute } from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import NotFound from "../pages/NotFound";
import ProfilePage from "../pages/ProfilePage";
import GeneralLoading from "../components/GeneralLoading";

export default function AppRouter() {
  //
  const dispatch = useDispatch();
  //
  const loading = useSelector((state) => state.auth.loading);
  const user = useSelector((state) => state.auth.user);
  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);
  //

  //
  // if (loading) return <div>Loading logo...</div>;
  if (loading) return <GeneralLoading />;
  //
  // if (loadingUserMessages) return <div>loadingUserMessages...</div>;
  //
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicRoute />}>
          {/* <Route path="/" element={<ChatList />} /> */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Protected Routes */}

        <Route element={<ProtectedRoute />}>
          <Route path="/messenger" element={<MessengerDashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
