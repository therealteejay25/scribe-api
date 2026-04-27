import { Router } from 'express';
import * as articleController from '../controllers/article.controller';
import { authenticate, optionalAuth } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createArticleSchema, updateArticleSchema, createCommentSchema } from '../validators/article.validator';

const router = Router();

router.post('/articles', authenticate, validate(createArticleSchema), articleController.createArticle);
router.get('/articles/feed', authenticate, articleController.getFeed);
router.get('/articles/bookmarked/list', authenticate, articleController.getBookmarkedArticles);
router.get('/articles/:slug', optionalAuth, articleController.getArticle);
router.put('/articles/:slug', authenticate, validate(updateArticleSchema), articleController.updateArticle);
router.delete('/articles/:slug', authenticate, articleController.deleteArticle);
router.get('/articles', optionalAuth, articleController.listArticles);

router.post('/articles/:slug/favorite', authenticate, articleController.favoriteArticle);
router.delete('/articles/:slug/favorite', authenticate, articleController.unfavoriteArticle);

router.post('/articles/:slug/like', authenticate, articleController.likeArticle);
router.delete('/articles/:slug/like', authenticate, articleController.unlikeArticle);

router.post('/articles/:slug/bookmark', authenticate, articleController.bookmarkArticle);
router.delete('/articles/:slug/bookmark', authenticate, articleController.unbookmarkArticle);

router.post('/articles/:slug/share', articleController.shareArticle);

router.post('/articles/:slug/comments', authenticate, validate(createCommentSchema), articleController.addComment);
router.get('/articles/:slug/comments', optionalAuth, articleController.getComments);
router.delete('/articles/:slug/comments/:id', authenticate, articleController.deleteComment);

router.get('/tags', articleController.getTags);

export default router;
