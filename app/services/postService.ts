import axiosInstance from "./axios-instance-singleton";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface CreatePostPayload {
    book_id: Number;
    is_spoiler: boolean;
    text: string;
    is_review: boolean;
    
}

export default function PostService() {

   const getAuthToken = async (): Promise<string> => {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) throw new Error("Token não encontrado");
    return token;
  };  


  const createPost = async (payload: CreatePostPayload): Promise<void> => {
    try {
      await axiosInstance.post('posts/create-new-post', payload);
    } catch (error) {
      console.error('Erro ao criar novo post:', error);
      throw error;
    }
  };

  return {
    createPost,
  };

}


