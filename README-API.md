# API Backend - Lucro Claro

API REST construída com Express.js, TypeScript e Prisma, conectada ao banco PostgreSQL no Neon.

## 🚀 Início Rápido

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env` e configure:

```bash
cp .env.example .env
```

Edite o `.env` com suas configurações:

```env
DATABASE_URL="sua-url-do-neon"
JWT_SECRET="sua-chave-secreta-jwt"
PORT=3001
FRONTEND_URL="http://localhost:5173"
```

### 3. Gerar Prisma Client

```bash
npm run prisma:generate
```

### 4. Executar migrations

```bash
npm run prisma:migrate
```

### 5. Popular banco (opcional)

```bash
npm run prisma:seed
```

### 6. Iniciar servidor

**Desenvolvimento:**
```bash
npm run server:dev
```

**Produção:**
```bash
npm run server:build
npm run server:start
```

O servidor estará rodando em `http://localhost:3001`

## 📡 Endpoints

### Autenticação

#### POST `/api/auth/login`
Login de usuário.

**Body:**
```json
{
  "email": "admin@lucroclaro.com.br",
  "password": "admin123"
}
```

**Response:**
```json
{
  "user": {
    "id": "...",
    "name": "Administrador",
    "email": "admin@lucroclaro.com.br",
    "role": "admin",
    "phone": "(11) 99999-9999",
    "company": "Lucro Claro"
  },
  "token": "jwt-token-here"
}
```

#### POST `/api/auth/register`
Registro de novo usuário.

**Body:**
```json
{
  "name": "Nome Completo",
  "email": "usuario@example.com",
  "password": "senha123",
  "phone": "(11) 99999-9999",
  "company": "Empresa"
}
```

**Response:**
```json
{
  "user": { ... },
  "token": "jwt-token-here"
}
```

### Usuário (Requer Autenticação)

Todas as rotas de usuário requerem o header:
```
Authorization: Bearer <token>
```

#### GET `/api/user/me`
Buscar dados do usuário atual.

**Response:**
```json
{
  "id": "...",
  "name": "...",
  "email": "...",
  "role": "...",
  "phone": "...",
  "company": "..."
}
```

#### PUT `/api/user/me`
Atualizar dados do usuário.

**Body:**
```json
{
  "name": "Novo Nome",
  "email": "novo@email.com",
  "phone": "(11) 88888-8888",
  "company": "Nova Empresa"
}
```

#### PUT `/api/user/me/password`
Alterar senha.

**Body:**
```json
{
  "currentPassword": "senha-atual",
  "newPassword": "nova-senha"
}
```

### Health Check

#### GET `/health`
Verificar se a API está rodando.

**Response:**
```json
{
  "status": "ok",
  "message": "API is running"
}
```

## 🔐 Autenticação

A API usa JWT (JSON Web Tokens) para autenticação.

1. Faça login ou registro para receber um token
2. Inclua o token no header `Authorization: Bearer <token>` em todas as requisições protegidas
3. O token expira em 7 dias

## 🛠️ Estrutura do Projeto

```
server/
├── controllers/     # Lógica de negócio
│   ├── auth.controller.ts
│   └── user.controller.ts
├── middleware/      # Middlewares (auth, etc)
│   └── auth.middleware.ts
├── routes/         # Definição de rotas
│   ├── auth.routes.ts
│   └── user.routes.ts
├── lib/            # Bibliotecas/configurações
│   └── prisma.ts
├── index.ts        # Entry point
└── tsconfig.json   # Configuração TypeScript
```

## 🔧 Scripts Disponíveis

- `npm run server:dev` - Inicia servidor em modo desenvolvimento (com watch)
- `npm run server:build` - Compila TypeScript para JavaScript
- `npm run server:start` - Inicia servidor em produção
- `npm run prisma:generate` - Gera Prisma Client
- `npm run prisma:migrate` - Aplica migrations
- `npm run prisma:seed` - Popula banco com dados iniciais

## 🌐 CORS

A API está configurada para aceitar requisições do frontend. Configure `FRONTEND_URL` no `.env` para o domínio do seu frontend.

## 📝 Notas

- O JWT_SECRET deve ser uma string segura em produção
- O banco de dados está configurado para usar Neon PostgreSQL
- Todas as senhas são hasheadas com bcrypt antes de serem salvas
- O token JWT expira em 7 dias

## 🐛 Troubleshooting

### Erro de conexão com banco
- Verifique se `DATABASE_URL` está correto no `.env`
- Verifique se o banco Neon está acessível

### Erro de CORS
- Verifique se `FRONTEND_URL` está correto no `.env`
- Certifique-se de que o frontend está rodando na URL configurada

### Token inválido
- Verifique se o token está sendo enviado no header `Authorization`
- Verifique se o token não expirou (7 dias)
- Verifique se `JWT_SECRET` está correto
