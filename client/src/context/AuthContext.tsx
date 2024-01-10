import React, { createContext, useCallback, useEffect, useState } from "react";
import { baseUrl, postRequest } from "../utils/services";

export interface AuthContext {
  user: User;
  registerInfo: RegisterInfo;
  updateRegisterInfo: (arg0: RegisterInfo) => void;
  registerUser: (arg0: React.ChangeEvent<HTMLInputElement>) => void;
  isRegisterLoading: boolean;
  registerError: string;
  logoutUser: () => void;
  loginUser: (arg0: React.SyntheticEvent) => void;
  loginInfo: LoginInfo;
  isLoginLoading: boolean;
  loginError: string;
  updateLoginInfo: (arg0: LoginInfo) => void;
}

export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface RegisterInfo {
  name: string;
  email: string;
  password: string;
}

export interface LoginInfo {
  email: string;
  password: string;
}

export const AuthContext = createContext<AuthContext | null>(null);

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User>(null);
  const [registerError, setRegisterError] = useState(null);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [registerInfo, setRegisterInfo] = useState<RegisterInfo>({
    name: "",
    email: "",
    password: "",
  });
  const [loginError, setLoginError] = useState(null);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [loginInfo, setLoginInfo] = useState<LoginInfo>({
    email: "",
    password: "",
  });

  useEffect(() => {
    const user = localStorage.getItem("user");
    setUser(JSON.parse(user));
  }, []);

  const updateRegisterInfo = useCallback((info: RegisterInfo) => {
    setRegisterInfo(info);
  }, []);

  const updateLoginInfo = useCallback((info: LoginInfo) => {
    setLoginInfo(info);
  }, []);

  const registerUser = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      setIsRegisterLoading(true);
      setRegisterError(null);
      const response = await postRequest(
        `${baseUrl}/users/register`,
        JSON.stringify(registerInfo)
      );

      setIsRegisterLoading(false);

      if (response.error) {
        return setRegisterError(response);
      }
      localStorage.setItem("user", JSON.stringify(response));
      setUser(response);
    },
    [registerInfo]
  );

  const logoutUser = useCallback(() => {
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  const loginUser = useCallback(
    async (e: React.SyntheticEvent) => {
      e.preventDefault();
      setIsLoginLoading(true);
      setLoginError(null);
      const response = await postRequest(
        `${baseUrl}/users/login`,
        JSON.stringify(loginInfo)
      );
      if (response.error) {
        return setLoginError(response);
      }
      localStorage.setItem("user", JSON.stringify(response));
      setUser(response);
      setIsLoginLoading(false);
    },
    [loginInfo]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        registerInfo,
        updateRegisterInfo,
        registerUser,
        isRegisterLoading,
        registerError,
        logoutUser,
        loginUser,
        isLoginLoading,
        loginError,
        loginInfo,
        updateLoginInfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
