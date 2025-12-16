// Script para testar a API
// Execute: tsx scripts/test-api.ts

const API_URL = process.env.API_URL || 'http://localhost:3001'

async function testAPI() {
  console.log('🧪 Testando API...\n')

  try {
    // Teste 1: Health Check
    console.log('1️⃣ Testando Health Check...')
    const healthResponse = await fetch(`${API_URL}/health`)
    const healthData = await healthResponse.json()
    console.log('✅ Health Check:', healthData)

    // Teste 2: Login
    console.log('\n2️⃣ Testando Login...')
    const loginResponse = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@lucroclaro.com.br',
        password: 'admin123',
      }),
    })

    if (!loginResponse.ok) {
      const error = await loginResponse.json()
      console.error('❌ Erro no login:', error)
      return
    }

    const loginData = await loginResponse.json()
    console.log('✅ Login bem-sucedido!')
    console.log('   Usuário:', loginData.user.email)
    console.log('   Token recebido:', loginData.token ? 'Sim' : 'Não')

    const token = loginData.token

    // Teste 3: Buscar usuário atual
    console.log('\n3️⃣ Testando GET /api/user/me...')
    const userResponse = await fetch(`${API_URL}/api/user/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!userResponse.ok) {
      const error = await userResponse.json()
      console.error('❌ Erro ao buscar usuário:', error)
      return
    }

    const userData = await userResponse.json()
    console.log('✅ Usuário encontrado:', userData.email)

    console.log('\n✅ Todos os testes passaram!')
  } catch (error: any) {
    console.error('❌ Erro ao testar API:', error.message)
    console.log('\n💡 Certifique-se de que o servidor está rodando:')
    console.log('   npm run server:dev')
  }
}

testAPI()

