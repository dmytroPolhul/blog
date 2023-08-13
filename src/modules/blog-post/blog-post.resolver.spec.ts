import { Test, TestingModule } from '@nestjs/testing';
import { BlogPostResolver } from './blog-post.resolver';
import { BlogPostService } from './blog-post.service';
import { BlogPostRepository } from './repositories/blogPost.repository';
import { mockRepository } from '../../../test/mock/mock.repository';
import { BlogService } from '../blog/blog.service';
import { UserService } from '../user/user.service';
import { Role } from '../../common/enums/userRole.enum';

describe('BlogPostResolver', () => {
  let resolver: BlogPostResolver;
  let blogPostService: BlogPostService;

  const author = {
    id: '593c7b92-1880-4932-b1eb-201e69beb36f',
    firstName: 'Test',
    lastName: 'Besicovitch',
    email: 'writer@example.com',
    role: Role.WRITER,
  };

  const mockBlogService = {
    getBlog: jest.fn(),
  };

  const mockUserService = {
    getOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlogPostResolver,
        {
          provide: BlogPostService,
          useValue: {
            createPost: jest.fn() as jest.Mock,
            updatePost: jest.fn() as jest.Mock,
            deletePost: jest.fn() as jest.Mock,
            findOne: jest.fn() as jest.Mock,
            getPost: jest.fn() as jest.Mock,
          },
        },
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
    blogPostService = module.get<BlogPostService>(BlogPostService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should create a blog post', async () => {
    const input = {
      title: 'my new post',
      mainText: 'description',
      isPublish: true,
      blogId: 'a78e0f1d-2cff-4b57-b65c-c29311ecc762',
    };

    const createdPost = {
      id: '5d5fc259-9727-416c-bf47-03125c5c5e07',
      ...input,
    };

    (blogPostService.createPost as jest.Mock).mockResolvedValue(createdPost);

    const result = await resolver.createBlogPost(input);
    expect(result).toEqual(createdPost);
    expect(blogPostService.createPost).toHaveBeenCalledWith(input);
  });

  it('should update a blog post', async () => {
    const post = {
      id: '5d5fc259-9727-416c-bf47-03125c5c5e07',
      title: 'my new post',
      mainText: 'description',
      isPublish: true,
      blogId: 'a78e0f1d-2cff-4b57-b65c-c29311ecc762',
    };

    const input = {
      id: '5d5fc259-9727-416c-bf47-03125c5c5e07',
      title: 'updated post title',
      tags: ['test'],
    };

    const mockContext = {
      req: {
        user: { ...author },
      },
    };

    const res = {
      ...post,
      ...input,
    };

    (blogPostService.updatePost as jest.Mock).mockResolvedValue(res);

    const result = await resolver.updateBlogPost(input, mockContext);
    expect(result).toEqual(res);
    expect(blogPostService.updatePost).toHaveBeenCalledWith(
      mockContext.req.user,
      input,
    );
  });

  it('should delete a blog post', async () => {
    const post = {
      id: '5d5fc259-9727-416c-bf47-03125c5c5e07',
      title: 'my new post',
      mainText: 'description',
      isPublish: true,
      blogId: 'a78e0f1d-2cff-4b57-b65c-c29311ecc762',
    };

    const mockContext = {
      req: {
        user: { ...author },
      },
    };

    (blogPostService.deletePost as jest.Mock).mockResolvedValue(true);

    const result = await resolver.removeBlogPost(post.id, mockContext);
    expect(result).toBe(true);
    expect(blogPostService.deletePost).toHaveBeenCalledWith(
      mockContext.req.user,
      post.id,
    );
  });

  it('should return a blog post by id', async () => {
    const post = {
      id: '5d5fc259-9727-416c-bf47-03125c5c5e07',
      title: 'my new post',
      mainText: 'description',
      isPublish: true,
      blogId: 'a78e0f1d-2cff-4b57-b65c-c29311ecc762',
    };

    (blogPostService.getPost as jest.Mock).mockResolvedValue(post);

    const result = await resolver.findOne(post.id);
    expect(result).toEqual(post);
    expect(blogPostService.getPost).toHaveBeenCalledWith(post.id);
  });
});
