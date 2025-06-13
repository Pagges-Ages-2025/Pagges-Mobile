import axiosInstance from "./axios-instance-singleton";

export interface UserRanking {
  position: number;
  name: string;
  profile_image: string | null;
  points: number;
}

export default function RankingService() {
  const fetchAndSplitRanking = async (): Promise<{
    top3: UserRanking[];
    outros7: UserRanking[];
  }> => {
    try {
      const response = await axiosInstance.get<{ ranking: UserRanking[] }>(
        "/ranking"
      );

      const ranking = response.data.ranking;

      return {
        top3: ranking.slice(0, 3),
        outros7: ranking.slice(3)
      };
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
    fetchAndSplitRanking,
  };
}