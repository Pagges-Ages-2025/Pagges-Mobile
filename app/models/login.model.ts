export type LoginRequestData = {
  email: string;
  password: string;
};

export type LoginResponseDto = {
  message: string;
  accessToken: string;
};
