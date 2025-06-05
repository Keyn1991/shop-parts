// Plik: backend/src/parts/dto/parts-query.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min, Max, IsIn } from 'class-validator';
import { Part } from '../parts.entity';

export class PartsQueryDto {
  @ApiPropertyOptional({
    description: 'Numer strony (zaczynając od 1)',
    default: 1,
    type: Number,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number) // Automatyczna transformacja string -> number
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Liczba elementów na stronie',
    default: 10,
    type: Number,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100) // Ograniczamy, aby nie pobierać za dużo naraz
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Termin wyszukiwania (w nazwie lub opisie części)',
    type: String,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Pole, po którym sortować',
    enum: ['name', 'price', 'stock'], // Dozwolone pola sortowania
    default: 'name',
  })
  @IsOptional()
  @IsString()
  @IsIn(['name', 'price', 'stock']) // Tylko te wartości są dozwolone
  sortBy?: string = 'name';

  @ApiPropertyOptional({
    description: 'Kierunek sortowania',
    enum: ['ASC', 'DESC'],
    default: 'ASC',
  })
  @IsOptional()
  @IsString()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'ASC';
}

// Interfejs dla odpowiedzi z paginacją
export interface PaginatedPartsResponse {
  items: Part[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}
