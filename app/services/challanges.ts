import { Challange } from "../models/Challanges";
import axiosInstance from "./axios-instance-singleton";
const challangesControllerUrl = "challenges";

export default function ChallangesAPI() {
  const getCurrentChallange = async (): Promise<Challange> => {
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

  const getChallangeByLevel = async (level: number): Promise<Challange> => {
    try {
      const response = await axiosInstance.get(
        `${challangesControllerUrl}/level/${level}`
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar desafio:", error);
      throw error;
    }
  };

  const checkAnswar = async (alternative_id: number): Promise<boolean> => {
    const response = await axiosInstance.post(
      `${challangesControllerUrl}/challenge-answer`,
      {
        alternative_id: alternative_id,
      }
    );
    return response.data.user_guessed_correctly;
  };

  return {
    getCurrentChallange,
    getChallangeByLevel,
    checkAnswar,
  };
}
