import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User.model';

export interface IArticle extends Document {
  slug: string;
  title: string;
  description: string;
  body: string;
  image?: string;
  tagList: string[];
  author: mongoose.Types.ObjectId;
  favoritedBy: mongoose.Types.ObjectId[];
  favoritesCount: number;
  likedBy: mongoose.Types.ObjectId[];
  likesCount: number;
  bookmarkedBy: mongoose.Types.ObjectId[];
  bookmarksCount: number;
  sharesCount: number;
  commentsCount: number;
  readTime?: number;
  createdAt: Date;
  updatedAt: Date;
  toArticleJSON(currentUser?: IUser): object;
}

const articleSchema = new Schema<IArticle>(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    body: { type: String, required: true },
    image: { type: String },
    tagList: [{ type: String }],
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    favoritedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    favoritesCount: { type: Number, default: 0 },
    likedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    likesCount: { type: Number, default: 0 },
    bookmarkedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    bookmarksCount: { type: Number, default: 0 },
    sharesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    readTime: { type: Number },
  },
  { timestamps: true }
);

articleSchema.index({ createdAt: -1 });
articleSchema.index({ author: 1, createdAt: -1 });

articleSchema.pre('save', function (next) {
  if (this.isModified('body')) {
    const wordsPerMinute = 200;
    const wordCount = this.body.trim().split(/\s+/).length;
    this.readTime = Math.ceil(wordCount / wordsPerMinute);
  }
  next();
});

articleSchema.methods.toArticleJSON = function (currentUser?: IUser) {
  const author = this.populated('author') || this.author;
  return {
    slug: this.slug,
    title: this.title,
    description: this.description,
    body: this.body,
    image: this.image,
    tagList: this.tagList,
    createdAt: this.createdAt.toISOString(),
    updatedAt: this.updatedAt.toISOString(),
    favorited: currentUser ? this.favoritedBy.some((id: any) => id.equals(currentUser._id)) : false,
    favoritesCount: this.favoritesCount,
    liked: currentUser ? this.likedBy.some((id: any) => id.equals(currentUser._id)) : false,
    likesCount: this.likesCount,
    bookmarked: currentUser ? this.bookmarkedBy.some((id: any) => id.equals(currentUser._id)) : false,
    bookmarksCount: this.bookmarksCount,
    sharesCount: this.sharesCount,
    commentsCount: this.commentsCount,
    readTime: this.readTime,
    author: typeof author === 'object' && author.toProfileJSON ? author.toProfileJSON(currentUser) : author,
  };
};

export const Article = mongoose.model<IArticle>('Article', articleSchema);
