// import axios from "axios";

import axios from "../../utils/axiosConfig";

// Define your backend API base URL (adjust this to your backend endpoint)
const API_URL = "http://localhost:3000/api/auth";

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}
//
//
export const AuthService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    //
    const response = await axios.post("/loginUser", credentials);
    console.log({ response });

    //
    // Optional: Save token in localStorage for later use
    // if (response.data.token) {
    //   localStorage.setItem("token", response.data.token);
    // }

    return response.data; // { token, user }
  },

  //   async register(data: { username: string; email: string; password: string }) {
  //     const response = await axios.post(`${API_URL}/register`, data);
  //     return response.data;
  //   },

  logout: async () => {
    await axios.post("/logoutUser");
  },

  // logout() {
  //   localStorage.removeItem("token");
  // },
};
