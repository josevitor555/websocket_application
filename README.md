# Projeto de Chat em Tempo Real com WebSocket

## Visão Geral do Projeto

Este é um sistema de chat em tempo real completo com frontend em React/TypeScript e backend em Node.js, utilizando WebSockets para comunicação bidirecional instantânea. O projeto integra tecnologias modernas como Vite, Socket.IO, Supabase e Tailwind CSS para criar uma experiência de usuário fluida e responsiva.

### Requisitos Funcionais

1. **Autenticação de Usuários**
   - Login com nome de usuário e nome de exibição
   - Gerenciamento de sessões com tokens
   - Armazenamento local de credenciais

2. **Chat em Tempo Real**
   - Envio e recebimento instantâneo de mensagens
   - Indicador de digitação ("usuário está digitando...")
   - Lista de usuários online em tempo real

3. **Funcionalidades do Chat**
   - Histórico de mensagens
   - Status de conexão WebSocket
   - Reconexão automática em caso de falhas
   - Interface responsiva e moderna

### Requisitos Não Funcionais

1. **Desempenho**
   - Baixa latência nas mensagens (menos de 100ms)
   - Reconexão automática com até 10 tentativas
   - Interface responsiva com atualizações em tempo real

2. **Segurança**
   - Autenticação baseada em tokens
   - Validação de sessões no servidor
   - Proteção contra mensagens mal formadas

3. **Confiabilidade**
   - Tratamento de erros em todas as operações
   - Persistência de mensagens no banco de dados
   - Manutenção de status de usuários online/offline

4. **Usabilidade**
   - Interface intuitiva com design moderno
   - Feedback visual para ações do usuário
   - Indicadores claros de status de conexão

### Implementação dos WebSockets

#### 1. WebSocket do Vite (HMR - Hot Module Replacement)

O Vite utiliza seu próprio WebSocket na porta padrão do servidor de desenvolvimento (5173) para:
- Atualizações de módulo em tempo de desenvolvimento
- Recarregamento automático de componentes modificados
- Comunicação entre o servidor de desenvolvimento e o navegador

Este WebSocket opera exclusivamente para funcionalidades de desenvolvimento e não interfere no funcionamento da aplicação em produção.

#### 2. WebSocket do Chat (Comunicação em Tempo Real)

Implementado com Socket.IO tanto no frontend quanto no backend:

**Backend (Node.js + Socket.IO):**
- Servidor WebSocket rodando na porta 3001
- Autenticação de usuários via tokens de sessão
- Armazenamento em memória de usuários conectados
- Eventos para mensagens, digitação e status de usuários
- Integração com banco de dados Supabase para persistência

**Frontend (React + Socket.IO Client):**
- Conexão dedicada ao backend na porta 3001
- Tratamento de eventos de conexão/desconexão
- Interface em tempo real para mensagens e usuários
- Indicador de status de conexão com reconexão automática

### Coexistência dos WebSockets

Os dois WebSockets coexistem sem conflitos porque:
1. **Portas diferentes**: Vite HMR usa a porta 5173 e o chat usa a porta 3001
2. **Propósitos distintos**: Vite para desenvolvimento e chat para comunicação em tempo real
3. **Bibliotecas separadas**: Cada WebSocket usa sua própria implementação e contexto
4. **Escopos isolados**: Não compartilham namespaces ou eventos

Essa arquitetura permite desenvolver e executar a aplicação de chat com todas as vantagens do HMR do Vite sem interferir na funcionalidade principal de comunicação em tempo real.

### Hashtags

#ChatEmTempoReal #WebSocket #NodeJS #React #TypeScript #Vite #SocketIO #Supabase #DesenvolvimentoWeb #Programação #Frontend #Backend #AplicaçãoWeb #ComunicaçãoEmTempoReal #Tecnologia #DesenvolvimentoDeSoftware #WebDevelopment #JavaScript #FullStack #ProjetoDeChat #HMR #HotModuleReplacement #TailwindCSS #DesenvolvimentoFrontend #DesenvolvimentoBackend