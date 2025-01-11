import { IsEmail, IsNumber, IsString, MinLength } from 'class-validator';

export class SignIn {
  
  @IsEmail()
  declare email: string;

  @MinLength(6)
  @IsString()
  declare password: string;
};

export class SignUp {

  @IsEmail()
  declare email: string;

  @IsString()
  declare username: string;

  @MinLength(6)
  @IsString()
  declare password: string;

  @IsNumber()
  declare organizationId: number;
}