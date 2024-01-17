import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { TextField, Button, Stack } from "@mui/material";
import axios from "axios";

/* Doesn't include user avatar because that means "userAvatar" 
would be either of "File" or "FileList" type, which creates extra headache when 
attempting to append them to FormData to be sent to the backend. 
This problem is in Typescript only. */
interface RegisterInfo {
  email: string;
  password: string;
  name: string;
}

const Register = () => {
  const { user, setUser } = useContext(AuthContext);
  const [userAvatarPreview, setUserAvatarPreview] = useState("");
  // Separate from RegisterInfo because of type difference
  const [userAvatar, setUserAvatar] = useState<File>(null);

  const { register, handleSubmit, formState } = useForm<RegisterInfo>();
  const { errors } = formState;

  // Clean up avatar preview
  useEffect(() => {
    return () => userAvatarPreview && URL.revokeObjectURL(userAvatarPreview);
  }, [userAvatarPreview]);

  if (user) {
    return <Navigate to={"/"} />;
  }

  const onSubmit: SubmitHandler<RegisterInfo> = async (data: RegisterInfo) => {
    const formData = new FormData();
    /* Append the image file separately because it is of "File" type.
    Note that the key has to be "image" so that multer in the server can intercept it */
    if (userAvatar) {
      console.log("avatar present");
      formData.append("image", userAvatar);
    }
    // Append the rest to formData in a for...in... loop nicely
    for (const key in data) {
      // Typescript shenanigans
      const temp = data[key as keyof RegisterInfo];
      formData.append(key, temp);
    }
    try {
      const response = await axios.post(`/api/users/register`, formData);
      const userData = response.data;
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Stack spacing={2} alignItems="center">
        <h1>Register</h1>
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
            <TextField
              label="Name"
              type="text"
              variant="outlined"
              {...register("name", {
                required: "This field is required",
              })}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            <div>
              <label htmlFor="avatar">Avatar (optional)</label>
              <input
                type="file"
                name="avatar"
                onChange={(e) => {
                  const file: File = (e.target as HTMLInputElement).files[0];
                  setUserAvatar(file);
                  setUserAvatarPreview(URL.createObjectURL(file));
                }}
              />
              {userAvatarPreview && (
                <img
                  src={userAvatarPreview}
                  alt="Avatar preview"
                  width="150"
                  className="mx-auto my-2"
                />
              )}
            </div>
            <Button type="submit" variant="contained" color="primary">
              Register
            </Button>
          </Stack>
        </form>
      </Stack>
    </>
  );
};

export default Register;
