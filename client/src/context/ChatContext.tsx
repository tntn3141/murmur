import {
  createContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  useCallback,
} from "react";
import axios from "axios";
import { User } from "./AuthContext";
import { io } from "socket.io-client";

interface ChatContextType {
  userChats: Array<UserChat>;
  setUserChats: Dispatch<SetStateAction<Array<UserChat>>>;
  isUserChatsLoading: boolean;
  userChatsError: string;

  currentChat: UserChat;
  updateCurrentChat: (chat: UserChat) => void;

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

  onlineUsers: Array<OnlineUser>;

  notifications: Array<Notification>;
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

export interface OnlineUser {
  userId: string;
  socketId: string;
}

export interface Notification {
  senderId: string;
  isRead: boolean;
  date: Date;
}

export const ChatContext = createContext<ChatContextType>(null);

export const ChatContextProvider = ({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User;
}) => {
  const [userChats, setUserChats] = useState<Array<UserChat>>();
  const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
  const [userChatsError, setUserChatsError] = useState(null);

  const [currentChat, setCurrentChat] = useState<UserChat>(null);

  const [messages, setMessages] = useState<Array<Message>>(null);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState(null);

  const [sendTextMessageError, setSendTextMessageError] = useState(null);
  const [newMessage, setNewMessage] = useState(null);

  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState<Array<OnlineUser>>([]);

  const [notifications, setNotifications] = useState<Array<Notification>>([]);

  // Socket
  useEffect(() => {
    const newSocket = io("https://murmur-chat.fly.dev", {
      withCredentials: true,
    });
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  // Socket online status
  useEffect(() => {
    if (socket === null) return;
    socket.emit("addNewUser", user?._id);
    socket.on("getOnlineUsers", (res: Array<OnlineUser>) => {
      setOnlineUsers(res);
    });
    return () => {
      socket.off("getOnlineUsers");
    };
  }, [socket]);

  // Socket sendMessage
  useEffect(() => {
    if (socket === null) return;
    //?
    const recipientId = currentChat?.members?.find(
      (id: string) => id !== user?._id
    );
    socket.emit("sendMessage", { ...newMessage, recipientId });
  }, [newMessage]);

  // Socket receiveMessage receiveNotification
  useEffect(() => {
    if (socket === null) return;
    socket.on("getMessage", (res: Message) => {
      if (currentChat?._id !== res.chatId) return;
      setMessages((prev) => [...prev, res]);
    });
    /* If the new message is from the current chat, it's considered read */
    socket.on("getNotification", (res: Notification) => {
      const isCurrentChat = currentChat?.members.some(
        (id) => id === res.senderId
      );
      console.log("senderId", res.senderId);
      console.log("currentChatMembers", currentChat.members);
      if (isCurrentChat) {
        setNotifications((prev) => [...prev, { ...res, isRead: true }]);
      } else {
        setNotifications((prev) => [...prev, res]);
      }
    });

    return () => {
      socket.off("getMessage");
      socket.off("getNotification");
    };
  }, [socket, currentChat]);

  // userChats, isUserChatsLoading, userChatsError
  useEffect(() => {
    const getUserChats = async () => {
      setIsUserChatsLoading(true);
      setUserChatsError(null);
      try {
        const response = await axios.get(`/api/chats/${user?._id}`);
        setUserChats(response.data);
      } catch (error) {
        console.log(error);
        setUserChatsError(error);
      } finally {
        setIsUserChatsLoading(false);
      }
    };

    getUserChats();
  }, [user]);

  // currentChat, messages, isMessagesLoading, messagesError
  useEffect(() => {
    const getMessages = async () => {
      try {
        setIsMessagesLoading(true);
        setMessagesError(null);
        const response = await axios.get(`/api/messages/${currentChat?._id}`);
        setMessages(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsMessagesLoading(false);
      }
    };
    getMessages();
  }, [currentChat]);

  // setCurrentChat
  const updateCurrentChat = useCallback((chat: UserChat) => {
    setCurrentChat(chat);
  }, []);

  const sendTextMessage = useCallback(
    async (
      textMessage: string,
      sender: User,
      currentChatId: string,
      setTextMessage: (arg0: string) => void
    ) => {
      if (!textMessage) {
        return;
      }

      try {
        const response = await axios.post(`/api/messages`, {
          chatId: currentChatId,
          senderId: sender._id,
          text: textMessage,
        });
        setNewMessage(response.data);
        setMessages((prev: Array<Message>) => [...prev, response.data]);
        setTextMessage("");
      } catch (error) {
        return setSendTextMessageError(error);
      }
    },
    []
  );

  return (
    <ChatContext.Provider
      value={{
        userChats,
        setUserChats,
        isUserChatsLoading,
        userChatsError,

        currentChat,
        updateCurrentChat,

        messages,
        isMessagesLoading,
        messagesError,

        sendTextMessage,
        sendTextMessageError,
        newMessage,

        onlineUsers,

        notifications,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
