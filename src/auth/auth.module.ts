import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DrizzleModule } from 'src/drizzle/drizzle.module';

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    DrizzleModule
  ],
  controllers: [AuthController],
  providers: [AuthService, DrizzleModule],
})
export class AuthModule {}
