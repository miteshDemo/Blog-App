import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  return (
    <nav style={{ padding: 12, borderBottom: "1px solid #ddd" }}>
      <Link to="/">Home</Link> {" | "}
      {user ? (
        <>
          <Link to="/dashboard">Dashboard</Link> {" | "}
          <button onClick={logout} style={{ marginLeft: 8 }}>
            Logout
          </button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link> {" | "}
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
};
export default Navbar;
