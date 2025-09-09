// backend/src/posts/dto/update-post.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsOptional() @IsNumber()
  userId?: number;

  @IsOptional() @IsString()
  title?: string;

  @IsOptional() @IsString()
  body?: string;
}