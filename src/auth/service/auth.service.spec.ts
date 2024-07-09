import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserRepository } from '../user.repository';
import { AuthCredentialsDto } from '../dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

const mockAuthCredentialsDto: AuthCredentialsDto = {
  username: 'mockUsertest',
  password: '123',
};

describe('UsersService', () => {
  let service: AuthService;

  const mockUserRepository = {
    findOneBy: jest.fn(async ({ username }) => {
      if (username === mockAuthCredentialsDto.username) {
        const salt = await bcrypt.genSalt();

        const hashedPassword = await bcrypt.hash(
          mockAuthCredentialsDto.password,
          salt,
        );

        return { password: hashedPassword };
      }
    }),
  };

  const mockJwtService = {
    sign: jest.fn(() => '123'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserRepository, useValue: mockUserRepository },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('SignIn', () => {
    it('should signin user', async () => {
      expect(await service.signIn(mockAuthCredentialsDto)).toEqual({
        accessToken: '123',
      });
    });

    it('should return UnauthorizedException when incorrect username', async () => {
      try {
        await service.signIn({
          ...mockAuthCredentialsDto,
          username: 'mockUsertest2',
        });
      } catch (error) {
        expect(() => {
          throw error;
        }).toThrow(UnauthorizedException);
      }
    });

    it('should return UnauthorizedException when incorrect password', async () => {
      try {
        await service.signIn({
          ...mockAuthCredentialsDto,
          password: '456',
        });
      } catch (error) {
        expect(() => {
          throw error;
        }).toThrow(UnauthorizedException);
      }
    });
  });
});
