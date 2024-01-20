import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Menu, MenuItem } from "@mui/material";
import { ThemeContext } from "../context/ThemeContext";

// Styles
const linkClasses = "hover:text-blue-500 align-items";

const DarkIconSVG = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="24"
    viewBox="0 -960 960 960"
    width="24"
    fill={props.fill}
    className={props.className}
    stroke={props.stroke}
  >
    <path d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Zm0-80q88 0 158-48.5T740-375q-20 5-40 8t-40 3q-123 0-209.5-86.5T364-660q0-20 3-40t8-40q-78 32-126.5 102T200-480q0 116 82 198t198 82Zm-10-270Z" />
  </svg>
);

const LightIconSVG = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="24"
    viewBox="0 -960 960 960"
    width="24"
    fill={props.fill}
    className={props.className}
  >
    <path d="M480-360q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Zm0 80q-83 0-141.5-58.5T280-480q0-83 58.5-141.5T480-680q83 0 141.5 58.5T680-480q0 83-58.5 141.5T480-280ZM200-440H40v-80h160v80Zm720 0H760v-80h160v80ZM440-760v-160h80v160h-80Zm0 720v-160h80v160h-80ZM256-650l-101-97 57-59 96 100-52 56Zm492 496-97-101 53-55 101 97-57 59Zm-98-550 97-101 59 57-100 96-56-52ZM154-212l101-97 55 53-97 101-59-57Zm326-268Z" />
  </svg>
);

function NavBar() {
  const { user, logoutUser } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <nav className="flex justify-between shadow-lg px-4 py-6 items-center dark:text-white dark:bg-black">
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
        <div className="hidden sm:flex gap-4">
          <button onClick={() => toggleTheme()} className="block">
          {theme === "light" ? (
            <DarkIconSVG />
          ) : (
            <LightIconSVG stroke={"white"} fill={"white"} />
          )}
        </button>
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
      <div className="sm:hidden flex gap-4">
        <button onClick={() => toggleTheme()} className="block">
          {theme === "light" ? (
            <DarkIconSVG />
          ) : (
            <LightIconSVG stroke={"white"} fill={"white"} />
          )}
        </button>
        <button
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
            stroke={theme === "light" ? "black" : "white"}
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
            />
          </svg>
        </button>
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
}

export default NavBar;
