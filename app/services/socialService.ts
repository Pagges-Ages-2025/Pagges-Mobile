import { UserFollower } from "../models/UserFollower";
import axiosInstance from "./axios-instance-singleton";
export default function SocialAPI() {
  async function isFollowing(username: string): Promise<boolean> {
    try {
      const axiosResponse = await axiosInstance.get("social/is-following", {
        params: { username },
      });
      return axiosResponse.data;
    } catch (error) {
      console.error("Erro ao verificar se está seguindo:", error);
      throw error;
    }
  }

  async function unfollowUser(username: string): Promise<void> {
    try {
      const axiosResponse = await axiosInstance.delete("social/unfollow", {
        data: { username },
      });
      return axiosResponse.data;
    } catch (error) {
      console.error("Erro ao deixar de seguir o usuário:", error);
      throw error;
    }
  }

  async function followUser(username: string): Promise<void> {
    try {
      const axiosResponse = await axiosInstance.post("social/follow", {
        username,
      });
      return axiosResponse.data;
    } catch (error) {
      console.error("Erro ao seguir o usuário:", error);
      throw error;
    }
  }

  async function getFollowersFromOtherUser(
    userId: number
  ): Promise<UserFollower[]> {
    try {
      const axiosResponse = await axiosInstance.get(
        `social/others-followers/${userId}`
      );
      return axiosResponse.data.followers.map((userFollower: any) => {
        return new UserFollower(
          userFollower.user_id,
          userFollower.imFollowing,
          userFollower.username,
          userFollower.profile_image
        );
      });
    } catch (error) {
      console.error("Erro ao buscar o usuário:", error);
      throw error;
    }
  }

  async function getUserFollowers(): Promise<UserFollower[]> {
    try {
      const axiosResponse = await axiosInstance.get(`social/followers`);

      return axiosResponse.data.followers.map((userFollower: any) => {
        return new UserFollower(
          userFollower.user_id,
          userFollower.imFollowing,
          userFollower.username,
          userFollower.profile_image
        );
      });
    } catch (error) {
      console.error("Erro ao buscar o usuário:", error);
      throw error;
    }
  }

  return {
    isFollowing,
    unfollowUser,
    followUser,
    getFollowersFromOtherUser,
    getUserFollowers,
  };
}
