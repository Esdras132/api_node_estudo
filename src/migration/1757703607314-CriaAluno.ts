import { MigrationInterface, QueryRunner } from "typeorm";

export class CriaAluno1757703607314 implements MigrationInterface {
    name = 'CriaAluno1757703607314'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "funcionario_info" ("cpf" varchar(11) NOT NULL, "cargo" varchar(50) NOT NULL, "setor" varchar(50) NOT NULL, "tipo_vinculo" varchar(30) NOT NULL, "turno" varchar(20) NOT NULL, "data_admissao" date NOT NULL, "salario" decimal(10,2) NOT NULL, "supervisor" varchar(100), "nivel_acesso" varchar(20) NOT NULL, CONSTRAINT "PK_f98c271fd4c8f9f2157eae96fa4" PRIMARY KEY ("cpf"))`);
        await queryRunner.query(`CREATE TABLE "funcionarios" ("cpf" varchar(11) NOT NULL, "nome" varchar(100) NOT NULL, "rg" varchar(12), "dt_nascimento" date, "sexo" varchar(20), "email" varchar(255), "telefone" varchar(20), "ativo" bit NOT NULL CONSTRAINT "DF_201028d9a6cc399b3d418d21d0c" DEFAULT 1, CONSTRAINT "PK_a0de321e9da6c025e7fc92f0bd8" PRIMARY KEY ("cpf"))`);
        await queryRunner.query(`CREATE TABLE "aluno" ("matricula" int NOT NULL, "nome" varchar(255) NOT NULL, "email" varchar(255), "dt_nascimento" date, "ativo" bit NOT NULL CONSTRAINT "DF_01bf92d8066edb6d3b202e325aa" DEFAULT 1, "telefone" bigint NOT NULL, CONSTRAINT "PK_d361bd841d0658620d4a3d2ff6a" PRIMARY KEY ("matricula"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "aluno"`);
        await queryRunner.query(`DROP TABLE "funcionarios"`);
        await queryRunner.query(`DROP TABLE "funcionario_info"`);
    }

}
