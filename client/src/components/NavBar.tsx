import { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { Menu, MenuItem } from "@mui/material";
import NotificationSingle from "./NotificationSingle";
import { ChatContext } from "../context/ChatContext";

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

const NotificationSVG = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="24"
    viewBox="0 -960 960 960"
    width="24"
    fill={props.fill}
    className={props.className}
  >
    <path d="M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z" />
  </svg>
);

function NavBar() {
  const { user, logoutUser } = useContext(AuthContext);
  const { combinedNotifications, currentChat } = useContext(ChatContext);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const navigate = useNavigate();

  const { theme, toggleTheme } = useContext(ThemeContext);

  let notificationAvailable = combinedNotifications.length > 0;
  useEffect(() => {
    notificationAvailable = combinedNotifications.length > 0;
  }, [currentChat]);

  // Close notification popup when changing route
  const { pathname } = useLocation();
  useEffect(() => {
    setIsNotificationOpen(false);
  }, [pathname]);

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

      <div className="hidden sm:flex gap-4">
        {user && <span className="font-bold">{user.name}</span>}
        <button onClick={() => toggleTheme()} className="block">
          {theme === "light" ? (
            <DarkIconSVG />
          ) : (
            <LightIconSVG stroke={"white"} fill={"white"} />
          )}
        </button>
        <button
          onClick={() => setIsNotificationOpen(!isNotificationOpen)}
          className={
            notificationAvailable
              ? `relative after:absolute after:left-3.5 
            after:bottom-3 after:w-3 after:h-3 after:bg-red-400 after:rounded-xl`
              : null
          }
        >
          <NotificationSVG fill={theme === "light" ? "black" : "white"} />
        </button>
        {user && (
          <>
            <Link to="/profile" className={linkClasses}>
              Profile
            </Link>
            <Link
              onClick={() => logoutUser()}
              to="/login"
              className={linkClasses}
            >
              Log out
            </Link>
          </>
        )}
        {!user && (
          <>
            <Link to="/login" className={linkClasses}>
              Login
            </Link>
            <Link to="/register" className={linkClasses}>
              Register
            </Link>
          </>
        )}
      </div>

      {/* Menu on mobile */}
      <div className="sm:hidden flex gap-4">
        {user && <span className="font-bold">{user.name}</span>}
        <button onClick={() => toggleTheme()} className="block">
          {theme === "light" ? (
            <DarkIconSVG />
          ) : (
            <LightIconSVG stroke={"white"} fill={"white"} />
          )}
        </button>
        <button
          onClick={() => setIsNotificationOpen(!isNotificationOpen)}
          className={
            notificationAvailable
              ? `relative after:absolute after:left-3.5 
            after:bottom-3 after:w-3 after:h-3 after:bg-red-400 after:rounded-xl`
              : null
          }
        >
          <NotificationSVG fill={theme === "light" ? "black" : "white"} />
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
          {!user && (
            <div>
              <MenuItem
                onClick={() => {
                  handleClose();
                  navigate("/login");
                }}
              >
                Login
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleClose();
                  navigate("/register");
                }}
              >
                Register
              </MenuItem>
            </div>
          )}
          {user && (
            <div>
              <MenuItem
                onClick={() => {
                  handleClose();
                  navigate("/profile");
                }}
              >
                Profile
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleClose();
                  logoutUser();
                }}
              >
                Logout
              </MenuItem>
            </div>
          )}
        </Menu>
      </div>
      {isNotificationOpen && (
        <div
          className={`absolute right-0 top-[3.25rem] z-10 w-auto flex flex-col gap-2
                bg-[#F2F3F5] dark:bg-[#1A1A1A] text-black dark:text-white p-3 
                overflow-y-auto max-h-[50vh] shadow-lg border border-slate-600
               `}
        >
          <div className="flex justify-between border-b-2 pb-2">
            <strong>{`Notifications (${combinedNotifications.length})`}</strong>
            <button className="hover:text-red-600 font-bold" onClick={() => setIsNotificationOpen(false)}>
              [Close]
            </button>
          </div>
          {combinedNotifications.length === 0 && (
            <p>You have no notifications right now.</p>
          )}
          {combinedNotifications.map((notification, index) => {
            if (!notification.isRead) {
              return <NotificationSingle key={index} content={notification} />;
            }
          })}
        </div>
      )}
    </nav>
  );
}

export default NavBar;
