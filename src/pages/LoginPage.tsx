import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { loginUser } from "../app/slices/authSlice";

export default function LoginPage() {
  //

  const error = useSelector((state) => state.auth.error);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/messenger";

  const user = useSelector((state: any) => state.auth.user);
  const loading = useSelector((state: any) => state.auth.loadingSubmit);

  // console.log({ from });
  //
  useEffect(() => {
    if (user) {
      navigate(from, { replace: true }); // 🟢 Redirect to the last attempted route
    }
  }, [user, from, navigate]);
  // console.log({ user });
  //

  // useEffect(() => {
  //   if (user) {
  //     return navigate("/messenger");
  //   }
  // }, [user]);
  // Local state for form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Handle login form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const resultAction = await dispatch(loginUser({ email, password }));

    // If login success, redirect to home page
    if (loginUser.fulfilled.match(resultAction)) {
      navigate("/messenger");
    }
    //
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Login to Messenger
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-700 rounded-lg px-3 py-2 text-gray-00 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center mt-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-70 transition-all"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-4">
          Don’t have an account?{" "}
          <a
            onClick={() => {
              navigate("/register");
            }}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
