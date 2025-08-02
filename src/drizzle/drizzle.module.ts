import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { schema } from "./schema";

// Injection Token
export const DRIZZLE = Symbol('drizzle-connection');

@Module({
  providers: [
    {
      provide: DRIZZLE,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const connectionString = configService.get<string>('DATABASE_URL');
        // Create PostgreSQL connection Pool
        const pool = new Pool({
          connectionString,
        });
        return drizzle(pool, { schema }) as NodePgDatabase<typeof schema>;
      }
    },
  ],
  exports: [DRIZZLE],
})
export class DrizzleModule {}
