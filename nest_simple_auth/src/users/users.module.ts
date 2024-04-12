import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [UsersController],
  providers: [UserService, AuthService, PrismaService]
})
export class UsersModule { }
