import axios, { AxiosError } from "axios";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button, Stack } from "@mui/material";

interface LoginInfo {
  email: string;
  password: string;
}

const Login = () => {
  const { user, setUser, loginError } = useContext(AuthContext);

  const { register, handleSubmit, formState } = useForm<LoginInfo>();
  const { errors } = formState;

  const [loginError, setLoginError] = useState(null);

  const onSubmit: SubmitHandler<LoginInfo> = async (data: LoginInfo) => {
    try {
      const response = await axios.post(`/api/users/login`, data);
      const userData = response.data;
      console.log("aaaaa", userData);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      const err = error as AxiosError;
      setLoginError(err.response.data);
    }
  };

  if (user) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="main p-10 dark:bg-[#1A1A1A] dark:text-[#F0F2F3]">
      <Stack spacing={3} alignItems="center">
        <h1>Login</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col mx-auto w-[300px] gap-6"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="bg-[#F0F0F0] dark:bg-[#313338] !dark:focus:bg-[#313338] p-3"
              {...register("email", {
                required: "This field is required",
              })}
            />
            {errors.email && (
              <div className="text-red-600">{errors.email.message}</div>
            )}
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="bg-[#F0F0F0] dark:bg-[#313338] !dark:focus:bg-[#313338] p-3"
              {...register("password", {
                required: "This field is required",
              })}
            />
            {errors.password && (
              <div className="text-red-600">{errors.password.message}</div>
            )}

            {loginError && (
              <div>
                <p className="text-red-600 pt-3">{loginError}</p>
              </div>
            )}
          </div>

          <Button type="submit" variant="contained" color="primary">
            Login
          </Button>
        </form>
      </Stack>
    </div>
  );
};

export default Login;
