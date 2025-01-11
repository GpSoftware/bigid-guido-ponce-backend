import { IsNumber, IsString, MinLength } from 'class-validator';

export class CommentBody {

  @MinLength(6)
  @IsString()
  declare comment: string;

  @IsNumber()
  declare article_id: number;
};

export class UpdateCommentBody {
  @MinLength(6)
  @IsString()
  declare comment: string;
}
