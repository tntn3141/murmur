import { createContext, useState, useEffect, useCallback } from "react";
import { baseUrl, getRequest, postRequest } from "../utils/services";
import { User } from "./AuthContext";
import { io } from "socket.io-client";

interface ChatContextType {
  userChats: Array<UserChat>;
  isUserChatsLoading: boolean;
  userChatsError: string;
  potentialChats: Array<User>;
  createChat: (firstId: string, secondId: string) => void;
  currentChat: UserChat;
  updateCurrentChat: (arg0: UserChat) => void;
  messages: Array<Message>;
  isMessagesLoading: boolean;
  messagesError: string;
  sendTextMessage: (
    textMessage: string,
    sender: User,
    currentChatId: string,
    setTextMessage: (arg0: string) => void
  ) => void;
  sendTextMessageError: (arg0: string) => void;
  newMessage: Message;
  onlineUsers: Array<User>;
}

export interface UserChat {
  _id: string;
  members: Array<string>;
}

export interface Message {
  _id: string;
  chatId: string;
  senderId: string;
  text: string;
  createdAt: string;
}

export const ChatContext = createContext<ChatContextType>(null);

export const ChatContextProvider = ({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User;
}) => {
  const [userChats, setUserChats] = useState([]);
  const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
  const [userChatsError, setUserChatsError] = useState(null);
  const [potentialChats, setPotentialChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState(null);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState(null);
  const [sendTextMessageError, setSendTextMessageError] = useState(null);
  const [newMessage, setNewMessage] = useState(null);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  // Socket
  useEffect(() => {
    // "http://localhost:3000"
    const newSocket = io();
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

    // userChats
    useEffect(() => {
      const getUserChats = async () => {
        if (user?._id) {
          setIsUserChatsLoading(true);
          setUserChatsError(null);
          const response = await getRequest(`${baseUrl}/chats/${user?._id}`);
          setIsUserChatsLoading(false);
          if (response.error) {
            return setUserChatsError(response);
          }
          setUserChats(response);
        }
      };
      getUserChats();
    }, [user]);

  // Add online users
  useEffect(() => {
    if (socket === null) return;
    socket.emit("addNewUser", user?._id);
    socket.on("getOnlineUsers", (res: Array<User>) => {
      setOnlineUsers(res);
    });

    return () => {
      socket.off("getOnlineUsers");
    };
  }, [socket]);

  // Potential chats
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



  // getMessages
  useEffect(() => {
    const getMessages = async () => {
      setIsMessagesLoading(true);
      setMessagesError(null);
      const response = await getRequest(
        `${baseUrl}/messages/${currentChat?._id}`
      );
      setIsMessagesLoading(false);
      if (response.error) {
        return setMessagesError(response);
      }
      setMessages(response);
    };

    getMessages();
  }, [currentChat]);

  // sendTextMessage / sendTextMessageError
  const sendTextMessage = useCallback(
    async (
      textMessage: string,
      sender: User,
      currentChatId: string,
      setTextMessage: (arg0: string) => void
    ) => {
      if (!textMessage) {return;}

      const response = await postRequest(
        `${baseUrl}/messages`,
        JSON.stringify({
          chatId: currentChatId,
          senderId: sender._id,
          text: textMessage,
        })
      );
      if (response.error) {
        return setSendTextMessageError(response);
      }

      setNewMessage(response);
      setMessages((prev: Array<string>) => [...prev, response]);
      setTextMessage("");
    },
    []
  );

  const updateCurrentChat = useCallback((chat: UserChat) => {
    setCurrentChat(chat);
  }, []);

  const createChat = useCallback(async (firstId: string, secondId: string) => {
    const response = await postRequest(
      `${baseUrl}/chats`,
      JSON.stringify({
        firstId,
        secondId,
      })
    );
    if (response.error) {
      return console.log("Error creating chat", response);
    }

    setUserChats(response);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        userChats,
        isUserChatsLoading,
        userChatsError,
        potentialChats,
        createChat,
        currentChat,
        updateCurrentChat,
        messages,
        isMessagesLoading,
        messagesError,
        sendTextMessage,
        sendTextMessageError,
        newMessage,
        onlineUsers,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
