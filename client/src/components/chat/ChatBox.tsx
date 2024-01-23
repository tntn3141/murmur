import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { ThemeContext } from "../../context/ThemeContext";
import { useFetchRecipient } from "../../hooks/useFetchRecipient";
import moment from "moment";
import InputEmoji from "react-input-emoji";
import Linkify from "react-linkify";
import { Box } from "@mui/material";

const PaperplaneSVG = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill={props.fill}
    className="bi bi-send-fill"
    viewBox="0 0 16 16"
  >
    <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z" />
  </svg>
);

const ChatBox = () => {
  const { user } = useContext(AuthContext);
  const { currentChat, messages, messagesError, sendTextMessage } =
    useContext(ChatContext);
  const [textMessage, setTextMessage] = useState("");

  const { recipientUser, fetchRecipientError } = useFetchRecipient(
    currentChat,
    user
  );

  const { theme } = useContext(ThemeContext);
  const scroll = useRef(null);

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!recipientUser) {
    return (
      <div className="h-full p-8 flex flex-col bg-white dark:bg-[#313338] text-[#060607] dark:text-[#F2F3F5] justify-center ">
        <p>No conversation selected yet.</p>
        <br></br>
        <p className="text-justify">
          If you wish to log in using another account to test how the app works,
          please use another browser to do so.
        </p>
      </div>
    );
  }

  if (fetchRecipientError) {
    return (
      <p style={{ textAlign: "center", width: "100%" }}>{messagesError}</p>
    );
  }

  return (
    <div className="">
      <Box className="justify-center align-center p-4 flex bg-[#eeeeee] dark:bg-[#2B2D31]">
        <strong>{recipientUser?.name}</strong>
      </Box>
      <Box className="chat-window flex flex-col gap-3 p-3 overflow-y-scroll bg-white dark:bg-[#313338] text-[#060607] dark:text-[#F2F3F5]">
        <p className="text-[#80848E] dark:text-[#B5BAC1] mx-auto">
          This is the start of your conversation with {recipientUser?.name}
        </p>
        {messages &&
          messages.map((message, index: number) => {
            return (
              <Box
                ref={scroll}
                key={index}
                className={`max-w-[50%] rounded-xl p-2 break-words text-white ${
                  message?.senderId === user?._id
                    ? "place-self-start text-white bg-[#2986cc] dark:bg-[#0b5394]"
                    : "place-self-end bg-[#5b5b5b] dark:bg-[#444444]"
                }`}
              >
                <p>{<Linkify>{message.text}</Linkify>}</p>
                <span className="text-xs italic">
                  {moment(message.createdAt).calendar()}
                </span>
              </Box>
            );
          })}
      </Box>

      <div className="flex justify-center items-center p-1.5 bg-[#EEEEEE] dark:bg-[#2B2D31]">
        <InputEmoji
          value={textMessage}
          onChange={setTextMessage}
          fontFamily="noto sans"
          onEnter={() => sendTextMessage(textMessage, user, currentChat._id, setTextMessage)}
        />
        <button
          className="send-btn flex justify-center items-center w-10"
          onClick={() =>
            sendTextMessage(textMessage, user, currentChat._id, setTextMessage)
          }
        >
          <PaperplaneSVG fill={theme === "light" ? "black" : "white"} />
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
