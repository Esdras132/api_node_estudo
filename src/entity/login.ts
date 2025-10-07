import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity()
export class Login {
  @PrimaryColumn({ type: "varchar", length: 255 }) // O e-mail será a chave primária
  email: string;

  @Column({ type: "nvarchar", length: 255 }) // Nvarchar é ótimo para guardar senhas (hash)
  password: string;
}
