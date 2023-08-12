import { Test, TestingModule } from '@nestjs/testing';
import { BlogPostResolver } from './blog-post.resolver';
import { BlogPostService } from './blog-post.service';
import { BlogPostRepository } from './repositories/blogPost.repository';
import { mockRepository } from '../../../test/mock/mock.repository';
import { BlogService } from '../blog/blog.service';
import { UserService } from '../user/user.service';

describe('BlogPostResolver', () => {
  let resolver: BlogPostResolver;

  const mockBlogService = {
    getOneBlog: jest.fn(),
  };

  const mockUserService = {
    getOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlogPostResolver,
        BlogPostService,
        {
          provide: BlogPostRepository,
          useValue: mockRepository,
        },
        {
          provide: BlogService,
          useValue: mockBlogService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    resolver = module.get<BlogPostResolver>(BlogPostResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
