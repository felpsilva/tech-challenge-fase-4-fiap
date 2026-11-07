# Blog Educacional

Aplicativo mobile de um blog educacional, desenvolvido com Expo, React Native, TypeScript e Expo Router.

## Funcionalidades

- Consulta pública de posts;
- Busca de posts;
- Autenticação de usuários;
- Criação, edição e exclusão de posts;
- CRUD de categorias;
- CRUD de usuários;
- Gerenciamento de alunos e professores por meio do campo `permission`.

## Integração com a API

A camada de integração está organizada em `Blog-Educacional/src/services` e `Blog-Educacional/src/lib`:

- `authService` autentica usuários em `/user/signin`;
- `postService` implementa leitura, busca, criação, edição e exclusão de posts;
- `categoryService` implementa o CRUD de categorias;
- `userService` implementa o CRUD de usuários;
- `useAuth` disponibiliza a sessão persistida e as permissões da conta.

Por padrão, o aplicativo usa a API publicada em `https://blog-educacional-backend-1.onrender.com`. Para apontar para outra instância, crie o arquivo `Blog-Educacional/.env` com base em `Blog-Educacional/.env.example`:

```env
EXPO_PUBLIC_API_URL=https://sua-api.example.com
```

Posts podem ser consultados sem autenticação. A API autoriza alterações de posts e o CRUD de categorias para `admin` e `professor`. O CRUD de usuários fica restrito a `admin`. Essa regra também está disponível no contexto de autenticação por meio de `canManageContent` e `canManageUsers`, mas a validação definitiva continua sendo feita pelo backend.

## Guia de uso da API

### URL base

A URL base padrão é:

```text
https://blog-educacional-backend-1.onrender.com
```

Para usar outra instância, defina `EXPO_PUBLIC_API_URL` no arquivo
`Blog-Educacional/.env`.

### Autenticação

Faça login pelo endpoint abaixo:

```bash
curl -X POST "https://blog-educacional-backend-1.onrender.com/user/signin" \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"professor1\",\"password\":\"prof123\"}"
```

A resposta contém um token JWT:

```json
{
  "token": "seu-token-jwt"
}
```

Nas requisições protegidas, envie o token no cabeçalho `Authorization`:

```text
Authorization: Bearer <TOKEN_JWT>
```

### Posts

| Método | Endpoint | Autenticação | Descrição |
| --- | --- | --- | --- |
| `GET` | `/post` | Não | Lista os posts |
| `GET` | `/post/search?q=termo` | Não | Busca posts |
| `GET` | `/post/{id}` | Não | Consulta um post |
| `POST` | `/post` | Sim | Cria um post |
| `PUT` | `/post/{id}` | Sim | Atualiza um post |
| `DELETE` | `/post/{id}` | Sim | Exclui um post |
| `POST` | `/post/{id}/thumbnail` | Sim | Envia a imagem de capa |
| `GET` | `/post/{id}/thumbnail` | Não | Consulta a imagem de capa |

Exemplo de criação de post:

```bash
curl -X POST "https://blog-educacional-backend-1.onrender.com/post" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN_JWT>" \
  -d "{\"user_id\":1,\"title\":\"Introdução à programação\",\"slug\":\"introducao-a-programacao\",\"content\":\"Conteúdo do post\",\"status\":\"published\",\"categories\":[{\"id\":1}]}"
```

### Categorias

| Método | Endpoint | Descrição |
| --- | --- | --- |
| `GET` | `/category` | Lista as categorias |
| `GET` | `/category/{id}` | Consulta uma categoria |
| `POST` | `/category` | Cria uma categoria |
| `PUT` | `/category/{id}` | Atualiza uma categoria |
| `DELETE` | `/category/{id}` | Exclui uma categoria |

Exemplo de criação de categoria:

```bash
curl -X POST "https://blog-educacional-backend-1.onrender.com/category" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN_JWT>" \
  -d "{\"name\":\"Programação\",\"slug\":\"programacao\"}"
```

### Usuários

O gerenciamento de usuários é restrito a contas com permissão `admin`.

| Método | Endpoint | Descrição |
| --- | --- | --- |
| `GET` | `/user` | Lista os usuários |
| `GET` | `/user/{id}` | Consulta um usuário |
| `POST` | `/user` | Cria um usuário |
| `PUT` | `/user/{id}` | Atualiza um usuário |
| `DELETE` | `/user/{id}` | Exclui um usuário |

Exemplo de criação de usuário:

```bash
curl -X POST "https://blog-educacional-backend-1.onrender.com/user" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN_JWT>" \
  -d "{\"username\":\"novo-usuario\",\"password\":\"senha-de-teste\",\"permission\":\"aluno\"}"
```

### Contas para demonstração

As contas abaixo são dados de demonstração para testar os fluxos do aplicativo:

| Perfil | Usuário | Senha | Permissão |
| --- | --- | --- | --- |
| Professor | `professor1` | `prof123` | `professor` |
| Aluno | `aluno1` | `aluno123` | `aluno` |

O professor pode testar a criação e a edição de posts e categorias. O aluno pode
acessar os conteúdos públicos, mas não possui permissão para gerenciar conteúdo.
Essas credenciais não devem ser utilizadas em ambientes de produção.

## Pré-requisitos

- Node.js;
- npm;
- Um ambiente compatível com Expo para executar o aplicativo, como Expo Go, um emulador Android ou um simulador iOS.

## Como executar

Entre na pasta do aplicativo e instale as dependências:

```bash
cd Blog-Educacional
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npx expo start
```

No terminal, escolha uma das opções disponíveis:

- `a` para abrir no emulador Android;
- `i` para abrir no simulador iOS;
- `w` para abrir no navegador;
- leitura do QR Code pelo Expo Go em um dispositivo físico.

Comece a desenvolver editando os arquivos dentro de `Blog-Educacional/src/app`. O projeto usa roteamento baseado em arquivos com Expo Router.

## Scripts disponíveis

Execute os comandos a partir de `Blog-Educacional`:

| Comando | Descrição |
| --- | --- |
| `npm start` | Inicia o servidor de desenvolvimento do Expo |
| `npm run android` | Inicia o aplicativo no Android |
| `npm run ios` | Inicia o aplicativo no iOS |
| `npm run web` | Inicia o aplicativo na web |
| `npm run lint` | Executa o ESLint |
| `npm run reset-project` | Move o código inicial para `example` e recria `src/app` |

## Estrutura principal

```text
Blog-Educacional/
├── assets/       # Imagens e ícones
├── src/app/      # Telas e rotas do aplicativo
├── src/components/
├── src/context/  # Contextos compartilhados, como autenticação
├── src/hooks/
├── src/lib/      # Cliente HTTP e persistência de sessão
├── src/services/ # Integrações com a API
└── src/types/    # Tipos compartilhados
```

## Documentação

- [Documentação do Expo](https://docs.expo.dev/)
- [Tutorial do Expo](https://docs.expo.dev/tutorial/introduction/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [Configuração do TypeScript no Expo](https://docs.expo.dev/guides/typescript/)
