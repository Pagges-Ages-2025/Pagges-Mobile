export class User {
  id: number;
  name: string;
  biography: string;
  favouriteGenres: string[];
  readKm: number;
  readBooks: number;
  ranking: number;
  friendsNumber: number;
  isAuthor: boolean;
  email: string;

  constructor() {
    this.id = 0;
    this.name = "";
    this.biography = "";
    this.favouriteGenres = [];
    this.readKm = 0;
    this.readBooks = 0;
    this.ranking = 0;
    this.friendsNumber = 0;
    this.isAuthor = false;
    this.email = "";
  }
}
