import { Module } from '@nestjs/common';
import { CommonService } from './common.service.js';
import { CommonResolver } from './common.resolver.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule, JwtModule],
  providers: [CommonResolver, CommonService],
  exports: [CommonService]
})
export class CommonModule {}
