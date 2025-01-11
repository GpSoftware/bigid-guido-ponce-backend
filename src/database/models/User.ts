import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
} from '@sequelize/core';
import { Attribute, PrimaryKey, AutoIncrement, NotNull, Index, Table, BelongsTo, HasMany } from '@sequelize/core/decorators-legacy';
import { IsEmail } from '@sequelize/validator.js';
import { Organization } from './Organization';
import { Article } from './Article';
import { Comment } from './Comment';

@Table({
  tableName: 'users',
  underscored: true,
})
export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>;

  @Attribute({
    type: DataTypes.STRING,
    unique: true
  })
  @NotNull
  declare username: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  @IsEmail
  @Index({ unique: true, name: 'emailIndex' })
  declare email: string;

  @Attribute(DataTypes.STRING)
  declare password: string;

  @Attribute(DataTypes.INTEGER)
  @NotNull
  @Index({ name: 'organizationIndex' })
  declare organization_id: number;

  @BelongsTo(() => Organization, 'organization_id')
  declare organization?: NonAttribute<Organization>;

  @HasMany(() => Article, 'user_id')
  declare articles?: NonAttribute<Article>;

  @HasMany(() => Comment, 'user_id')
  declare comments?: NonAttribute<Comment>;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}