import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";

import { TextField, Button, Stack } from "@mui/material";

interface LoginInfo {
  email: string;
  password: string;
}

const Login = () => {
  const { user, setUser } = useContext(AuthContext);

  const { register, handleSubmit, formState } = useForm<LoginInfo>();
  const { errors } = formState;

  const onSubmit: SubmitHandler<LoginInfo> = async (data: LoginInfo) => {
    try {
      const response = await axios.post(`/api/users/login`, data);
      const userData = response.data;
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.log(error);
    }
  };

  if (user) {
    return <Navigate to={"/"} />;
  }

  return (
    <>
      <Stack spacing={3} alignItems="center">
        <h1>Login</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col mx-auto w-[300px] gap-2"
        >
          <Stack spacing={2}>
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              {...register("email", {
                required: "This field is required",
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              {...register("password", {
                required: "This field is required",
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <Button type="submit" variant="contained" color="primary">
              Login
            </Button>
          </Stack>
        </form>
      </Stack>
    </>
  );
};

export default Login;
