import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserModule } from '../user/user.module';
import { PrismaModule } from '../prisma/prisma.module';
import * as jwt from 'jsonwebtoken';
import { Prisma, User } from '@prisma/client';
import { passwordHash } from '../utils/hashutils';
import { HttpException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let userService: Pick<jest.MockedObject<UserService>, 'user'>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UserModule, PrismaModule],
      controllers: [AuthController],
      providers: [AuthService, PrismaService, UserService]
    }).compile();

    controller = module.get<AuthController>(AuthController);
    userService = module.get(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('/auth/signIn', () => {
    const userCredentials = { email: 'dummy', password: 'dummy' };

    test('for valid credentials returns valid token with email, iat, exp', async () => {
      jest.spyOn(UserService.prototype, 'user').mockResolvedValue({ id: 1, email: 'test', password: 'test' } as User);
      const signin = await controller.signIn(userCredentials);
      const token = jwt.decode(signin.token);
      expect(token).toHaveProperty('email');
      expect(token).toHaveProperty('iat');
      expect(token).toHaveProperty('exp');
    });

    test('for invalid credentials throws error with code 401', async () => {
      jest.spyOn(UserService.prototype, 'user').mockResolvedValue(null);
      const signin = controller.signIn(userCredentials);
      await expect(signin).rejects.toThrow(new HttpException("Invalid credentials.", 401))
    });
  });
});
