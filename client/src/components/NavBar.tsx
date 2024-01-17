import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Button, Menu, MenuItem } from "@mui/material";

// Styles
const linkClasses = "text-decoration-none m-2 hover:text-blue-500";

const NavBar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <nav className="flex justify-between border p-4 mb-4 items-center">
      <h1>
        <Link
          to="/"
          className="flex justify-center items-center gap-1 text-decoration-none hover:text-blue-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
            />
          </svg>
          <span className="hidden sm:block">Murmur</span>
        </Link>
      </h1>

      {user && (
        <>
          <div>
            <span className="text-warning">{user?.name}</span>
          </div>
          <div className="flex gap-4 items-center hidden sm:block">
            <Link to="/" className={linkClasses}>
              Profile
            </Link>
            <Link
              onClick={() => logoutUser()}
              to="/login"
              className={linkClasses}
            >
              Log out
            </Link>
          </div>
        </>
      )}

      {!user && (
        <div className="hidden sm:block">
          <Link to="/login" className={linkClasses}>
            Login
          </Link>
          <Link to="/register" className={linkClasses}>
            Register
          </Link>
        </div>
      )}

      {/* Menu on mobile */}
      <div className="sm:hidden">
        <Button
          id="basic-button"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
            />
          </svg>
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem onClick={handleClose}>Profile</MenuItem>
          <MenuItem
            onClick={() => {
              handleClose();
              console.log("aaa");
              logoutUser();
            }}
          >
            Logout
          </MenuItem>
        </Menu>
      </div>
    </nav>
  );
};

export default NavBar;
