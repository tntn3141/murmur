import { User } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { useEffect, useState, useContext } from "react";
import { Avatar } from "@mui/material";
import axios from "axios";

interface Chat {
  _id: string;
  members: Array<string>;
}

const UserChat = ({ chat, user }: { chat: Chat; user: User }) => {
  const { updateCurrentChat, newMessage, onlineUsers } = useContext(ChatContext);
  const [recipientUser, setRecipientUser] = useState(null);

  const recipientId = chat?.members?.find((id: string) => id !== user?._id);
  const isOnline = onlineUsers?.some(onlineUser => onlineUser?.userId === recipientId)
  

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
      className="my-2 flex justify-between items-center"
      role="button"
      onClick={() => updateCurrentChat(chat)}
    >
      <div className="flex gap-2 items-center">
        <Avatar alt={recipientUser?.name} src={recipientUser?.avatar} />
        <p className="hidden sm:inline">{recipientUser?.name}</p>
        <p>{newMessage?.chatId === chat._id ?  newMessage?.text : ""}</p>
      </div>
      <div className="">
        <div className="this-user-notifications">{isOnline ? 1 : 0}</div>
        <span>{isOnline}</span>
      </div>
    </div>
  );
};

export default UserChat;
