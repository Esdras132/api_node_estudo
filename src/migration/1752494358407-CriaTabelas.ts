import { MigrationInterface, QueryRunner } from "typeorm";

export class CriaTabelas1752494358407 implements MigrationInterface {
    name = 'CriaTabelas1752494358407'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "funcionario_info" DROP CONSTRAINT "PK_f98c271fd4c8f9f2157eae96fa4"`);
        await queryRunner.query(`ALTER TABLE "funcionario_info" DROP COLUMN "cpf"`);
        await queryRunner.query(`ALTER TABLE "funcionario_info" ADD "cpf" varchar(11) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "funcionario_info" ADD CONSTRAINT "PK_f98c271fd4c8f9f2157eae96fa4" PRIMARY KEY ("cpf")`);
        await queryRunner.query(`ALTER TABLE "funcionarios" DROP CONSTRAINT "PK_a0de321e9da6c025e7fc92f0bd8"`);
        await queryRunner.query(`ALTER TABLE "funcionarios" DROP COLUMN "cpf"`);
        await queryRunner.query(`ALTER TABLE "funcionarios" ADD "cpf" varchar(11) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "funcionarios" ADD CONSTRAINT "PK_a0de321e9da6c025e7fc92f0bd8" PRIMARY KEY ("cpf")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "funcionarios" DROP CONSTRAINT "PK_a0de321e9da6c025e7fc92f0bd8"`);
        await queryRunner.query(`ALTER TABLE "funcionarios" DROP COLUMN "cpf"`);
        await queryRunner.query(`ALTER TABLE "funcionarios" ADD "cpf" int NOT NULL IDENTITY(1,1)`);
        await queryRunner.query(`ALTER TABLE "funcionarios" ADD CONSTRAINT "PK_a0de321e9da6c025e7fc92f0bd8" PRIMARY KEY ("cpf")`);
        await queryRunner.query(`ALTER TABLE "funcionario_info" DROP CONSTRAINT "PK_f98c271fd4c8f9f2157eae96fa4"`);
        await queryRunner.query(`ALTER TABLE "funcionario_info" DROP COLUMN "cpf"`);
        await queryRunner.query(`ALTER TABLE "funcionario_info" ADD "cpf" int NOT NULL IDENTITY(1,1)`);
        await queryRunner.query(`ALTER TABLE "funcionario_info" ADD CONSTRAINT "PK_f98c271fd4c8f9f2157eae96fa4" PRIMARY KEY ("cpf")`);
    }

}
