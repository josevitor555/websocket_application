# Sistema de Chat em Tempo Real com WebSocket

Este é um sistema completo de chat em tempo real com backend em Node.js e frontend em React, utilizando WebSocket (Socket.IO) para comunicação em tempo real e integração com Supabase para autenticação e banco de dados. O sistema oferece integração com diversas LLMs (Large Language Models) distribuídas entre diferentes provedores, permitindo aos usuários acessar uma ampla variedade de modelos conforme seu plano de assinatura.

> [!Note]
> Observação: Embora o sistema suporte diversos modelos de IA conforme detalhado na seção "Modelos de Linguagem Disponíveis", o modelo Gemma é utilizado como padrão para testes iniciais devido às restrições de quota de outros provedores. A arquitetura foi projetada para facilitar a integração de novos modelos conforme a evolução do projeto.

> [!Warning]
> Observação: O sistema de debate e o modo criativo ainda estão em desenvolvimento e algumas funcionalidades do MVP podem não estar completamente implementadas. Os recursos estão sendo desenvolvidos gradualmente com foco inicial na funcionalidade básica de chat com LLMs. Novas funcionalidades serão adicionadas em atualizações futuras.

---

## Estrutura do Projeto

```
websocket/
├── backend/                 # Backend do sistema de chat
│   ├── controllers/         # Lógica da aplicação
│   ├── db/                  # Configuração do banco de dados
│   ├── middleware/          # Interceptadores de requisição
│   ├── model/               # Definição da estrutura dos dados
│   ├── route/               # Definição dos caminhos da API
│   ├── services/            # Serviços externos (ex: integração com LLMs)
│   ├── utils/               # Funções auxiliares reutilizáveis
│   ├── public/              # Arquivos públicos
│   ├── server.js            # Arquivo principal do servidor
│   └── README.md            # Documentação do backend
├── ws_react/                # Frontend do sistema de chat
│   ├── src/                 # Código-fonte do frontend
│   ├── supabase/            # Configurações do Supabase
│   ├── public/              # Arquivos estáticos
│   └── README.md            # Documentação do frontend
└── README.md                # Documentação principal do projeto
```

## Tecnologias Utilizadas

### Backend
- **Node.js** com **Express** para o servidor HTTP
- **Socket.IO** para comunicação em tempo real via WebSocket
- **Supabase** para autenticação e banco de dados
- **ES6 Modules** para organização do código

### Frontend
- **React** com **TypeScript** para construção da interface
- **Vite** como bundler e servidor de desenvolvimento
- **Tailwind CSS** para estilização
- **Socket.IO Client** para comunicação em tempo real
- **Lucide React** para ícones

## Funcionalidades Principais

### Chat em Tempo Real
- Envio e recebimento de mensagens instantâneas entre usuários
- Indicador de digitação ("usuário está digitando...")
- Lista de usuários online em tempo real
- Histórico de mensagens

### Autenticação
- Login de usuários com nome de usuário e nome de exibição
- Gerenciamento de sessões com tokens
- Armazenamento local de credenciais

### Integração com LLM
- Suporte à integração com modelos de linguagem (como Gemini)
- Interface para interagir com assistentes virtuais

### Modelos de Linguagem Disponíveis

O sistema oferece suporte a diversos modelos de linguagem distribuídos em diferentes provedores. Os modelos disponíveis variam conforme o plano de assinatura:

#### Plano Free

**Google:**
- gemma-3-1b-it
- gemini-1.5-flash
- gemini-2.5-flash

**Open AI:**
- GPT-5

**Anthropic:**
- Claude Opus 4.1

#### Plano PRO

**Google:**
- gemini-1.5-flash
- gemini-2.5-flash
- gemini-2.5-flash Image (Nano Banana)
- gemini-2.5-pro
- gemini-3-pro
- gemma-3-1b-it
- Google Veo 3.1

**Open AI:**
- GPT-4.1
- GPT 4o
- GPT-5
- GPT o4 mini
- GPT 5 Nano
- GPT 5 Pro
- Sora 2

**XAI:**
- Grok 4 Fast Reasoning
- Grok 4 Fast Non Reasoning
- Grok Code Fast 1
- Grok-4
- Grok-3
- Grok 3 Mini
- Grok 2 Image 1212

**Anthropic:**
- Claude Opus 4.1
- Claude Sonnet 4.5
- Claude Haiku 4.5

## Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn
- Conta no Supabase
- Chave de API do Google AI (para integração com Gemini, se necessário)

## Configuração Inicial

### Backend

1. Navegue até o diretório do backend:
   ```bash
   cd backend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente no arquivo `.env`:
   - `SUPABASE_URL`: URL do seu projeto Supabase
   - `SUPABASE_SERVICE_ROLE_KEY`: Chave de serviço do Supabase
   - `GOOGLE_AI_API_KEY`: Chave de API do Google AI (para integração com seus modelos)

4. Inicie o servidor:
   ```bash
   npm run dev
   ```

### Frontend

1. Navegue até o diretório do frontend:
   ```bash
   cd ws_react
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente no arquivo `.env`:
   - `VITE_SUPABASE_URL`: URL do seu projeto Supabase
   - `VITE_SUPABASE_ANON_KEY`: Chave pública do Supabase
   - `VITE_BACKEND_URL`: URL do backend (padrão: http://localhost:3001)

4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

## Documentação Detalhada

Para informações mais detalhadas sobre cada componente do sistema, consulte os READMEs específicos:

- [Documentação do Backend](backend/README.md)
- [Documentação do Frontend](ws_react/README.md)

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto é para o Centelha.