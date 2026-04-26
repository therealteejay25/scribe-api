import { Request, Response, NextFunction } from 'express';
import { ArticleService } from '../services/article.service';

const articleService = new ArticleService();

export const createArticle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await articleService.createArticle(req.body.article, req.user!);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const getArticle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await articleService.getArticle(req.params.slug, req.user);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const updateArticle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await articleService.updateArticle(req.params.slug, req.body.article, req.user!);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteArticle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await articleService.deleteArticle(req.params.slug, req.user!);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const listArticles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await articleService.listArticles(req.query, req.user);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getFeed = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { limit, offset } = req.query;
    const result = await articleService.getFeed(req.user!, Number(limit), Number(offset));
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const favoriteArticle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await articleService.favoriteArticle(req.params.slug, req.user!);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const unfavoriteArticle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await articleService.unfavoriteArticle(req.params.slug, req.user!);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const likeArticle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await articleService.likeArticle(req.params.slug, req.user!);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const unlikeArticle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await articleService.unlikeArticle(req.params.slug, req.user!);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const bookmarkArticle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await articleService.bookmarkArticle(req.params.slug, req.user!);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const unbookmarkArticle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await articleService.unbookmarkArticle(req.params.slug, req.user!);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const shareArticle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await articleService.shareArticle(req.params.slug);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getBookmarkedArticles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { limit, offset } = req.query;
    const result = await articleService.getBookmarkedArticles(req.user!, Number(limit), Number(offset));
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const addComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await articleService.addComment(req.params.slug, req.body.comment.body, req.user!);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const getComments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await articleService.getComments(req.params.slug, req.user);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await articleService.deleteComment(req.params.slug, req.params.id, req.user!);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getTags = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await articleService.getTags();
    res.json(result);
  } catch (error) {
    next(error);
  }
};
