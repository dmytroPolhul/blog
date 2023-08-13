import { Test, TestingModule } from '@nestjs/testing';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { Role } from '../../common/enums/userRole.enum';

describe('UserResolver', () => {
  let resolver: UserResolver;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserResolver,
        {
          provide: UserService,
          useValue: {
            createUser: jest.fn() as jest.Mock,
            updateUser: jest.fn() as jest.Mock,
          },
        },
      ],
    }).compile();

    resolver = module.get<UserResolver>(UserResolver);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should create a user', async () => {
    const userInput = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: '1234',
      status: true,
      role: Role.MODERATOR,
    };

    const createdUser = {
      id: '5d5fc259-9727-416c-bf47-03125c5c5e07',
      ...userInput,
    };

    (userService.createUser as jest.Mock).mockResolvedValue(createdUser);

    const result = await resolver.createUser(userInput);
    expect(result).toEqual(createdUser);
    expect(userService.createUser).toHaveBeenCalledWith(userInput);
  });

  it('should update a user', async () => {
    const existUser = {
      id: '5d5fc259-9727-416c-bf47-03125c5c5e07',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: '1234',
      status: true,
      role: Role.MODERATOR,
    };

    const request = {
      id: '5d5fc259-9727-416c-bf47-03125c5c5e07',
      firstName: 'Test',
    };

    const res = {
      ...existUser,
      ...request,
    };

    (userService.updateUser as jest.Mock).mockResolvedValue(res);

    const result = await resolver.updateUser(request);
    expect(result).toEqual(res);
    expect(userService.updateUser).toHaveBeenCalledWith(request);
  });
});
