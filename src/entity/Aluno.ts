// src/entity/Aluno.ts
import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity()
export class Aluno {
  @PrimaryColumn({ type: "int" }) // 👈 Tipo especificado aqui
  matricula: number;

  @Column({ type: "varchar" }) // 👈 Sempre especifique o tipo
  nome: string;

  @Column({ type: "varchar", nullable: true })
  email: string;

  @Column({ type: "date", nullable: true })
  dt_nascimento: Date;

  @Column({ type: "bit", default: true }) // Para SQL Server, "boolean" é "bit"
  ativo: boolean;

  @Column({ type: "bigint" })
  telefone: number;
}
