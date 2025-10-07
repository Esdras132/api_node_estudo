import { connectAlunos } from "../repositories/aluno.repositories";
import * as bcrypt from 'bcrypt';
import { VarChar, NVarChar } from 'mssql'; // Importe os tipos do mssql

export class LoginController {

  /**
   * Cria um novo login se o e-mail não existir no banco de dados.
   * A senha é armazenada de forma segura usando hashing.
   * @param email - O e-mail do novo usuário.
   * @param password - A senha do novo usuário.
   * @returns Um objeto indicando sucesso ou falha com uma mensagem.
   */
  async createLogin(email: string, password: string): Promise<{ success: boolean; message: string }> {
    try {
      const conn = await connectAlunos();

      // 1. Verifica se o e-mail já existe (usando parâmetros para segurança)
      const existingUser = await conn.request()
        .input('email', VarChar, email)
        .query('SELECT email FROM login WHERE email = @email');

      if (existingUser.recordset.length > 0) {
        return { success: false, message: 'Este e-mail já está cadastrado.' };
      }

      // 2. Cria o hash da senha
      const saltRounds = 10; // Fator de custo para o hashing
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // 3. Insere o novo usuário no banco de dados com a senha hasheada
      await conn.request()
        .input('email', VarChar, email)
        .input('password', NVarChar, hashedPassword) // NVarChar é melhor para hashes
        .query('INSERT INTO login (email, password) VALUES (@email, @password)');

      return { success: true, message: 'Usuário criado com sucesso!' };

    } catch (erro) {
      console.error("Erro ao criar login:", erro);
      return { success: false, message: 'Ocorreu um erro no servidor.' };
    }
  }

  /**
   * Valida as credenciais de um usuário de forma segura.
   * @param email - O e-mail fornecido para login.
   * @param password - A senha fornecida para login.
   * @returns `true` se as credenciais forem válidas, `false` caso contrário.
   */
  async validateLogin(email: string, password: string): Promise<boolean> {
    try {
      const conn = await connectAlunos();

      // 1. Busca o usuário pelo e-mail (forma segura com parâmetros)
      const resultado = await conn.request()
        .input('email', VarChar, email)
        .query('SELECT password FROM login WHERE email = @email');

      // Se nenhum usuário for encontrado, o login falha
      if (resultado.recordset.length === 0) {
        return false;
      }

      const hashedPassword = resultado.recordset[0].password;

      // 2. Compara a senha fornecida com o hash armazenado no banco
      const match = await bcrypt.compare(password, hashedPassword);

      return match; // Retorna true se a senha corresponder, false caso contrário

    } catch (erro) {
      console.error("Erro ao validar login:", erro);
      return false;
    }
  }
}