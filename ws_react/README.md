# Frontend do Chat em Tempo Real

Este é o frontend do sistema de chat em tempo real construído com React, TypeScript e Vite, integrado com o backend Node.js e Supabase.

## Estrutura do Projeto

```
ws_react/
├── src/
│   ├── components/     # Componentes React reutilizáveis
│   ├── hooks/          # Hooks personalizados
│   ├── lib/            # Configurações e clientes de API
│   ├── types/          # Definições de tipos TypeScript
│   ├── App.tsx         # Componente principal da aplicação
│   ├── main.tsx        # Ponto de entrada da aplicação
│   └── index.css       # Estilos globais
├── supabase/           # Configurações do Supabase
│   ├── functions/      # Funções serverless (Deno)
│   └── migrations/     # Scripts de migração do banco de dados
├── public/             # Arquivos estáticos
├── index.html          # Arquivo HTML principal
├── package.json        # Dependências e scripts
├── tsconfig.json       # Configuração do TypeScript
├── vite.config.ts      # Configuração do Vite
└── README.md           # Documentação
```

## Tecnologias Utilizadas

- **React** com **TypeScript** para construção da interface
- **Vite** como bundler e servidor de desenvolvimento
- **Tailwind CSS** para estilização
- **Socket.IO Client** para comunicação em tempo real
- **Supabase** para autenticação e banco de dados
- **Lucide React** para ícones

## Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento
- `npm run build`: Compila o projeto para produção
- `npm run preview`: Visualiza a build de produção localmente

## Configuração

1. Instale as dependências:
   ```
   npm install
   ```

2. Configure as variáveis de ambiente no arquivo `.env`:
   - `VITE_SUPABASE_URL`: URL do seu projeto Supabase
   - `VITE_SUPABASE_ANON_KEY`: Chave pública do Supabase
   - `VITE_BACKEND_URL`: URL do backend (padrão: http://localhost:3001)

3. Inicie o servidor de desenvolvimento:
   ```
   npm run dev
   ```

## Funcionalidades

### Autenticação
- Login de usuários com nome de usuário e nome de exibição
- Gerenciamento de sessões com tokens
- Armazenamento local de credenciais

### Chat em Tempo Real
- Envio e recebimento de mensagens instantâneas
- Indicador de digitação ("usuário está digitando...")
- Lista de usuários online em tempo real

### Componentes Principais

#### LoginForm
Componente de autenticação que permite aos usuários fazer login no chat.

#### ChatMessage
Componente que exibe mensagens individuais com informações do remetente.

#### UserList
Lista de usuários online com status de conexão.

#### ChatInput
Campo de entrada para envio de mensagens com suporte a indicador de digitação.

#### ConnectionStatus
Indicador visual do status da conexão WebSocket.

## Integração com Backend

O frontend se comunica com o backend através de uma API RESTful e WebSockets:

### Endpoints da API
- `POST /api/auth/login`: Autenticação de usuários
- `POST /api/auth/logout`: Logout de usuários
- `GET /api/users/online`: Lista de usuários online
- `GET /api/messages/history`: Histórico de mensagens

### WebSocket
- Conexão em tempo real para envio/recebimento de mensagens
- Eventos para indicador de digitação
- Atualizações em tempo real da lista de usuários

## Hooks Personalizados

### useAuth
Gerencia o estado de autenticação do usuário, incluindo login, logout e persistência de sessão.

### useWebSocket
Gerencia a conexão WebSocket com o servidor, incluindo reconexão automática e tratamento de eventos.

## Tipos TypeScript

O projeto utiliza tipos TypeScript fortemente tipados para garantir segurança e autocomplete:

- `ChatUser`: Representa um usuário do chat
- `ChatMessage`: Representa uma mensagem no chat
- `ChatSession`: Representa uma sessão de usuário

## Estilização

O projeto utiliza Tailwind CSS com uma paleta de cores escura personalizada, seguindo o design moderno de aplicações de chat.