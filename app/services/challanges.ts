import { Challanges } from "../models/Challanges";
import axiosInstance from "./axios-instance-singleton";
// Se não funcionar mudar de localhost para o ip da máquina
const challangesControllerUrl = "challenges";

export default function ChallangesAPI() {
  const getCurrentChallange = async (): Promise<Challanges> => {
    try {
      const response = await axiosInstance.get(
        `${challangesControllerUrl}/get-current`
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar perfil:", error);
      throw error;
    }
  };

  const checkAnswar = async (
    alternative_id: number
  ): Promise<boolean | null> => {
    try {
      const response = await axiosInstance.post(
        `${challangesControllerUrl}/challenge-answer`,
        {
          alternative_id: alternative_id,
        }
      );
      return response.data.user_guessed_correctly;
    } catch (error: any) {
      // Verifica se é a BadRequest específica
      const isAlreadyAnswered =
        error.response?.status === 400 &&
        error.response?.data?.message ===
          "User already answered this challenge";

      if (isAlreadyAnswered) {
        return null; // Retorna null só nesse caso
      }

      // Para qualquer outro erro, lança novamente
      throw error;
    }
  };
  return {
    getCurrentChallange,
    checkAnswar,
  };
}
