import { Sequelize as Seq } from '@sequelize/core';
import { MySqlDialect } from '@sequelize/mysql';
import { Article, Organization, User, Comment } from './models';
import { populateDatabase } from './seeders';

export class Sequelize {
  private static _instance: Sequelize;
  private sequelize: Seq<MySqlDialect> | undefined;

  public static singleton(): Sequelize {
    if (!Sequelize._instance) {
      Sequelize._instance = new Sequelize();
    }

    return Sequelize._instance;
  }

  private constructor() {}

  public async initializeDatabase() {
    this.sequelize = new Seq({
      dialect: MySqlDialect,
      database: process.env.DATABASE,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      host: 'localhost',
      port: 3306,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      models: [User, Organization, Article, Comment]
    });

    await this.sequelize.sync({ force: true });
    
    await populateDatabase();
  }

  public async createTransaction<T>(callback: () => T) {
    if (!this.sequelize) {
      throw new Error('Sequelize was not initialized');
    }

    return this.sequelize.transaction(callback);
  }
}