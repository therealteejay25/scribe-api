import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User.model';

export interface IComment extends Document {
  body: string;
  author: mongoose.Types.ObjectId;
  article: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  toCommentJSON(currentUser?: IUser): object;
}

const commentSchema = new Schema<IComment>(
  {
    body: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    article: { type: Schema.Types.ObjectId, ref: 'Article', required: true, index: true },
  },
  { timestamps: true }
);

commentSchema.methods.toCommentJSON = function (currentUser?: IUser) {
  const author = this.populated('author') || this.author;
  return {
    id: this._id,
    body: this.body,
    createdAt: this.createdAt.toISOString(),
    updatedAt: this.updatedAt.toISOString(),
    author: typeof author === 'object' && author.toProfileJSON ? author.toProfileJSON(currentUser) : author,
  };
};

export const Comment = mongoose.model<IComment>('Comment', commentSchema);
