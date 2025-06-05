// Plik: backend/src/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';
// import { JwtModule } from '@nestjs/jwt'; // <<< USUNIĘTY IMPORT

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    // JwtModule.register({ secret: 'secretKey', ... }) // <<< USUNIĘTA LOKALNA KONFIGURACJA
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
