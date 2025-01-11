import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
} from '@sequelize/core';
import { Attribute, PrimaryKey, AutoIncrement, NotNull, Table, BelongsTo, Index } from '@sequelize/core/decorators-legacy';
import { User } from './User';
import { Article } from './Article';

@Table({
  tableName: 'comments',
  underscored: true,
})
export class Comment extends Model<InferAttributes<Comment>, InferCreationAttributes<Comment>> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare comment: string;

  @Attribute(DataTypes.INTEGER)
  @NotNull
  @Index({ name: 'userIndex' })
  declare user_id: number;

  @Attribute(DataTypes.INTEGER)
  @NotNull
  @Index({ name: 'articleIndex' })
  declare article_id: number;

  @BelongsTo(() => User, 'user_id')
  declare author?: NonAttribute<User>;

  @BelongsTo(() => Article, 'article_id')
  declare article?: NonAttribute<Article>;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}