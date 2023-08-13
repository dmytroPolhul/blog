import { Test, TestingModule } from '@nestjs/testing';
import { BlogPostService } from './blog-post.service';
import { BlogPostRepository } from './repositories/blogPost.repository';
import { mockRepository } from '../../../test/mock/mock.repository';
import { BlogService } from '../blog/blog.service';
import {User} from "../user/entities/user.entity";
import {Role} from "../../common/enums/userRole.enum";
import {ForbiddenError} from "@nestjs/apollo";

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
    }

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
      }
    };

    mockRepository.findOneOrFail.mockResolvedValueOnce(existBlogPost);
    mockRepository.hardDelete.mockResolvedValueOnce(1);

    const result = await service.deletePost(moderator as User, existBlogPost.id);

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
      }
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
      }
    };

    mockRepository.findOneOrFail.mockResolvedValueOnce(existBlogPost);
    mockRepository.findOneOrFail.mockResolvedValueOnce(existBlogPost);

    await expect(service.deletePost(authorD as User, existBlogPost.id)).rejects.toThrow(ForbiddenError);

    await expect(service.deletePost(authorD as User, existBlogPost.id)).rejects.toThrow(
        'You can only delete your own blog posts.',
    );
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
      }
    };

    mockRepository.findOneOrFail.mockResolvedValueOnce(existBlogPost);

    const result = await service.getPost(existBlogPost.id);

    expect(mockRepository.findOneOrFail).toHaveBeenCalledWith({
      where: { id: existBlogPost.id },
      relations: ['blog'],
    });
    expect(result).toBe(existBlogPost);
  });
});
