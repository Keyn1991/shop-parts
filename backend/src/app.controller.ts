// src/app.controller.ts
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service'; // Upewnij się, że AppService jest wstrzykiwany
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Status Aplikacji') // Tag grupujący ten endpoint w Swagger UI
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {} // Wstrzyknięcie AppService

  @Get()
  @ApiOperation({ summary: 'Sprawdź status API i pobierz powitalną wiadomość' })
  @ApiResponse({ status: 200, description: 'API działa poprawnie i zwraca wiadomość powitalną.' })
  getHello(): string {
    return this.appService.getHello(); // Wywołanie metody z serwisu
  }
}