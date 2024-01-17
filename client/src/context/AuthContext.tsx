import React, { createContext, useCallback, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

export interface AuthContext {
  user: User;
  setUser: (user: User) => void;
  registerInfo: RegisterInfo;
  updateRegisterInfo: (arg0: RegisterInfo) => void;
  registerUser: (arg0: React.ChangeEvent<HTMLInputElement>) => void;
  isRegisterLoading: boolean;
  registerError: {
    error: boolean;
    message: string;
  };
  logoutUser: () => void;
  loginUser: (arg0: React.SyntheticEvent) => void;
  loginInfo: LoginInfo;
  isLoginLoading: boolean;
  loginError: {
    error: boolean;
    message: string;
  };
  updateLoginInfo: (arg0: LoginInfo) => void;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface RegisterInfo {
  name: string;
  email: string;
  password: string;
  avatar: string;
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
    avatar: "",
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
      try {
        const response = await axios.post(`/api/user/register`, registerInfo);
        setIsRegisterLoading(false);
        localStorage.setItem("user", response.data);
        setUser(response.data);
      } catch (error) {
        return setRegisterError(error);
      }
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
      try {
        const response = await axios.post(`/api/users/login`, loginInfo);
        localStorage.setItem("user", response.data);
        setUser(response.data);
        setIsLoginLoading(false);
      } catch (error) {
        return setLoginError(error);
      }

      return <Navigate to={"/"} />;
    },
    [loginInfo]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
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
