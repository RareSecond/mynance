import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { CurrentUserService } from './current-user.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: DeepMockProxy<AuthService>;
  let userService: DeepMockProxy<UserService>;
  let currentUserService: DeepMockProxy<CurrentUserService>;

  beforeEach(async () => {
    authService = mockDeep<AuthService>();
    userService = mockDeep<UserService>();
    currentUserService = mockDeep<CurrentUserService>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: UserService, useValue: userService },
        { provide: CurrentUserService, useValue: currentUserService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('googleAuthRedirect', () => {
    it('should create a new user if user does not exist', async () => {
      const mockEmail = 'test@example.com';
      const mockToken = 'mock-jwt-token';
      const mockReq = {
        user: { email: mockEmail },
        res: {
          cookie: jest.fn(),
          redirect: jest.fn(),
        },
        query: { state: '/dashboard' },
      };

      userService.getUserByEmail.mockResolvedValue(null);
      authService.generateToken.mockResolvedValue(mockToken);

      await controller.googleAuthRedirect(mockReq as any);

      expect(userService.getUserByEmail).toHaveBeenCalledWith(mockEmail);
      expect(userService.createUser).toHaveBeenCalledWith(mockEmail);
      expect(authService.generateToken).toHaveBeenCalledWith({
        email: mockEmail,
      });
      expect(mockReq.res.cookie).toHaveBeenCalled();
      expect(mockReq.res.redirect).toHaveBeenCalledWith('/dashboard');
    });

    it('should not create a new user if user exists', async () => {
      const mockEmail = 'test@example.com';
      const mockToken = 'mock-jwt-token';
      const mockUser = {
        id: '1',
        email: mockEmail,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const mockReq = {
        user: { email: mockEmail },
        res: {
          cookie: jest.fn(),
          redirect: jest.fn(),
        },
        query: { state: '/dashboard' },
      };

      userService.getUserByEmail.mockResolvedValue(mockUser);
      authService.generateToken.mockResolvedValue(mockToken);

      await controller.googleAuthRedirect(mockReq as any);

      expect(userService.getUserByEmail).toHaveBeenCalledWith(mockEmail);
      expect(userService.createUser).not.toHaveBeenCalled();
      expect(authService.generateToken).toHaveBeenCalledWith({
        email: mockEmail,
      });
      expect(mockReq.res.cookie).toHaveBeenCalled();
      expect(mockReq.res.redirect).toHaveBeenCalledWith('/dashboard');
    });

    it('should use default redirect path if state is not provided', async () => {
      const mockEmail = 'test@example.com';
      const mockToken = 'mock-jwt-token';
      const mockUser = {
        id: '1',
        email: mockEmail,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const mockReq = {
        user: { email: mockEmail },
        res: {
          cookie: jest.fn(),
          redirect: jest.fn(),
        },
        query: {},
      };

      userService.getUserByEmail.mockResolvedValue(mockUser);
      authService.generateToken.mockResolvedValue(mockToken);

      await controller.googleAuthRedirect(mockReq as any);

      expect(mockReq.res.redirect).toHaveBeenCalledWith('/');
    });
  });

  describe('logout', () => {
    it('should clear the auth cookie', () => {
      const mockReq = {
        res: {
          clearCookie: jest.fn(),
        },
      };

      const result = controller.logout(mockReq as any);

      expect(mockReq.res.clearCookie).toHaveBeenCalledWith('auth_token', {
        domain: 'localhost',
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
      });
      expect(result).toEqual({ message: 'Logged out' });
    });
  });

  describe('getCurrentUser', () => {
    it('should return the current user', () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      currentUserService.getUser.mockReturnValue(mockUser);

      const result = controller.getCurrentUser();

      expect(result).toBe(mockUser);
      expect(currentUserService.getUser).toHaveBeenCalled();
    });
  });
});
