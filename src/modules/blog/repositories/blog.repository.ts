import { Injectable } from '@nestjs/common';
import { CrudRepository } from '../../baseModule/base.repository';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from '../entities/blog.entity';

@Injectable()
export class BlogRepository extends CrudRepository<Blog> {
  constructor(
    @InjectRepository(Blog)
    repository: Repository<Blog>,
  ) {
    super(repository);
  }
}
