import { useContext } from "react";
import { Navigate } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import UserChat from "../components/chat/UserChat";
import ChatBox from "../components/chat/ChatBox";
import FindChat from "../components/chat/FindChat";

const Chat = () => {
  const { user } = useContext(AuthContext);
  const { userChats, isUserChatsLoading, userChatsError } =
    useContext(ChatContext);

  if (!user) return <Navigate to={"/login"} />;

  return (
    <div className="flex dark:text-[#949B99] main">
      <div className="sm:basis-1/3 basis-2 bg-[#F2F3F5] dark:bg-[#1E1F22] dark:bg-[#1a1a1a] dark:text-[#949B99]">
        <FindChat />
        <div className="flex flex-col">
          {isUserChatsLoading && <div className="lds-dual-ring"></div>}
          {userChatsError && <div>{userChatsError}</div>}
          {userChats?.length < 1 && null}
          {Array.isArray(userChats)
            ? userChats?.map((chat, index) => {
                return <UserChat chat={chat} user={user} key={index} />;
              })
            : null}
        </div>
      </div>
      <div className="sm:basis-2/3 w-full">
        <ChatBox />
      </div>
    </div>
  );
};

export default Chat;
