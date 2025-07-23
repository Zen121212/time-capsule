import { NavLink, useNavigate } from "react-router-dom";
import { authService } from "../../../services/authService.js";
import styles from "./Navigation.module.css";
import clock from "../../../assets/icons/png/clock.png";

const Navigation = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await authService.logout();
      navigate("/");
    } catch (error) {
      console.error("Sign out error:", error);
      navigate("/");
    }
  };

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles.logoWrapper}>
          <img src={clock} className={styles.icon} />
          <NavLink to="/dashboard" className={styles.logo}>
            Time Capsule
          </NavLink>
        </div>
        <ul className={styles.navLinks}>
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.active : ""}`
              }
            >
              My Capsules
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/public-wall"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.active : ""}`
              }
            >
              Public Wall
            </NavLink>
          </li>
          <li>
            <button onClick={handleSignOut} className={styles.signOutButton}>
              Sign Out
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navigation;
