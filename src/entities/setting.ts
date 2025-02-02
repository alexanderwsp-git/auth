import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
} from 'typeorm';

@Entity({ schema: process.env.DATABASE_SCHEMA || 'public' })
export class Setting {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Index()
    @Column({ unique: true, nullable: false })
    name?: string;

    @Column({ nullable: false })
    type?: string;

    @Column({ nullable: false })
    config?: string;

    @Column({ default: 'Active' })
    status?: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
