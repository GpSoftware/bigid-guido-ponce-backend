import BaseRepository from '../libs/repository';
import { Article, Comment, User } from '../database/models';
import { fn, col, Op } from '@sequelize/core';

export class CommentRepository extends BaseRepository<Comment> {
  public static singleton = new CommentRepository();
  
  constructor() {
    super(Comment);
  }

  public async findComments() {
    return this.findAll({
      attributes: {
        include: [
          [col('User.username'), 'author'],
          [col('Article.title'), 'article_title'],
        ]
      },
      include: [
        {
          model: Article,
          attributes: [],
          required: false,
        },
        {
          model: User,
          attributes: [],
          association: 'user'
        }
      ],
    });
  }

  public async deleteCommentsByUserId(user_id: number) {
    return Comment.destroy({
      where: {
        user_id: user_id
      }
    });
  }

  public async deleteCommentsByArticleId(ids: number[]) {
    return Comment.destroy({
      where: {
        article_id: {
          [Op.in]: ids,
        }
      }
    });
  }
}