import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { useFetchRecipient } from "../../hooks/useFetchRecipient";
import moment from "moment";
import InputEmoji from "react-input-emoji";
import Linkify from "react-linkify";

const ChatBox = () => {
  const { user } = useContext(AuthContext);
  const { currentChat, messages, messagesError, sendTextMessage } =
    useContext(ChatContext);
  const [textMessage, setTextMessage] = useState("");

  const { recipientUser, fetchRecipientError } = useFetchRecipient(
    currentChat,
    user
  );

  const scroll = useRef(null);

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!recipientUser) {
    return (
      <p style={{ textAlign: "center", width: "100%" }}>
        No conversation selected yet.
      </p>
    );
  }

  if (fetchRecipientError) {
    return (
      <p style={{ textAlign: "center", width: "100%" }}>{messagesError}</p>
    );
  }

  return (
    <div className="w-full">
      <div className="bg-[#1e1e1e] justify-center align-center p-[0.75rem] text-white flex">
        <strong>{recipientUser?.name}</strong>
      </div>
      <div className="flex flex-col gap-3 p-3 overflow-y-scroll h-[60vh] bg-[#171717]">
        {messages &&
          messages.map((message, index: number) => {
            return (
              <div
                ref={scroll}
                key={index}
                className={`max-w-[50%] rounded-xl p-2 break-words ${
                  message?.senderId === user?._id
                    ? "bg-[#0ea5e9] place-self-start"
                    : "bg-[#27272a] place-self-end"
                }`}
              >
                <p>{<Linkify>{message.text}</Linkify>}</p>
                <span className="text-xs italic">
                  {moment(message.createdAt).calendar()}
                </span>
              </div>
            );
          })}
      </div>

      <div className="flex justify-center items-center p-2 bg-[#1e1e1e]">
        <InputEmoji
          value={textMessage}
          onChange={setTextMessage}
          fontFamily="noto sans"
          borderColor="rgba(72, 112, 223, 0.2)"
        />
        <button
          className="send-btn flex justify-center items-center"
          onClick={() =>
            sendTextMessage(textMessage, user, currentChat._id, setTextMessage)
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-send-fill"
            viewBox="0 0 16 16"
          >
            <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
