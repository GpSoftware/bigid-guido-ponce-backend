import BaseRepository from '../libs/repository';
import { Article, Comment, Organization, User } from '../database/models';
import { fn, col } from '@sequelize/core';

export class UserRepository extends BaseRepository<User> {
  public static singleton = new UserRepository();
  
  constructor() {
    super(User);
  }

  public async findUsers(): Promise<User[]> {
    return await this.findAll({
      attributes: {
        exclude: ['password'],
        include: [
          [col('Organization.name'), 'organization_name'],
          [fn('COUNT', col('articles.id')), 'amount_of_articles'],
          [fn('COUNT', col('comments.id')), 'amount_of_comments'],
        ],
      },
      include: [
        {
          model: Organization,
          attributes: [],
        },
        {
          model: Article,
          attributes: [],
          required: false,
        },
        {
          model: Comment,
          attributes: [],
          required: false,
        },
      ],
      group: ['User.id', 'Organization.id'],
    });
  }

  public async findUserById(id: number): Promise<User | null> {
    return this.findByPk(id, {
      attributes: {
        exclude: ['password']
      }
    })
  }
}