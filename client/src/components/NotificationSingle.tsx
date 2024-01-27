import { useContext, useEffect, useState } from "react";
import { ChatContext, Notification } from "../context/ChatContext";
import { User } from "../context/AuthContext";
import axios from "axios";
import { Avatar } from "@mui/material";

const NotificationSingle: React.FC<{ content: Notification }> = ({
  content,
}) => {
  const { updateCurrentChat, userChats, updateCombinedNotifications } =
    useContext(ChatContext);
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
    updateCurrentChat(thisChat);
  };

  return (
    <div>
      <button onClick={handleClickNotification} className="flex items-center">
        <Avatar alt={sender?.name} src={sender?.avatar} className="mr-2" />
        <p>
          You have
          {content.number === 1
            ? ` a new message `
            : ` ${content.number} new messages `}
          from <span className="font-bold">{sender?.name}</span>
        </p>
      </button>
    </div>
  );
};

export default NotificationSingle;
