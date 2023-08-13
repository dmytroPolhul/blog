import { Test, TestingModule } from '@nestjs/testing';
import { mockRepository } from '../../../test/mock/mock.repository';
import { UserService } from '../user/user.service';
import { BlogRepository } from './repositories/blog.repository';
import { BlogResolver } from './blog.resolver';
import { BlogService } from './blog.service';
import { Role } from '../../common/enums/userRole.enum';

describe('BlogResolver', () => {
  let resolver: BlogResolver;
  let blogService: BlogService;

  const author = {
    id: '593c7b92-1880-4932-b1eb-201e69beb36f',
    firstName: 'Test',
    lastName: 'Besicovitch',
    email: 'writer@example.com',
    role: Role.WRITER,
  };

  const mockUserService = {
    getOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlogResolver,
        {
          provide: BlogService,
          useValue: {
            createBlog: jest.fn() as jest.Mock,
            updateBlog: jest.fn() as jest.Mock,
          },
        },
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

    resolver = module.get<BlogResolver>(BlogResolver);
    blogService = module.get<BlogService>(BlogService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should create a blog', async () => {
    const input = {
      title: 'my new post',
      description: 'description',
      authorId: 'a78e0f1d-2cff-4b57-b65c-c29311ecc762',
    };

    const createdBlog = {
      id: '5d5fc259-9727-416c-bf47-03125c5c5e07',
      ...input,
    };

    (blogService.createBlog as jest.Mock).mockResolvedValue(createdBlog);

    const result = await resolver.createBlog(input);
    expect(result).toEqual(createdBlog);
    expect(blogService.createBlog).toHaveBeenCalledWith(input);
  });

  it('should update a blog', async () => {
    const blog = {
      id: '5d5fc259-9727-416c-bf47-03125c5c5e07',
      title: 'my new post',
      description: 'description',
      author: {
        id: author.id,
      },
    };

    const input = {
      id: '5d5fc259-9727-416c-bf47-03125c5c5e07',
      title: 'updated blog title',
    };

    const mockContext = {
      req: {
        user: { ...author },
      },
    };

    const res = {
      ...blog,
      ...input,
    };

    (blogService.updateBlog as jest.Mock).mockResolvedValue(res);

    const result = await resolver.updateBlog(input, mockContext);
    expect(result).toEqual(res);
    expect(blogService.updateBlog).toHaveBeenCalledWith(
      mockContext.req.user,
      input,
    );
  });
});
