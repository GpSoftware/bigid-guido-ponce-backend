import { Response } from 'express';
import { Controller, Delete, Get, Patch, Post, ValidateBody } from '../utils/decorators';
import { STATUS } from '../utils/status';
import { JSONWebToken } from '../libs/jwt';
import { PrivateRequest } from '../utils/decorators/types';
import { ArticleRepository } from '../repositories/ArticleRepository';
import { Sequelize } from '../database';
import { CommentRepository } from '../repositories/CommentRepository';
import { ArticleBody, UpdateArticleBody } from '../types/article';

@Controller('/articles')
export default class ArticleController {

  @Get('/:articleId', [JSONWebToken.singleton.verify])
  public async getArticle(req: PrivateRequest, res: Response) : Promise<Response> {
    try {
      const article = await ArticleRepository.singleton.findByPk(Number(req.params.articleId));

      if (!article) {
        throw new Error('Article Not Found');
      }

      return res.status(STATUS.OK).json({
        success: true,
        data: {
          article,
        },
      });
    } catch (error: any) {
      return res.status(STATUS.SERVER_ERROR).json({
        success: false,
        message: error.message || 'Cannot get article',
      });
    }
  }

  @Post('/', [JSONWebToken.singleton.verify])
  @ValidateBody(ArticleBody)
  public async createArticle(req: PrivateRequest, res: Response): Promise<Response> {
    try {
      if (!req.user) throw new Error('Missing user identifier');
      const article = await ArticleRepository.singleton.create({
        ...req.body,
        user_id: req.user.userId,
      });

      return res.status(STATUS.OK).json({
        success: true,
        data: {
          article
        },
      });
    } catch (error: any) {
      return res.status(STATUS.SERVER_ERROR).json({
        success: false,
        message: error.message || 'Cannot create article',
      });
    }
  }

  @Patch('/:articleId', [JSONWebToken.singleton.verify])
  @ValidateBody(UpdateArticleBody)
  public async updateArticle(req: PrivateRequest, res: Response): Promise<Response> {
    try {
      const article = await ArticleRepository.singleton.update(Number(req.params.articleId), req.body);

      if (!article) {
        throw new Error('Article Not Found');
      }

      return res.status(STATUS.OK).json({
        success: true,
        data: {
          article,
        },
      });
    } catch (error: any) {
      return res.status(STATUS.SERVER_ERROR).json({
        success: false,
        message: error.message || 'Cannot update article',
      });
    }
  }

  @Delete('/:articleId', [JSONWebToken.singleton.verify])
  public async deleteArticle(req: PrivateRequest, res: Response): Promise<Response> {
    try {
      const article = await ArticleRepository.singleton.findByPk(Number(req.params.articleId));

      if (!req.user || (article && article.user_id !== Number(req.user.userId))) {
        return res.status(STATUS.FORBIDDEN).json({
          success: false,
          message: 'Cannot delete articles where you are not the owner',
        });
      }

      await Sequelize.singleton().createTransaction(async () => {
        await CommentRepository.singleton.deleteCommentsByArticleId([Number(req.params.articleId)]);

        await ArticleRepository.singleton.delete(Number(req.params.articleId));
      });

      return res.status(STATUS.OK).json({
        success: true,
      });
    } catch (error: any) {
      return res.status(STATUS.SERVER_ERROR).json({
        success: false,
        message: error.message || 'Cannot delete article',
      });
    }
  }

  @Get('/', [JSONWebToken.singleton.verify])
  public async getArticles(req: PrivateRequest, res: Response): Promise<Response> {
    try {
      const articles = await ArticleRepository.singleton.findArticles();

      return res.status(STATUS.OK).json({
        success: true,
        data: {
          articles,
        },
      });
    } catch (error: any) {
      return res.status(STATUS.SERVER_ERROR).json({
        success: false,
        message: error.message || 'Cannot get articles',
      });
    }
  }
}