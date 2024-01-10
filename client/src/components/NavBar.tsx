import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const NavBar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  console.log(user)

  return (
    <nav className="flex m-4 justify-between ">
      <div>
        <h2>
          <Link to="/" className="link-light text-decoration-none">
            Murmur
          </Link>
        </h2>
      </div>
      <div>
        {user && (
          <span className="text-warning">Logged in as {user?.name}</span>
        )}
      </div>
      <div className="flex gap-4">
        {user && (
          <>
            <Link
              onClick={() => logoutUser()}
              to="/login"
              className="link-light text-decoration-none"
            >
              Log out
            </Link>
          </>
        )}
        {!user && (
          <>
            <Link to="/login" className="link-light text-decoration-none">
              Login
            </Link>
            <Link to="/register" className="link-light text-decoration-none">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
