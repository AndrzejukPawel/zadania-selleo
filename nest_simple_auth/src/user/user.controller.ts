import { Body, Controller, HttpException, Logger, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Put("register")
  async register(@Body() body: Prisma.UserCreateInput) {
    try {
      return await this.userService.createUser(body)
    }
    catch (e) {
      Logger.error(e);
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code == "P2002")
          throw new HttpException(`Email address is already in use!`, 409);
      }
    }
  }
}
