import axiosInstance from "./axios-instance-singleton";
import { UserSearchResult } from "../models/UserSearchResult";


export async function searchUsers(term: string): Promise<UserSearchResult[]> {
    const response = await axiosInstance.get(`/user/searchByName`, {
        params: { name: term },
      });
    
      return response.data.map((user: any) => {
        return {
            id: user.user_id,
            name: user.name,
            username: user.username,
            profile_image: user.profile_image ?? null,
        }
      });
}