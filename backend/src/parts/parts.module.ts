import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartsService } from './parts.service';
import { PartsController } from './parts.controller';
import { Part } from './parts.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Part])],
    controllers: [PartsController],
    providers: [PartsService],
})
export class PartsModule {}
