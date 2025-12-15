import { prisma } from '../src/lib/prisma'

async function testConnection() {
  try {
    await prisma.$connect()
    console.log('✅ Conexão com banco PostgreSQL estabelecida!')
    
    // Testa uma query simples
    const clientCount = await prisma.client.count()
    const collaboratorCount = await prisma.collaborator.count()
    const projectCount = await prisma.project.count()
    
    console.log(`\n📊 Estatísticas do banco:`)
    console.log(`   - Clientes: ${clientCount}`)
    console.log(`   - Colaboradores: ${collaboratorCount}`)
    console.log(`   - Projetos: ${projectCount}`)
    
    await prisma.$disconnect()
    console.log('\n✅ Teste concluído com sucesso!')
  } catch (error) {
    console.error('❌ Erro ao conectar:', error)
    process.exit(1)
  }
}

testConnection()

