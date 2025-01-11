import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
} from '@sequelize/core';
import { Attribute, PrimaryKey, AutoIncrement, NotNull, Table, HasMany } from '@sequelize/core/decorators-legacy';
import { User } from './User';

@Table({
  tableName: 'organizations',
  underscored: true,
})
export class Organization extends Model<InferAttributes<Organization>, InferCreationAttributes<Organization>> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>;

  @Attribute({
    type: DataTypes.STRING,
    unique: true
  })
  @NotNull
  declare name: string;

  @HasMany(() => User, 'organization_id')
  declare users?: NonAttribute<User>;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}