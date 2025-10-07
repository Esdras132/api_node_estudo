import { MigrationInterface, QueryRunner } from "typeorm";

export class CriaAluno1759865514520 implements MigrationInterface {
    name = 'CriaAluno1759865514520'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "login" ("email" varchar(255) NOT NULL, "password" nvarchar(255) NOT NULL, CONSTRAINT "PK_a1fa377d7cba456bebaa6922edf" PRIMARY KEY ("email"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "login"`);
    }

}
