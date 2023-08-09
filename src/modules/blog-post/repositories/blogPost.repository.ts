import { Injectable } from '@nestjs/common';
import { CrudRepository } from '../../baseModule/base.repository';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogPost } from '../entities/blog-post.entity';

@Injectable()
export class BlogPostRepository extends CrudRepository<BlogPost> {
  constructor(
    @InjectRepository(BlogPost)
    repository: Repository<BlogPost>,
  ) {
    super(repository);
  }
}
