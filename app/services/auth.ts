import { LoginRequestData, LoginResponseDto } from "../models/login.model";
import RegisterRequestData, { RegisterResponseDto } from "../models/Register";
import axiosInstance from "./axios-instance-singleton";

export default function AuthAPI() {
  const executeRegisterUserRequest = async (
    user: RegisterRequestData
  ): Promise<RegisterResponseDto> => {
    const response = await axiosInstance.post("/auth/register", {
      email: user.email,
      password: user.password,
      name: user.name,
      username: user.username,
      isAuthor: user.isAuthor,
    });
    const responseData: RegisterResponseDto = response.data;
    return responseData;
  };

  const executeLoginUserRequest = async (
    loginRequestData: LoginRequestData
  ): Promise<LoginResponseDto> => {
    const response = await axiosInstance.post(`/auth/login`, {
      email: loginRequestData.email,
      password: loginRequestData.password,
    });
    const responseData: LoginResponseDto = response.data;
    return responseData;
  };

  return {
    executeRegisterUserRequest: executeRegisterUserRequest,
    executeLoginUserRequest: executeLoginUserRequest,
  };
}
