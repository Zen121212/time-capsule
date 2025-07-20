import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService.js";
import styles from "./AuthPage.module.css";

function AuthPage() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("register");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // ✅ Check if user already logged in
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (activeTab === "register") {
        // Validate password match on frontend
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match!");
          setLoading(false);
          return;
        }

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
      } else {
        console.log("Attempting to login:", {
          email: formData.email,
        });

        const result = await authService.login({
          email: formData.email,
          password: formData.password,
        });

        if (result.success) {
          console.log("Login successful:", result.user);
          console.log("Attempting to navigate to dashboard...");
          navigate("/dashboard");
        } else {
          console.log("Login failed:", result.message);
          setError(result.message);
        }
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
            onClick={() => setActiveTab("register")}
          >
            Register
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "login" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>
        </div>
        {error && <div className={styles.error}>{error}</div>}
        <form className={styles.form} onSubmit={handleSubmit}>
          {activeTab === "register" && (
            <>
              <label className={styles.label}>
                Full Name
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={styles.input}
                  required
                />
              </label>
            </>
          )}
          <label className={styles.label}>
            Email
            <input
              type="email"
              name="email"
              placeholder="example@gmail.com"
              value={formData.email}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </label>
          <label className={styles.label}>
            Password
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </label>
          {activeTab === "register" && (
            <label className={styles.label}>
              Confirm Password
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </label>
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
