import { IsString, MinLength } from 'class-validator';

export class OrganizationBody {

  @MinLength(3)
  @IsString()
  declare name: string;
};
