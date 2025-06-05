import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

interface ExtendedRequest extends Request {
  user?: { id: number; role: string; [key: string]: any }; // Ulepszone typowanie
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<ExtendedRequest>();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Brak lub niepoprawny format tokena Bearer',
      );
    }

    try {
      const token = authHeader.split(' ')[1];
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET, // Użyj sekretu ze zmiennej środowiskowej (ConfigService byłby lepszy, ale wymaga refaktoryzacji Guard)
      }); // Możesz potrzebować dostępu do ConfigService tutaj, aby pobrać sekret dynamicznie
      request.user = decoded;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Nieprawidłowy lub przedawniony token');
    }
  }
}
