import 'reflect-metadata';

import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

const validationFactory = <T extends object>(type: new () => T, source: 'body' | 'query') => {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    Reflect.defineMetadata(source, type, target, propertyKey);

    descriptor.value = async function (...args: any[]) {
      const request = args[0];
      const response = args[1];
      const body = plainToClass(type, request[source]);
      const errors = await validate(body);

      if (errors.length > 0) {
        return response.status(400).json({ errors });
      }

      return originalMethod.apply(this, args);
    };
  };
};

export const ValidateQuery = (dto: new () => object) => validationFactory(dto, 'query');
export const ValidateBody = (dto: new () => object) => validationFactory(dto, 'body');
