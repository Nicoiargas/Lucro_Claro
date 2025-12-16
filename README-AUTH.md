# Sistema de Autenticação - Lucro Claro

## Configuração do Banco de Dados Neon

O sistema está configurado para usar o banco PostgreSQL no Neon. A conexão é feita através do Prisma.

### Variáveis de Ambiente

Certifique-se de ter o arquivo `.env` na raiz do projeto com:

```
DATABASE_URL="postgresql://neondb_owner:npg_3GApgZuKYJ9l@ep-wispy-cloud-aho4u2wu-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
```

### Migrations

Para aplicar as migrations do banco:

```bash
npm run prisma:migrate
```

### Seed do Banco

Para popular o banco com dados iniciais (incluindo usuário padrão):

```bash
npm run prisma:seed
```

### Sincronizar Usuários

Para sincronizar usuários do sistema com o banco:

```bash
npm run prisma:sync-users
```

## Sistema de Autenticação

### Usuário Padrão

- **Email**: `admin@lucroclaro.com.br`
- **Senha**: `admin123`
- **Role**: `admin`

### Funcionalidades

1. **Login**: Autenticação de usuários
2. **Cadastro**: Criação de novas contas
3. **Perfil**: Edição de dados pessoais
4. **Alteração de Senha**: Mudança de senha com validação

### Estrutura Atual

Atualmente, o sistema usa uma implementação mockada com `localStorage` para funcionar no frontend. Para usar o banco Neon diretamente, é necessário:

1. Criar uma API backend (Express, Next.js API Routes, etc.)
2. Substituir as chamadas em `src/utils/auth-api.ts` por chamadas HTTP
3. Implementar endpoints que usam Prisma para acessar o banco Neon

### Migração para API Real

Para migrar para uma API real:

1. Criar endpoints de API:
   - `POST /api/auth/login`
   - `POST /api/auth/register`
   - `GET /api/auth/user/:id`
   - `PUT /api/auth/user/:id`
   - `PUT /api/auth/user/:id/password`

2. Atualizar `src/utils/auth-api.ts` para fazer chamadas HTTP:

```typescript
export async function login(credentials: LoginCredentials): Promise<User | null> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  })
  if (!response.ok) return null
  return response.json()
}
```

3. Implementar os endpoints no backend usando Prisma:

```typescript
// Exemplo com Express
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return res.status(401).json({ error: 'Credenciais inválidas' })
  
  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) return res.status(401).json({ error: 'Credenciais inválidas' })
  
  const { password: _, ...userWithoutPassword } = user
  res.json(userWithoutPassword)
})
```

## Tela de Cadastro

A tela de cadastro (`/register`) inclui:

- Nome completo (obrigatório)
- Email (obrigatório)
- Senha (obrigatório, mínimo 6 caracteres)
- Confirmar senha (obrigatório)
- Telefone (opcional)
- Empresa (opcional)
- Aceitar termos e condições (obrigatório)

### Validações

- Email deve ser válido
- Senha deve ter pelo menos 6 caracteres
- Senhas devem coincidir
- Telefone deve ser válido (se informado)
- Termos devem ser aceitos

