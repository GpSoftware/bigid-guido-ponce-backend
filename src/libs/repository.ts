import { Model, ModelStatic, FindOptions, CreationAttributes, CreateOptions, InstanceUpdateOptions, FindByPkOptions } from '@sequelize/core';

export interface IBaseRepository<T extends Model> {
  findByPk(id: number): Promise<T | null>;
  findAll(): Promise<Array<T>>;
  findOne(options?: FindOptions): Promise<T | null>;
  create(attributes: CreationAttributes<T>, options?: CreateOptions): Promise<T>;
  update(id: number, attributes: Partial<T>, options?: InstanceUpdateOptions): Promise<T | null>;
  delete(id: number): Promise<void>;
}

export default class BaseRepository<T extends Model> implements IBaseRepository<T> {
  constructor(private model: ModelStatic<T>) {}

  public async findAll(options?: FindOptions): Promise<T[]> {
    return this.model.findAll(options);
  }

  public async findByPk(id: number, options?: FindByPkOptions<T>): Promise<T | null> {
    return this.model.findByPk(id, options);
  }

  public async findOne(options?: FindOptions): Promise<T | null> {
    return this.model.findOne(options);
  }

  public async create(attributes: CreationAttributes<T>, options?: CreateOptions): Promise<T> {
    return this.model.create(attributes, options);
  }

  public async update(id: number, attributes: Partial<T>, options?: InstanceUpdateOptions): Promise<T | null> {
    const instance = await this.findByPk(id);

    if (instance) {
      return instance.update(attributes, options);
    }
    return null;
  }

  public async delete(id: number): Promise<void> {
    const instance = await this.findByPk(id);

    if (instance) {
      await instance.destroy();
    }
  }
}
