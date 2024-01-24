import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import NotificationSingle from "./NotificationSingle";

const NotificationPopup = () => {
  const { combinedNotifications } = useContext(ChatContext);
  console.log(combinedNotifications)

  return (
    <div
      className={`absolute right-0 top-[3.25rem] z-10 w-auto
          bg-[#F2F3F5] dark:bg-[#1A1A1A] text-black dark:text-white p-2 overflow-y-auto max-h-[90vh] shadow-lg border border-slate-600
         `}
    >
      {combinedNotifications.length === 0 && (
        <p>You have no notifications right now.</p>
      )}
      {combinedNotifications.map((notification, index) => {
        if (!notification.isRead) {
          return <NotificationSingle key={index} content={notification} />;
        }
      })}
    </div>
  );
};

export default NotificationPopup;
