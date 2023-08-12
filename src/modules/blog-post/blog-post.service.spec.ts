import { Test, TestingModule } from '@nestjs/testing';
import { BlogPostService } from './blog-post.service';
import { BlogPostRepository } from './repositories/blogPost.repository';
import { mockRepository } from '../../../test/mock/mock.repository';
import { BlogService } from '../blog/blog.service';

describe('BlogPostService', () => {
  let service: BlogPostService;

  const mockBlogService = {
    getOneBlog: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlogPostService,
        {
          provide: BlogPostRepository,
          useValue: mockRepository,
        },
        {
          provide: BlogService,
          useValue: mockBlogService,
        },
      ],
    }).compile();

    service = module.get<BlogPostService>(BlogPostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
