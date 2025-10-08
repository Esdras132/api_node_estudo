import { FuncionariosController } from "../controllers/funcionarios.controller";
import { Aluno } from "../entity/Aluno";
import { FastifyTypedInstance } from "../types";
import { z } from "zod";
import { authenticate } from "./login.routes";

export async function routes_funcionarios(app: FastifyTypedInstance) {
  const funcionariosController = new FuncionariosController();
app.addHook('preHandler', authenticate);
  app.get(
    "",
    {
      schema: {
        tags: ["Funcionarios"],
        description: "Get a list of employees",
        querystring: z.object({
          cpf: z.string().optional(),
        }),
        response: {
          200: z.array(
            z.object({
              nome: z.string().describe("Name of the employee"),
              email: z.string().describe("Email of the employee"),
              cpf: z.string().describe("CPF of the employee"),
              tipo_vinculo: z.string().describe("Type of employment"),
              telefone: z.string().describe("Phone number"),
              sexo: z.string().describe("Gender"),
              setor: z.string().describe("Department"),
              ativo: z.boolean().describe("Is active"),
            })
          ),
          400: z.object({
            message: z.string().describe("Error message"),
          }),
          500: z.object({
            message: z.string().describe("Internal Server Error"),
          }),
        },
      },
    },
    async (request, reply) => {
      const { cpf } = request.query;
      try {
        const funcionariosEntity = await funcionariosController.getFuncionarios(
          cpf || ""
        );
        return reply.status(200).send(funcionariosEntity);
      } catch (error) {
        console.error("Erro ao buscar alunos:", error);
        return reply.status(500).send({ message: "Internal Server Error" });
      }
    }
  );

  app.get(
    "/one",
    {
      schema: {
        tags: ["Funcionarios"],
        description: "Get a list of employees",
        querystring: z.object({
          cpf: z.string().optional(),
        }),
        response: {
          200: z.array(
            z.object({
              nome: z.string().describe("Name of the employee"),
              rg: z.string().optional().describe("RG of the employee"),
              dt_nascimento: z
                .date()
                .optional()
                .describe("Date of birth of the employee"),
              sexo: z.string().optional().describe("Gender of the employee"),
              email: z.string().optional().describe("Email of the employee"),
              telefone: z
                .string()
                .optional()
                .describe("Phone number of the employee"),
              cargo: z.string().describe("Job title of the employee"),
              setor: z.string().describe("Department of the employee"),
              tipo_vinculo: z
                .string()
                .describe("Type of employment of the employee"),
              turno: z.string().describe("Shift of the employee"),
              data_admissao: z
                .date()
                .describe("Date of admission of the employee"),
              salario: z.number().describe("Salary of the employee"),
              supervisor: z
                .string()
                .optional()
                .describe("Supervisor of the employee"),
              nivel_acesso: z.string().describe("Access level of the employee"),
              ativo: z.boolean().describe("Is the employee active?"),
            })
          ),
          400: z.object({
            message: z.string().describe("Error message"),
          }),
          500: z.object({
            message: z.string().describe("Internal Server Error"),
          }),
        },
      },
    },
    async (request, reply) => {
      const { cpf } = request.query;
      if (cpf == "" || cpf == undefined) {
        return reply.status(400).send({ message: "CPF is required" });
      }
      try {
        const funcionariosEntity =
          await funcionariosController.getOneFuncionario(cpf);
        return reply.status(200).send(funcionariosEntity);
      } catch (error) {
        console.error("Erro ao buscar alunos:", error);
        return reply.status(500).send({ message: "Internal Server Error" });
      }
    }
  );

  app.get(
    "/deepen",
    {
      schema: {
        tags: ["Funcionarios"],
        description: "Get a list of employees",
        response: {
          200: z.array(
            z.object({
              nome: z.string().describe("Nome do funcionário"),
              rg: z.string().nullable().describe("RG do funcionário"),
              dt_nascimento: z.date().nullable().describe("Data de nascimento"),
              sexo: z.string().nullable().describe("Sexo"),
              email: z.string().nullable().describe("E-mail"),
              telefone: z.string().nullable().describe("Telefone"),
              cpf: z.string().describe("CPF do funcionário"),
              cargo: z.string().describe("Cargo"),
              setor: z.string().describe("Setor"),
              tipo_vinculo: z.string().describe("Tipo de vínculo"),
              turno: z.string().describe("Turno"),
              data_admissao: z.date().describe("Data de admissão"),
              salario: z.number().describe("Salário"),
              supervisor: z.string().nullable().describe("Supervisor"),
              nivel_acesso: z.string().describe("Nível de acesso"),
              ativo: z.boolean().describe("Ativo"),
            })
          ),
          400: z.object({
            message: z.string().describe("Error message"),
          }),
          500: z.object({
            message: z.string().describe("Internal Server Error"),
          }),
        },
      },
    },
    async (request, reply) => {
      try {
        let funcionariosEntity =
          await funcionariosController.getDeepenFuncionario();
        return reply.status(200).send(funcionariosEntity);
      } catch (error) {
        console.error("Erro ao buscar alunos:", error);
        return reply.status(500).send({ message: "Internal Server Error" });
      }
    }
  );

  app.put(
    "/:cpf",
    {
      schema: {
        tags: ["Funcionarios"],
        description: "Update a funcionario",
        params: z.object({
          cpf: z.string().describe("CPF of the funcionario"),
        }),
        body: z.object({
          nome: z.string(),
          rg: z.string().nullable(),
          dt_nascimento: z.preprocess(
            (val) => (val ? new Date(val as string) : null),
            z.date().nullable()
          ),
          sexo: z.string().nullable(),
          email: z.string().nullable(),
          telefone: z.string().nullable(),
          cargo: z.string(),
          setor: z.string(),
          tipo_vinculo: z.string(),
          turno: z.string(),
          data_admissao: z.preprocess(
            (val) => new Date(val as string),
            z.date()
          ),
          salario: z.number(),
          supervisor: z.string().nullable(),
          nivel_acesso: z.string(),
          ativo: z.boolean(),
        }),

        response: {
          200: z.object({
            message: z.string().describe("Funcionário atualizado com sucesso"),
          }),
          400: z.object({
            message: z.string().describe("Error message"),
          }),
          500: z.object({
            message: z.string().describe("Internal Server Error"),
          }),
        },
      },
    },
    async (request, reply) => {
      const { cpf } = request.params;
      const funcionario = request.body;

      try {
        await funcionariosController.updateFuncionario(cpf, funcionario);
        return reply
          .status(200)
          .send({ message: "Funcionário atualizado com sucesso" });
      } catch (error) {
        console.error("Erro ao atualizar funcionário:", error);
        return reply.status(500).send({ message: "Internal Server Error" });
      }
    }
  );

  /*   app.post(
    "",
    {
      schema: {
        tags: ["Funcionarios"],
        description: "Create a new student",
        body: z.object({
          nome: z.string().describe("Name of the student"),
          dt_nascimento: z.string().nullable().describe("Date of birth"),
          email: z.string().nullable().describe("Email"),
          telefone: z.string().nullable().describe("Phone"),
          ativo: z.boolean().describe("Is active"),
        }),
        response: {
          201: z.object({ status: z.literal("success") }).describe("Student created successfully"),
          400: z.object({
            message: z.string().describe("Error message"),
          }),
          500: z.object({
            message: z.string().describe("Internal Server Error"),
          }),
        },
      },
    },
    async (request, reply) => {
      const { nome, dt_nascimento, email, telefone } = request.body;

      let aluno: Aluno = {
        matricula: 0,
        nome,
        dt_nascimento: dt_nascimento ? new Date(dt_nascimento) : undefined,
        email,
        telefone: telefone ? Number(telefone) : undefined,
        ativo: true,
      };

      try {
        await FuncionariosController.createAluno(aluno);
        return reply.status(201).send({ status: "success" });
      } catch (error) {
        console.error("Erro ao criar aluno:", error);
        return reply.status(500).send({ message: "Internal Server Error" });
      }
    }
  ); */
}
