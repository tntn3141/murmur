import axios, { AxiosError } from "axios";
import { useState, useContext, useEffect, useRef } from "react";
import { Button, Input, Avatar, Popper } from "@mui/material";
import { AuthContext, User } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";

const FindChat = () => {
  const { user } = useContext(AuthContext);
  const { userChats, setUserChats } = useContext(ChatContext);

  const [findUserResult, setFindUserResult] = useState<User>(null);
  const [findUserError, setFindUserError] = useState(null);
  const [email, setEmail] = useState<string>("");

  // For the enter key eventListener attached to the email input
  const inputEnterRef = useRef(null);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.code === "Enter") {
        findUser();
      }
    };
    const input = inputEnterRef.current;
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
    <>
      {/* Desktop */}
      <div className="flex flex-col gap-2 hidden sm:block">
        <Input
          ref={inputEnterRef}
          placeholder="Enter user email..."
          type="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={findUser}>
          Find
        </Button>
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
                fill="#000000"
              >
                <path d="M0 0h24v24H0V0z" fill="none" />
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
              </svg>
            </button>
          </div>
        )}
        {findUserError && <p className="text-red-600">{findUserError}</p>}
      </div>

      {/* Mobile */}
      <div className="sm:hidden flex items-center align-center justify-center border">
        <button
          onClick={(e) => {
            setAnchorEl(e.currentTarget);
            setIsOpen((prev) => !prev);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 0 24 24"
            width="24px"
            fill="#000000"
          >
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
        </button>
        <Popper
          placement="bottom-start"
          // disablePortal={false}
          open={isOpen}
          anchorEl={anchorEl}
        >
          <div className="bg-white border p-4">
            <div className="mb-2">
              <Input
                autoFocus
                placeholder="Enter user email..."
                type="email"
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
                  <Avatar
                    alt={findUserResult.name}
                    src={findUserResult.avatar}
                  />
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
                    fill="#000000"
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
    </>
  );
};

export default FindChat;
