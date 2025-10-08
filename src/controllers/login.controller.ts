import { connectAlunos } from "../repositories/aluno.repositories";
import * as bcrypt from 'bcrypt';
import { VarChar, NVarChar } from 'mssql';
import { AppDataSource } from "../data-source";
import { Login } from "../entity/login";

export class LoginController {

  /**
   * Verifica se um e-mail já existe no banco de dados.
   * @param email - O e-mail a ser verificado.
   * @returns `true` se o e-mail existir, `false` caso contrário.
   */
  private async emailExists(email: string): Promise<boolean> {
    const conn = await connectAlunos();
    const result = await conn.request()
      .input('email', VarChar, email)
      .query('SELECT email FROM login WHERE email = @email');
    return result.recordset.length > 0;
  }

  /**
   * Cria um novo login se o e-mail não existir.
   * @param email - O e-mail do novo usuário.
   * @param password - A senha do novo usuário.
   * @returns Objeto indicando sucesso ou falha.
   */
  async createLogin(email: string, password: string): Promise<{ success: boolean; message: string }> {
    try {
      if (await this.emailExists(email)) {
        return { success: false, message: 'Este e-mail já está cadastrado.' };
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const conn = await connectAlunos();
      await conn.request()
        .input('email', VarChar, email)
        .input('password', NVarChar, hashedPassword)
        .query('INSERT INTO login (email, password) VALUES (@email, @password)');

      return { success: true, message: 'Usuário criado com sucesso!' };

    } catch (erro) {
      console.error("Erro ao criar login:", erro);
      return { success: false, message: 'Ocorreu um erro no servidor.' };
    }
  }

  /**
   * Valida as credenciais de um usuário.
   * Se forem válidas, retorna os dados do usuário.
   * @param email - O e-mail fornecido.
   * @param password - A senha fornecida.
   * @returns O objeto do usuário se as credenciais forem válidas, caso contrário, null.
   */
  async validateLogin(email: string, password: string): Promise<{ email: string } | null> {
    try {
      const conn = await connectAlunos();
      const resultado = await conn.request()
        .input('email', VarChar, email)
        .query('SELECT email, password FROM login WHERE email = @email');

      if (resultado.recordset.length === 0) {
        return null; // Usuário não encontrado
      }

      const user = resultado.recordset[0];
      const match = await bcrypt.compare(password, user.password);

      if (match) {
        return { email: user.email }; // Senha correta, retorna dados do usuário
      } else {
        return null; // Senha incorreta
      }

    } catch (erro) {
      console.error("Erro ao validar login:", erro);
      return null;
    }
  }

  /**
   * Atualiza o token JWT de um usuário no banco de dados,
   * apenas se o usuário ainda não possuir um token ativo.
   * @param email - O e-mail do usuário a ser atualizado.
   * @param token - O novo token JWT, ou null para remover.
   */
  async updateUserToken(email: string, token: string | null): Promise<void> {
    try {
      const loginRepository = AppDataSource.getRepository(Login);

      // Busca o usuário pelo e-mail
      const user = await loginRepository.findOneBy({ email });

      // Se já tiver token e não for logout, não atualiza
      if (user?.token && token !== null) {
        console.log("Token já existente, atualização automática bloqueada.");
        return;
      }

      // Se for logout (token = null) ou novo token inicial, atualiza
      await loginRepository.update({ email }, { token });

    } catch (error) {
      console.error("Erro ao atualizar o token do usuário:", error);
      throw new Error("Não foi possível atualizar o token.");
    }
  }

  /**
   * Encontra um usuário pelo seu token JWT.
   * @param token - O token a ser verificado no banco de dados.
   * @returns O objeto do usuário se o token for encontrado, caso contrário, null.
   */
  async findUserByToken(token: string): Promise<{ email: string } | null> {
    try {
      const conn = await connectAlunos();

      const resultado = await conn.request()
        .query("SELECT email FROM login WHERE token = '" + token + "'");

      if (resultado.recordset.length > 0) {
        const user = resultado.recordset[0];
        return { email: user.email };
      }

      return null;
    } catch (error) {
      console.error("Erro ao buscar usuário pelo token:", error);
      return null;
    }
  }
}
