// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';
// import { JwtModule } from '@nestjs/jwt'; // <<< USUNIĘTY IMPORT

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    // JwtModule.register({ secret: 'secretKey', signOptions: { expiresIn: '1h' } }), // <<< USUNIĘTA LOKALNA KONFIGURACJA
  ],
  providers: [UsersService], // JwtService będzie dostępny globalnie
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
