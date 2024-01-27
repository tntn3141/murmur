import { Dispatch, SetStateAction, useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import NotificationSingle from "./NotificationSingle";

const NotificationPopup: React.FC<{
  open: boolean;
  close: Dispatch<SetStateAction<boolean>>;
}> = ({ open, close }) => {
  const { combinedNotifications } = useContext(ChatContext);
  console.log(close);

  return (
    <div
      className={`absolute right-2 top-[3.25rem] z-10 w-auto font-bold 
          bg-[#F2F3F5] dark:bg-[#1A1A1A] text-black dark:text-white 
          p-4 overflow-y-auto max-h-[90vh] shadow-lg border border-slate-600 
         `}
    >
      {combinedNotifications.length === 0 && (
        <p className="text-red-500">You have no notifications right now.</p>
      )}
      {combinedNotifications.map((notification, index) => {
        if (!notification.isRead) {
          return <NotificationSingle key={index} content={notification} />;
        }
      })}
      <button className="" onClick={() => close(!open)}>
        Close
      </button>
    </div>
  );
};

export default NotificationPopup;
