import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import axios from "axios";

import { Avatar, Button } from "@mui/material";
import { Navigate } from "react-router-dom";

const EditSVG = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="24"
    viewBox="0 -960 960 960"
    width="24"
    fill={props.fill}
    stroke={props.stroke}
  >
    <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h357l-80 80H200v560h560v-278l80-80v358q0 33-23.5 56.5T760-120H200Zm280-360ZM360-360v-170l367-367q12-12 27-18t30-6q16 0 30.5 6t26.5 18l56 57q11 12 17 26.5t6 29.5q0 15-5.5 29.5T897-728L530-360H360Zm481-424-56-56 56 56ZM440-440h56l232-232-28-28-29-28-231 231v57Zm260-260-29-28 29 28 28 28-28-28Z" />
  </svg>
);

const Profile = () => {
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const [isLoading, setIsLoading] = useState(false);
  const [userAvatar, setUserAvatar] = useState<File>(null);
  const [userAvatarPreview, setUserAvatarPreview] = useState("");
  const [confirmChange, setConfirmChange] = useState(false);

  const ref = useRef(null);

  useEffect(() => {
    return () => userAvatarPreview && URL.revokeObjectURL(userAvatarPreview);
  }, [userAvatarPreview]);

  const registerDate = new Date(user?.createdAt);

  const handlePreviewAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file: File = e.target.files[0];
    setUserAvatar(file);
    setUserAvatarPreview(URL.createObjectURL(file));
    setConfirmChange(true);
  };

  const handleChangeAvatar = async () => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("image", userAvatar);
      console.log("id", user._id);
      const response = await axios.patch(
        `/api/users/update/${user._id}`,
        formData
      );
      const userData = response.data;
      localStorage.setItem("user", JSON.stringify(userData));
      setUserAvatarPreview(userData.avatar);
      setConfirmChange(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="main p-4 bg-[#eeeeee] dark:bg-[#2B2D31] text-[#060607] dark:text-[#F2F3F5]">
        <div className="flex items-center justify-center m-4">
          Please wait...
        </div>
      </div>
    );
  }

  if (!isLoading && !user) {
    return <Navigate to={"/login"} />;
  }

  if (user) {
    return (
      <div className="main p-4 bg-[#eeeeee] dark:bg-[#2B2D31] text-[#060607] dark:text-[#F2F3F5]">
        <div className="flex items-center justify-center m-4">
          <div className="relative">
            <Avatar
              src={userAvatarPreview ? userAvatarPreview : user?.avatar}
              alt={`${user?.name}'s avatar`}
              sx={{ width: 128, height: 128 }}
              ref={ref}
            />
            <label
              htmlFor="avatar"
              tabIndex={0}
              onMouseEnter={() => ref.current.classList.add("opacity-25")}
              onMouseLeave={() => ref.current.classList.remove("opacity-25")}
              className={
                "absolute top-0 opacity-0 hover:opacity-100 w-full h-full flex items-center justify-center"
              }
            >
              <strong>Edit</strong>
              <EditSVG fill={theme === "light" ? "black" : "white"} />
            </label>
            {/* The input is "hidden" from view, but still is visible to the browser */}
            <input
              id="avatar"
              type="file"
              name="avatar"
              className="w-[0.1] h-[0.1] opacity-0 overflow-hidden absolute z-[-1]"
              onChange={(e) => handlePreviewAvatar(e)}
            />
          </div>

          <div className="mx-4">
            <p className="font-bold text-xl">{user?.name}</p>
            <p>Joined on {registerDate.toLocaleDateString()}</p>
          </div>
        </div>
        {confirmChange && (
          <div className="flex justify-center items-center gap-4">
            <p>Confirm change?</p>
            <Button variant="outlined" onClick={() => handleChangeAvatar()}>
              Yes
            </Button>
            <Button variant="outlined" onClick={() => setUserAvatarPreview("")}>
              No
            </Button>
          </div>
        )}
      </div>
    );
  }
};

export default Profile;
