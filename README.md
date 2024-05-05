# backend em nest

este é o backend desenvolvida com NestJS e TypeScript, utilizando TypeORM para gerenciamento de banco de dados e autenticação via JWT. A segurança dos dados é garantida com bcrypt. Inclui migrations para estruturação do banco de dados e seeding para criação de roles e usuários iniciais, incluindo um usuário master.

## Funcionalidades Principais
- criação de token
- Cadastro, visualização, edição e exclusão de usuários.

## Instruções de Uso

1. Clone o repositório.
2. Instale as dependências usando o comando `yarn start` ou `npm start`.

## Links

- [Link api online](https://api-user-management-vert.vercel.app/api/v1)

# criar usuário

    POST BaseURL/users

    Exemplo Payload: {
        "name": "user",
        "lastName": "user1",
        "email": "user@email.com",
        "password": "12345678",
        "roleId": "roleId"
    }

# atualizar usuário
    PUT BaseURL/users

    Exemplo Payload: {
        "id": "userId"
        "name": "NewName",
    }

# Listar usuários com exceção do usuário master
    GET BaseURL/users

# Buscar usuário pelo id
    GET BaseURL/users/:id

# Deletar usuário pelo id
    Deletar usuário pelo id

# Contagem de usuários ativos e desativados (todos e dividos por nível de acesso)

  GET BaseURL/users/count

# Listar níveis de acesso
      GET BaseURL/roles