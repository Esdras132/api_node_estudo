import { MigrationInterface, QueryRunner } from "typeorm";

export class CriaAluno1759867230926 implements MigrationInterface {
    name = 'CriaAluno1759867230926'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "login" ADD "token" nvarchar(500)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "login" DROP COLUMN "token"`);
    }

}
