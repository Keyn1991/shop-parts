// src/users/users.controller.ts
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('register')
    @ApiOperation({ summary: 'Zarejestruj nowego użytkownika' })
    @ApiBody({ type: RegisterUserDto })
    @ApiResponse({ status: 201, description: 'Użytkownik został pomyślnie zarejestrowany.' }) // Zwróci User entity bez hasła
    @ApiResponse({ status: 400, description: 'Nieprawidłowe dane wejściowe lub użytkownik już istnieje.' })
    async register(@Body() registerUserDto: RegisterUserDto) {
        // Serwis powinien zwracać użytkownika bez hasła
        const user = await this.usersService.register(registerUserDto.username, registerUserDto.password, registerUserDto.role);
        const { password, ...result } = user; // Usuń hasło z odpowiedzi
        return result;
    }

    @Post('login')
    @HttpCode(HttpStatus.OK) // Ustawienie kodu odpowiedzi na 200
    @ApiOperation({ summary: 'Zaloguj użytkownika' })
    @ApiBody({ type: LoginUserDto })
    @ApiResponse({ status: 200, description: 'Logowanie pomyślne, zwraca token JWT i rolę.', schema: { properties: { token: {type: 'string'}, role: {type: 'string', enum: ['admin', 'client']}} }})
    @ApiResponse({ status: 401, description: 'Niepoprawne dane logowania.' })
    login(@Body() loginUserDto: LoginUserDto): Promise<{ token: string; role: 'admin' | 'client' }> {
        return this.usersService.login(loginUserDto.username, loginUserDto.password);
    }
}