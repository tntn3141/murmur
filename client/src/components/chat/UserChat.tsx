import { User } from "../../context/AuthContext";
import { ChatContext, SingleUserChat } from "../../context/ChatContext";
import { useEffect, useState, useContext } from "react";
import { Avatar } from "@mui/material";
import axios from "axios";

const onlineIndicatorClasses =
  "relative after:absolute after:left-9 " +
  "after:bottom-1.5 after:w-3.5 after:h-3.5 after:bg-green-400 after:rounded-xl ";

const UserChat: React.FC<{ chat: SingleUserChat; user: User }> = ({
  chat,
  user,
}) => {
  const { currentChat, updateCurrentChat, setCurrentChatUser, onlineUsers } =
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

  const handleOpenUserChat = (chat: SingleUserChat) => {
    updateCurrentChat(chat);
    setCurrentChatUser(recipientUser);
  };

  return (
    <div
      className={
        "flex gap-2 p-1.5 sm:p-2.5 items-center text-black dark:text-[#949B99] " +
        (isOnline ? onlineIndicatorClasses : "") +
        (isCurrentChat ? "bg-[#9B9B9B]" : "")
      }
      role="button"
      onClick={() => handleOpenUserChat(chat)}
    >
      <Avatar alt={recipientUser?.name} src={recipientUser?.avatar} />
      <p className={"hidden sm:inline " + (isCurrentChat ? "font-bold" : "")}>
        {recipientUser?.name}
      </p>
    </div>
  );
};

export default UserChat;
