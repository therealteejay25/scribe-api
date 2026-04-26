import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';

const userService = new UserService();

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email, password } = req.body.user;
    const result = await userService.register(username, email, password);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body.user;
    const result = await userService.login(email, password);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.getCurrentUser(req.user!._id.toString());
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.updateUser(req.user!._id.toString(), req.body.user);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.getProfile(req.params.username, req.user);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const followUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.followUser(req.params.username, req.user!);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const unfollowUser = async (req: Request,
 res: Response, next: NextFunction) => {
  try {
    const result = await userService.unfollowUser(req.params.username, req.user!);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
