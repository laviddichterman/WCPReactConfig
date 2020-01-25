import React from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "../react-auth0-spa";

const NavBar = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  return (
    <div>
      {!isAuthenticated && (
        <button onClick={() => loginWithRedirect({})}>Log in</button>
      )}

      {isAuthenticated && <button onClick={() => logout()}>Log out</button>}
          {/* NEW - add a link to the home and profile pages */}
    {isAuthenticated && (
      <span>
        <Link to="/">Home</Link>&nbsp;
        <Link to="/profile">Profile</Link>
        <Link to="/blockoff">Blocked-off Times</Link>
        <Link to="/leadtimes">Lead Times</Link>
        <Link to="/settings">Settings</Link>
      </span>
    )}
    </div>
  );
};

export default NavBar;