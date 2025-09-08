// backend/src/posts/dto/create-post.dto.ts
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePostDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  body: string;
}
