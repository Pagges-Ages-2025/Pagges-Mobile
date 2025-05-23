import axiosInstance from "./axios-instance-singleton";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface CreatePostPayload {
    book_id: number;
    is_spoiler: boolean;
    text: string;
    is_review: boolean;
    
}

export default function PostService() {



  const createPost = async (payload: CreatePostPayload): Promise<void> => {
    try {
      // Remove os campos undefined (tenho amenor ideia oq é isso mas ta funcionando)
      //acho q o back buga se recebe um null ou algo assim
      const cleanPayload = Object.fromEntries(
        Object.entries(payload).filter(([_, v]) => v !== undefined)
      );


      console.log("Payload final enviado para o back:", cleanPayload);
      await axiosInstance.post('posts/create-new-post', cleanPayload);
    } catch (error: any) {
  if (error.response) {
    console.error("Erro da API:", error.response.data);
  } else {
    console.error("Erro inesperado:", error.message);
  }
  throw error;
}
  };

  return {
    createPost,
  };

}


