import axiosInstance from "./axios-instance-singleton";
import { Post } from "../models/Post";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface CreatePostPayload {
  book_id: number;
  is_spoiler: boolean;
  text: string;
  is_review: boolean;
}

export default function PostService() {
  const fetchBookPosts = async (id: string): Promise<Post[]> => {
    try {
      const response = await axiosInstance.get(`/posts/reviews/bookId/${id}`);

      const mappedPosts = response.data.data.map(
        (item: any) =>
          new Post({
            postId: item.post_id,
            bookId: item.book_id,
            userId: item.user_id,
            isSpoiler: item.is_spoiler,
            text: item.text,
            isReview: item.is_review,
            parentId: item.parent_id,
            createdAt: item.created_at,
            profileImage: item.user.profile_image,
            username: item.user.username,
            likedBy: item._count.liked_by,
          })
      );
      return mappedPosts;
    } catch (error) {
      console.error("Erro ao buscar posts do livro:", error);
      throw error;
    }
  };

  const getPostsByParentId = async (
    parentId: number
  ): Promise<Post[]> => {
    try {
      const response = await axiosInstance.get(`/posts/reviews/parentId/${parentId}`);
      
      const mappedPosts = response.data.data.map(
        (item: any) =>
          new Post({
            postId: item.post_id,
            bookId: item.book_id,
            userId: item.user_id,
            isSpoiler: item.is_spoiler,
            title: item.livro.title,
            text: item.text,
            isReview: item.is_review,
            parentId: item.parent_id,
            createdAt: item.created_at,
            profileImage: item.user.profile_image,
            googleImageUrl: item.livro.google_image_url,
            bookTitle: item.livro.title,
            username: item.user.username,
            likedBy: item._count.liked_by,
          })
      );
      return mappedPosts;

    } catch (error) {
      console.error("Erro ao buscar posts por parentId:", error);
      throw error;
    }
  }

  const createPost = async (payload: CreatePostPayload): Promise<void> => {
    try {
      // Remove os campos undefined (tenho amenor ideia oq é isso mas ta funcionando)
      //acho q o back buga se recebe um null ou algo assim
      const cleanPayload = Object.fromEntries(
        Object.entries(payload).filter(([_, v]) => v !== undefined)
      );

      console.log("Payload final enviado para o back:", cleanPayload);
      await axiosInstance.post("posts/create-new-post", cleanPayload);
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
    fetchBookPosts,
    createPost,
    getPostsByParentId
  };
}
