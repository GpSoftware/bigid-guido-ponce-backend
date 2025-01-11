import { IsEmail, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserBody {

  @IsEmail()
  declare email: string;

  @MinLength(3)
  @IsString()
  declare username: string;

  @MinLength(6)
  @IsString()
  @IsOptional()
  declare password: string;

  @IsNumber()
  declare organization_id: number;
}

export class UpdateUserBody extends CreateUserBody {}
