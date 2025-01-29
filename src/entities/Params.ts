import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: process.env.DATABASE_SCHEMA || 'public' })
export class User {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ unique: true })
    name?: string;

    @Column()
    type?: string;

    @Column({ unique: true })
    config?: string;

    @Column()
    status?: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt!: Date;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    })
    updatedAt!: Date;
}
