import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  bio?: string;
  image?: string;
  following: mongoose.Types.ObjectId[];
  comparePassword(candidatePassword: string): Promise<boolean>;
  toAuthJSON(): object;
  toProfileJSON(currentUser?: IUser): object;
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true, lowercase: true, index: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    password: { type: String, required: true },
    bio: { type: String, default: '' },
    image: { type: String, default: '' },
    following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toAuthJSON = function () {
  return {
    username: this.username,
    email: this.email,
    bio: this.bio,
    image: this.image,
  };
};

userSchema.methods.toProfileJSON = function (currentUser?: IUser) {
  return {
    username: this.username,
    bio: this.bio,
    image: this.image,
    following: currentUser ? currentUser.following.some(id => id.equals(this._id)) : false,
  };
};

export const User = mongoose.model<IUser>('User', userSchema);
