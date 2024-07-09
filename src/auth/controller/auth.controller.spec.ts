import { Test, TestingModule } from '@nestjs/testing';

import { AuthService } from '../service/auth.service';
import { AuthController } from './auth.controller';
import { AuthCredentialsDto } from '../dto/auth-credentials.dto';

describe('UsersController', () => {
  let authController: AuthController;

  const mockAuthService = {
    signIn: jest.fn(() => ({ accessToken: '123' })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();

    authController = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('SignIn', () => {
    it('should receive access token', () => {
      const authDto: AuthCredentialsDto = { username: 'test', password: '123' };

      expect(authController.signIn(authDto)).toEqual({
        accessToken: '123',
      });
    });
  });
});
