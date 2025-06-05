import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PartsService } from './parts.service';
import { Part } from './parts.entity';
import { CreatePartDto } from './dto/create-part.dto';
import { UpdatePartDto } from './dto/update-part.dto';
import { PartsQueryDto, PaginatedPartsResponse } from './dto/parts-query.dto'; // Importuj DTO i interfejs
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
// import { AuthGuard } from '../auth/auth.guard';

@ApiTags('parts')
@Controller('parts')
export class PartsController {
  constructor(private readonly partsService: PartsService) {}

  @Get()
  @ApiOperation({
    summary:
      'Pobierz listę wszystkich części z paginacją, sortowaniem i wyszukiwaniem',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Numer strony',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Liczba elementów na stronie',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Termin wyszukiwania',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['name', 'price', 'stock'],
    description: 'Pole sortowania',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['ASC', 'DESC'],
    description: 'Kierunek sortowania (ASC/DESC)',
  })
  @ApiResponse({
    status: 200,
    description:
      'Lista części pobrana pomyślnie.' /* type: PaginatedPartsResponse - Swagger może mieć problem z generycznym interfejsem, można zdefiniować konkretny typ odpowiedzi */,
  })
  findAll(@Query() queryDto: PartsQueryDto): Promise<PaginatedPartsResponse> {
    // Użyj @Query()
    return this.partsService.findAll(queryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Pobierz szczegóły jednej części po ID' })
  @ApiParam({ name: 'id', description: 'ID części', type: Number })
  @ApiResponse({ status: 200, description: 'Szczegóły części.', type: Part })
  @ApiResponse({
    status: 404,
    description: 'Część o podanym ID nie została znaleziona.',
  })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Part> {
    // Dodano ParseIntPipe
    return this.partsService.findOne(id);
  }

  // @UseGuards(AuthGuard)
  // @ApiBearerAuth('JWT-auth')
  @Post()
  @ApiOperation({ summary: 'Stwórz nową część' })
  @ApiBody({ type: CreatePartDto })
  @ApiResponse({
    status: 201,
    description: 'Część została pomyślnie utworzona.',
    type: Part,
  })
  create(@Body() createPartDto: CreatePartDto): Promise<Part> {
    return this.partsService.create(createPartDto);
  }

  // @UseGuards(AuthGuard)
  // @ApiBearerAuth('JWT-auth')
  @Put(':id')
  @ApiOperation({ summary: 'Aktualizuj istniejącą część' })
  @ApiParam({
    name: 'id',
    description: 'ID części do aktualizacji',
    type: Number,
  })
  @ApiBody({ type: UpdatePartDto })
  @ApiResponse({
    status: 200,
    description: 'Część została pomyślnie zaktualizowana.',
    type: Part,
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePartDto: UpdatePartDto,
  ): Promise<Part> {
    // Dodano ParseIntPipe
    return this.partsService.update(id, updatePartDto);
  }

  // @UseGuards(AuthGuard)
  // @ApiBearerAuth('JWT-auth')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Usuń część' })
  @ApiParam({ name: 'id', description: 'ID części do usunięcia', type: Number })
  @ApiResponse({
    status: 204,
    description: 'Część została pomyślnie usunięta.',
  })
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    // Dodano ParseIntPipe
    await this.partsService.delete(id);
  }

  // @UseGuards(AuthGuard)
  // @ApiBearerAuth('JWT-auth')
  @Post(':id/purchase')
  @ApiOperation({ summary: 'Zakup część' })
  @ApiParam({ name: 'id', description: 'ID części do zakupu', type: Number })
  @ApiBody({
    schema: {
      type: 'object',
      properties: { quantity: { type: 'number', example: 1 } },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Część została pomyślnie zakupiona.',
    type: Part,
  })
  purchase(
    @Param('id', ParseIntPipe) id: number,
    @Body('quantity', ParseIntPipe) quantity: number,
  ): Promise<Part> {
    // Dodano ParseIntPipe
    return this.partsService.purchase(id, quantity || 1); // Domyślnie 1, jeśli quantity nie podane
  }
}
