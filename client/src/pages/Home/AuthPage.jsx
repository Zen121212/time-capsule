import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService.js";
import InputField from "../../components/common/InputField/InputField.jsx";
import styles from "./AuthPage.module.css";

function AuthPage() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("login");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setError("");
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError("Please fill in all required fields");
      return false;
    }

    if (activeTab === "register") {
      if (!formData.fullName) {
        setError("Please enter your full name");
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match!");
        return false;
      }
    }
    return true;
  };

  const handleRegister = async () => {
    console.log("Attempting to register:", {
      fullName: formData.fullName,
      email: formData.email,
    });

    const result = await authService.register(formData);
    if (result.success) {
      console.log("Registration successful:", result.user);
      navigate("/dashboard");
    } else {
      setError(result.message);
    }
  };

  const handleLogin = async () => {
    console.log("Attempting to login:", {
      email: formData.email,
    });

    const result = await authService.login({
      email: formData.email,
      password: formData.password,
    });

    if (result.success) {
      console.log("Login successful:", result.user);
      navigate("/dashboard");
    } else {
      console.log("Login failed:", result.message);
      setError(result.message);
    }
  };

  const handleSubmit = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (loading) return;
    if (!validateForm()) {
      return;
    }
    processSubmission();
  };

  const processSubmission = async () => {
    setLoading(true);
    setError("");

    try {
      if (activeTab === "register") {
        await handleRegister();
      } else {
        await handleLogin();
      }
    } catch (error) {
      console.error("Auth error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Welcome to Time Capsule!</h1>
      <div className={styles.authBox}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${
              activeTab === "register" ? styles.active : ""
            }`}
            onClick={() => handleTabSwitch("register")}
          >
            Register
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "login" ? styles.active : ""
            }`}
            onClick={() => handleTabSwitch("login")}
          >
            Login
          </button>
        </div>
        <hr />
        {error && <div className={styles.error}>{error}</div>}
        <form className={styles.form} onSubmit={handleSubmit}>
          {activeTab === "register" && (
            <InputField
              label="Full Name"
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          )}
          <InputField
            label="Email"
            type="email"
            name="email"
            placeholder="example@gmail.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <InputField
            label="Password"
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {activeTab === "register" && (
            <InputField
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          )}
          <button type="submit" className={styles.submit} disabled={loading}>
            {loading
              ? "Processing..."
              : activeTab === "register"
              ? "Register"
              : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AuthPage;
