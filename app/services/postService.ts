import { Post } from "../models/Post";
import axiosInstance from "./axios-instance-singleton";

export interface CreatePostPayload {
  book_id: number;
  is_spoiler: boolean;
  text: string;
  is_review: boolean;
}

export default function PostService() {
  const fetchBookPosts = async (id: string): Promise<Post[]> => {
    try {
      console.log(`Buscando posts do livro com ID: ${id}`);
      const response = await axiosInstance.get(`/posts/reviews/bookId/${id}`);

      if (!response.data || !response.data.data) {
        console.log(`Nenhum dado encontrado para o livro ${id}`);
        return [];
      }

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
            comments: item._count.comments,
          })
      );

      console.log(`Encontrados ${mappedPosts.length} posts para o livro ${id}`);
      return mappedPosts;
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 404) {
          console.log(`Nenhum post encontrado para o livro ${id} (404)`);
          return [];
        }
        console.error(
          `Erro ${error.response.status} ao buscar posts do livro ${id}:`,
          error.response.data
        );
      } else if (error.request) {
        console.error(
          `Erro de rede ao buscar posts do livro ${id}:`,
          error.request
        );
      } else {
        console.error(`Erro ao buscar posts do livro ${id}:`, error.message);
      }
      return [];
    }
  };

  const getPostsByParentId = async (parentId: number): Promise<Post[]> => {
    try {
      console.log(`Buscando posts com parentId: ${parentId}`);
      const response = await axiosInstance.get(
        `/posts/reviews/parentId/${parentId}`
      );

      if (!response.data || !response.data.data) {
        console.log(`Nenhum dado encontrado para parentId: ${parentId}`);
        return [];
      }

      if (!Array.isArray(response.data.data)) {
        console.log(
          `Dados recebidos não são um array para parentId: ${parentId}`,
          response.data.data
        );
        return [];
      }

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
            comments: item._count.comments,
          })
      );

      console.log(
        `Encontrados ${mappedPosts.length} posts para parentId: ${parentId}`
      );
      return mappedPosts;
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 404) {
          console.log(
            `Nenhum post encontrado para parentId: ${parentId} (404)`
          );
          return [];
        }
        console.error(
          `Erro ${error.response.status} ao buscar posts por parentId ${parentId}:`,
          error.response.data
        );
      } else if (error.request) {
        console.error(
          `Erro de rede ao buscar posts por parentId ${parentId}:`,
          error.request
        );
      } else {
        console.error(
          `Erro ao buscar posts por parentId ${parentId}:`,
          error.message
        );
      }
      return [];
    }
  };

  const getPostsByProfile = async (): Promise<Post[]> => {
    console.log("Buscando posts recentes do usuário...");
    try {
      const response = await axiosInstance.get("/posts/user-recent-reviews");
      if (response.data.length == 0) return [];
      const mappedPosts = response.data.map(
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
            comments: item._count.comments,
          })
      );
      return mappedPosts;
    } catch (error) {
      console.error("Erro ao buscar posts por perfil:", error);
      return [];
    }
  };

  const getPostsByUsername = async (username: string): Promise<Post[]> => {
    console.log(`Buscando posts do usuário: ${username}`);
    try {
      const response = await axiosInstance.get(
        `/posts/user-recent-reviews/${username}`
      );
      if (response.data.length == 0) return [];
      const mappedPosts = response.data.map(
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
            comments: item._count.comments,
          })
      );
      return mappedPosts;
    } catch (error) {
      console.error(`Erro ao buscar posts do usuário ${username}:`, error);
      return [];
    }
  };

  const getPostsByUserId = async (userId: number): Promise<Post[]> => {
    console.log(`Buscando posts do usuário com ID: ${userId}`);
    try {
      const response = await axiosInstance.get(
        `/posts/user-recent-reviews/${userId}`
      );
      if (response.data.length == 0) return [];
      const mappedPosts = response.data.map(
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
            comments: item._count.comments,
          })
      );
      return mappedPosts;
    } catch (error) {
      console.error(`Erro ao buscar posts do usuário com ID ${userId}:`, error);
      return [];
    }
  };

  const getForYouPosts = async (): Promise<Post[]> => {
    console.log("Buscando posts para você...");
    try {
      const response = await axiosInstance.get("/posts/for-you-posts-section");

      if (!response.data || !response.data.data) {
        console.log("Nenhum dado encontrado para posts para você");
        return [];
      }

      const mappedPosts = response.data.data.map(
        (item: any) =>
          new Post({
            postId: item.post_id,
            bookId: item.livro?.book_id || item.livro?.id || 0,
            userId: item.autor?.user_id || 0,
            isSpoiler: item.spoiler || false,
            title: item.livro?.title || "",
            text: item.texto,
            isReview: true,
            parentId: item.id_postPai || null,
            createdAt: new Date(item.dataPostagem),
            profileImage: item.autor?.profile_image || null,
            googleImageUrl: item.livro?.google_image_url || null,
            bookTitle: item.livro?.title || "",
            username: item.autor?.username || "",
            likedBy: item.curtidas || 0,
            comments: item.comentarios || 0,
          })
      );

      console.log(`Encontrados ${mappedPosts.length} posts para você`);
      return mappedPosts;
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 404) {
          console.log("Nenhum post encontrado para você (404)");
          return [];
        }
        console.error(
          `Erro ${error.response.status} ao buscar posts para você:`,
          error.response.data
        );
      } else if (error.request) {
        console.error("Erro de rede ao buscar posts para você:", error.request);
      } else {
        console.error("Erro ao buscar posts para você:", error.message);
      }
      return [];
    }
  };

  const getFollowingPosts = async (): Promise<Post[]> => {
    console.log("Buscando posts dos usuários seguidos...");
    try {
      const response = await axiosInstance.get("/posts/following");

      if (!response.data || !response.data.data) {
        console.log("Nenhum dado encontrado para posts seguidos");
        return [];
      }

      const mappedPosts = response.data.data.map(
        (item: any) =>
          new Post({
            postId: item.post_id,
            bookId: item.livro?.book_id || item.livro?.id || 0, // Try both possible field names
            userId: item.autor?.user_id || 0,
            isSpoiler: item.spoiler || false,
            title: item.livro?.title || "",
            text: item.texto,
            isReview: true, // Since this endpoint returns reviews
            parentId: item.id_postPai || null,
            createdAt: new Date(item.dataPostagem),
            profileImage: item.autor?.profile_image || null,
            googleImageUrl: item.livro?.google_image_url || null,
            bookTitle: item.livro?.title || "",
            username: item.autor?.username || "",
            likedBy: item.curtidas || 0,
            comments: item.comentarios || 0,
          })
      );

      console.log(
        `Encontrados ${mappedPosts.length} posts dos usuários seguidos`
      );
      return mappedPosts;
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 404) {
          console.log("Nenhum post encontrado para usuários seguidos (404)");
          return [];
        }
        console.error(
          `Erro ${error.response.status} ao buscar posts dos usuários seguidos:`,
          error.response.data
        );
      } else if (error.request) {
        console.error(
          "Erro de rede ao buscar posts dos usuários seguidos:",
          error.request
        );
      } else {
        console.error(
          "Erro ao buscar posts dos usuários seguidos:",
          error.message
        );
      }
      return [];
    }
  };

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
    getPostsByParentId,
    getPostsByProfile,
    getPostsByUsername,
    getPostsByUserId,
    getForYouPosts,
    getFollowingPosts,
    createPost,
  };
}
