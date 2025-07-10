import React from "react";

const Navigation = () => {
  return (
    <nav>
      <ul style={{ display: "flex", gap: "1rem", listStyle: "none" }}>
        <li>
          <a href="#home">My Capsules</a>
        </li>
        <li>
          <a href="#about">Public Wall</a>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
