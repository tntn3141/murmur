import { useState, useEffect } from "react";
import { getRequest } from "../utils/services";
import { User } from "../context/AuthContext";
import { baseUrl } from "../utils/services";

export interface Chat {
  members: Array<string>;
}

export const useFetchRecipient = (chat: Chat, user: User) => {
  const [recipientUser, setRecipientUser] = useState(null);
  const [error, setError] = useState(null);

  const recipientId = chat?.members?.find((id: string) => id !== user?._id);

  useEffect(() => {
    const getUser = async () => {
      if (!recipientId) {
        return null;
      }
      const response = await getRequest(`${baseUrl}/users/find/${recipientId}`);

      if (response.error) {
        return setError(response);
      }
      setRecipientUser(response);
    };
    getUser();
  }, [recipientId]);

  // should return error also?
  return { recipientUser, error };
};
