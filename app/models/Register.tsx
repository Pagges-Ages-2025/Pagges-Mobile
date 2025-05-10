export default interface RegisterRequestData {
  email: string;
  password: string;
  name: string;
  username: string;
  isAuthor: boolean;
}

export type RegisterResponseDto = {
  message: string;
  accessToken: string;
};
