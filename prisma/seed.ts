import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...\n')

  // Limpar dados existentes
  console.log('🧹 Limpando dados existentes...')
  await prisma.projectHistory.deleteMany()
  await prisma.salaryHistory.deleteMany()
  await prisma.tax.deleteMany()
  await prisma.expense.deleteMany()
  await prisma.projectCollaborator.deleteMany()
  await prisma.project.deleteMany()
  await prisma.collaborator.deleteMany()
  await prisma.client.deleteMany()
  await prisma.user.deleteMany()

  // Criar usuário padrão
  console.log('👤 Criando usuário padrão...')
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const defaultUser = await prisma.user.create({
    data: {
      name: 'Administrador',
      email: 'admin@lucroclaro.com.br',
      password: hashedPassword,
      role: 'admin',
      phone: '(11) 99999-9999',
      company: 'Lucro Claro',
    },
  })
  console.log(`   ✅ Usuário criado: ${defaultUser.email} (senha: admin123)\n`)

  // Criar Clientes
  console.log('👥 Criando clientes...')
  const clients = await Promise.all([
    prisma.client.create({
      data: {
        name: 'Empresa ABC Ltda',
        email: 'contato@empresaabc.com.br',
        phone: '(11) 3456-7890',
        cnpj: '12.345.678/0001-90',
      },
    }),
    prisma.client.create({
      data: {
        name: 'Tech Solutions SA',
        email: 'contato@techsolutions.com.br',
        phone: '(11) 3456-7891',
        cnpj: '23.456.789/0001-01',
      },
    }),
    prisma.client.create({
      data: {
        name: 'Digital Marketing Corp',
        email: 'contato@digitalmarketing.com.br',
        phone: '(11) 3456-7892',
        cnpj: '34.567.890/0001-12',
      },
    }),
    prisma.client.create({
      data: {
        name: 'Inovação Tech',
        email: 'contato@inovacaotech.com.br',
        phone: '(11) 3456-7893',
        cnpj: '45.678.901/0001-23',
      },
    }),
    prisma.client.create({
      data: {
        name: 'StartupXYZ',
        email: 'contato@startupxyz.com.br',
        phone: '(11) 3456-7894',
        cnpj: '56.789.012/0001-34',
      },
    }),
  ])

  // Criar 20 Colaboradores
  console.log('👨‍💼 Criando colaboradores...')
  const collaborators = await Promise.all([
    prisma.collaborator.create({
      data: {
        name: 'João Silva',
        email: 'joao.silva@example.com',
        phone: '(11) 99999-9999',
        role: 'Desenvolvedor Full Stack',
        status: 'busy',
        hourlyRate: '150,00',
        monthlySalary: '12.000,00',
        totalCost: '15.000,00',
        allocationRate: '100%',
        admissionDate: '2023-01-15',
        contractType: 'CLT',
        cpf: '123.456.789-00',
        rg: '12.345.678-9',
        cep: '01310-100',
        street: 'Avenida Paulista',
        number: '1000',
        neighborhood: 'Bela Vista',
        city: 'São Paulo',
        state: 'SP',
        bloodType: 'O+',
        healthInsurance: 'Unimed',
        healthInsuranceNumber: '123456789',
      },
    }),
    prisma.collaborator.create({
      data: {
        name: 'Maria Santos',
        email: 'maria.santos@example.com',
        phone: '(11) 98888-8888',
        role: 'Designer UX/UI',
        status: 'busy',
        hourlyRate: '120,00',
        monthlySalary: '10.000,00',
        totalCost: '12.500,00',
        allocationRate: '100%',
        admissionDate: '2023-02-01',
        contractType: 'CLT',
        cpf: '234.567.890-11',
        rg: '23.456.789-0',
        cep: '04547-130',
        street: 'Rua Funchal',
        number: '200',
        neighborhood: 'Vila Olímpia',
        city: 'São Paulo',
        state: 'SP',
        bloodType: 'A+',
      },
    }),
    prisma.collaborator.create({
      data: {
        name: 'Pedro Oliveira',
        email: 'pedro.oliveira@example.com',
        phone: '(11) 97777-7777',
        role: 'Desenvolvedor Mobile',
        status: 'busy',
        hourlyRate: '140,00',
        monthlySalary: '11.000,00',
        totalCost: '13.750,00',
        allocationRate: '100%',
        admissionDate: '2023-03-10',
        contractType: 'PJ',
        cpf: '345.678.901-22',
        rg: '34.567.890-1',
        cep: '05433-000',
        street: 'Avenida Brigadeiro Faria Lima',
        number: '1500',
        neighborhood: 'Pinheiros',
        city: 'São Paulo',
        state: 'SP',
        bloodType: 'B+',
      },
    }),
    prisma.collaborator.create({
      data: {
        name: 'Ana Costa',
        email: 'ana.costa@example.com',
        phone: '(11) 96666-6666',
        role: 'Product Manager',
        status: 'available',
        hourlyRate: '180,00',
        monthlySalary: '15.000,00',
        totalCost: '18.750,00',
        allocationRate: '100%',
        admissionDate: '2023-04-05',
        contractType: 'CLT',
        cpf: '456.789.012-33',
        rg: '45.678.901-2',
        cep: '01310-100',
        street: 'Avenida Paulista',
        number: '2000',
        neighborhood: 'Bela Vista',
        city: 'São Paulo',
        state: 'SP',
        bloodType: 'AB+',
      },
    }),
    prisma.collaborator.create({
      data: {
        name: 'Carlos Ferreira',
        email: 'carlos.ferreira@example.com',
        phone: '(11) 95555-5555',
        role: 'Desenvolvedor Backend',
        status: 'busy',
        hourlyRate: '160,00',
        monthlySalary: '13.000,00',
        totalCost: '16.250,00',
        allocationRate: '100%',
        admissionDate: '2023-05-20',
        contractType: 'CLT',
        cpf: '567.890.123-44',
        rg: '56.789.012-3',
        cep: '04547-130',
        street: 'Rua Funchal',
        number: '300',
        neighborhood: 'Vila Olímpia',
        city: 'São Paulo',
        state: 'SP',
        bloodType: 'O-',
      },
    }),
    prisma.collaborator.create({
      data: {
        name: 'Julia Almeida',
        email: 'julia.almeida@example.com',
        phone: '(11) 94444-4444',
        role: 'QA Tester',
        status: 'available',
        hourlyRate: '100,00',
        monthlySalary: '8.000,00',
        totalCost: '10.000,00',
        allocationRate: '100%',
        admissionDate: '2023-06-15',
        contractType: 'CLT',
        cpf: '678.901.234-55',
        rg: '67.890.123-4',
        cep: '05433-000',
        street: 'Avenida Brigadeiro Faria Lima',
        number: '2500',
        neighborhood: 'Pinheiros',
        city: 'São Paulo',
        state: 'SP',
        bloodType: 'A-',
      },
    }),
    prisma.collaborator.create({
      data: {
        name: 'Roberto Lima',
        email: 'roberto.lima@example.com',
        phone: '(11) 93333-3333',
        role: 'DevOps Engineer',
        status: 'busy',
        hourlyRate: '170,00',
        monthlySalary: '14.000,00',
        totalCost: '17.500,00',
        allocationRate: '100%',
        admissionDate: '2023-07-01',
        contractType: 'PJ',
        cpf: '789.012.345-66',
        rg: '78.901.234-5',
        cep: '01310-100',
        street: 'Avenida Paulista',
        number: '3000',
        neighborhood: 'Bela Vista',
        city: 'São Paulo',
        state: 'SP',
        bloodType: 'B-',
      },
    }),
    prisma.collaborator.create({
      data: {
        name: 'Fernanda Souza',
        email: 'fernanda.souza@example.com',
        phone: '(11) 92222-2222',
        role: 'Scrum Master',
        status: 'available',
        hourlyRate: '130,00',
        monthlySalary: '11.500,00',
        totalCost: '14.375,00',
        allocationRate: '100%',
        admissionDate: '2023-08-10',
        contractType: 'CLT',
        cpf: '890.123.456-77',
        rg: '89.012.345-6',
        cep: '04547-130',
        street: 'Rua Funchal',
        number: '400',
        neighborhood: 'Vila Olímpia',
        city: 'São Paulo',
        state: 'SP',
        bloodType: 'O+',
      },
    }),
    prisma.collaborator.create({
      data: {
        name: 'Rafael Martins',
        email: 'rafael.martins@example.com',
        phone: '(11) 91111-1111',
        role: 'Desenvolvedor Frontend',
        status: 'busy',
        hourlyRate: '145,00',
        monthlySalary: '11.500,00',
        totalCost: '14.375,00',
        allocationRate: '100%',
        admissionDate: '2023-09-05',
        contractType: 'CLT',
        cpf: '901.234.567-88',
        rg: '90.123.456-7',
        cep: '05433-000',
        street: 'Avenida Brigadeiro Faria Lima',
        number: '3500',
        neighborhood: 'Pinheiros',
        city: 'São Paulo',
        state: 'SP',
        bloodType: 'A+',
      },
    }),
    prisma.collaborator.create({
      data: {
        name: 'Camila Rodrigues',
        email: 'camila.rodrigues@example.com',
        phone: '(11) 90000-0000',
        role: 'Business Analyst',
        status: 'available',
        hourlyRate: '110,00',
        monthlySalary: '9.000,00',
        totalCost: '11.250,00',
        allocationRate: '100%',
        admissionDate: '2023-10-12',
        contractType: 'CLT',
        cpf: '012.345.678-99',
        rg: '01.234.567-8',
        cep: '01310-100',
        street: 'Avenida Paulista',
        number: '4000',
        neighborhood: 'Bela Vista',
        city: 'São Paulo',
        state: 'SP',
        bloodType: 'B+',
      },
    }),
    prisma.collaborator.create({
      data: {
        name: 'Lucas Pereira',
        email: 'lucas.pereira@example.com',
        phone: '(11) 89999-9999',
        role: 'Desenvolvedor Full Stack',
        status: 'busy',
        hourlyRate: '155,00',
        monthlySalary: '12.500,00',
        totalCost: '15.625,00',
        allocationRate: '100%',
        admissionDate: '2023-11-01',
        contractType: 'PJ',
        cpf: '123.456.789-10',
        rg: '12.345.678-9',
        cep: '04547-130',
        street: 'Rua Funchal',
        number: '500',
        neighborhood: 'Vila Olímpia',
        city: 'São Paulo',
        state: 'SP',
        bloodType: 'AB-',
      },
    }),
    prisma.collaborator.create({
      data: {
        name: 'Patricia Gomes',
        email: 'patricia.gomes@example.com',
        phone: '(11) 88888-8888',
        role: 'UX Designer',
        status: 'available',
        hourlyRate: '125,00',
        monthlySalary: '10.500,00',
        totalCost: '13.125,00',
        allocationRate: '100%',
        admissionDate: '2024-01-15',
        contractType: 'CLT',
        cpf: '234.567.890-20',
        rg: '23.456.789-1',
        cep: '05433-000',
        street: 'Avenida Brigadeiro Faria Lima',
        number: '4500',
        neighborhood: 'Pinheiros',
        city: 'São Paulo',
        state: 'SP',
        bloodType: 'O+',
      },
    }),
    prisma.collaborator.create({
      data: {
        name: 'Thiago Barbosa',
        email: 'thiago.barbosa@example.com',
        phone: '(11) 87777-7777',
        role: 'Desenvolvedor Backend',
        status: 'busy',
        hourlyRate: '165,00',
        monthlySalary: '13.500,00',
        totalCost: '16.875,00',
        allocationRate: '100%',
        admissionDate: '2024-02-01',
        contractType: 'CLT',
        cpf: '345.678.901-30',
        rg: '34.567.890-2',
        cep: '01310-100',
        street: 'Avenida Paulista',
        number: '5000',
        neighborhood: 'Bela Vista',
        city: 'São Paulo',
        state: 'SP',
        bloodType: 'A-',
      },
    }),
    prisma.collaborator.create({
      data: {
        name: 'Beatriz Nunes',
        email: 'beatriz.nunes@example.com',
        phone: '(11) 86666-6666',
        role: 'Product Owner',
        status: 'available',
        hourlyRate: '190,00',
        monthlySalary: '16.000,00',
        totalCost: '20.000,00',
        allocationRate: '100%',
        admissionDate: '2024-03-10',
        contractType: 'CLT',
        cpf: '456.789.012-40',
        rg: '45.678.901-3',
        cep: '04547-130',
        street: 'Rua Funchal',
        number: '600',
        neighborhood: 'Vila Olímpia',
        city: 'São Paulo',
        state: 'SP',
        bloodType: 'B+',
      },
    }),
    prisma.collaborator.create({
      data: {
        name: 'Gabriel Rocha',
        email: 'gabriel.rocha@example.com',
        phone: '(11) 85555-5555',
        role: 'Desenvolvedor Mobile',
        status: 'busy',
        hourlyRate: '148,00',
        monthlySalary: '12.000,00',
        totalCost: '15.000,00',
        allocationRate: '100%',
        admissionDate: '2024-04-05',
        contractType: 'PJ',
        cpf: '567.890.123-50',
        rg: '56.789.012-4',
        cep: '05433-000',
        street: 'Avenida Brigadeiro Faria Lima',
        number: '5500',
        neighborhood: 'Pinheiros',
        city: 'São Paulo',
        state: 'SP',
        bloodType: 'O+',
      },
    }),
    prisma.collaborator.create({
      data: {
        name: 'Isabela Freitas',
        email: 'isabela.freitas@example.com',
        phone: '(11) 84444-4444',
        role: 'QA Engineer',
        status: 'available',
        hourlyRate: '105,00',
        monthlySalary: '8.500,00',
        totalCost: '10.625,00',
        allocationRate: '100%',
        admissionDate: '2024-05-20',
        contractType: 'CLT',
        cpf: '678.901.234-60',
        rg: '67.890.123-5',
        cep: '01310-100',
        street: 'Avenida Paulista',
        number: '6000',
        neighborhood: 'Bela Vista',
        city: 'São Paulo',
        state: 'SP',
        bloodType: 'A+',
      },
    }),
    prisma.collaborator.create({
      data: {
        name: 'Marcos Alves',
        email: 'marcos.alves@example.com',
        phone: '(11) 83333-3333',
        role: 'Tech Lead',
        status: 'busy',
        hourlyRate: '200,00',
        monthlySalary: '18.000,00',
        totalCost: '22.500,00',
        allocationRate: '100%',
        admissionDate: '2024-06-15',
        contractType: 'CLT',
        cpf: '789.012.345-70',
        rg: '78.901.234-6',
        cep: '04547-130',
        street: 'Rua Funchal',
        number: '700',
        neighborhood: 'Vila Olímpia',
        city: 'São Paulo',
        state: 'SP',
        bloodType: 'AB+',
      },
    }),
    prisma.collaborator.create({
      data: {
        name: 'Larissa Mendes',
        email: 'larissa.mendes@example.com',
        phone: '(11) 82222-2222',
        role: 'UI Designer',
        status: 'available',
        hourlyRate: '115,00',
        monthlySalary: '9.500,00',
        totalCost: '11.875,00',
        allocationRate: '100%',
        admissionDate: '2024-07-01',
        contractType: 'CLT',
        cpf: '890.123.456-80',
        rg: '89.012.345-7',
        cep: '05433-000',
        street: 'Avenida Brigadeiro Faria Lima',
        number: '6500',
        neighborhood: 'Pinheiros',
        city: 'São Paulo',
        state: 'SP',
        bloodType: 'B-',
      },
    }),
    prisma.collaborator.create({
      data: {
        name: 'Diego Castro',
        email: 'diego.castro@example.com',
        phone: '(11) 81111-1111',
        role: 'Desenvolvedor Full Stack',
        status: 'busy',
        hourlyRate: '152,00',
        monthlySalary: '12.300,00',
        totalCost: '15.375,00',
        allocationRate: '100%',
        admissionDate: '2024-08-10',
        contractType: 'PJ',
        cpf: '901.234.567-90',
        rg: '90.123.456-8',
        cep: '01310-100',
        street: 'Avenida Paulista',
        number: '7000',
        neighborhood: 'Bela Vista',
        city: 'São Paulo',
        state: 'SP',
        bloodType: 'O-',
      },
    }),
    prisma.collaborator.create({
      data: {
        name: 'Renata Dias',
        email: 'renata.dias@example.com',
        phone: '(11) 80000-0000',
        role: 'Data Analyst',
        status: 'available',
        hourlyRate: '135,00',
        monthlySalary: '11.000,00',
        totalCost: '13.750,00',
        allocationRate: '100%',
        admissionDate: '2024-09-05',
        contractType: 'CLT',
        cpf: '012.345.678-00',
        rg: '01.234.567-9',
        cep: '04547-130',
        street: 'Rua Funchal',
        number: '800',
        neighborhood: 'Vila Olímpia',
        city: 'São Paulo',
        state: 'SP',
        bloodType: 'A+',
      },
    }),
  ])

  // Criar 10 Projetos (4 ativos, 2 em pausa, 4 encerrados)
  console.log('📁 Criando projetos...')
  
  // 4 Projetos Ativos
  const activeProjects = await Promise.all([
    prisma.project.create({
      data: {
        projectName: 'Sistema de Gestão ERP',
        clientId: clients[0].id,
        startDate: '2024-01-15',
        endDate: '2024-06-15',
        contractType: 'fixed',
        value: '150.000,00',
        status: 'active',
        collaborators: {
          create: [
            { collaboratorId: collaborators[0].id, customHourlyRate: '150,00' },
            { collaboratorId: collaborators[4].id },
          ],
        },
        expenses: {
          create: [
            { name: 'Servidor Cloud', value: '2.500,00' },
            { name: 'Licenças de Software', value: '5.000,00' },
          ],
        },
        taxes: {
          create: [
            { name: 'ISS', percentage: '5,00', selected: true },
            { name: 'IRRF', percentage: '1,50', selected: true },
          ],
        },
      },
    }),
    prisma.project.create({
      data: {
        projectName: 'Plataforma E-commerce',
        clientId: clients[1].id,
        startDate: '2024-02-01',
        endDate: '2024-05-28',
        contractType: 'fixed',
        value: '85.000,00',
        status: 'active',
        collaborators: {
          create: [
            { collaboratorId: collaborators[1].id, customHourlyRate: '120,00' },
            { collaboratorId: collaborators[8].id },
          ],
        },
        expenses: {
          create: [
            { name: 'Gateway de Pagamento', value: '1.200,00' },
          ],
        },
        taxes: {
          create: [
            { name: 'ISS', percentage: '5,00', selected: true },
          ],
        },
      },
    }),
    prisma.project.create({
      data: {
        projectName: 'App Mobile iOS/Android',
        clientId: clients[2].id,
        startDate: '2024-02-15',
        endDate: '2024-07-10',
        contractType: 'fixed',
        value: '120.000,00',
        status: 'active',
        collaborators: {
          create: [
            { collaboratorId: collaborators[2].id, customHourlyRate: '140,00' },
            { collaboratorId: collaborators[14].id },
          ],
        },
        expenses: {
          create: [
            { name: 'Conta Apple Developer', value: '399,00' },
            { name: 'Conta Google Play', value: '25,00' },
          ],
        },
        taxes: {
          create: [
            { name: 'ISS', percentage: '5,00', selected: true },
            { name: 'PIS', percentage: '0,65', selected: true },
          ],
        },
      },
    }),
    prisma.project.create({
      data: {
        projectName: 'Website Institucional',
        clientId: clients[3].id,
        startDate: '2024-03-01',
        endDate: '2024-05-22',
        contractType: 'fixed',
        value: '45.000,00',
        status: 'active',
        collaborators: {
          create: [
            { collaboratorId: collaborators[11].id },
            { collaboratorId: collaborators[17].id },
          ],
        },
        expenses: {
          create: [
            { name: 'Domínio e Hospedagem', value: '800,00' },
          ],
        },
        taxes: {
          create: [
            { name: 'ISS', percentage: '5,00', selected: true },
          ],
        },
      },
    }),
  ])

  // 2 Projetos em Pausa
  const onHoldProjects = await Promise.all([
    prisma.project.create({
      data: {
        projectName: 'Sistema de BI',
        clientId: clients[0].id,
        startDate: '2024-03-10',
        endDate: '2024-08-05',
        contractType: 'fixed',
        value: '200.000,00',
        status: 'onhold',
        collaborators: {
          create: [
            { collaboratorId: collaborators[4].id, customHourlyRate: '160,00' },
            { collaboratorId: collaborators[12].id },
          ],
        },
        expenses: {
          create: [
            { name: 'Ferramentas de BI', value: '8.000,00' },
            { name: 'Servidor Dedicado', value: '3.500,00' },
          ],
        },
        taxes: {
          create: [
            { name: 'ISS', percentage: '5,00', selected: true },
            { name: 'COFINS', percentage: '3,00', selected: true },
          ],
        },
      },
    }),
    prisma.project.create({
      data: {
        projectName: 'Integração API',
        clientId: clients[1].id,
        startDate: '2024-01-20',
        endDate: '2024-08-18',
        contractType: 'fixed',
        value: '60.000,00',
        status: 'onhold',
        collaborators: {
          create: [
            { collaboratorId: collaborators[6].id, customHourlyRate: '170,00' },
          ],
        },
        expenses: {
          create: [
            { name: 'API Externa', value: '1.500,00' },
          ],
        },
        taxes: {
          create: [
            { name: 'ISS', percentage: '5,00', selected: true },
          ],
        },
      },
    }),
  ])

  // 4 Projetos Encerrados
  const completedProjects = await Promise.all([
    prisma.project.create({
      data: {
        projectName: 'Portal do Cliente',
        clientId: clients[2].id,
        startDate: '2023-12-01',
        endDate: '2024-02-20',
        contractType: 'fixed',
        value: '95.000,00',
        status: 'completed',
        collaborators: {
          create: [
            { collaboratorId: collaborators[0].id },
            { collaboratorId: collaborators[8].id },
          ],
        },
        expenses: {
          create: [
            { name: 'Certificado SSL', value: '500,00' },
          ],
        },
        taxes: {
          create: [
            { name: 'ISS', percentage: '5,00', selected: true },
            { name: 'IRRF', percentage: '1,50', selected: true },
          ],
        },
      },
    }),
    prisma.project.create({
      data: {
        projectName: 'Dashboard Analytics',
        clientId: clients[3].id,
        startDate: '2023-11-01',
        endDate: '2024-01-15',
        contractType: 'fixed',
        value: '75.000,00',
        status: 'completed',
        collaborators: {
          create: [
            { collaboratorId: collaborators[3].id },
            { collaboratorId: collaborators[5].id },
          ],
        },
        expenses: {
          create: [
            { name: 'Ferramentas de Analytics', value: '2.000,00' },
          ],
        },
        taxes: {
          create: [
            { name: 'ISS', percentage: '5,00', selected: true },
          ],
        },
      },
    }),
    prisma.project.create({
      data: {
        projectName: 'Sistema de Pagamentos',
        clientId: clients[0].id,
        startDate: '2023-10-01',
        endDate: '2024-01-30',
        contractType: 'fixed',
        value: '130.000,00',
        status: 'completed',
        collaborators: {
          create: [
            { collaboratorId: collaborators[4].id },
            { collaboratorId: collaborators[6].id },
            { collaboratorId: collaborators[15].id },
          ],
        },
        expenses: {
          create: [
            { name: 'Gateway de Pagamento', value: '3.000,00' },
            { name: 'Certificações de Segurança', value: '5.000,00' },
          ],
        },
        taxes: {
          create: [
            { name: 'ISS', percentage: '5,00', selected: true },
            { name: 'PIS', percentage: '0,65', selected: true },
            { name: 'COFINS', percentage: '3,00', selected: true },
          ],
        },
      },
    }),
    prisma.project.create({
      data: {
        projectName: 'API de Integração',
        clientId: clients[1].id,
        startDate: '2023-09-01',
        endDate: '2023-12-10',
        contractType: 'fixed',
        value: '55.000,00',
        status: 'completed',
        collaborators: {
          create: [
            { collaboratorId: collaborators[2].id },
            { collaboratorId: collaborators[7].id },
          ],
        },
        expenses: {
          create: [
            { name: 'Documentação API', value: '800,00' },
          ],
        },
        taxes: {
          create: [
            { name: 'ISS', percentage: '5,00', selected: true },
          ],
        },
      },
    }),
  ])

  // Atualizar currentProject dos colaboradores
  console.log('🔄 Atualizando projetos atuais dos colaboradores...')
  await prisma.collaborator.update({
    where: { id: collaborators[0].id },
    data: { currentProject: 'Sistema de Gestão ERP' },
  })
  await prisma.collaborator.update({
    where: { id: collaborators[1].id },
    data: { currentProject: 'Plataforma E-commerce' },
  })
  await prisma.collaborator.update({
    where: { id: collaborators[2].id },
    data: { currentProject: 'App Mobile iOS/Android' },
  })
  await prisma.collaborator.update({
    where: { id: collaborators[4].id },
    data: { currentProject: 'Sistema de Gestão ERP' },
  })
  await prisma.collaborator.update({
    where: { id: collaborators[6].id },
    data: { currentProject: 'Integração API' },
  })
  await prisma.collaborator.update({
    where: { id: collaborators[8].id },
    data: { currentProject: 'Plataforma E-commerce' },
  })
  await prisma.collaborator.update({
    where: { id: collaborators[11].id },
    data: { currentProject: 'Website Institucional' },
  })
  await prisma.collaborator.update({
    where: { id: collaborators[12].id },
    data: { currentProject: 'Sistema de BI' },
  })
  await prisma.collaborator.update({
    where: { id: collaborators[14].id },
    data: { currentProject: 'App Mobile iOS/Android' },
  })
  await prisma.collaborator.update({
    where: { id: collaborators[15].id },
    data: { currentProject: 'Sistema de BI' },
  })
  await prisma.collaborator.update({
    where: { id: collaborators[17].id },
    data: { currentProject: 'Website Institucional' },
  })

  // Criar histórico de projetos para alguns colaboradores
  console.log('📚 Criando histórico de projetos...')
  await prisma.projectHistory.createMany({
    data: [
      {
        collaboratorId: collaborators[0].id,
        projectId: completedProjects[0].id,
        projectName: 'Portal do Cliente',
        startDate: '2023-12-01',
        endDate: '2024-02-20',
        hourlyRate: '150,00',
        hoursWorked: 320,
      },
      {
        collaboratorId: collaborators[4].id,
        projectId: completedProjects[2].id,
        projectName: 'Sistema de Pagamentos',
        startDate: '2023-10-01',
        endDate: '2024-01-30',
        hourlyRate: '160,00',
        hoursWorked: 480,
      },
      {
        collaboratorId: collaborators[2].id,
        projectId: completedProjects[3].id,
        projectName: 'API de Integração',
        startDate: '2023-09-01',
        endDate: '2023-12-10',
        hourlyRate: '140,00',
        hoursWorked: 400,
      },
    ],
  })

  // Criar histórico de salários
  console.log('💰 Criando histórico de salários...')
  await prisma.salaryHistory.createMany({
    data: [
      {
        collaboratorId: collaborators[0].id,
        date: '2024-01-01',
        previousValue: '140,00',
        newValue: '150,00',
        reason: 'Ajuste anual',
      },
      {
        collaboratorId: collaborators[1].id,
        date: '2024-02-01',
        previousValue: '110,00',
        newValue: '120,00',
        reason: 'Promoção',
      },
      {
        collaboratorId: collaborators[4].id,
        date: '2024-03-01',
        previousValue: '150,00',
        newValue: '160,00',
        reason: 'Aumento por desempenho',
      },
    ],
  })

  console.log('\n✅ Seed concluído com sucesso!')
  console.log(`\n📊 Resumo:`)
  console.log(`   - ${clients.length} clientes criados`)
  console.log(`   - ${collaborators.length} colaboradores criados`)
  console.log(`   - ${activeProjects.length} projetos ativos criados`)
  console.log(`   - ${onHoldProjects.length} projetos em pausa criados`)
  console.log(`   - ${completedProjects.length} projetos encerrados criados`)
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

