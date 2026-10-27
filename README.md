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
