import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn } from "typeorm";

@Entity()
export class FuncionarioInfo {
  @PrimaryColumn({ type: "varchar", length: 11 })  // CPF fixo, sem geração automática
  cpf: string;

  @Column({ type: "varchar", length: 50 })
  cargo: string;

  @Column({ type: "varchar", length: 50 })
  setor: string;

  @Column({ type: "varchar", length: 30 })
  tipo_vinculo: string;

  @Column({ type: "varchar", length: 20 })
  turno: string;

  @Column({ type: "date" })
  data_admissao: Date;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  salario: number;

  @Column({ type: "varchar", length: 100, nullable: true })
  supervisor: string;

  @Column({ type: "varchar", length: 20 })
  nivel_acesso: string;
}
