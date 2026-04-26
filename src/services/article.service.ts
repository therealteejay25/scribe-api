import { Article, IArticle } from '../models/Article.model';
import { Comment } from '../models/Comment.model';
import { IUser } from '../models/User.model';
import { generateSlug } from '../utils/slugify';

export class ArticleService {
  async createArticle(data: Partial<IArticle>, author: IUser) {
    const slug = generateSlug(data.title!);
    const article = await Article.create({ ...data, slug, author: author._id });
    await article.populate('author');
    return { article: article.toArticleJSON(author) };
  }

  async getArticle(slug: string, currentUser?: IUser) {
    const article = await Article.findOne({ slug }).populate('author');
    if (!article) throw { status: 404, message: 'Article not found' };
    return { article: article.toArticleJSON(currentUser) };
  }

  async updateArticle(slug: string, updates: Partial<IArticle>, currentUser: IUser) {
    const article = await Article.findOne({ slug }).populate('author');
    if (!article) throw { status: 404, message: 'Article not found' };
    if (!article.author._id.equals(currentUser._id)) {
      throw { status: 403, message: 'Not authorized' };
    }

    if (updates.title) article.slug = generateSlug(updates.title);
    Object.assign(article, updates);
    await article.save();
    return { article: article.toArticleJSON(currentUser) };
  }

  async deleteArticle(slug: string, currentUser: IUser) {
    const article = await Article.findOne({ slug });
    if (!article) throw { status: 404, message: 'Article not found' };
    if (!article.author.equals(currentUser._id)) {
      throw { status: 403, message: 'Not authorized' };
    }

    await article.deleteOne();
  }

  async listArticles(query: any, currentUser?: IUser) {
    const { tag, author, favorited, limit = 20, offset = 0 } = query;
    const filter: any = {};

    if (tag) filter.tagList = tag;
    if (author) {
      const authorUser = await this.findUserByUsername(author);
      filter.author = authorUser._id;
    }
    if (favorited) {
      const favoritedUser = await this.findUserByUsername(favorited);
      filter.favoritedBy = favoritedUser._id;
    }

    const [articles, articlesCount] = await Promise.all([
      Article.find(filter).populate('author').sort({ createdAt: -1 }).limit(limit).skip(offset),
      Article.countDocuments(filter),
    ]);

    return {
      articles: articles.map(a => a.toArticleJSON(currentUser)),
      articlesCount,
    };
  }

  async getFeed(currentUser: IUser, limit = 20, offset = 0) {
    const articles = await Article.find({ author: { $in: currentUser.following } })
      .populate('author')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset);

    const articlesCount = await Article.countDocuments({ author: { $in: currentUser.following } });

    return {
      articles: articles.map(a => a.toArticleJSON(currentUser)),
      articlesCount,
    };
  }

  async favoriteArticle(slug: string, currentUser: IUser) {
    const article = await Article.findOne({ slug }).populate('author');
    if (!article) throw { status: 404, message: 'Article not found' };

    if (!article.favoritedBy.includes(currentUser._id)) {
      article.favoritedBy.push(currentUser._id);
      article.favoritesCount++;
      await article.save();
    }

    return { article: article.toArticleJSON(currentUser) };
  }

  async unfavoriteArticle(slug: string, currentUser: IUser) {
    const article = await Article.findOne({ slug }).populate('author');
    if (!article) throw { status: 404, message: 'Article not found' };

    article.favoritedBy = article.favoritedBy.filter(id => !id.equals(currentUser._id));
    article.favoritesCount = article.favoritedBy.length;
    await article.save();

    return { article: article.toArticleJSON(currentUser) };
  }

  async likeArticle(slug: string, currentUser: IUser) {
    const article = await Article.findOne({ slug }).populate('author');
    if (!article) throw { status: 404, message: 'Article not found' };

    if (!article.likedBy.includes(currentUser._id)) {
      article.likedBy.push(currentUser._id);
      article.likesCount++;
      await article.save();
    }

    return { article: article.toArticleJSON(currentUser) };
  }

  async unlikeArticle(slug: string, currentUser: IUser) {
    const article = await Article.findOne({ slug }).populate('author');
    if (!article) throw { status: 404, message: 'Article not found' };

    article.likedBy = article.likedBy.filter(id => !id.equals(currentUser._id));
    article.likesCount = article.likedBy.length;
    await article.save();

    return { article: article.toArticleJSON(currentUser) };
  }

  async bookmarkArticle(slug: string, currentUser: IUser) {
    const article = await Article.findOne({ slug }).populate('author');
    if (!article) throw { status: 404, message: 'Article not found' };

    if (!article.bookmarkedBy.includes(currentUser._id)) {
      article.bookmarkedBy.push(currentUser._id);
      article.bookmarksCount++;
      await article.save();
    }

    return { article: article.toArticleJSON(currentUser) };
  }

  async unbookmarkArticle(slug: string, currentUser: IUser) {
    const article = await Article.findOne({ slug }).populate('author');
    if (!article) throw { status: 404, message: 'Article not found' };

    article.bookmarkedBy = article.bookmarkedBy.filter(id => !id.equals(currentUser._id));
    article.bookmarksCount = article.bookmarkedBy.length;
    await article.save();

    return { article: article.toArticleJSON(currentUser) };
  }

  async shareArticle(slug: string) {
    const article = await Article.findOne({ slug }).populate('author');
    if (!article) throw { status: 404, message: 'Article not found' };

    article.sharesCount++;
    await article.save();

    return { article: article.toArticleJSON() };
  }

  async getBookmarkedArticles(currentUser: IUser, limit = 20, offset = 0) {
    const articles = await Article.find({ bookmarkedBy: currentUser._id })
      .populate('author')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset);

    const articlesCount = await Article.countDocuments({ bookmarkedBy: currentUser._id });

    return {
      articles: articles.map(a => a.toArticleJSON(currentUser)),
      articlesCount,
    };
  }

  async addComment(slug: string, body: string, currentUser: IUser) {
    const article = await Article.findOne({ slug });
    if (!article) throw { status: 404, message: 'Article not found' };

    const comment = await Comment.create({ body, author: currentUser._id, article: article._id });
    await comment.populate('author');
    
    article.commentsCount++;
    await article.save();
    
    return { comment: comment.toCommentJSON(currentUser) };
  }

  async getComments(slug: string, currentUser?: IUser) {
    const article = await Article.findOne({ slug });
    if (!article) throw { status: 404, message: 'Article not found' };

    const comments = await Comment.find({ article: article._id }).populate('author').sort({ createdAt: -1 });
    return { comments: comments.map(c => c.toCommentJSON(currentUser)) };
  }

  async deleteComment(slug: string, commentId: string, currentUser: IUser) {
    const comment = await Comment.findById(commentId);
    if (!comment) throw { status: 404, message: 'Comment not found' };
    if (!comment.author.equals(currentUser._id)) {
      throw { status: 403, message: 'Not authorized' };
    }

    const article = await Article.findOne({ slug });
    if (article) {
      article.commentsCount = Math.max(0, article.commentsCount - 1);
      await article.save();
    }

    await comment.deleteOne();
  }

  async getTags() {
    const tags = await Article.distinct('tagList');
    return { tags };
  }

  private async findUserByUsername(username: string) {
    const { User } = await import('../models/User.model');
    const user = await User.findOne({ username });
    if (!user) throw { status: 404, message: 'User not found' };
    return user;
  }
}
