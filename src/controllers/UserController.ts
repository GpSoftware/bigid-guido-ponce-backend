import { Response } from 'express';
import { Controller, Delete, Get, Patch, Post, ValidateBody } from '../utils/decorators';
import { STATUS } from '../utils/status';
import { JSONWebToken } from '../libs/jwt';
import { PrivateRequest } from '../utils/decorators/types';
import { UserRepository } from '../repositories/UserRepository';
import { CreateUserBody, UpdateUserBody } from '../types/user';
import { encrypt } from '../libs/encrypt';
import { ArticleRepository } from '../repositories/ArticleRepository';
import { CommentRepository } from '../repositories/CommentRepository';
import { Sequelize } from '../database';

@Controller('/users')
export default class UserController {

  @Get('/:userId', [JSONWebToken.singleton.verify])
  public async getUser(req: PrivateRequest, res: Response) : Promise<Response> {
    try {
      const user = await UserRepository.singleton.findUserById(Number(req.params.userId));

      if (!user) {
        throw new Error('User Not Found');
      }

      return res.status(STATUS.OK).json({
        success: true,
        data: {
          user,
        },
      });
    } catch (error: any) {
      return res.status(STATUS.SERVER_ERROR).json({
        success: false,
        message: error.message || 'Cannot get user',
      });
    }
  }

  @Post('/', [JSONWebToken.singleton.verify])
  @ValidateBody(CreateUserBody)
  public async createUser(req: PrivateRequest, res: Response): Promise<Response> {
    try {
      const user = await UserRepository.singleton.create({
        ...req.body,
        password: await encrypt(req.body.password, req.body.password),
      });

      return res.status(STATUS.OK).json({
        success: true,
        data: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      });
    } catch (error: any) {
      return res.status(STATUS.SERVER_ERROR).json({
        success: false,
        message: error.message || 'Cannot create user',
      });
    }
  }

  @Patch('/:userId', [JSONWebToken.singleton.verify])
  @ValidateBody(UpdateUserBody)
  public async updateUser(req: PrivateRequest, res: Response): Promise<Response> {
    try {
      if (req.body.password) {
        req.body.password = await encrypt(req.body.password, req.body.password);
      }
      const user = await UserRepository.singleton.update(Number(req.params.userId), req.body);

      if (!user) {
        throw new Error('User Not Found');
      }

      return res.status(STATUS.OK).json({
        success: true,
        data: {
          id: user.id,
          username: user.username,
          email: user.email,
          organization_id: user.organization_id,
        },
      });
    } catch (error: any) {
      return res.status(STATUS.SERVER_ERROR).json({
        success: false,
        message: error.message || 'Cannot create user',
      });
    }
  }

  @Delete('/:userId')
  public async deleteUser(req: PrivateRequest, res: Response): Promise<Response> {
    try {
      await Sequelize.singleton().createTransaction(async () => {
        const userArticles = await ArticleRepository.singleton.findArticlesIdsByUserId(Number(req.params.userId));

        await CommentRepository.singleton.deleteCommentsByUserId(Number(req.params.userId));
        await CommentRepository.singleton.deleteCommentsByArticleId(userArticles.map(arts => arts.id));

        await ArticleRepository.singleton.deleteArticlesByUserId(Number(req.params.userId));
        
        await UserRepository.singleton.delete(Number(req.params.userId));
      });

      return res.status(STATUS.OK).json({
        success: true,
      });
    } catch (error: any) {
      return res.status(STATUS.SERVER_ERROR).json({
        success: false,
        message: error.message || 'Cannot delete user',
      });
    }
  }

  @Get('/', [JSONWebToken.singleton.verify])
  public async getUsers(req: PrivateRequest, res: Response): Promise<Response> {
    try {
      const users = await UserRepository.singleton.findUsers();

      return res.status(STATUS.OK).json({
        success: true,
        data: {
          users,
        },
      });
    } catch (error: any) {
      return res.status(STATUS.SERVER_ERROR).json({
        success: false,
        message: error.message || 'Cannot get users',
      });
    }
  }
}