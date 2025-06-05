// Plik: backend/src/config/database.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Poprawne: zapewnia dostępność ConfigService dla useFactory
      inject: [ConfigService],
      name: 'default', // <<< KRYTYCZNA LINIA - POPRAWNIE! To powinno rozwiązać problem z "crypto".
      useFactory: (configService: ConfigService) => {
        // Logi diagnostyczne - bardzo dobrze
        console.log(
          '--- [DB_MODULE] Inicjalizacja TypeORM z ConfigService ---',
        );
        console.log(
          `[DB_MODULE] Odczytany DB_HOST: ${configService.get<string>('DB_HOST')}`,
        );
        console.log(
          `[DB_MODULE] Odczytany DB_PORT: ${configService.get<string>('DB_PORT', '3306')}`,
        );
        console.log(
          `[DB_MODULE] Odczytany DB_USER: ${configService.get<string>('DB_USER')}`,
        ); // Dodatkowy log
        console.log(
          `[DB_MODULE] Odczytany DB_NAME: ${configService.get<string>('DB_NAME')}`,
        ); // Dodatkowy log
        console.log(
          `[DB_MODULE] Odczytany TYPEORM_SYNCHRONIZE: ${configService.get<string>('TYPEORM_SYNCHRONIZE')}`,
        );
        console.log(
          `[DB_MODULE] Odczytany NODE_ENV: ${configService.get<string>('NODE_ENV')}`,
        );

        const dbPortEnv = configService.get<string>('DB_PORT', '3306');
        const synchronizeEnv = configService.get<string>(
          'TYPEORM_SYNCHRONIZE',
          'true',
        ); // Domyślnie true, jeśli zmienna nie jest ustawiona

        return {
          type: 'mysql', // Zakładam, że ostatecznie zostajesz przy MySQL
          host: configService.get<string>('DB_HOST'),
          port: parseInt(dbPortEnv, 10),
          username: configService.get<string>('DB_USER'),
          password: configService.get<string>('DB_PASS'),
          database: configService.get<string>('DB_NAME'),
          entities: [__dirname + '/../**/*.entity.{js,ts}'],
          synchronize: synchronizeEnv === 'true', // Poprawna konwersja string -> boolean
          logging:
            configService.get<string>('NODE_ENV') !== 'production'
              ? ['query', 'error']
              : ['error'],
        };
      },
    }),
  ],
})
export class DatabaseModule {}
