import { useFetchRecipient } from "../../hooks/useFetchRecipient";
import { User } from "../../context/AuthContext";
import { Chat } from "../../hooks/useFetchRecipient";
import { Stack } from "react-bootstrap";
import avatar from "../../assets/avatar.svg";
import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { baseUrl, postRequest } from "../../utils/services";

const UserChat = ({ chat, user }: { chat: Chat; user: User }) => {
  const { recipientUser } = useFetchRecipient(chat, user);
  const { onlineUsers } = useContext(ChatContext);

  const isOnline = onlineUsers?.some(
    (user) => user?.userId === recipientUser?._id
  );

  const handleAddFriend = async () => {
    const response = await fetch(`${baseUrl}/friends/${recipientUser._id}`, {
      _id: user._id
    })
    console.log(response)
  }

  return (
    <Stack
      direction="horizontal"
      gap={3}
      className="user-card align-items-center p-2 justify-content-between"
      role="button"
    >
      <div className="d-flex">
        <div className="me-2">
          <img src={avatar} alt="avatar" height="20px" />
        </div>
        <div className="text-content">
          <div className="name">{recipientUser?.name}</div>
          <div className="text">Text nessage</div>
        </div>
      </div>
      <div className="d-flex flex-column align-items-end">
        <div>
          <button
            onClick={handleAddFriend}
          >
            Add friend
          </button>
        </div>
        <div className="this-user-notifications">2</div>
        <span className={isOnline ? "user-online" : ""}></span>
      </div>
    </Stack>
  );
};

export default UserChat;
