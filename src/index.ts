import { fastify } from "fastify";
import { fastifyCors } from "@fastify/cors";
import {
  validatorCompiler,
  serializerCompiler,
  ZodTypeProvider,
  jsonSchemaTransform,
} from "fastify-type-provider-zod";
import { fastifySwagger } from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { routes } from "./routes/texto.route";
import { routes_alunos } from "./routes/alunos.route";
import { AppDataSource } from "./data-source";
import 'reflect-metadata'; 
import { routes_funcionarios } from "./routes/funcionarios.route";
import { authenticate, routes_login } from "./routes/login.routes";


const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);


app.register(fastifyCors, {
  origin: "*",
});

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Teste API",
      description: "Documentação gerada automaticamente com Zod + Fastify",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  transform: jsonSchemaTransform,
});


app.register(fastifySwaggerUi, {
  routePrefix: "/docs",
});

app.register(routes, {
  prefix: "/texto",
});

app.register(routes_alunos, {
  prefix: "/alunos",
});

app.register(routes_funcionarios, {
  prefix: "/funcionarios",
  
});

app.register(routes_login,{
  prefix: "/auth",
   secret: 'uma-chave-secreta-muito-longa-e-dificil-de-adivinhar-com-pelo-menos-32-caracteres',
  cookie: {
    secure: false, // Em produção, mude para 'true' se usar HTTPS
    maxAge: 86400000 // Tempo de vida do cookie em milissegundos (24 horas)
  }
})




app
  .listen({ host: '0.0.0.0', port: 3000 })
  .then((address) => {
    console.log(`Server listening at ${address}`);
    
    AppDataSource.initialize()
      .then(() => console.log("Conectado o ao Entity Server!"))
      .catch((err) => console.error("Erro ao conectar ao Entity Server:", err));

  })
  .catch((err) => {
    console.error(`Error starting server: ${err}`);
  });


/* 
CODIGOS UTILIZADOS

Gera automaticamente uma migration com base nas diferenças entre suas entidades e o banco de dados atual.
npx ts-node ./node_modules/typeorm/cli.js migration:generate src/migration/CriaAluno -d src/data-source.ts

Executa todas as migrations pendentes (que ainda não foram aplicadas) no banco de dados.
npx ts-node ./node_modules/typeorm/cli.js migration:run -d src/data-source.ts

Desfaz (rollback) a última migration executada no banco de dados.
npx ts-node ./node_modules/typeorm/cli.js migration:revert -d src/data-source.ts

Mostra uma lista de migrations ainda não executadas no banco.
npx ts-node ./node_modules/typeorm/cli.js migration:show -d src/data-source.ts

Cria um arquivo de migration vazio. Ideal para escrever manualmente os comandos up e down.
npx ts-node ./node_modules/typeorm/cli.js migration:create src/migration/NomeMigration

*/