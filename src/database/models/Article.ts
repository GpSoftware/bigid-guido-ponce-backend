import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
} from '@sequelize/core';
import { Attribute, PrimaryKey, AutoIncrement, NotNull, Table, BelongsTo, Index, HasMany } from '@sequelize/core/decorators-legacy';
import { User } from './User';
import { Comment } from './Comment';

@Table({
  tableName: 'articles',
  underscored: true,
})
export class Article extends Model<InferAttributes<Article>, InferCreationAttributes<Article>> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare title: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare content: string;

  @Attribute(DataTypes.INTEGER)
  @NotNull
  @Index({ name: 'userIndex' })
  declare user_id: number;

  @BelongsTo(() => User, 'user_id')
  declare author?: NonAttribute<User>;

  @HasMany(() => Comment, 'article_id')
  declare comments?: NonAttribute<Comment>;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}