import { IsString, IsNumber, IsOptional, Min, MaxLength } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePartDto } from './create-part.dto'; // Importuj bazowe DTO

// PartialType sprawia, że wszystkie właściwości z CreatePartDto stają się opcjonalne
// i dziedziczą dekoratory @ApiProperty oraz class-validator
export class UpdatePartDto extends PartialType(CreatePartDto) {}