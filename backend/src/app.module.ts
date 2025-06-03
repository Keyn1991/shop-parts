// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from './config/database.module';
import { PartsModule } from './parts/parts.module';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Ustawia ConfigModule jako globalny
      envFilePath: '.env', // Można jawnie wskazać (Nest sam też szuka)
      ignoreEnvFile: process.env.NODE_ENV === 'production', // Na produkcji zmienne będą z systemu/Dockera
    }),
    DatabaseModule,
    PartsModule,
    UsersModule, // UsersModule nie powinien już importować JwtModule.register
    JwtModule.registerAsync({
      global: true, // Ustawia JwtModule jako globalny
      imports: [ConfigModule], // Potrzebne dla useFactory
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN', '1h'),
        },
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
