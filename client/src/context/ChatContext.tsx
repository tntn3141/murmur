import {
  createContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
} from "react";
import axios from "axios";
import { AuthContext, User } from "./AuthContext";
import { Socket, io } from "socket.io-client";

// ENV
const isDevMode = import.meta.env.DEV;
const devBaseUrl = import.meta.env.VITE_DEV_SERVER_URL;
const prodBaseUrl = import.meta.env.VITE_PROD_SERVER_URL;
const baseUrl = isDevMode ? devBaseUrl : prodBaseUrl;

// TYPES
interface ChatContextType {
  userChats: Array<SingleUserChat>;
  setUserChats: Dispatch<SetStateAction<Array<SingleUserChat>>>;
  isUserChatsLoading: boolean;
  userChatsError: string;

  currentChat: SingleUserChat;
  updateCurrentChat: (chat: SingleUserChat) => void;
  currentChatUser: User;
  setCurrentChatUser: Dispatch<SetStateAction<User>>;

  socket: Socket;
  onlineUsers: Array<OnlineUser>;

  notifications: Array<Notification>;
  setNotifications: Dispatch<SetStateAction<Array<Notification>>>;
  combinedNotifications: Array<Notification>;
  updateCombinedNotifications: (senderId: string) => void;
}
export interface SingleUserChat {
  _id: string;
  members: Array<string>;
}
export interface Message {
  _id: string;
  chatId: string;
  senderId: string;
  createdAt: string;
  text: string;
}
export interface OnlineUser {
  userId: string;
  socketId: string;
}
export interface Notification {
  senderId: string;
  isRead: boolean;
  date: Date;
  text: string;
  number: number;
}

export const ChatContext = createContext<ChatContextType>(null);

export const ChatContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user } = useContext(AuthContext);

  const [userChats, setUserChats] = useState<Array<SingleUserChat>>([]);
  const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
  const [userChatsError, setUserChatsError] = useState(null);

  const [currentChat, setCurrentChat] = useState<SingleUserChat>(null);
  const [currentChatUser, setCurrentChatUser] = useState<User>(null);

  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState<Array<OnlineUser>>([]);

  const [notifications, setNotifications] = useState<Array<Notification>>([]);
  const [combinedNotifications, setCombinedNotifications] = useState<
    Array<Notification>
  >([]);

  // Socket
  useEffect(() => {
    const newSocket = io(baseUrl);
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
  }, [socket, user]);

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

  /* Combine multiple message notifications from one user 
  into one single notification */
  useEffect(() => {
    if (notifications.length === 0) return;

    const lastNotification = notifications[notifications.length - 1];
    const results: Array<Notification> = [...combinedNotifications];
    const lastSenderId = lastNotification.senderId;
    const isNewSenderId = combinedNotifications?.every(
      (value) => value.senderId !== lastSenderId
    );
    if (isNewSenderId) {
      results.push(lastNotification);
    } else {
      const foundIndex = results.findIndex(
        (result) => result.senderId === lastSenderId
      );
      results[foundIndex] = {
        ...lastNotification,
        number: results[foundIndex].number + 1,
      };
    }
    setCombinedNotifications(results);
  }, [notifications]);

  // Remove checked notification
  const updateCombinedNotifications = useCallback((senderId: string) => {
    const foundIndex = combinedNotifications.findIndex(
      (value) => value.senderId === senderId
    );
    const newCombinedNotifications = combinedNotifications.splice(
      foundIndex,
      1
    );
    setCombinedNotifications(newCombinedNotifications);
  }, []);

  /* If the user reads the new message(s) by clicking directly on the chat with sender,
  also clears the associated notification from the notification bar */
  useEffect(() => {
    const otherUserId = currentChat?.members.find(
      (id: string) => id !== user._id
    );
    if (combinedNotifications.some((value) => value.senderId === otherUserId)) {
      updateCombinedNotifications(otherUserId);
    }
  }, [currentChat]);

  // setCurrentChat
  const updateCurrentChat = useCallback((chat: SingleUserChat) => {
    setCurrentChat(chat);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        userChats,
        setUserChats,
        isUserChatsLoading,
        userChatsError,

        currentChat,
        updateCurrentChat,
        currentChatUser,
        setCurrentChatUser,

        socket,
        onlineUsers,

        notifications,
        combinedNotifications,
        updateCombinedNotifications,

        setNotifications,

      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
