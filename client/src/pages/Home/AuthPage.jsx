import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (activeTab === "register") {
      console.log("Register data:", formData);

      // Optional: validate password match
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      // Simulate user creation response
      const newUser = {
        id: Date.now(), // fake user id
        fullName: formData.fullName,
        email: formData.email,
      };

      // ✅ Save user in localStorage
      localStorage.setItem("user", JSON.stringify(newUser));

      // ✅ Redirect to dashboard
      navigate("/dashboard");
    } else {
      console.log("Login data:", {
        email: formData.email,
        password: formData.password,
      });

      // Simulate fetching user from a database
      const fakeUser = {
        id: "123",
        fullName: "Test User",
        email: formData.email,
      };

      localStorage.setItem("user", JSON.stringify(fakeUser));
      navigate("/dashboard");
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
          <button type="submit" className={styles.submit}>
            {activeTab === "register" ? "Register" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AuthPage;
