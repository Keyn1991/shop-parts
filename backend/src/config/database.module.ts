// Plik: backend/src/config/database.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Potrzebne, aby ConfigService był wstrzykiwalny
      inject: [ConfigService],
      name: 'default', // <<< TA LINIA JEST NAJWAŻNIEJSZA DLA BŁĘDU "crypto"
      useFactory: (configService: ConfigService) => {
        console.log('--- [DB_MODULE] Inicjalizacja TypeORM z ConfigService ---');
        console.log(`[DB_MODULE] Odczytany DB_HOST: ${configService.get<string>('DB_HOST')}`);
        console.log(`[DB_MODULE] Odczytany TYPEORM_SYNCHRONIZE: ${configService.get<string>('TYPEORM_SYNCHRONIZE')}`);

        const dbPortEnv = configService.get<string>('DB_PORT', '3306');
        const synchronizeEnv = configService.get<string>('TYPEORM_SYNCHRONIZE', 'true'); // Domyślnie true (dobre dla dev)

        return {
          type: 'mysql',
          host: configService.get<string>('DB_HOST'),
          port: parseInt(dbPortEnv, 10),
          username: configService.get<string>('DB_USER'),
          password: configService.get<string>('DB_PASS'),
          database: configService.get<string>('DB_NAME'),
          entities: [__dirname + '/../**/*.entity.{js,ts}'],
          synchronize: synchronizeEnv === 'true', // Użyje wartości z .env lub true
          logging: configService.get<string>('NODE_ENV') !== 'production' ? ['query', 'error'] : ['error'],
        };
      },
    }),
  ],
})
export class DatabaseModule {}