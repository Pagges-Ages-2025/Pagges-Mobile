export class Post {
    postId: number;
    title?: string;
    bookId: number;
    userId: number;
    isSpoiler?: boolean = false;
    text: string;
    isReview?: boolean = false;
    parentId?: number;
    createdAt: Date;
    profileImage?: any;
    googleImageUrl?: string;
    bookTitle?: string;
    username: string;
    likedBy: number;

    constructor(
        {   
            postId,
            title,
            bookId,
            userId,
            isSpoiler = false,
            text,
            isReview = false,
            parentId,
            createdAt,
            profileImage,
            googleImageUrl,
            bookTitle,
            username,
            likedBy
        } : {
            profileImage?: string,
            postId: number,
            title?: string,
            bookId: number,
            userId: number,
            isSpoiler: boolean,
            text: string,
            isReview: boolean,
            parentId: number,
            createdAt: Date,
            googleImageUrl?: string,
            bookTitle?: string,
            username: string,
            likedBy: number
    }
    ) {
        this.postId = postId;
        this.profileImage = profileImage;
        this.title = title;
        this.bookId = bookId;
        this.userId = userId;
        this.isSpoiler = isSpoiler;
        this.text = text;
        this.isReview = isReview;
        this.parentId = parentId;
        this.createdAt = createdAt;
        this.googleImageUrl = googleImageUrl;
        this.bookTitle = bookTitle;
        this.username = username;
        this.likedBy = likedBy;
    }
}