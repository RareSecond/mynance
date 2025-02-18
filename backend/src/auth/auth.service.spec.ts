import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { UnauthorizedException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: DeepMockProxy<JwtService>;
  let userService: DeepMockProxy<UserService>;

  beforeEach(async () => {
    // Create mocks for JwtService and UserService
    jwtService = mockDeep<JwtService>();
    userService = mockDeep<UserService>();

    // Create testing module
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: jwtService,
        },
        {
          provide: UserService,
          useValue: userService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('generateToken', () => {
    it('should generate a JWT token for a user', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const mockToken = 'jwt.token.here';

      userService.getUserByEmail.mockResolvedValue(mockUser);
      jwtService.sign.mockReturnValue(mockToken);

      const result = await authService.generateToken({
        email: 'test@example.com',
      });

      expect(result).toBe(mockToken);
      expect(userService.getUserByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
      expect(jwtService.sign).toHaveBeenCalledWith({ id: mockUser.id });
    });

    it('should throw NotFoundException when user does not exist', async () => {
      userService.getUserByEmail.mockResolvedValue(null);

      await expect(
        authService.generateToken({ email: 'nonexistent@example.com' }),
      ).rejects.toThrow(NotFoundException);

      expect(userService.getUserByEmail).toHaveBeenCalledWith(
        'nonexistent@example.com',
      );
      expect(jwtService.sign).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when JWT signing fails', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      userService.getUserByEmail.mockResolvedValue(mockUser);
      jwtService.sign.mockImplementation(() => {
        throw new Error('JWT signing failed');
      });

      await expect(
        authService.generateToken({ email: 'test@example.com' }),
      ).rejects.toThrow(UnauthorizedException);

      expect(userService.getUserByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
      expect(jwtService.sign).toHaveBeenCalledWith({ id: mockUser.id });
    });
  });
});
