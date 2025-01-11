import BaseRepository from '../libs/repository';
import { Organization, User } from '../database/models';
import { fn, col } from '@sequelize/core';

export class OrganizatyionRepository extends BaseRepository<Organization> {
  public static singleton = new OrganizatyionRepository();
  
  constructor() {
    super(Organization);
  }

  public async findOrganizations(): Promise<Organization[]> {
    return this.findAll({
      attributes: {
        include: [
          [fn('COUNT', col('users.id')), 'amount_of_users'],
        ]
      },
      include: [
        {
          model: User,
          attributes: [],
          required: false,
        },
      ],
      group: ['Organization.id']
    });
  }

  public async findOrganizationNames(): Promise<Organization[]> {
    return this.findAll({
      attributes: ['id', 'name'],
    });
  }
}