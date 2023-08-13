import { Test, TestingModule } from '@nestjs/testing';
import { mockRepository } from '../../../test/mock/mock.repository';
import { BlogService } from './blog.service';
import { BlogRepository } from './repositories/blog.repository';
import { UserService } from '../user/user.service';
import { Role } from '../../common/enums/userRole.enum';
import { ForbiddenError } from '@nestjs/apollo';
import { User } from '../user/entities/user.entity';
import { BadRequestException } from '@nestjs/common';
import { Ordering } from '../../common/enums/ordering.enum';

describe('BlogService', () => {
  let service: BlogService;

  const mockUserService = {
    getUser: jest.fn(),
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
        BlogService,
        {
          provide: BlogRepository,
          useValue: mockRepository,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    service = module.get<BlogService>(BlogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create new blog', async () => {
    const request = {
      title: 'New blog',
      description: 'blog about testing',
      authorId: author.id,
    };

    mockUserService.getUser.mockResolvedValueOnce(author);
    mockRepository.create.mockResolvedValueOnce(request);

    const result = await service.createBlog(request);

    expect(mockUserService.getUser).toHaveBeenCalledWith(author.id);
    expect(result).toEqual(request);
  });

  it('should return Forbidden error when Moderator try to create blog', async () => {
    const request = {
      title: 'New blog',
      description: 'blog about testing',
      authorId: moderator.id,
    };

    mockUserService.getUser.mockResolvedValueOnce(moderator);
    mockUserService.getUser.mockResolvedValueOnce(moderator);

    await expect(service.createBlog(request)).rejects.toThrow(ForbiddenError);

    await expect(service.createBlog(request)).rejects.toThrow(
      'You are not performing this action',
    );
  });

  it('should update blog by blog author', async () => {
    const existBlog = {
      id: 'dbfa8838-4317-4410-a854-84bd00281177',
      title: 'New blog',
      description: 'blog about testing',
      author: {
        id: '593c7b92-1880-4932-b1eb-201e69beb36f',
      },
    };

    const request = {
      id: 'dbfa8838-4317-4410-a854-84bd00281177',
      title: 'Updated blog',
      description: 'blog about testing 2',
    };

    const planned = {
      id: 'dbfa8838-4317-4410-a854-84bd00281177',
      title: 'Updated blog',
      description: 'blog about testing 2',
      author: {
        id: '593c7b92-1880-4932-b1eb-201e69beb36f',
      },
    };

    mockRepository.findOne.mockResolvedValueOnce(existBlog);
    mockRepository.update.mockResolvedValueOnce({ ...existBlog, ...request });
    mockRepository.findOneOrFail.mockResolvedValueOnce({
      ...existBlog,
      ...request,
    });

    const result = await service.updateBlog(author as User, request);

    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: { id: existBlog.id },
      relations: ['author'],
    });
    expect(result).toEqual(planned);
  });

  it('should update blog by Moderator', async () => {
    const existBlog = {
      id: 'dbfa8838-4317-4410-a854-84bd00281177',
      title: 'New blog',
      description: 'blog about testing',
      author: {
        id: '593c7b92-1880-4932-b1eb-201e69beb36f',
      },
    };

    const request = {
      id: 'dbfa8838-4317-4410-a854-84bd00281177',
      title: 'Updated blog by Moderator',
      description: 'blog about testing 3',
    };

    const planned = {
      id: 'dbfa8838-4317-4410-a854-84bd00281177',
      title: 'Updated blog by Moderator',
      description: 'blog about testing 3',
      author: {
        id: '593c7b92-1880-4932-b1eb-201e69beb36f',
      },
    };

    mockRepository.findOne.mockResolvedValueOnce(existBlog);
    mockRepository.update.mockResolvedValueOnce({ ...existBlog, ...request });
    mockRepository.findOneOrFail.mockResolvedValueOnce({
      ...existBlog,
      ...request,
    });

    const result = await service.updateBlog(moderator as User, request);

    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: { id: existBlog.id },
      relations: ['author'],
    });
    expect(result).toEqual(planned);
  });

  it('should return Forbidden error if user is not author', async () => {
    const existBlog = {
      id: 'dbfa8838-4317-4410-a854-84bd00281177',
      title: 'New blog',
      description: 'blog about testing',
      author: {
        id: '593c7b92-1880-4932-b1eb-201e69beb36f',
      },
    };

    const request = {
      id: 'dbfa8838-4317-4410-a854-84bd00281177',
      title: 'Updated blog by Moderator',
      description: 'blog about testing 3',
    };

    mockRepository.findOne.mockResolvedValueOnce(existBlog);
    mockRepository.findOne.mockResolvedValueOnce(existBlog);

    await expect(service.updateBlog(authorD as User, request)).rejects.toThrow(
      ForbiddenError,
    );

    await expect(service.updateBlog(authorD as User, request)).rejects.toThrow(
      'You can only update your own blogs.',
    );
  });

  it('should delete blog by Moderator', async () => {
    const existBlog = {
      id: 'dbfa8838-4317-4410-a854-84bd00281177',
      title: 'New blog',
      description: 'blog about testing',
      author: {
        id: '593c7b92-1880-4932-b1eb-201e69beb36f',
      },
    };

    mockRepository.findOne.mockResolvedValueOnce(existBlog);
    mockRepository.hardDelete.mockResolvedValueOnce(1);

    const result = await service.deleteBlog(moderator as User, existBlog.id);

    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: { id: existBlog.id },
      relations: ['author'],
    });
    expect(result).toBe(true);
  });

  it('should delete blog by owner', async () => {
    const existBlog = {
      id: 'dbfa8838-4317-4410-a854-84bd00281177',
      title: 'New blog',
      description: 'blog about testing',
      author: {
        id: '593c7b92-1880-4932-b1eb-201e69beb36f',
      },
    };

    mockRepository.findOne.mockResolvedValueOnce(existBlog);
    mockRepository.hardDelete.mockResolvedValueOnce(1);

    const result = await service.deleteBlog(author as User, existBlog.id);

    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: { id: existBlog.id },
      relations: ['author'],
    });
    expect(result).toBe(true);
  });

  it('should return Forbidden error if user is not author', async () => {
    const existBlog = {
      id: 'dbfa8838-4317-4410-a854-84bd00281177',
      title: 'New blog',
      description: 'blog about testing',
      author: {
        id: '593c7b92-1880-4932-b1eb-201e69beb36f',
      },
    };

    mockRepository.findOne.mockResolvedValueOnce(existBlog);
    mockRepository.findOne.mockResolvedValueOnce(existBlog);

    await expect(
      service.deleteBlog(authorD as User, existBlog.id),
    ).rejects.toThrow(ForbiddenError);

    await expect(
      service.deleteBlog(authorD as User, existBlog.id),
    ).rejects.toThrow('You can only delete your own blogs.');
  });

  it('should return blog by id', async () => {
    const existBlog = {
      id: 'dbfa8838-4317-4410-a854-84bd00281177',
      title: 'New blog',
      description: 'blog about testing',
      author: {
        id: '593c7b92-1880-4932-b1eb-201e69beb36f',
      },
      posts: [],
    };

    mockRepository.findOneOrFail.mockResolvedValueOnce(existBlog);

    const result = await service.getBlog(existBlog.id);

    expect(mockRepository.findOneOrFail).toHaveBeenCalledWith({
      where: { id: existBlog.id },
      relations: ['author', 'posts'],
    });
    expect(result).toEqual(existBlog);
  });

  it('should return error if blog does not exist', async () => {
    const id = 'dbfa8838-4317-4410-a854-84bd00281167';

    mockRepository.findOneOrFail.mockResolvedValueOnce(
      new BadRequestException(`Entity ${id}. Not Found`),
    );
    mockRepository.findOneOrFail.mockResolvedValueOnce(
      new BadRequestException(`Entity ${id}. Not Found`),
    );

    await expect(service.getBlog(id)).resolves.toThrow(BadRequestException);

    await expect(service.getBlog(id)).resolves.toThrow(
      'Entity dbfa8838-4317-4410-a854-84bd00281167. Not Found',
    );
  });

  it('should return blog author', async () => {
    const existBlog = {
      id: 'dbfa8838-4317-4410-a854-84bd00281177',
      title: 'New blog',
      description: 'blog about testing',
      author: {
        id: '593c7b92-1880-4932-b1eb-201e69beb36f',
      },
      posts: [],
    };

    mockUserService.getUser.mockResolvedValueOnce(author);

    const result = await service.getAuthor(existBlog.author.id);

    expect(result).toEqual(author);
  });

  it('should return blog with related posts', async () => {
    const existBlog = {
      id: 'dbfa8838-4317-4410-a854-84bd00281177',
      title: 'New blog',
      description: 'blog about testing',
      author: {
        id: '593c7b92-1880-4932-b1eb-201e69beb36f',
      },
      posts: [
        {
          id: '128454d1-8b24-40f4-9798-6f6b44e380ba',
          title: 'post 1',
        },
        {
          id: '612f44e8-9cab-457c-ab51-a7368c2dfd35',
          title: 'post 1',
        },
      ],
    };

    mockRepository.find.mockResolvedValueOnce(existBlog);

    const result = await service.findRelatedPosts(existBlog.id);

    expect(mockRepository.find).toHaveBeenCalledWith({
      where: { id: existBlog.id },
      relations: ['posts'],
    });

    expect(result).toEqual(existBlog);
  });

  it('should return blogs with filtration', async () => {
    const existBlogs = [
      {
        id: 'dbfa8838-4317-4410-a854-84bd00281177',
        title: 'New blog',
        description: 'blog about testing',
        author: {
          id: '593c7b92-1880-4932-b1eb-201e69beb36f',
        },
        posts: [
          {
            id: '128454d1-8b24-40f4-9798-6f6b44e380ba',
            title: 'post 1',
          },
          {
            id: '612f44e8-9cab-457c-ab51-a7368c2dfd35',
            title: 'post 2',
          },
        ],
      },
      {
        id: '03ef3458-79a8-4f59-a828-c2620894b91d',
        title: 'New blog 2',
        description: 'blog about testing 2',
        author: {
          id: authorD.id,
        },
        posts: [
          {
            id: '58cb0580-a1d8-4532-ac9f-ba03dc1a5023',
            title: 'post sec 1',
          },
          {
            id: '6c260cd4-01e5-4d41-a7ad-72320b1b2c8f',
            title: 'post sec 2',
          },
        ],
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
        includePosts: true,
      },
    };

    mockRepository.findAndCount.mockResolvedValueOnce([
      existBlogs,
      existBlogs.length,
    ]);

    const result = await service.getBlogs(request);

    expect(result).toEqual({
      results: existBlogs,
      options: { ...request },
      total: existBlogs.length,
    });
  });

  it('should return blogs with filtration v2', async () => {
    const existBlogs = [
      {
        id: 'dbfa8838-4317-4410-a854-84bd00281177',
        title: 'New blog',
        description: 'blog about testing',
        author: {
          id: '593c7b92-1880-4932-b1eb-201e69beb36f',
        },
      },
      {
        id: '03ef3458-79a8-4f59-a828-c2620894b91d',
        title: 'New blog 2',
        description: 'blog about testing 2',
        author: {
          id: authorD.id,
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
        includePosts: false,
        blogId: existBlogs[0].id,
        authorId: '593c7b92-1880-4932-b1eb-201e69beb36f',
      },
    };

    mockRepository.findAndCount.mockResolvedValueOnce([existBlogs[0], 1]);

    const result = await service.getBlogs(request);

    expect(result).toEqual({
      results: existBlogs[0],
      options: { ...request },
      total: 1,
    });
  });
});
