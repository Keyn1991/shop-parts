// src/parts/dto/create-part.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; // Import

export class CreatePartDto {
  @ApiProperty({
    example: 'Filtr Oleju Bosch F026407022',
    description: 'Pełna nazwa części',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    example: 'Wysokiej jakości filtr oleju do silników grupy VW.',
    description: 'Szczegółowy opis części',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @ApiProperty({
    example: 49.99,
    description: 'Cena części w PLN',
    type: 'number',
    format: 'float',
    minimum: 0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @ApiProperty({
    example: 15,
    description: 'Dostępna ilość sztuk w magazynie',
    type: 'number',
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  stock: number;
}
