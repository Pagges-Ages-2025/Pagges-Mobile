import { User } from "../models/User"
import axiosInstance from "./axios-instance-singleton";


export async function searchUsers(term: string): Promise<User[]> {
    const response = await axiosInstance.get(`/user/searchByName`, {
        params: { name: term },
      });
    
      return response.data as User[];
}