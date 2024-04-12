import { Test, TestingModule } from '@nestjs/testing';
import { HttpException } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UserController', () => {
  let controller: UsersController;
  let userService: Pick<jest.MockedObject<UserService>, 'users'>;
  let authService: Pick<jest.MockedObject<AuthService>, 'validateAuthenticationToken'>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [AuthService, UserService, PrismaService]
    }).compile();

    controller = module.get(UsersController);
    userService = module.get(UserService);
    authService = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('/users', () => {

    test('for valid authorization token return users data', async () => {
      const authorization = 'Bearer correctToken';
      jest.spyOn(userService, 'users').mockImplementationOnce(() => ({}));
      jest.spyOn(authService, 'validateAuthenticationToken').mockImplementationOnce(() => ({ ok: true }));
      const usersSpy = jest.spyOn(userService, 'users');
      await controller.getUsers({ authorization });

      expect(usersSpy).toHaveBeenCalled();
    });

    test('throw error if token is missing', async () => {
      await expect(controller.getUsers({})).rejects.toThrow(new HttpException("Missing authorization token", 401));
    });

    test('throw error if token is invalid', async () => {
      const authorization = 'Bearer incorrectToken';
      await expect(controller.getUsers({ authorization })).rejects.toThrow(HttpException);
    });
  });
});
