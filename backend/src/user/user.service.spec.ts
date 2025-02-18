import { Test } from '@nestjs/testing';
import { DatabaseService } from '@/database/database.service';
import { UserService } from './user.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';

describe('UserService', () => {
  let userService: UserService;
  let db: DeepMockProxy<DatabaseService>;

  beforeEach(async () => {
    // Create a mock for DatabaseService
    db = mockDeep<DatabaseService>();

    // Create testing module
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: DatabaseService,
          useValue: db,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  describe('getUserByEmail', () => {
    it('should find a user by email', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      db.user.findUnique.mockResolvedValue(mockUser);

      const result = await userService.getUserByEmail('test@example.com');

      expect(result).toEqual(mockUser);
      expect(db.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });
  });

  describe('getUserById', () => {
    it('should find a user by id', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      db.user.findUnique.mockResolvedValue(mockUser);

      const result = await userService.getUserById('1');

      expect(result).toEqual(mockUser);
      expect(db.user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      db.user.create.mockResolvedValue(mockUser);

      const result = await userService.createUser('test@example.com');

      expect(result).toEqual(mockUser);
      expect(db.user.create).toHaveBeenCalledWith({
        data: { email: 'test@example.com' },
      });
    });
  });
});
