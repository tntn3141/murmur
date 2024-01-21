import { useContext } from "react";
import UserChat from "../components/chat/UserChat";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import ChatBox from "../components/chat/ChatBox";
import FindChat from "../components/chat/FindChat";
import { Navigate } from "react-router-dom";

interface UserChat {
  _id: string;
  members: Array<string>;
}

const Chat = () => {
  const { user } = useContext(AuthContext);
  const { userChats, isUserChatsLoading, userChatsError } =
    useContext(ChatContext);

  if (isUserChatsLoading) {
    return <p>Loading...</p>;
  }

  if (userChatsError) {
    return userChatsError;
  }

  if (!user) return <Navigate to={"/login"} />;

  return (
    <div className="flex dark:text-[#949B99] main">
      <div className="sm:basis-1/3 basis-2 bg-[#F2F3F5] dark:bg-[#1E1F22] dark:bg-[#1a1a1a] dark:text-[#949B99] px-1.5 pt-1.5 sm:px-3 sm:pt-3">
        <FindChat />
        {userChats?.length < 1 ? null : (
          <div className="flex flex-col">
            {Array.isArray(userChats)
              ? userChats?.map((chat, index) => {
                  return <UserChat chat={chat} user={user} key={index} />;
                })
              : null}
          </div>
        )}
      </div>
      <div className="sm:basis-2/3 w-full">
        <ChatBox />
      </div>
    </div>
  );
};

export default Chat;
