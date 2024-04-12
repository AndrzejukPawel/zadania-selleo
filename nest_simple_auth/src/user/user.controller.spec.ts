import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserModule } from './user.module';
import { PrismaModule } from '../prisma/prisma.module';
import * as jwt from 'jsonwebtoken';
import { Prisma, User } from '@prisma/client';
import { passwordHash } from '../utils/hashutils';
import { HttpException } from '@nestjs/common';
import { UserController } from './user.controller';

describe('UserController', () => {
  let controller: UserController;
  let userService: Pick<jest.MockedObject<UserService>, 'createUser'>;
  let prismaService: Pick<jest.MockedObject<PrismaService>, 'user'>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{
        provide: PrismaService,
        useValue: {
          user: {
            create: jest.fn(),
          }
        }
      }, UserService]
    }).compile();

    controller = module.get(UserController);
    userService = module.get(UserService);
    prismaService = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('/user/register', () => {

    test('for valid user data create new user', async () => {
      const input = {
        "email": "test4@test.test",
        "password": "TestTest1!",
        "firstName": "test",
        "lastName": "test",
        "phoneNumber": "test",
        "shirtSize": "test",
        "preferredTechnology": "test"
      };
      jest.spyOn(prismaService.user, 'create').mockImplementationOnce(() => ({} as any));
      const createUserSpy = jest.spyOn(userService, 'createUser');
      await controller.register(input);

      expect(createUserSpy).toHaveBeenCalledWith(input);
    });

    test('throw error if email is invalid', async () => {
      const input = {
        "email": "test4test.test",
        "password": "TestTest1!",
        "firstName": "test",
        "lastName": "test",
        "phoneNumber": "test",
        "shirtSize": "test",
        "preferredTechnology": "test"
      };
      jest.spyOn(prismaService.user, 'create').mockImplementationOnce(() => ({} as any));
      const createUserSpy = jest.spyOn(userService, 'createUser');
      await expect(controller.register(input)).rejects.toThrow(new HttpException("Invalid email address!", 422))
      expect(createUserSpy).toHaveBeenCalledWith(input);
    });

    test('throw error if password is invalid', async () => {
      const input = {
        "email": "test4@test.test",
        "password": "",
        "firstName": "test",
        "lastName": "test",
        "phoneNumber": "test",
        "shirtSize": "test",
        "preferredTechnology": "test"
      };
      jest.spyOn(prismaService.user, 'create').mockImplementationOnce(() => ({} as any));
      const createUserSpy = jest.spyOn(userService, 'createUser');
      await expect(controller.register(input)).rejects.toThrow(new HttpException("Invalid password, must contain minimum eight characters, at least one letter, one number and one special character", 422))
      expect(createUserSpy).toHaveBeenCalledWith(input);
    });
  });
});
