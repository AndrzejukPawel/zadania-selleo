import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UserService } from 'src/user/user.service';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [UsersController],
  providers: [UserService, AuthService, PrismaService]
})
export class UsersModule { }
