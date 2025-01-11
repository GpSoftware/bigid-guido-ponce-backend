import BaseRepository from '../libs/repository';
import { Article, Comment, User } from '../database/models';
import { fn, col } from '@sequelize/core';

export class ArticleRepository extends BaseRepository<Article> {
  public static singleton = new ArticleRepository();
  
  constructor() {
    super(Article);
  }

  public async findArticles() {
    return this.findAll({
      attributes: {
        include: [
          [col('User.email'), 'author'],
          [fn('COUNT', col('comments.id')), 'amount_of_comments'],
        ]
      },
      include: [
        {
          model: Comment,
          attributes: [],
          required: false,
        },
        {
          model: User,
          attributes: [],
          association: 'user'
        }
      ],
      group: ['Article.id']
    });
  }

  public async deleteArticlesByUserId(user_id: number) {
    return Article.destroy({
      where: {
        user_id: user_id
      }
    });
  }

  public async findArticlesIdsByUserId(user_id: number) {
    return this.findAll({
      attributes: ['id'],
      where: {
        user_id: user_id
      }
    })
  }
}