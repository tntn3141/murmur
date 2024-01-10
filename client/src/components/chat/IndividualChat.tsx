import { Stack } from "react-bootstrap";
import { useFetchRecipient } from "../../hooks/useFetchRecipient";
import { User } from "../../context/AuthContext";
import { Chat } from "../../hooks/useFetchRecipient";
import { ChatContext } from "../../context/ChatContext";
import { useContext } from "react";
import avatar from "../../assets/avatar.svg";

const IndividualChat = ({ chat, user }: { chat: Chat; user: User }) => {
  const { recipientUser } = useFetchRecipient(chat, user);
  const { onlineUsers } = useContext(ChatContext);

  const isOnline = onlineUsers?.some(
    (onlineUser) => onlineUser?._id === recipientUser?._id
  );

  return (
    <>
      <div className="flex">
        <div className="d-flex">
          <div className="me-2">
            <img src={avatar} alt="avatar" />
          </div>
          <div className="text-content hidden md:block">
            <div className="name">{recipientUser?.name}</div>
            <div className="text">Text nessage</div>
          </div>
        </div>
        <div className="d-flex flex-column align-items-end">
          <div className="this-user-notifications">2</div>
          <span className={isOnline ? "user-online" : ""}></span>
        </div>
      </div>

      {/* <Stack
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
          <div className="this-user-notifications">2</div>
          <span className={isOnline ? "user-online" : ""}></span>
        </div>
      </Stack> */}
    </>
  );
};

export default IndividualChat;
