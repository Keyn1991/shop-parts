import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Part {
    @ApiProperty({ example: 1, description: 'Unikalne ID części' })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ example: 'Filtr Oleju Bosch', description: 'Nazwa części' })
    @Column()
    name: string;

    @ApiProperty({ example: 'Wysokiej jakości filtr oleju.', description: 'Opis części', required: false })
    @Column({ nullable: true }) // Zezwól na null w bazie, jeśli description jest opcjonalny
    description: string;

    @ApiProperty({ example: 49.99, description: 'Cena części' })
    @Column('decimal', { precision: 10, scale: 2 }) // Dobrze jest zdefiniować precyzję dla decimal
    price: number;

    @ApiProperty({ example: 10, description: 'Ilość sztuk na stanie' })
    @Column({ default: 0 }) // Lepiej default 0 niż 10, chyba że jest specyficzny powód
    stock: number;
}