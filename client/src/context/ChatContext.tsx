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
  combinedNotifications: Array<Notification>;
  updateCombinedNotifications: (senderId: string) => void;

  isNotificationOpen: boolean;
  setIsNotificationOpen: Dispatch<SetStateAction<boolean>>;
}

export interface UserChat {
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
  const [combinedNotifications, setCombinedNotifications] = useState<
    Array<Notification>
  >([]);

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Socket
  useEffect(() => {
    const newSocket = io("https://murmur-chat.fly.dev");
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
    /* From currentChat, find the member that IS NOT
    our logined user, i.e. the one that receives the msg */
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
      // Check if the incoming new msg is from the current chat
      const isCurrentChat = currentChat?.members.some(
        (id) => id === res.senderId
      );
      // It is important that the new notification is placed at the last index
      if (isCurrentChat) {
        /* Consider incoming messages from the current chat read, 
        and do not include them in the notifications */
        // setNotifications((prev) => [...prev, { ...res, isRead: true }]);
      } else {
        setNotifications((prev) => [...prev, res]);
      }
    });

    return () => {
      socket.off("getMessage");
      socket.off("getNotification");
    };
  }, [socket, currentChat]);

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
        combinedNotifications,
        updateCombinedNotifications,

        isNotificationOpen,
        setIsNotificationOpen,

      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
