import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { EnvModule } from 'src/env/env.module';

@Module({
  imports: [EnvModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
