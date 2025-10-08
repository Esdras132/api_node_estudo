import { AlunosController } from "../controllers/alunos.controller";
import { Aluno } from "../entity/Aluno";
import { FastifyTypedInstance } from "../types";
import { z } from "zod";
import { authenticate } from "../routes/login.routes";

export async function routes_alunos(app: FastifyTypedInstance) {
  const alunosController = new AlunosController();
app.addHook('preHandler', authenticate);
  app.get(
    "",
    {
      schema: {
        tags: ["Alunos"],
        description: "Get a list of students",
        querystring: z.object({
          pesquisa: z.string().optional(),
        }),
        response: {
          200: z.array(
            z.object({
              matricula: z.number().describe("ID of the student"),
              nome: z.string().describe("Name of the student"),
              dt_nascimento: z.string().nullable().describe("Date of birth"),
              email: z.string().nullable().describe("Email"),
              telefone: z.string().nullable().describe("Phone"),
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
      const { pesquisa } = request.query;
      try {
        const alunosEntity = await alunosController.getAlunos(pesquisa || "");
        const alunos = alunosEntity.map((aluno) => {
          let dt_nascimento = "";
          if (aluno.dt_nascimento) {
            const date = new Date(aluno.dt_nascimento);
            const day = String(date.getDate()).padStart(2, "0");
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const year = date.getFullYear();
            dt_nascimento = `${day}/${month}/${year}`;
          }

          return {
            matricula: aluno.matricula,
            nome: aluno.nome,
            ativo: aluno.ativo,
            dt_nascimento,
            email: aluno.email,
            telefone: aluno.telefone,
          };
        });

        return reply.status(200).send(alunos);
      } catch (error) {
        console.error("Erro ao buscar alunos:", error);
        return reply.status(500).send({ message: "Internal Server Error" });
      }
    }
  );

  app.post(
    "",
    {
      schema: {
        tags: ["Alunos"],
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
        await alunosController.createAluno(aluno);
        return reply.status(201).send({ status: "success" });
      } catch (error) {
        console.error("Erro ao criar aluno:", error);
        return reply.status(500).send({ message: "Internal Server Error" });
      }
    }
  );
  
}

