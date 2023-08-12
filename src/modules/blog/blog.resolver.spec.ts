import { Test, TestingModule } from '@nestjs/testing';
import { mockRepository } from '../../../test/mock/mock.repository';
import { UserService } from '../user/user.service';
import { BlogRepository } from './repositories/blog.repository';
import { BlogResolver } from './blog.resolver';
import { BlogService } from './blog.service';

describe('BlogResolver', () => {
  let resolver: BlogResolver;

  const mockUserService = {
    getOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlogResolver,
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

    resolver = module.get<BlogResolver>(BlogResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
