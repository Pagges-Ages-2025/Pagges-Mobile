export class UserFollower {
  userId: number;
  profileImage?: string;
  imFollowing: boolean;
  username: string;

  constructor(
    userId: number,
    imFollowing: boolean,
    username: string,
    profileImage?: string
  ) {
    this.userId = userId;
    this.profileImage = profileImage;
    this.imFollowing = imFollowing;
    this.username = username;
  }
}
