import { FastifyReply } from "fastify";
import { connectAlunos } from "../repositories/aluno.repositories";
import { Aluno } from "../entity/Aluno";
import { AppDataSource } from "../data-source";

export class AlunosController {
  async getAlunos(matricula: String) {
    try {
      let conn = await connectAlunos();
      if (matricula.length > 0) {
        /* console.log("Buscando alunos com matrícula:", matricula); */
        conn = await connectAlunos();
        let resultado = await conn
          .request()
          .query(`SELECT * FROM aluno WHERE matricula = ${matricula}`);

        return resultado.recordset;
      } else {
        conn = await connectAlunos();
        let resultado = await conn.request().query(`
          SELECT 
            * 
          FROM
           aluno`);
        return resultado.recordset;
      }
    } catch (erro) {
      console.error("Erro ao buscar alunos:", erro);
      return erro;
    }
  }

  async getToLastMatricula() {
    let conn = await connectAlunos();
    try {
      conn = await connectAlunos();
      let resultado = await conn.request().query(`
        SELECT 
          TOP 1 *
        FROM 
          aluno
        ORDER BY
          matricula DESC;`);
      return resultado.recordset.length === 0
        ? 1001
        : resultado.recordset[0].matricula + 1;
    } catch (erro) {
      console.error("Erro ao buscar alunos:", erro);
      return erro;
    }
  }

  async createAluno(aluno: Aluno) {
    let matricula = await this.getToLastMatricula();
    let ativo;

    aluno.matricula = matricula;
    console.log(matricula);

    if (aluno.ativo === true) ativo = 1;
    else ativo = 0;

    try {
      let conn = await connectAlunos();

      await conn
        .request()
        .query(
          `INSERT INTO aluno (matricula, nome, email, dt_nascimento, telefone,ativo ) VALUES (${
            aluno.matricula
          }, '${aluno.nome}', '${aluno.email}', '${new Date(
            aluno.dt_nascimento
          ).toISOString()}', ${aluno.telefone}, ${ativo})`
        );
      return 201; // Retorne o objeto Aluno
    } catch (erro) {
      console.error("Erro ao criar aluno:", erro);
      return 500;
    }
  }

  async updateAluno(matricula: number, aluno: Aluno) {
    let setClause: string[] = [];

    if (aluno.nome) setClause.push(`nome = '${aluno.nome}'`);

    if (aluno.email) setClause.push(`email = '${aluno.email}'`);

    if (aluno.dt_nascimento)
      setClause.push(
        `dt_nascimento = '${new Date(aluno.dt_nascimento).toISOString()}'`
      );

    if (aluno.telefone) setClause.push(`telefone = ${aluno.telefone}`);

    if (setClause.length === 0) throw new Error("Nenhum campo para atualizar");

    let query = `UPDATE aluno SET ${setClause.join(
      ", "
    )} WHERE matricula = ${matricula}`;

    try {
      let conn = await connectAlunos();
      await conn.request().query(query);
      return { message: "Aluno atualizado com sucesso" };
    } catch (error) {
      console.error("Erro ao atualizar aluno:", error);
      return error;
    }
  }
}
