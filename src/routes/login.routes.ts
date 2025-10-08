import { FastifyTypedInstance } from "../types";
import { z } from "zod";
import jwt from 'jsonwebtoken';
import { FastifyRequest, FastifyReply } from 'fastify';
import { connectAlunos } from "../repositories/aluno.repositories";
import { VarChar } from "mssql";
import { LoginController } from "../controllers/login.controller";


declare module 'fastify' {
  interface FastifyRequest {
    user?: { email: string };
  }
}
export async function authenticate(request: FastifyRequest, reply: FastifyReply) {

  const publicRoutes = ['/login', '/register', '/docs'];


  const rawUrl = request.url || '';
  const routerPath = (request as any).routerPath || null;
  const rawReqUrl = (request.raw && (request.raw as any).url) ? (request.raw as any).url : null;
  const candidates = [rawUrl, routerPath, rawReqUrl].filter(Boolean).map(p => String(p).split('?')[0]);


  console.log('[AUTH] request candidates:', candidates);


  const isPublic = candidates.some(p =>
    publicRoutes.some(route => p === route || p.endsWith(route))
  );

  if (isPublic) {
    console.log('[AUTH] rota pública detectada. Liberando sem autenticação.');
    return;
  }


  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.status(401).send({ message: "Token de autenticação não fornecido ou em formato inválido." });
  }

  const token = authHeader.slice(7);

  try {

    const conn = await connectAlunos();
    const dbTokenResult = await conn.request()
      .input('token', VarChar, token)
      .query('SELECT token, email FROM login WHERE token = @token');

    if (dbTokenResult.recordset.length === 0) {
      console.log('[AUTH] token não encontrado no DB');
      return reply.status(401).send({ message: "Token inválido." });
    }

    const dbRow = dbTokenResult.recordset[0];


    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('[AUTH] JWT_SECRET não configurado');
      return reply.status(500).send({ message: "Erro no servidor (JWT não configurado)." });
    }

    let decoded: any = null;
    try {
      decoded = jwt.verify(token, secret) as { email: string };
    } catch (err) {
      console.log('[AUTH] token inválido/expirado segundo jwt.verify()', err);
      return reply.status(401).send({ message: "Token de autenticação inválido ou expirado." });
    }


    if (!decoded?.email || decoded.email !== dbRow.email) {
      console.log('[AUTH] payload do token não bate com o email do DB');
      return reply.status(401).send({ message: "Token inválido." });
    }


    request.user = { email: decoded.email };
    return;
  } catch (error) {
    console.error('[AUTH] erro ao validar token:', error);
    return reply.status(401).send({ message: "Token de autenticação inválido ou expirado." });
  }
}

export async function routes_login(app: FastifyTypedInstance) {
  const loginController = new LoginController();


  app.addHook('preHandler', authenticate);


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
          201: z.object({ message: z.string() }),
          400: z.object({ message: z.string() }),
          500: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      try {
        const { email, password } = request.body as any;
        const result = await loginController.createLogin(email, password);

        if (result.success) return reply.status(201).send({ message: result.message });
        return reply.status(400).send({ message: result.message });
      } catch (error) {
        console.error("Erro na rota de registro:", error);
        return reply.status(500).send({ message: "Erro interno no servidor." });
      }
    }
  );


  app.post(
    "/login",
    {
      schema: {
        tags: ["Autenticação"],
        description: "Autentica um usuário. Se houver token válido no DB, retorna-o; caso contrário gera novo token.",
        body: z.object({
          email: z.string().email(),
          password: z.string(),
        }),
        response: {
          200: z.object({ token: z.string() }),
          401: z.object({ message: z.string() }),
          500: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      try {
        const { email, password } = request.body as any;
        const user = await loginController.validateLogin(email, password);

        if (!user) {
          return reply.status(401).send({ message: "Email ou senha inválidos." });
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) throw new Error("Chave JWT_SECRET não configurada.");


        const conn = await connectAlunos();
        const tokenRow = await conn.request()
          .input('email', VarChar, email)
          .query('SELECT token FROM login WHERE email = @email');

        const existingToken = tokenRow.recordset.length ? tokenRow.recordset[0].token : null;


        if (existingToken) {
          try {
            jwt.verify(existingToken, secret);
            console.log("[LOGIN] token existente é válido -> retornando token sem atualizar.");
            return reply.status(200).send({ token: existingToken });
          } catch (err) {

            console.log("[LOGIN] token existente expirado/inválido, gerando novo.");
          }
        }


        const payload = { email: user.email };
        const newToken = jwt.sign(payload, secret, { expiresIn: '1h' });


        await conn.request()
          .input('token', VarChar, newToken)
          .input('email', VarChar, email)
          .query('UPDATE login SET token = @token WHERE email = @email');

        return reply.status(200).send({ token: newToken });
      } catch (error) {
        console.error("Erro na rota de login:", error);
        return reply.status(500).send({ message: "Erro interno no servidor." });
      }
    }
  );


  app.post(
    "/logout",
    {
      schema: {
        tags: ["Autenticação"],
        description: "Invalida o token atual do usuário, removendo-o do banco de dados.",
        response: {
          200: z.object({ message: z.string() }),
          401: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const userEmail = request.user?.email;
      if (!userEmail) return reply.status(401).send({ message: "Não autenticado." });

      await loginController.updateUserToken(userEmail, null);
      return reply.status(200).send({ message: "Logout realizado com sucesso." });
    }
  );


  app.get(
    "/validator",
    {
      schema: {
        tags: ["Autenticação"],
        description: "Verifica se o token de autenticação fornecido no header é válido e corresponde ao do banco.",
        security: [{ bearerAuth: [] }],
        response: {
          200: z.object({ message: z.string(), email: z.string() }),
          401: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      return reply.status(200).send({
        message: "Token é válido.",
        email: request.user!.email
      });
    }
  );
}
