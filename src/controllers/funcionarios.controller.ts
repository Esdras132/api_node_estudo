import { FastifyReply } from "fastify";
import { connectAlunos } from "../repositories/aluno.repositories";
import { Aluno } from "../entity/Aluno";
import { AppDataSource } from "../data-source";
import { Funcionarios } from "../entity/funcionarios";
import { FuncionarioInfo } from "../entity/infoFuncionarios";

export class FuncionariosController {
  async getFuncionarios(cpf: String) {
    let query = `SELECT
      FUNCIO.nome,
      FUNCIO.email,
      FUNCIO.cpf,
      INFO.tipo_vinculo,
      FUNCIO.telefone,
      FUNCIO.sexo,
      INFO.setor,
      FUNCIO.ativo
    FROM
      funcionario_info INFO,
      funcionarios FUNCIO
    WHERE
      FUNCIO.cpf = INFO.cpf `;

    try {
      let conn = await connectAlunos();
      if (cpf.length > 0) {
        conn = await connectAlunos();
        let resultado = await conn
          .request()
          .query(query + `AND INFO.cpf = '${cpf}'`);

        return resultado.recordset;
      } else {
        conn = await connectAlunos();
        let resultado = await conn.request().query(query);
        return resultado.recordset;
      }
    } catch (erro) {
      console.error("Erro ao buscar alunos:", erro);
      return erro;
    }
  }

  async getOneFuncionario(cpf: String) {
    let query = `	SELECT
                    FUNCIO.nome,
                    FUNCIO.rg,
                    FUNCIO.dt_nascimento,
                    FUNCIO.sexo,
                    FUNCIO.email,
                    FUNCIO.telefone,
                    FUNCIO.cpf,
                    INFO.cargo,
                    INFO.setor,
                    INFO.tipo_vinculo,
                    INFO.turno,
                    INFO.data_admissao,
                    INFO.salario,
                    INFO.supervisor,
                    INFO.nivel_acesso,
                    FUNCIO.ativo
                  FROM
                    funcionario_info INFO,
                    funcionarios FUNCIO
                  WHERE
                    FUNCIO.cpf = INFO.cpf AND INFO.cpf = '${cpf}' `;

    try {
      let conn = await connectAlunos();
      let resultado = await conn.request().query(query);
      return resultado.recordset;
    } catch (erro) {
      console.error("Erro ao buscar alunos:", erro);
      return erro;
    }
  }


    async getDeepenFuncionario() {
    let query = `	SELECT
                    FUNCIO.nome,
                    FUNCIO.rg,
                    FUNCIO.dt_nascimento,
                    FUNCIO.sexo,
                    FUNCIO.email,
                    FUNCIO.telefone,
                    FUNCIO.cpf,
                    INFO.cargo,
                    INFO.setor,
                    INFO.tipo_vinculo,
                    INFO.turno,
                    INFO.data_admissao,
                    INFO.salario,
                    INFO.supervisor,
                    INFO.nivel_acesso,
                    FUNCIO.ativo
                  FROM
                    funcionario_info INFO,
                    funcionarios FUNCIO
                  WHERE
                    FUNCIO.cpf = INFO.cpf `;

    try {
      let conn = await connectAlunos();
      let resultado = await conn.request().query(query);
      return resultado.recordset;
    } catch (erro) {
      console.error("Erro ao buscar alunos:", erro);
      return erro;
    }
  }

async updateFuncionario(cpf: string, updateData: Partial<Funcionarios & FuncionarioInfo>) {
  let setClause: string[] = [];
  if (updateData.nome) setClause.push(`FUNCIO.nome = '${updateData.nome}'`);
  if (updateData.email) setClause.push(`FUNCIO.email = '${updateData.email}'`);
  if (updateData.telefone) setClause.push(`FUNCIO.telefone = '${updateData.telefone}'`);
  if (updateData.sexo) setClause.push(`FUNCIO.sexo = '${updateData.sexo}'`);
  if (updateData.rg) setClause.push(`FUNCIO.rg = '${updateData.rg}'`);
  if (updateData.dt_nascimento) setClause.push(`FUNCIO.dt_nascimento = '${new Date(updateData.dt_nascimento).toISOString()}'`);
  if (updateData.cargo) setClause.push(`INFO.cargo = '${updateData.cargo}'`);
  if (updateData.setor) setClause.push(`INFO.setor = '${updateData.setor}'`);
  if (updateData.tipo_vinculo) setClause.push(`INFO.tipo_vinculo = '${updateData.tipo_vinculo}'`);
  if (updateData.turno) setClause.push(`INFO.turno = '${updateData.turno}'`);
  if (updateData.data_admissao) setClause.push(`INFO.data_admissao = '${new Date(updateData.data_admissao).toISOString()}'`);
  if (updateData.salario) setClause.push(`INFO.salario = ${updateData.salario}`);
  if (updateData.supervisor) setClause.push(`INFO.supervisor = '${updateData.supervisor}'`);
  if (updateData.nivel_acesso) setClause.push(`INFO.nivel_acesso = '${updateData.nivel_acesso}'`);
  if (updateData.ativo !== undefined) setClause.push(`FUNCIO.ativo = ${updateData.ativo ? 1 : 0}`);

  if (setClause.length === 0) {
    throw new Error("No fields to update");
  }

  let query = `UPDATE FUNCIO, INFO SET ${setClause.join(", ")} WHERE FUNCIO.cpf = INFO.cpf AND FUNCIO.cpf = '${cpf}'`;

  try {
    let conn = await connectAlunos();
    await conn.request().query(query);
    return { message: "Funcionario updated successfully" };
  } catch (error) {
    console.error("Erro ao atualizar funcionario:", error);
    return error;
  }
}


  /*   async getToLastMatricula() {
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

      return resultado.recordset[0].matricula + 1;
    } catch (erro) {
      console.error("Erro ao buscar alunos:", erro);
      return erro;
    }
  } */

  /*   async createAluno(aluno: Aluno) {
    
    let matricula = await this.getToLastMatricula();

    aluno.matricula = matricula;

    try {
      let conn = await connectAlunos();

console.log(aluno);
     await conn
        .request()
        .query(
          `INSERT INTO aluno (matricula, nome, email, dt_nascimento, telefone) VALUES (${
            aluno.matricula
          }, '${aluno.nome}', '${aluno.email}', '${new Date(
            aluno.dt_nascimento
          ).toISOString()}', ${aluno.telefone})`
        ); 
      return aluno; // Retorne o objeto Aluno
    } catch (erro) {
      console.error("Erro ao criar aluno:", erro);
      return erro;
    }
  } */
}
