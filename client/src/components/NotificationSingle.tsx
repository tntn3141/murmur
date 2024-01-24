import { useContext, useEffect, useState } from "react";
import { ChatContext, Notification } from "../context/ChatContext";
import { User } from "../context/AuthContext";
import axios from "axios";
import { Avatar } from "@mui/material";

const NotificationSingle = ({ content }: { content: Notification }) => {
  const {
    updateCurrentChat,
    userChats,
    updateCombinedNotifications,
    setIsNotificationOpen,
  } = useContext(ChatContext);
  const [sender, setSender] = useState<User>(null);
  const thisChat = userChats.find((chat) =>
    chat?.members?.includes(sender?._id)
  );

  useEffect(() => {
    const getSender = async () => {
      const response = await axios.get(
        `/api/users/findById/${content.senderId}`
      );
      setSender(response.data);
    };
    getSender();
  }, []);

  const handleClickNotification = () => {
    updateCombinedNotifications(sender._id);
    setIsNotificationOpen(false);
    updateCurrentChat(thisChat);
  };

  return (
    <div>
      <button
        onClick={handleClickNotification}
        className="flex items-center gap-2"
      >
        <Avatar alt={sender?.name} src={sender?.avatar} />
        You have
        {content.number === 1
          ? ` a new message `
          : ` ${content.number} new messages `}
        from <strong>{sender?.name}</strong>
      </button>
    </div>
  );
};

export default NotificationSingle;
