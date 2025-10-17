# Backend do Chat em Tempo Real

Este é o backend do sistema de chat em tempo real utilizando WebSocket com Socket.IO e integração com Supabase, seguindo uma arquitetura modular e usando módulos ES6.

## Estrutura do Projeto

```
backend/
├── controllers/       # Lógica da aplicação
├── db/               # Configuração do banco de dados
├── middleware/       # Interceptadores de requisição
├── model/            # Definição da estrutura dos dados
├── route/            # Definição dos caminhos da API
├── utils/            # Funções auxiliares reutilizáveis
├── public/           # Arquivos públicos
│   └── temp/         # Arquivos temporários
├── server.js         # Arquivo principal do servidor
├── constant.js       # Valores constantes da aplicação
├── package.json      # Dependências e scripts
├── package-lock.json # Versões exatas das dependências
├── .env             # Variáveis de ambiente
├── .gitkeep         # Arquivo para manter pastas vazias no Git
└── README.md        # Documentação
```

## Arquitetura

### controllers/
O cérebro das requisições. Recebe o pedido (req), fala com o model, trata os dados e devolve a resposta (res). É onde mora a lógica da aplicação.

### db/
Lugar onde você conecta o banco de dados. Contém o script de conexão com o Supabase e helpers de query.

### middleware/
Interceptadores de requisição. Servem pra autenticação, logs, validação de tokens, limitar requisições, ou qualquer coisa que precise acontecer antes de chegar no controller.

### model/
Define a estrutura dos dados e interage com o banco de dados Supabase.

### route/
Define os caminhos da API: tipo /users, /login, /products. Cada rota aponta pra um controller específico.

### utils/
O depósito de "funções mágicas" que você reaproveita por todo lado. Coisas tipo formatar datas, gerar tokens, validar dados, etc.

### constant.js
Armazena valores fixos (mensagens padrão, códigos de erro, etc.). Serve pra não espalhar "strings mágicas" pelo código.

### server.js
O arquivo principal do servidor: levanta o Express, carrega os middlewares, conecta o banco e sobe o app.

### .env
Guarda as variáveis sensíveis (como senhas e chaves de API).

### public/temp/
Pasta pública pra arquivos temporários (upload, cache, imagens transitórias).

## Dependências Instaladas

- **express**: Framework web para Node.js
- **socket.io**: Biblioteca para comunicação em tempo real via WebSocket
- **cors**: Middleware para habilitar CORS
- **dotenv**: Carregamento de variáveis de ambiente
- **nodemon**: Ferramenta para reiniciar automaticamente o servidor durante o desenvolvimento
- **@supabase/supabase-js**: Cliente JavaScript oficial do Supabase

## Scripts Disponíveis

- `npm start`: Inicia o servidor em modo produção
- `npm run dev`: Inicia o servidor em modo desenvolvimento com nodemon

## Configuração

1. Certifique-se de que todas as dependências estão instaladas:
   ```
   npm install
   ```

2. Configure as variáveis de ambiente no arquivo `.env`:
   - `SUPABASE_URL`: URL do seu projeto Supabase
   - `SUPABASE_SERVICE_ROLE_KEY`: Chave de serviço do Supabase (não compartilhe publicamente)

3. Inicie o servidor:
   ```
   npm run dev
   ```

## Endpoints REST API

### Autenticação
- `POST /api/auth/login`: Login de usuário
  - Body: `{ username, displayName }`
  - Response: `{ user, sessionToken }`

- `POST /api/auth/logout`: Logout de usuário
  - Body: `{ userId, sessionToken }`
  - Response: `{ message: 'Logout successful' }`

### Usuários
- `GET /api/users/online`: Lista de usuários online
  - Response: Array de usuários

- `GET /api/users/:id`: Obter usuário por ID
  - Response: Objeto do usuário

### Mensagens
- `GET /api/messages/history`: Histórico de mensagens
  - Query: `limit` (opcional, padrão 100)
  - Response: Array de mensagens

- `POST /api/messages`: Criar nova mensagem
  - Body: `{ userId, message }`
  - Response: Objeto da mensagem criada

### Health Check
- `GET /api/health`: Verificação de status do servidor
  - Response: `{ status: 'OK', timestamp, message }`

## Eventos do Socket.IO

### Eventos Recebidos (do cliente para o servidor)
- `authenticate`: Autenticação do WebSocket
  - Data: `{ sessionToken, userId }`

- `send_message`: Envio de mensagem
  - Data: `{ message }`

- `typing`: Indicação de digitação
  - Data: `{ isTyping }`

### Eventos Emitidos (do servidor para o cliente)
- `authenticated`: Confirmação de autenticação
  - Data: `{ userId, sessionToken }`

- `auth_error`: Erro de autenticação
  - Data: `{ message }`

- `users_updated`: Lista atualizada de usuários online
  - Data: Array de usuários

- `new_message`: Nova mensagem recebida
  - Data: Objeto da mensagem com dados do usuário

- `user_typing`: Indicação de que um usuário está digitando
  - Data: `{ userId, isTyping }`

- `message_error`: Erro no processamento de mensagem
  - Data: `{ message }`

## Estrutura de Dados

### Usuário
```javascript
{
  id: string,
  username: string,
  display_name: string,
  is_online: boolean,
  last_seen: string,
  created_at: string
}
```

### Mensagem
```javascript
{
  id: string,
  user_id: string,
  message: string,
  created_at: string,
  chat_users: User // dados do usuário que enviou
}
```

### Sessão
```javascript
{
  id: string,
  user_id: string,
  session_token: string,
  connected_at: string,
  last_activity: string
}
```