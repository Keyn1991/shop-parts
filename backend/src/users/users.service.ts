import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private jwtService: JwtService,
    ) {}

    async register(username: string, password: string, role: 'admin' | 'client' = 'client') {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = this.usersRepository.create({ username, password: hashedPassword, role });
        return this.usersRepository.save(user);
    }

    async login(username: string, password: string) {
        const user = await this.usersRepository.findOne({ where: { username } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException('Niepoprawne dane logowania');
        }

        const token = this.jwtService.sign({ id: user.id, role: user.role });
        return { token, role: user.role };
    }
}
