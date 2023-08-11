import { Test, TestingModule } from '@nestjs/testing';
import { BlogPostResolver } from './blog-post.resolver';
import { BlogPostService } from './blog-post.service';

describe('BlogPostResolver', () => {
  let resolver: BlogPostResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlogPostResolver, BlogPostService],
    }).compile();

    resolver = module.get<BlogPostResolver>(BlogPostResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
