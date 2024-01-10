import { useContext, useEffect, useState } from "react";
import { ChatContext, UserChat } from "../../context/ChatContext";
import { AuthContext, User } from "../../context/AuthContext";
import { getRequest, baseUrl } from "../../utils/services";

const PotentialChats = () => {
  const { user } = useContext(AuthContext);
  const { userChats, createChat, onlineUsers } = useContext(ChatContext);
  const [potentialChats, setPotentialChats] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      const response = await getRequest(`${baseUrl}/users`);
      if (response.error) {
        return console.log("Error fetching users", response);
      }
      const pChats = response.filter((u: User) => {
        let isChatCreated = false;
        if (user?._id === u._id) {
          return false;
        }
        if (userChats.length > 0) {
          console.log("userChats", userChats)
          isChatCreated = userChats.some((chat: UserChat) => {
            return chat.members[0] === u._id || chat.members[1] === u._id;
          });
        }
        return !isChatCreated;
      });
      setPotentialChats(pChats);
    };
    getUsers();
  }, [userChats]);

  return (
    <>
      <div className="all-users">
        <div>Discover</div>
        {potentialChats &&
          potentialChats.map((u, index) => {
            return (
              <div
                className="single-user"
                key={index}
                onClick={() => createChat(user._id, u._id)}
              >
                {u.name}
                <span
                  className={
                    onlineUsers?.some((user) => user?._id === u?._id)
                      ? "user-online"
                      : ""
                  }
                ></span>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default PotentialChats;
