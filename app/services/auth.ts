import RegisterAPI from "../models/Register";
import axiosInstance from "./axios-instance-singleton";

export default function AuthAPI() {
  const registerUser = async (user: RegisterAPI) => {
    const response = await axiosInstance.post("/auth/register", {
      email: user.email,
      password: user.password,
      name: user.name,
      username: user.username,
      isAuthor: user.isAuthor,
    });
    return response.data;
  };

  return {
    registerUser,
  };
}
