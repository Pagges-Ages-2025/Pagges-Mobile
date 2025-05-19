import { GenresResponse } from "../models/genresResponse";
import axiosInstance from "./axios-instance-singleton";

export async function retriveAllGenres(): Promise<GenresResponse> {
   const axiosResponse = await axiosInstance.get('user-genres/available')
   const genresData: GenresResponse = axiosResponse.data
    return genresData
}