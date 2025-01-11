import { Response } from 'express';
import { Controller, Delete, Get, Patch, Post, ValidateBody } from '../utils/decorators';
import { STATUS } from '../utils/status';
import { JSONWebToken } from '../libs/jwt';
import { PrivateRequest } from '../utils/decorators/types';
import { CommentRepository } from '../repositories/CommentRepository';
import { CommentBody, UpdateCommentBody } from '../types/comment';

@Controller('/comments')
export default class CommentController {

  @Get('/:commentId', [JSONWebToken.singleton.verify])
  public async getComment(req: PrivateRequest, res: Response) : Promise<Response> {
    try {
      const comment = await CommentRepository.singleton.findByPk(Number(req.params.commentId));

      if (!comment) {
        throw new Error('Comment Not Found');
      }

      return res.status(STATUS.OK).json({
        success: true,
        data: {
          comment,
        },
      });
    } catch (error: any) {
      return res.status(STATUS.SERVER_ERROR).json({
        success: false,
        message: error.message || 'Cannot get comment',
      });
    }
  }

  @Post('/', [JSONWebToken.singleton.verify])
  @ValidateBody(CommentBody)
  public async createComment(req: PrivateRequest, res: Response): Promise<Response> {
    try {
      if (!req.user) throw new Error('Missing user identifier');
      const comment = await CommentRepository.singleton.create({
        ...req.body,
        user_id: req.user.userId,
      });

      return res.status(STATUS.OK).json({
        success: true,
        data: {
          comment
        },
      });
    } catch (error: any) {
      return res.status(STATUS.SERVER_ERROR).json({
        success: false,
        message: error.message || 'Cannot create comment',
      });
    }
  }

  @Patch('/:commentId', [JSONWebToken.singleton.verify])
  @ValidateBody(UpdateCommentBody)
  public async updateComment(req: PrivateRequest, res: Response): Promise<Response> {
    try {
      const comment = await CommentRepository.singleton.update(Number(req.params.commentId), req.body);

      if (!comment) {
        throw new Error('Comment Not Found');
      }

      return res.status(STATUS.OK).json({
        success: true,
        data: {
          comment,
        },
      });
    } catch (error: any) {
      return res.status(STATUS.SERVER_ERROR).json({
        success: false,
        message: error.message || 'Cannot update comment',
      });
    }
  }

  @Delete('/:commentId', [JSONWebToken.singleton.verify])
  public async deleteComment(req: PrivateRequest, res: Response): Promise<Response> {
    try {
      const comment = await CommentRepository.singleton.findByPk(Number(req.params.commentId));

      if (!req.user || (comment && comment.user_id !== Number(req.user.userId))) {
        return res.status(STATUS.FORBIDDEN).json({
          success: false,
          message: 'Cannot delete comments where you are not the owner',
        });
      }

      await CommentRepository.singleton.delete(Number(req.params.commentId));

      return res.status(STATUS.OK).json({
        success: true,
      });
    } catch (error: any) {
      return res.status(STATUS.SERVER_ERROR).json({
        success: false,
        message: error.message || 'Cannot delete comment',
      });
    }
  }
  
  @Get('/', [JSONWebToken.singleton.verify])
  public async getComments(req: PrivateRequest, res: Response): Promise<Response> {
    try {
      const comments = await CommentRepository.singleton.findComments();

      return res.status(STATUS.OK).json({
        success: true,
        data: {
          comments,
        },
      });
    } catch (error: any) {
      return res.status(STATUS.SERVER_ERROR).json({
        success: false,
        message: error.message || 'Cannot get comments',
      });
    }
  }
}