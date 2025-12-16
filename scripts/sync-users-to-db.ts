// Script para sincronizar usuários do localStorage com o banco Neon
// Execute: tsx scripts/sync-users-to-db.ts

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function syncUsers() {
  try {
    console.log('🔄 Sincronizando usuários com o banco Neon...\n')

    // Buscar usuários do localStorage (simulado - em produção viria de uma API)
    // Por enquanto, vamos criar o usuário padrão se não existir
    const defaultEmail = 'admin@lucroclaro.com.br'
    const defaultPassword = 'admin123'

    const existingUser = await prisma.user.findUnique({
      where: { email: defaultEmail },
    })

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(defaultPassword, 10)
      await prisma.user.create({
        data: {
          name: 'Administrador',
          email: defaultEmail,
          password: hashedPassword,
          role: 'admin',
          phone: '(11) 99999-9999',
          company: 'Lucro Claro',
        },
      })
      console.log(`✅ Usuário padrão criado: ${defaultEmail}`)
    } else {
      console.log(`ℹ️  Usuário já existe: ${defaultEmail}`)
    }

    const userCount = await prisma.user.count()
    console.log(`\n📊 Total de usuários no banco: ${userCount}`)

    console.log('\n✅ Sincronização concluída!')
  } catch (error) {
    console.error('❌ Erro ao sincronizar:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

syncUsers()

