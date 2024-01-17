import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import UserChat from "../components/chat/UserChat";
import { AuthContext } from "../context/AuthContext";
import PotentialChats from "../components/chat/PotentialChats";
import ChatBox from "../components/chat/ChatBox";
import FindChat from "../components/chat/FindChat";
import { Navigate } from "react-router-dom";



const Chat = () => {
  const { user } = useContext(AuthContext);
  const { userChats, isUserChatsLoading, updateCurrentChat } =
    useContext(ChatContext);

  if (isUserChatsLoading) {
    return <p>Loading...</p>;
  }

  if (!user) return <Navigate to={"/login"} />;

  return (
    <div className="flex flex-row gap-4 mx-auto max-w-[95%] md:max-w-[90%]">
      <div>
        <FindChat />
        {userChats?.length < 1 ? null : (
          <div className="flex flex-col sm:w-[50%] md:w-[45%] h-[70vh]">
            {isUserChatsLoading && <p>Loading...</p>}
            {Array.isArray(userChats)
              ? userChats?.map((chat, index) => {
                  return (
                    <div
                      key={index}
                      onClick={() => updateCurrentChat(chat)}
                      className=""
                    >
                      <UserChat chat={chat} user={user} />
                    </div>
                  );
                })
              : null}
          </div>
        )}
      </div>

      <div className="w-full">
        <ChatBox />
      </div>
    </div>
  );
};

export default Chat;
