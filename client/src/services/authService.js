import api from "./api.js";

async function register(userData) {
  try {
    const requestData = {
      name: userData.fullName,
      email: userData.email,
      password: userData.password,
    };

    console.log("Sending registration data:", requestData);

    const response = await api.post("/register", requestData);
    const { user, authorisation } = response.data.data;

    localStorage.setItem("token", authorisation.token);

    return {
      success: true,
      user: user,
      token: authorisation.token,
      message: response.data.message,
    };
  } catch (error) {
    console.error("Register error:", error);
    console.error("Error response:", error.response?.data);
    console.error("Error status:", error.response?.status);
    return {
      success: false,
      message: error.response?.data?.message || "Registration failed",
      errors: error.response?.data?.errors || {},
    };
  }
}

async function login(credentials) {
  try {
    console.log("Attempting login with:", {
      email: credentials.email,
      password: credentials.password ? "[PASSWORD PROVIDED]" : "[NO PASSWORD]",
    });

    const response = await api.post("/login", {
      email: credentials.email,
      password: credentials.password,
    });

    const { user, authorisation } = response.data.data;

    console.log("Saving token only");
    localStorage.setItem("token", authorisation.token);

    return {
      success: true,
      user: user,
      token: authorisation.token,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Login failed",
    };
  }
}

async function logout() {
  try {
    await api.post("/logout");
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    localStorage.removeItem("token");
  }
}

function getToken() {
  return localStorage.getItem("token");
}

function isAuthenticated() {
  const token = localStorage.getItem("token");
  return token !== null && token !== "undefined";
}

function migrateToTokenStorage() {
  const oldUser = localStorage.getItem("user");
  if (oldUser) {
    try {
      const userData = JSON.parse(oldUser);
      if (userData.token) {
        localStorage.setItem("token", userData.token);
      }
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Error migrating user data:", error);
      localStorage.removeItem("user");
    }
  }
}

export const authService = {
  register,
  login,
  logout,
  getToken,
  isAuthenticated,
  migrateToTokenStorage,
};
