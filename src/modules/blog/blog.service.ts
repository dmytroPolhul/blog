import { Injectable } from '@nestjs/common';
import { BaseService } from '../baseModule/base.service';
import { Blog } from './entities/blog.entity';
import { BlogRepository } from './repositories/blog.repository';

@Injectable()
export class BlogService extends BaseService<Blog> {
  constructor(private blogRepository: BlogRepository) {
    super(blogRepository);
  }
}
