import { Genre } from "./Genre";

export class User {
  id: number;
  name: string;
  biography: string;
  favoriteGenres: Genre[];
  readKm: number;
  readBooks: number;
  ranking_position: number;
  friendsNumber: number;
  isAuthor: boolean;
  email: string;
  profileImage?: string;
  points: number

  constructor() {
    this.id = 0;
    this.name = "";
    this.biography = "";
    this.favoriteGenres = [];
    this.readKm = 0;
    this.readBooks = 0;
    this.ranking_position = 0;
    this.friendsNumber = 0;
    this.isAuthor = false;
    this.email = "";
    this.points = 0;
  }
}
