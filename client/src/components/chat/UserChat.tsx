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
  "font-bold relative after:absolute after:left-8 " +
  "after:bottom-6 after:w-3 after:h-3 after:bg-green-400 after:rounded-xl ";

const UserChat = ({ chat, user }: { chat: Chat; user: User }) => {
  const { updateCurrentChat, newMessage, onlineUsers } =
    useContext(ChatContext);
  const [recipientUser, setRecipientUser] = useState(null);

  const recipientId = chat?.members?.find((id: string) => id !== user?._id);
  const isOnline = onlineUsers?.some(
    (onlineUser) => onlineUser?.userId === recipientId
  );

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

  console.log(recipientUser?.name, "isOnline: ", isOnline);

  return (
    <div
      className={
        "my-2 flex gap-2 items-center text-black dark:text-[#949B99] " +
        (isOnline ? onlineIndicatorClasses : "")
      }
      role="button"
      onClick={() => updateCurrentChat(chat)}
    >
      <Avatar alt={recipientUser?.name} src={recipientUser?.avatar} />
      <p className="hidden sm:inline">{recipientUser?.name}</p>
      <p className="hidden sm:inline">
        {newMessage?.chatId === chat._id ? newMessage?.text : ""}
      </p>
    </div>
  );
};

export default UserChat;
