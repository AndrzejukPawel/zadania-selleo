import { Body, Controller, HttpException, Logger, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { Prisma } from '@prisma/client';

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post("register")
  async register(@Body() body: Prisma.UserCreateInput) {
    return this.userService.createUser(body)
  }
}
