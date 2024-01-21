import axios, { AxiosError } from "axios";
import { useState, useContext, useEffect, useRef } from "react";
import { Button, Input, Avatar, Popper } from "@mui/material";
import { AuthContext, User } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { ThemeContext } from "../../context/ThemeContext";
import { useOutsideClick } from "../../hooks/useOutsideClick";

const FinderSVG = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="24px"
    viewBox="0 0 24 24"
    width="24px"
    fill={props.fill}
    stroke={props.stroke}
  >
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
  </svg>
);

const FindChat = () => {
  const { user } = useContext(AuthContext);
  const { userChats, setUserChats } = useContext(ChatContext);
  const { theme } = useContext(ThemeContext);

  const [findUserResult, setFindUserResult] = useState<User>(null);
  const [findUserError, setFindUserError] = useState(null);
  const [email, setEmail] = useState<string>("");

  // For the enter key eventListener attached to the email input
  const inputEnterRef = useRef(null);
  // To close the popup when the user clicks outside
  const ref = useOutsideClick(() => {
    setIsOpen(false);
  });

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.code === "Enter" || e.code === "NumpadEnter") {
        findUser();
      }
    };
    const input = inputEnterRef.current;

    if (!input) return;

    input.addEventListener("keydown", handleKeyDown);

    return () => {
      input.removeEventListener("keydown", handleKeyDown);
    };
  }, [email]);

  const findUser = async () => {
    try {
      setFindUserResult(null);
      const formData = new FormData();
      // The key needs to be "userEmail"
      formData.append("userEmail", email);
      const response = await axios.post(`/api/users/findByEmail/`, formData);
      const userData = response.data;
      setFindUserResult(userData);
      setFindUserError(null);
    } catch (error) {
      const err = error as AxiosError;
      setFindUserError(err.response?.data);
    }
  };

  const createChat = async (firstId: string, secondId: string) => {
    // Check if the user is trying to add themself
    if (firstId === secondId) {
      return setFindUserError("You cannot add yourself.");
    }
    // Check if the user to be added is already in the chat list
    const isUserAdded = userChats.some((userChat) =>
      userChat.members.includes(secondId)
    );
    if (isUserAdded) {
      return setFindUserError("You have already added this user.");
    }

    try {
      const response = await axios.post(`api/chats`, {
        firstId,
        secondId,
      });
      const updatedUserChats = [...userChats, response.data];
      setUserChats(updatedUserChats);
      setFindUserResult(null);
    } catch (error) {
      const err = error as AxiosError;
      setFindUserError(err.response?.data);
    }
  };

  return (
    <div className="">
      <button
        onClick={(e) => {
          setAnchorEl(e.currentTarget);
          setIsOpen(!isOpen);
        }}
        className="rounded-full block h-[40px] w-[40px] flex items-center justify-center hover:bg-blue-500 hover:text-white border-2 border-black dark:border-white"
      >
        <FinderSVG fill={theme === "light" ? "black" : "white"} />
      </button>

      <Popper placement="left" open={isOpen} anchorEl={anchorEl} ref={ref}>
        <div className="dark:bg-[#2B2D31] m-2 border p-2">
          <div className="">
            <Input
              autoFocus
              placeholder="Enter user email..."
              type="email"
              ref={inputEnterRef}
              className="dark:text-[#FFFFFF]"
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={findUser}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 0 24 24"
                width="24px"
                fill="#ffffff"
              >
                <path d="M0 0h24v24H0V0z" fill="none" />
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
            </Button>
          </div>

          {findUserResult && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 p-2">
                <Avatar alt={findUserResult.name} src={findUserResult.avatar} />
                <span>{findUserResult.name}</span>
              </div>
              <button
                className="hover:bg-gray-400"
                onClick={() => createChat(user._id, findUserResult._id)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 0 24 24"
                  width="24px"
                >
                  <path d="M0 0h24v24H0V0z" fill="none" />
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                </svg>
              </button>
            </div>
          )}
          {findUserError && <p className="text-red-600">{findUserError}</p>}
        </div>
      </Popper>
    </div>
  );
};

export default FindChat;
