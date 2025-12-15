# PRD - Módulo de Cadastro de Colaborador

## 1. Visão Geral

O módulo de cadastro de colaborador permite gerenciar todas as informações necessárias para alocar colaboradores em projetos, incluindo dados pessoais, financeiros, de contrato, endereço e saúde.

## 2. Estrutura do Formulário

O formulário será organizado em **abas** para melhor organização e experiência do usuário:

### Aba 1: Dados Pessoais
- Nome Completo * (obrigatório)
- Email * (obrigatório)
- Telefone * (obrigatório, com máscara)
- Cargo/Função * (obrigatório)
- Status Inicial (Disponível/Ocupado)

### Aba 2: Informações de Projeto
- Salário/Hora (valor por hora trabalhada) * (obrigatório, com máscara financeira)
- Salário Mensal Fixo * (obrigatório, com máscara financeira)
- Custo Total do Colaborador (salário + encargos) * (obrigatório, com máscara financeira)
- Taxa de Alocação (ex: 50%, 100%) * (obrigatório, com máscara de porcentagem)

### Aba 3: Informações de Contrato
- Data de Admissão * (obrigatório, com datepicker)
- Data de Término (opcional, com datepicker)
- Tipo de Contrato * (obrigatório, Select: CLT, PJ, Estágio, Freelancer, Outro)
- Período de Experiência (em dias, opcional)

### Aba 4: Dados Financeiros (RH)
- CPF * (obrigatório, com máscara e validação)
- RG * (obrigatório, com máscara)
- Banco (nome do banco)
- Agência (número da agência)
- Conta (número da conta, com ou sem dígito)
- PIS/PASEP (opcional, com máscara)

### Aba 5: Endereço
- CEP * (obrigatório, com máscara e busca automática)
- Rua/Logradouro * (obrigatório, preenchido automaticamente via CEP)
- Número * (obrigatório)
- Complemento (opcional)
- Bairro * (obrigatório, preenchido automaticamente via CEP)
- Cidade * (obrigatório, preenchido automaticamente via CEP)
- Estado * (obrigatório, preenchido automaticamente via CEP)

### Aba 6: Informações de Saúde
- Alergias (campo de texto livre, opcional)
- Tipo Sanguíneo (Select: A+, A-, B+, B-, AB+, AB-, O+, O-, Não informado)
- Plano de Saúde (nome do plano, opcional)
- Número do Plano de Saúde (opcional)

## 3. Validações

### Validação de CPF
- Formato: XXX.XXX.XXX-XX
- Validação dos dígitos verificadores
- Mensagem de erro clara se inválido

### Validação de CEP
- Formato: XXXXX-XXX
- Busca automática via API ViaCEP quando CEP completo
- Preenchimento automático de: Rua, Bairro, Cidade, Estado
- Mensagem de erro se CEP não encontrado

### Validação de Email
- Formato válido de email
- Regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`

### Validação de Datas
- Data de término não pode ser anterior à data de admissão
- Datepicker nativo em todos os campos de data

## 4. Máscaras e Formatação

- **Telefone**: (XX) XXXXX-XXXX
- **CPF**: XXX.XXX.XXX-XX
- **RG**: XX.XXX.XXX-X
- **CEP**: XXXXX-XXX
- **Valores Financeiros**: R$ 0.000,00 (máscara de moeda)
- **Porcentagem**: 00% (máscara de porcentagem)
- **Datas**: DD/MM/AAAA (com datepicker nativo)

## 5. Relacionamento com Projetos

Quando um colaborador é adicionado a um projeto:
- O sistema permite definir um custo específico para aquele projeto (sobrescreve o custo padrão)
- O sistema calcula automaticamente o custo total do projeto baseado nas horas trabalhadas
- O histórico de projetos trabalhados é mantido

## 6. Histórico e Rastreabilidade

O sistema mantém:
- **Histórico de alterações de salário**: data, valor anterior, valor novo, motivo (opcional)
- **Histórico de projetos trabalhados**: lista de projetos com datas de início/fim, custo aplicado, horas trabalhadas

## 7. Funcionalidades

### Criar Colaborador
- Preencher todas as abas
- Validação de campos obrigatórios
- Salvar no localStorage (mockado)

### Editar Colaborador
- Carregar dados existentes
- Permitir edição de qualquer campo
- Atualizar histórico quando salário for alterado

### Deletar Colaborador
- Confirmação dupla (duas etapas)
- Verificar se colaborador está em projetos ativos antes de permitir exclusão

## 8. Interface do Usuário

- Layout responsivo
- Abas com navegação clara
- Indicadores visuais de campos obrigatórios (*)
- Mensagens de erro claras e contextuais
- Botões de ação (Salvar, Deletar) sempre visíveis no rodapé
- Logo no topo da página

## 9. Estrutura de Dados

```typescript
interface Collaborator {
  id: string
  // Dados Pessoais
  name: string
  email: string
  phone: string
  role: string
  status: 'busy' | 'available'
  
  // Informações de Projeto
  hourlyRate: string // Salário/hora
  monthlySalary: string // Salário mensal
  totalCost: string // Custo total
  allocationRate: string // Taxa de alocação (%)
  
  // Informações de Contrato
  admissionDate: string
  terminationDate?: string
  contractType: 'CLT' | 'PJ' | 'Estágio' | 'Freelancer' | 'Outro'
  probationPeriod?: number // dias
  
  // Dados Financeiros
  cpf: string
  rg: string
  bank?: string
  agency?: string
  account?: string
  pisPasep?: string
  
  // Endereço
  cep: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  
  // Informações de Saúde
  allergies?: string
  bloodType?: string
  healthInsurance?: string
  healthInsuranceNumber?: string
  
  // Histórico
  salaryHistory?: Array<{
    date: string
    previousValue: string
    newValue: string
    reason?: string
  }>
  projectHistory?: Array<{
    projectId: string
    projectName: string
    startDate: string
    endDate?: string
    hourlyRate: string
    hoursWorked?: number
  }>
  
  currentProject?: string
}
```

## 10. Integração com Outros Módulos

- **Módulo de Projetos**: Colaboradores cadastrados aparecem na lista de seleção
- **Dashboard**: Status dos colaboradores é atualizado em tempo real
- **Módulo de Clientes**: (futuro) Relacionamento com clientes através de projetos

