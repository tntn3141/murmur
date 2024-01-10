import { createContext, useState } from "react";

export interface UserContext {
  user: User;
  setUser: (arg0: User) => void
}

export interface User {
  _id: string;
  name: string;
  email: string;
}

export const UserContext = createContext<UserContext>(null);

export const UserContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User>(null);
  return (
    <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>
  );
};
