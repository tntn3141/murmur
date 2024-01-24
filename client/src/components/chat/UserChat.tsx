import { User } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { useEffect, useState, useContext } from "react";
import { Avatar } from "@mui/material";
import axios from "axios";

interface Chat {
  _id: string;
  members: Array<string>;
}

const onlineIndicatorClasses =
  "relative after:absolute after:left-9 " +
  "after:bottom-1.5 after:w-3.5 after:h-3.5 after:bg-green-400 after:rounded-xl ";

const UserChat = ({ chat, user }: { chat: Chat; user: User }) => {
  const { updateCurrentChat, newMessage, onlineUsers, currentChat } =
    useContext(ChatContext);
  const [recipientUser, setRecipientUser] = useState(null);

  const recipientId = chat?.members?.find((id: string) => id !== user?._id);
  const isOnline = onlineUsers?.some(
    (onlineUser) => onlineUser?.userId === recipientId
  );
  const isCurrentChat = currentChat?.members?.includes(recipientId);

  useEffect(() => {
    const getRecipientUser = async () => {
      try {
        const response = await axios.get(`/api/users/findById/${recipientId}`);
        setRecipientUser(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getRecipientUser();
  }, [recipientId]);

  return (
    <div
      className={
        "flex gap-2 p-1.5 sm:p-2.5 items-center text-black dark:text-[#949B99] " +
        (isOnline ? onlineIndicatorClasses : "") +
        (isCurrentChat ? "bg-[#9B9B9B]" : "b")
      }
      role="button"
      onClick={() => updateCurrentChat(chat)}
    >
      <Avatar
        alt={recipientUser?.name}
        src={recipientUser?.avatar}
      />
      <p className={"hidden sm:inline " + (isCurrentChat ? "font-bold" : "")}>{recipientUser?.name}</p>
      <p className="hidden sm:inline truncate">
        {newMessage?.chatId === chat._id && newMessage?.senderId === recipientId
          ? newMessage?.text
          : ""}
      </p>
    </div>
  );
};

export default UserChat;
