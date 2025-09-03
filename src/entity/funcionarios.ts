import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn } from "typeorm";

@Entity()
export class Funcionarios {
  @PrimaryColumn({ type: "varchar", length: 11 })  // CPF fixo, sem geração automática
  cpf: string;

  @Column({ type: "varchar", length: 100 })
  nome: string;


  @Column({ type: "varchar", length: 12, nullable: true })
  rg: string;

  @Column({ type: "date", nullable: true })
  dt_nascimento: Date;

  @Column({ type: "varchar", length: 20, nullable: true })
  sexo: string;

  @Column({ type: "varchar", nullable: true })
  email: string;

  @Column({ type: "varchar", length: 20, nullable: true })
  telefone: string;

  @Column({ type: "bit", default: true })
  ativo: boolean;
}
