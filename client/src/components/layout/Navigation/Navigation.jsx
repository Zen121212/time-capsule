import { NavLink } from "react-router-dom";

const Navigation = () => {
  return (
    <nav>
      <ul style={{ display: "flex", gap: "1rem", listStyle: "none" }}>
        <li>
          <NavLink to="/dashboard">My Capsules</NavLink>
        </li>
        <li>
          <NavLink to="/public-wall">Public Wall</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
