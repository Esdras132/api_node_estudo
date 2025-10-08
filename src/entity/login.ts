import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity('login')
export class Login {
  @PrimaryColumn({ type: "varchar", length: 255 })
  email: string;

  @Column({ type: "nvarchar", length: 255 })
  password: string;

  // Novo campo para armazenar o token JWT
  @Column({ type: "nvarchar", length: 500, nullable: true }) // Um token pode ser longo e é opcional
  token: string | null;
}

