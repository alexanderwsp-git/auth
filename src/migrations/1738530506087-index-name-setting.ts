import { MigrationInterface, QueryRunner } from "typeorm";

export class IndexNameSetting1738530506087 implements MigrationInterface {
    name = 'IndexNameSetting1738530506087'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "IDX_27923d152bbf82683ab795d547" ON "sheep"."setting" ("name") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "sheep"."IDX_27923d152bbf82683ab795d547"`);
    }

}
