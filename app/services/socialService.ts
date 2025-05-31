import axiosInstance from "./axios-instance-singleton";
export default function SocialAPI() {

    async function isFollowing(username: string): Promise<boolean> {
        try{
            const axiosResponse = await axiosInstance.get("social/is-following", {
                 params: { username },
            });
            return axiosResponse.data
        } catch (error) {
            console.error("Erro ao verificar se está seguindo:", error);
            throw error;
        }
    }

    async function unfollowUser(username: string): Promise<void> {
        try{
            const axiosResponse = await axiosInstance.delete("social/unfollow", {
                data: { username },
            });
            return axiosResponse.data
        } catch (error) {
            console.error("Erro ao deixar de seguir o usuário:", error);
            throw error;
        }
    }

    async function followUser(username: string): Promise<void> {
        try{
            const axiosResponse = await axiosInstance.post("social/follow", {
                data: { username },
            });
            return axiosResponse.data
        } catch (error) {
            console.error("Erro ao seguir o usuário:", error);
            throw error;
        }
    }
    
    return {
        isFollowing,
        unfollowUser,
        followUser
    };

}


