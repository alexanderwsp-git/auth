import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity({ schema: process.env.DATABASE_SCHEMA || 'public' })
export class Param {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ unique: true })
    name?: string;

    @Column({ default: null })
    type?: string;

    @Column({ default: null })
    config?: string;

    @Column({ default: 'Active' })
    status?: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
