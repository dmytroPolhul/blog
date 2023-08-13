import { Test, TestingModule } from '@nestjs/testing';
import { BlogPostService } from './blog-post.service';
import { BlogPostRepository } from './repositories/blogPost.repository';
import { mockRepository } from '../../../test/mock/mock.repository';
import { BlogService } from '../blog/blog.service';
import { User } from '../user/entities/user.entity';
import { Role } from '../../common/enums/userRole.enum';
import { ForbiddenError } from '@nestjs/apollo';
import { Ordering } from '../../common/enums/ordering.enum';

describe('BlogPostService', () => {
  let service: BlogPostService;

  const mockBlogService = {
    getBlog: jest.fn(),
  };

  const blog = {
    id: 'dbfa8838-4317-4410-a854-84bd00281177',
    title: 'New blog',
    description: 'blog about testing',
    author: {
      id: '593c7b92-1880-4932-b1eb-201e69beb36f',
    },
  };

  const author = {
    id: '593c7b92-1880-4932-b1eb-201e69beb36f',
    firstName: 'Test',
    lastName: 'Besicovitch',
    email: 'writer@example.com',
    role: Role.WRITER,
  };

  const authorD = {
    id: '64e96ed6-6479-48ba-b8d0-485ee66d07d0',
    firstName: 'Test',
    lastName: 'Besicovitch',
    email: 'writer@example.com',
    role: Role.WRITER,
  };

  const moderator = {
    id: '96541f85-33fe-4622-b172-9ed0eb318b18',
    firstName: 'Admin',
    lastName: 'Besicovitch',
    email: 'admin@example.com',
    status: true,
    role: Role.MODERATOR,
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

  it('should create new blog post', async () => {
    const request = {
      title: 'New blog post',
      mainText: 'blog post about testing',
      isPublish: true,
      tags: ['testing', 'jest'],
      blogId: blog.id,
    };
    const post = {
      ...request,
      id: 'dbfa8838-4317-4410-a854-84bd00281177',
    };

    mockBlogService.getBlog.mockResolvedValueOnce(blog);
    mockRepository.create.mockResolvedValueOnce(post);

    const result = await service.createPost(request);

    expect(mockBlogService.getBlog).toHaveBeenCalledWith(blog.id);
    expect(result).toEqual(post);
  });

  it('should return main blog', async () => {
    mockBlogService.getBlog.mockResolvedValueOnce(blog);

    const result = await service.getMainBlog(blog.id);

    expect(mockBlogService.getBlog).toHaveBeenCalledWith(blog.id);
    expect(result).toEqual(blog);
  });

  it('should delete blog post by Moderator', async () => {
    const existBlogPost = {
      id: 'dbfa8838-4317-4410-a854-84bd00281177',
      title: 'New blog post',
      mainText: 'blog post about testing',
      isPublish: true,
      tags: ['testing', 'jest'],
      blog: {
        id: '68678369-5aaa-4ddd-82f1-624c6dc10066',
        title: 'New blog',
        description: 'blog about testing',
        author: {
          id: author.id,
        },
      },
    };

    mockRepository.findOneOrFail.mockResolvedValueOnce(existBlogPost);
    mockRepository.hardDelete.mockResolvedValueOnce(1);

    const result = await service.deletePost(
      moderator as User,
      existBlogPost.id,
    );

    expect(mockRepository.findOneOrFail).toHaveBeenCalledWith({
      where: { id: existBlogPost.id },
      relations: ['blog'],
    });
    expect(result).toBe(true);
  });

  it('should delete blog post by author', async () => {
    const existBlogPost = {
      id: 'dbfa8838-4317-4410-a854-84bd00281177',
      title: 'New blog post',
      mainText: 'blog post about testing',
      isPublish: true,
      tags: ['testing', 'jest'],
      blog: {
        id: '68678369-5aaa-4ddd-82f1-624c6dc10066',
        title: 'New blog',
        description: 'blog about testing',
        author: {
          id: author.id,
        },
      },
    };

    mockRepository.findOneOrFail.mockResolvedValueOnce(existBlogPost);
    mockRepository.hardDelete.mockResolvedValueOnce(1);

    const result = await service.deletePost(author as User, existBlogPost.id);

    expect(mockRepository.findOneOrFail).toHaveBeenCalledWith({
      where: { id: existBlogPost.id },
      relations: ['blog'],
    });
    expect(result).toBe(true);
  });

  it('should return Forbidden error if user not author of the post', async () => {
    const existBlogPost = {
      id: 'dbfa8838-4317-4410-a854-84bd00281177',
      title: 'New blog post',
      mainText: 'blog post about testing',
      isPublish: true,
      tags: ['testing', 'jest'],
      blog: {
        id: '68678369-5aaa-4ddd-82f1-624c6dc10066',
        title: 'New blog',
        description: 'blog about testing',
        author: {
          id: author.id,
        },
      },
    };

    mockRepository.findOneOrFail.mockResolvedValueOnce(existBlogPost);
    mockRepository.findOneOrFail.mockResolvedValueOnce(existBlogPost);

    await expect(
      service.deletePost(authorD as User, existBlogPost.id),
    ).rejects.toThrow(ForbiddenError);

    await expect(
      service.deletePost(authorD as User, existBlogPost.id),
    ).rejects.toThrow('You can only delete your own blog posts.');
  });

  it('should return blog post by id', async () => {
    const existBlogPost = {
      id: 'dbfa8838-4317-4410-a854-84bd00281177',
      title: 'New blog post',
      mainText: 'blog post about testing',
      isPublish: true,
      tags: ['testing', 'jest'],
      blog: {
        id: '68678369-5aaa-4ddd-82f1-624c6dc10066',
        title: 'New blog',
        description: 'blog about testing',
        author: {
          id: author.id,
        },
      },
    };

    mockRepository.findOneOrFail.mockResolvedValueOnce(existBlogPost);

    const result = await service.getPost(existBlogPost.id);

    expect(mockRepository.findOneOrFail).toHaveBeenCalledWith({
      where: { id: existBlogPost.id },
      relations: ['blog'],
    });
    expect(result).toBe(existBlogPost);
  });

  it('should update blog post by blog post author', async () => {
    const existBlogPost = {
      id: 'dbfa8838-4317-4410-a854-84bd00281177',
      title: 'New blog post',
      mainText: 'blog post about testing',
      isPublish: true,
      tags: ['testing', 'jest'],
      blog: {
        id: '68678369-5aaa-4ddd-82f1-624c6dc10066',
        title: 'New blog',
        description: 'blog about testing',
        author: {
          id: author.id,
        },
      },
    };

    const request = {
      id: 'dbfa8838-4317-4410-a854-84bd00281177',
      title: 'Updated blog post',
      description: 'blog about testing 2',
      tags: ['jest', 'mocha'],
    };

    const planned = {
      ...existBlogPost,
      ...request,
    };

    mockRepository.findOne.mockResolvedValueOnce(existBlogPost);
    mockRepository.update.mockResolvedValueOnce({
      ...existBlogPost,
      ...request,
    });
    mockRepository.findOneOrFail.mockResolvedValueOnce(planned);

    const result = await service.updatePost(author as User, request);

    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: { id: request.id },
      relations: ['blog'],
    });
    expect(result).toEqual(planned);
  });

  it('should update blog post by moderator', async () => {
    const existBlogPost = {
      id: 'dbfa8838-4317-4410-a854-84bd00281177',
      title: 'New blog post',
      mainText: 'blog post about testing',
      isPublish: true,
      tags: ['testing', 'jest'],
      blog: {
        id: '68678369-5aaa-4ddd-82f1-624c6dc10066',
        title: 'New blog',
        description: 'blog about testing',
        author: {
          id: author.id,
        },
      },
    };

    const request = {
      id: 'dbfa8838-4317-4410-a854-84bd00281177',
      title: 'Updated blog post',
      description: 'blog about testing 2',
      tags: ['jest', 'mocha'],
    };

    const planned = {
      ...existBlogPost,
      ...request,
    };

    mockRepository.findOne.mockResolvedValueOnce(existBlogPost);
    mockRepository.update.mockResolvedValueOnce({
      ...existBlogPost,
      ...request,
    });
    mockRepository.findOneOrFail.mockResolvedValueOnce(planned);

    const result = await service.updatePost(moderator as User, request);

    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: { id: request.id },
      relations: ['blog'],
    });
    expect(result).toEqual(planned);
  });

  it('should return Forbidden error if user is not an author', async () => {
    const existBlogPost = {
      id: 'dbfa8838-4317-4410-a854-84bd00281177',
      title: 'New blog post',
      mainText: 'blog post about testing',
      isPublish: true,
      tags: ['testing', 'jest'],
      blog: {
        id: '68678369-5aaa-4ddd-82f1-624c6dc10066',
        title: 'New blog',
        description: 'blog about testing',
        author: {
          id: author.id,
        },
      },
    };

    const request = {
      id: 'dbfa8838-4317-4410-a854-84bd00281177',
      title: 'Updated blog post',
      description: 'blog about testing 2',
      tags: ['jest', 'mocha'],
    };

    mockRepository.findOne.mockResolvedValueOnce(existBlogPost);
    mockRepository.findOne.mockResolvedValueOnce(existBlogPost);

    await expect(service.updatePost(authorD as User, request)).rejects.toThrow(
      ForbiddenError,
    );

    await expect(service.updatePost(authorD as User, request)).rejects.toThrow(
      'You can only update your own blog posts.',
    );
  });

  it('should return blog posts with filtration', async () => {
    const existBlogPosts = [
      {
        id: 'dbfa8838-4317-4410-a854-84bd00281177',
        title: 'New blog post',
        mainText: 'blog post about testing',
        isPublish: true,
        tags: ['testing', 'jest'],
        blog: {
          id: '68678369-5aaa-4ddd-82f1-624c6dc10066',
          title: 'New blog',
          description: 'blog about testing',
          author: {
            id: author.id,
          },
        },
      },
      {
        id: '251fb716-1fdf-4fd5-b827-8467314a519f',
        title: 'New post 2',
        mainText: 'blog post about testing 2',
        isPublish: true,
        tags: ['mocha'],
        blog: {
          id: '98372f8a-9d4b-448c-8c58-2a7a7bfb6ed8',
          title: 'New blog 2',
          description: 'blog about testing 2',
          author: {
            id: author.id,
          },
        },
      },
    ];

    const request = {
      pagination: {
        offset: 0,
        limit: 5,
      },
      sorting: {
        field: 'title',
        order: Ordering.ASC,
      },
      filter: {
        isPublish: true,
      },
    };

    mockRepository.findAndCount.mockResolvedValueOnce([
      existBlogPosts,
      existBlogPosts.length,
    ]);

    const result = await service.getPosts(request);

    expect(result).toEqual({
      results: existBlogPosts,
      options: { ...request },
      total: existBlogPosts.length,
    });
  });

  it('should return blog posts with filtration v2', async () => {
    const existBlogPosts = [
      {
        id: 'dbfa8838-4317-4410-a854-84bd00281177',
        title: 'New blog post',
        mainText: 'blog post about testing',
        isPublish: true,
        tags: ['testing', 'jest'],
        blog: {
          id: '68678369-5aaa-4ddd-82f1-624c6dc10066',
          title: 'New blog',
          description: 'blog about testing',
          author: {
            id: author.id,
          },
        },
      },
      {
        id: '251fb716-1fdf-4fd5-b827-8467314a519f',
        title: 'New post 2',
        mainText: 'blog post about testing 2',
        isPublish: true,
        tags: ['mocha'],
        blog: {
          id: '98372f8a-9d4b-448c-8c58-2a7a7bfb6ed8',
          title: 'New blog 2',
          description: 'blog about testing 2',
          author: {
            id: author.id,
          },
        },
      },
    ];

    const request = {
      pagination: {
        offset: 0,
        limit: 5,
      },
      sorting: {
        field: 'title',
        order: Ordering.ASC,
      },
      filter: {
        tag: 'jest',
        title: 'blog',
      },
    };

    mockRepository.findAndCount.mockResolvedValueOnce([existBlogPosts[0], 1]);

    const result = await service.getPosts(request);

    expect(result).toEqual({
      results: existBlogPosts[0],
      options: { ...request },
      total: 1,
    });
  });

  it('should return blog posts with filtration v3', async () => {
    const existBlogPosts = [
      {
        id: 'dbfa8838-4317-4410-a854-84bd00281177',
        title: 'New blog post',
        mainText: 'blog post about testing',
        isPublish: true,
        tags: ['testing', 'jest'],
        blog: {
          id: '68678369-5aaa-4ddd-82f1-624c6dc10066',
          title: 'New blog',
          description: 'blog about testing',
          author: {
            id: author.id,
          },
        },
      },
      {
        id: '251fb716-1fdf-4fd5-b827-8467314a519f',
        title: 'New post 2',
        mainText: 'blog post about testing 2',
        isPublish: true,
        tags: ['mocha'],
        blog: {
          id: '98372f8a-9d4b-448c-8c58-2a7a7bfb6ed8',
          title: 'New blog 2',
          description: 'blog about testing 2',
          author: {
            id: author.id,
          },
        },
      },
    ];

    const request = {
      pagination: {
        offset: 0,
        limit: 5,
      },
      sorting: {
        field: 'title',
        order: Ordering.ASC,
      },
      filter: {
        blogPostId: existBlogPosts[1].id,
      },
    };

    mockRepository.findAndCount.mockResolvedValueOnce([existBlogPosts[1], 1]);

    const result = await service.getPosts(request);

    expect(result).toEqual({
      results: existBlogPosts[1],
      options: { ...request },
      total: 1,
    });
  });
});
