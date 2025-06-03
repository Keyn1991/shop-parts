import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

interface ExtendedRequest extends Request {
    user?: any;
}

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<ExtendedRequest>();
        const authHeader = request.headers.authorization;

        if (!authHeader) throw new ForbiddenException('Brak tokena');

        try {
            const token = authHeader.split(' ')[1];
            const decoded = this.jwtService.verify(token);
            request.user = decoded;
            return true;
        } catch {
            throw new ForbiddenException('Nieprawidłowy token');
        }
    }
}
