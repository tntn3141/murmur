import { useState, useEffect } from "react";
import { User } from "../context/AuthContext";
import axios from "axios";

export interface Chat {
  members: Array<string>;
}

export const useFetchRecipient = (chat: Chat, user: User) => {
  const [recipientUser, setRecipientUser] = useState(null);
  const [fetchRecipientError, setFetchRecipientError] = useState(null);

  const recipientId = chat?.members?.find((id: string) => id !== user?._id);

  useEffect(() => {
    const getUser = async (): Promise<void> => {
      if (!recipientId) {
        return null;
      }
      try {
        const response = await axios.get(`api/users/findById/${recipientId}`);
        setRecipientUser(response.data)        
      } catch (error) {
        setFetchRecipientError("Unexpected error. Please contact the admin.")
      }
    };
    getUser();
  }, [recipientId]);

  return { recipientUser, fetchRecipientError };
};
