import { IsString, MinLength } from 'class-validator';

export class ArticleBody {

  @MinLength(6)
  @IsString()
  declare title: string;

  @MinLength(10)
  @IsString()
  declare content: string;
};

export class UpdateArticleBody extends ArticleBody {}
