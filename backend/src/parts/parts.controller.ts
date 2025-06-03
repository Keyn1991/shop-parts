// src/parts/parts.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { PartsService } from './parts.service';
import { Part } from './parts.entity';
import { CreatePartDto } from './dto/create-part.dto';
import { UpdatePartDto } from './dto/update-part.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
// import { AuthGuard } from '../auth/auth.guard'; // Odkomentuj, jeśli AuthGuard jest gotowy i chcesz go używać

@ApiTags('parts')
@Controller('parts')
export class PartsController {
    constructor(private readonly partsService: PartsService) {}

    @Get()
    @ApiOperation({ summary: 'Pobierz listę wszystkich części' })
    @ApiResponse({ status: 200, description: 'Lista części pobrana pomyślnie.', type: [Part] })
    findAll(): Promise<Part[]> {
        return this.partsService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Pobierz szczegóły jednej części po ID' })
    @ApiParam({ name: 'id', description: 'ID części', type: 'number', example: 1 })
    @ApiResponse({ status: 200, description: 'Szczegóły części.', type: Part })
    @ApiResponse({ status: 404, description: 'Część o podanym ID nie została znaleziona.' })
    findOne(@Param('id', ParseIntPipe) id: number): Promise<Part> {
        return this.partsService.findOne(id);
    }

    // PRZYKŁAD ZABEZPIECZENIA - odkomentuj jeśli chcesz używać
    // @UseGuards(AuthGuard)
    // @ApiBearerAuth('JWT-auth') // Użyj tej samej nazwy co w DocumentBuilder
    @Post()
    @ApiOperation({ summary: 'Stwórz nową część (może wymagać uprawnień admina)' })
    @ApiBody({ type: CreatePartDto })
    @ApiResponse({ status: 201, description: 'Część została pomyślnie utworzona.', type: Part })
    @ApiResponse({ status: 400, description: 'Nieprawidłowe dane wejściowe.' })
    @ApiResponse({ status: 401, description: 'Brak autoryzacji (jeśli endpoint jest zabezpieczony).'})
    @ApiResponse({ status: 403, description: 'Brak uprawnień (jeśli endpoint jest zabezpieczony).'})
    create(@Body() createPartDto: CreatePartDto): Promise<Part> {
        return this.partsService.create(createPartDto);
    }

    // @UseGuards(AuthGuard)
    // @ApiBearerAuth('JWT-auth')
    @Put(':id')
    @ApiOperation({ summary: 'Aktualizuj istniejącą część (może wymagać uprawnień admina)' })
    @ApiParam({ name: 'id', description: 'ID części do aktualizacji', type: 'number' })
    @ApiBody({ type: UpdatePartDto })
    @ApiResponse({ status: 200, description: 'Część została pomyślnie zaktualizowana.', type: Part })
    @ApiResponse({ status: 404, description: 'Część o podanym ID nie została znaleziona.' })
    @ApiResponse({ status: 400, description: 'Nieprawidłowe dane wejściowe.' })
    @ApiResponse({ status: 401, description: 'Brak autoryzacji (jeśli endpoint jest zabezpieczony).'})
    @ApiResponse({ status: 403, description: 'Brak uprawnień (jeśli endpoint jest zabezpieczony).'})
    update(@Param('id', ParseIntPipe) id: number, @Body() updatePartDto: UpdatePartDto): Promise<Part> {
        return this.partsService.update(id, updatePartDto);
    }

    // @UseGuards(AuthGuard)
    // @ApiBearerAuth('JWT-auth')
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT) // Ustawienie kodu odpowiedzi na 204
    @ApiOperation({ summary: 'Usuń część (może wymagać uprawnień admina)' })
    @ApiParam({ name: 'id', description: 'ID części do usunięcia', type: 'number' })
    @ApiResponse({ status: 204, description: 'Część została pomyślnie usunięta.' })
    @ApiResponse({ status: 404, description: 'Część o podanym ID nie została znaleziona.' })
    @ApiResponse({ status: 401, description: 'Brak autoryzacji (jeśli endpoint jest zabezpieczony).'})
    @ApiResponse({ status: 403, description: 'Brak uprawnień (jeśli endpoint jest zabezpieczony).'})
    async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
        await this.partsService.delete(id);
    }

    // Endpoint zakupu - prawdopodobnie dostępny dla zalogowanych użytkowników
    // @UseGuards(AuthGuard) // Odkomentuj jeśli zakup wymaga logowania
    // @ApiBearerAuth('JWT-auth')
    @Post(':id/purchase')
    @ApiOperation({ summary: 'Zakup część' })
    @ApiParam({ name: 'id', description: 'ID części do zakupu', type: 'number' })
    @ApiBody({ schema: { type: 'object', properties: { quantity: { type: 'number', example: 1, description: 'Ilość sztuk do zakupu', default: 1, minimum: 1 } } } })
    @ApiResponse({ status: 200, description: 'Część została pomyślnie zakupiona.', type: Part })
    @ApiResponse({ status: 400, description: 'Niewystarczająca ilość na stanie lub nieprawidłowa ilość.' })
    @ApiResponse({ status: 404, description: 'Część o podanym ID nie została znaleziona.' })
    @ApiResponse({ status: 401, description: 'Brak autoryzacji (jeśli endpoint jest zabezpieczony).'})
    purchase(@Param('id', ParseIntPipe) id: number, @Body('quantity', ParseIntPipe) quantity: number): Promise<Part> {
        // Domyślna wartość quantity, jeśli nie podana, może być obsłużona w DTO lub tu
        if (quantity === undefined || quantity === null) quantity = 1;
        return this.partsService.purchase(id, quantity);
    }
}