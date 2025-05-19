export class Post {
    title: string;
    bookId: number;
    userId: number;
    isSpoiler?: boolean = false;
    text: string;
    isReview?: boolean = false;
    parentId?: number;
    createdAt: Date;
    googleImageUrl: string;
    bookTitle: string;
    username: string;
    likedBy: number;

    constructor(
        {
            title,
            bookId,
            userId,
            isSpoiler = false,
            text,
            isReview = false,
            parentId,
            createdAt,
            googleImageUrl,
            bookTitle,
            username,
            likedBy
        } : {
            title: string,
            bookId: number,
            userId: number,
            isSpoiler: boolean,
            text: string,
            isReview: boolean,
            parentId: number,
            createdAt: Date,
            googleImageUrl: string,
            bookTitle: string,
            username: string,
            likedBy: number
    }
    ) {
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