import { User, IUser } from '../models/User.model';
import { generateToken } from '../utils/jwt';

export class UserService {
  async register(username: string, email: string, password: string) {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      throw { status: 422, message: 'User already exists' };
    }

    const user = await User.create({ username, email, password });
    return { user: { ...user.toAuthJSON(), token: generateToken(user._id.toString()) } };
  }

  async login(email: string, password: string) {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      throw { status: 401, message: 'Invalid credentials' };
    }

    return { user: { ...user.toAuthJSON(), token: generateToken(user._id.toString()) } };
  }

  async getCurrentUser(userId: string) {
    const user = await User.findById(userId);
    if (!user) throw { status: 404, message: 'User not found' };
    return { user: { ...user.toAuthJSON(), token: generateToken(user._id.toString()) } };
  }

  async updateUser(userId: string, updates: Partial<IUser>) {
    const user = await User.findById(userId);
    if (!user) throw { status: 404, message: 'User not found' };

    Object.assign(user, updates);
    await user.save();
    return { user: { ...user.toAuthJSON(), token: generateToken(user._id.toString()) } };
  }

  async getProfile(username: string, currentUser?: IUser) {
    const user = await User.findOne({ username });
    if (!user) throw { status: 404, message: 'Profile not found' };
    return { profile: user.toProfileJSON(currentUser) };
  }

  async followUser(username: string, currentUser: IUser) {
    const userToFollow = await User.findOne({ username });
    if (!userToFollow) throw { status: 404, message: 'User not found' };

    if (!currentUser.following.includes(userToFollow._id)) {
      currentUser.following.push(userToFollow._id);
      await currentUser.save();
    }

    return { profile: userToFollow.toProfileJSON(currentUser) };
  }

  async unfollowUser(username: string, currentUser: IUser) {
    const userToUnfollow = await User.findOne({ username });
    if (!userToUnfollow) throw { status: 404, message: 'User not found' };

    currentUser.following = currentUser.following.filter(id => !id.equals(userToUnfollow._id));
    await currentUser.save();

    return { profile: userToUnfollow.toProfileJSON(currentUser) };
  }
}
