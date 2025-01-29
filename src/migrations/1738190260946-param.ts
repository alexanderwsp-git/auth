import { MigrationInterface, QueryRunner } from 'typeorm';

export class Param1738190260946 implements MigrationInterface {
    name = 'Param1738190260946';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "sheep"."param" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "type" character varying, "config" character varying, "status" character varying NOT NULL DEFAULT 'Active', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_1c3e1bc85a875ead22e0b4d35c5" UNIQUE ("name"), CONSTRAINT "PK_954cb8cfb3627c778c6798a487a" PRIMARY KEY ("id"))`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "sheep"."param"`);
    }
}
