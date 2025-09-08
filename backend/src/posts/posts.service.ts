// backend/src/posts/posts.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { Post } from './interfaces/post.interface';
import { CreatePostDto } from '../users/dto/create-post.dto';
import { UpdatePostDto } from '../users/dto/update-post.dto';

@Injectable()
export class PostsService {
  private posts: Post[] = [
    {
      userId: 1,
      id: 1,
      title:
        'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
      body: 'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est aut em',
    },
    {
      userId: 1,
      id: 2,
      title: 'qui est esse',
      body: 'est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui itaque one',
    },
    {
      userId: 2,
      id: 3,
      title: 'ea molestias quasi exercitationem repellat qui ipsa sit aut',
      body: 'et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut ad\nvoluptatem doloribus vel accusantium quis pariatur\nmolestiae porro eius odio et labore et there',
    },
    // Add more sample posts from jsonplaceholder if needed
  ];
  private nextId =
    this.posts.length > 0 ? Math.max(...this.posts.map((p) => p.id)) + 1 : 1;

  findAll(): Post[] {
    return this.posts;
  }

  findByUserId(userId: number): Post[] {
    return this.posts.filter((post) => post.userId === userId);
  }

  findOne(id: number): Post {
    const post = this.posts.find((post) => post.id === id);
    if (!post) {
      throw new NotFoundException(`Post with ID "${id}" not found`);
    }
    return post;
  }

  create(createPostDto: CreatePostDto): Post {
    const newPost: Post = {
      id: this.nextId++,
      ...createPostDto,
    };
    this.posts.push(newPost);
    return newPost;
  }

  update(id: number, updatePostDto: UpdatePostDto): Post {
    const postIndex = this.posts.findIndex((post) => post.id === id);
    if (postIndex === -1) {
      throw new NotFoundException(`Post with ID "${id}" not found`);
    }
    this.posts[postIndex] = { ...this.posts[postIndex], ...updatePostDto };
    return this.posts[postIndex];
  }

  remove(id: number): void {
    const initialLength = this.posts.length;
    this.posts = this.posts.filter((post) => post.id !== id);
    if (this.posts.length === initialLength) {
      throw new NotFoundException(`Post with ID "${id}" not found`);
    }
  }
}
