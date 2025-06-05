// Plik: backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from './config/database.module';
import { PartsModule } from './parts/parts.module';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { AuthMiddleware } from './auth/auth.guard.ts'; // Zmień nazwę i sposób użycia jeśli to Guard

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // Wskazuje na backend/.env gdy uruchamiasz lokalnie bez Dockera
      // Dla Dockera, zmienne są wstrzykiwane przez docker-compose i ConfigService je odczyta
    }),
    DatabaseModule,
    PartsModule,
    UsersModule, // UsersModule nie powinien już importować JwtModule.register
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
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
// Jeśli AuthMiddleware to faktycznie Guard, powinien być zarejestrowany globalnie lub w modułach
// np. providers: [AppService, { provide: APP_GUARD, useClass: AuthGuard }] (AuthGuard musi być zdefiniowany)
