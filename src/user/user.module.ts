import { Module } from '@nestjs/common';
import { UserService } from './user.service.js';
import { UserResolver } from './user.resolver.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { CommonModule } from '../common/common.module.js';

@Module({
  imports: [PrismaModule, CommonModule],
  providers: [UserResolver, UserService],
  exports: [UserService]
})
export class UserModule {}
