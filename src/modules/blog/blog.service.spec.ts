import { Test, TestingModule } from '@nestjs/testing';
import { mockRepository } from '../../../test/mock/mock.repository';
import { BlogService } from './blog.service';
import { BlogRepository } from './repositories/blog.repository';
import { UserService } from '../user/user.service';
import { Role } from '../../common/enums/userRole.enum';
import { ForbiddenError } from '@nestjs/apollo';
import { User } from '../user/entities/user.entity';

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
});
