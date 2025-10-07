import { LoginController } from "../controllers/login.controller"; // Ajuste o caminho se necessário
import { FastifyTypedInstance } from "../types"; // Ajuste o caminho se necessário
import { z } from "zod";

export async function routes_login(app: FastifyTypedInstance) {
  const loginController = new LoginController();

  // --- ROTA DE REGISTRO (CRIAÇÃO DE LOGIN) ---
  app.post(
    "/register",
    {
      schema: {
        tags: ["Autenticação"],
        description: "Registra um novo usuário no sistema.",
        body: z.object({
          email: z.string().email({ message: "Formato de e-mail inválido." }),
          password: z.string().min(6, { message: "A senha deve ter no mínimo 6 caracteres." }),
        }),
        response: {
          201: z.object({
            message: z.string().describe("Mensagem de sucesso."),
          }),
          400: z.object({
            message: z.string().describe("Mensagem de erro de validação ou e-mail duplicado."),
          }),
          500: z.object({
            message: z.string().describe("Erro interno do servidor."),
          }),
        },
      },
    },
    async (request, reply) => {
      try {
        const { email, password } = request.body;
        
        const result = await loginController.createLogin(email, password);

        if (result.success) {
          // 201 Created - Recurso criado com sucesso
          return reply.status(201).send({ message: result.message });
        } else {
          // 400 Bad Request - O cliente enviou dados inválidos (e-mail já existe)
          return reply.status(400).send({ message: result.message });
        }
      } catch (error) {
        console.error("Erro na rota de registro:", error);
        return reply.status(500).send({ message: "Erro interno no servidor." });
      }
    }
  );

  // --- ROTA DE LOGIN (AUTENTICAÇÃO) ---
  app.post(
    "/login",
    {
      schema: {
        tags: ["Autenticação"],
        description: "Autentica um usuário e, em um caso real, retornaria um token JWT.",
        body: z.object({
          email: z.string().email(),
          password: z.string(),
        }),
        response: {
          200: z.object({
            message: z.string().describe("Login bem-sucedido."),
            // Em uma aplicação real, você adicionaria o token aqui:
            // token: z.string().describe("Token de autenticação JWT")
          }),
          401: z.object({
            message: z.string().describe("Credenciais inválidas."),
          }),
          500: z.object({
            message: z.string().describe("Erro interno do servidor."),
          }),
        },
      },
    },
    async (request, reply) => {
      try {
        const { email, password } = request.body;
        const isValid = await loginController.validateLogin(email, password);

        if (isValid) {
          // 200 OK - Sucesso
          // Aqui é o local ideal para gerar e retornar um token JWT
          return reply.status(200).send({ message: "Login bem-sucedido!" });
        } else {
          // 401 Unauthorized - Credenciais incorretas
          return reply.status(401).send({ message: "Email ou senha inválidos." });
        }
      } catch (error) {
        console.error("Erro na rota de login:", error);
        return reply.status(500).send({ message: "Erro interno no servidor." });
      }
    }
  );
}
