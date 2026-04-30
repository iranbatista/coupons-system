import { Injectable } from '@nestjs/common';
import { PrismaClient } from 'src/generated/prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { EnvService } from 'src/env/env.service';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(private readonly env: EnvService) {
    const adapter = new PrismaBetterSqlite3({
      url: env.get('DATABASE_URL'),
    });
    super({ adapter });
  }
}
