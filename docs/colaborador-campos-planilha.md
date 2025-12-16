# Planilha de Campos - Formulário de Colaborador

Esta planilha contém todos os campos necessários para alimentar o formulário de colaborador do sistema Lucro Claro.

## Aba 1: Dados Pessoais

| Campo | Tipo | Obrigatório | Descrição | Exemplo | Validação |
|-------|------|-------------|-----------|---------|-----------|
| Nome Completo | Texto | Sim | Nome completo do colaborador | João Silva Santos | Mínimo 3 caracteres |
| Email Pessoal | Email | Não | Email pessoal do colaborador | joao.silva@gmail.com | Formato de email válido |
| Email Profissional | Email | Sim | Email corporativo do colaborador | joao.silva@empresa.com | Formato de email válido |
| Telefone(s) | Texto | Sim | Um ou mais números de telefone | (11) 99999-9999 | Pelo menos um telefone obrigatório |
| Cargo/Função | Texto | Sim | Cargo ou função do colaborador | Desenvolvedor Full Stack | - |
| Status | Select | Sim | Status do colaborador | Disponível / Ocupado | - |

## Aba 2: Contrato

| Campo | Tipo | Obrigatório | Descrição | Exemplo | Validação |
|-------|------|-------------|-----------|---------|-----------|
| Data de Admissão | Data | Sim | Data de início do contrato | 2024-01-15 | - |
| Data de Término | Data | Não | Data de término do contrato (se aplicável) | 2024-12-31 | Deve ser posterior à data de admissão |
| Tipo de Contrato | Select | Sim | Tipo de contratação | CLT / PJ / Estágio / Freelancer / Outro | - |
| Período de Experiência | Número | Não | Período de experiência em dias | 90 | - |

### Seção: Horários

#### Para Contrato CLT:

| Campo | Tipo | Obrigatório | Descrição | Exemplo | Validação |
|-------|------|-------------|-----------|---------|-----------|
| Salário Bruto | Moeda | Sim | Salário bruto mensal | 15.000,00 | - |
| Salário Líquido | Moeda | Não | Salário líquido (para cálculo reverso) | 12.000,00 | - |
| INSS | Moeda | Calculado | Valor do INSS calculado | 1.200,00 | Calculado automaticamente |
| IRRF | Moeda | Calculado | Valor do IRRF calculado | 1.500,00 | Calculado automaticamente |
| FGTS | Moeda | Calculado | Valor do FGTS calculado | 1.200,00 | Calculado automaticamente |
| Custo Total | Moeda | Calculado | Custo total (bruto + FGTS + materiais) | 17.200,00 | Calculado automaticamente |

#### Para Contrato PJ:

| Campo | Tipo | Obrigatório | Descrição | Exemplo | Validação |
|-------|------|-------------|-----------|---------|-----------|
| Valor Mensal | Moeda | Sim | Valor mensal fixo do contrato PJ | 20.000,00 | - |
| Custo Total | Moeda | Calculado | Custo total (valor mensal + materiais) | 21.500,00 | Calculado automaticamente |

### Material e Assinaturas (Ambos os tipos)

| Campo | Tipo | Obrigatório | Descrição | Exemplo | Validação |
|-------|------|-------------|-----------|---------|-----------|
| Descrição | Texto | Não | Descrição do material/assinatura | Swile / Adobe Creative Cloud | - |
| Valor | Moeda | Não | Valor do material/assinatura | 500,00 | - |

**Nota:** Pode adicionar múltiplos itens de material e assinaturas. O campo "Swile" aparece por padrão.

## Aba 3: Dados Financeiros

| Campo | Tipo | Obrigatório | Descrição | Exemplo | Validação |
|-------|------|-------------|-----------|---------|-----------|
| CPF | CPF | Sim | CPF do colaborador | 123.456.789-00 | Formato válido de CPF |
| RG | RG | Sim | RG do colaborador | 12.345.678-9 | - |
| Banco | Texto | Não | Nome do banco | Banco do Brasil | - |
| Agência | Texto | Não | Número da agência | 1234-5 | - |
| Conta | Texto | Não | Número da conta | 12345-6 | - |
| PIS/PASEP | Texto | Condicional | PIS/PASEP (apenas para CLT) | 000.00000.00-0 | Aparece apenas se tipo de contrato = CLT |
| CNPJ | CNPJ | Condicional | CNPJ (apenas para PJ) | 12.345.678/0001-90 | Aparece apenas se tipo de contrato = PJ |

## Aba 4: Endereço

| Campo | Tipo | Obrigatório | Descrição | Exemplo | Validação |
|-------|------|-------------|-----------|---------|-----------|
| CEP | CEP | Sim | Código postal | 01310-100 | Formato válido, busca endereço automaticamente |
| Rua/Logradouro | Texto | Sim | Nome da rua | Avenida Paulista | - |
| Número | Texto | Sim | Número do endereço | 1000 | - |
| Complemento | Texto | Não | Complemento do endereço | Apto 101 | - |
| Bairro | Texto | Sim | Bairro | Bela Vista | - |
| Cidade | Texto | Sim | Cidade | São Paulo | - |
| Estado | Texto | Sim | Estado (UF) | SP | Máximo 2 caracteres |

## Aba 5: Saúde

| Campo | Tipo | Obrigatório | Descrição | Exemplo | Validação |
|-------|------|-------------|-----------|---------|-----------|
| Alergias | Texto (Lista) | Não | Lista de alergias conhecidas | Amendoim, Lactose | Pode adicionar múltiplas |
| Doenças | Texto (Lista) | Não | Lista de doenças | Diabetes, Hipertensão | Pode adicionar múltiplas |
| Remédios que Usa | Texto (Lista) | Não | Lista de remédios em uso | Metformina, Losartana | Pode adicionar múltiplos |
| Contatos de Emergência | Objeto (Lista) | Não | Contatos de emergência | - | Pode adicionar múltiplos |
| - Nome | Texto | Não | Nome do contato | Maria Silva | - |
| - Telefone | Telefone | Não | Telefone do contato | (11) 98888-8888 | - |
| - Relação | Texto | Não | Relação com o colaborador | Mãe, Pai, Cônjuge | - |
| Tipo Sanguíneo | Select | Não | Tipo sanguíneo | A+ / A- / B+ / B- / AB+ / AB- / O+ / O- / Não informado | - |
| Plano de Saúde | Texto | Não | Nome do plano de saúde | Unimed | - |
| Número do Plano de Saúde | Texto | Não | Número da carteirinha | 123456789 | - |

## Observações Importantes

1. **Campos Calculados**: Os campos INSS, IRRF, FGTS e Custo Total são calculados automaticamente e não devem ser preenchidos manualmente.

2. **Campos Condicionais**: 
   - PIS/PASEP aparece apenas para contratos CLT
   - CNPJ aparece apenas para contratos PJ

3. **Listas Múltiplas**: 
   - Alergias, Doenças e Remédios permitem adicionar múltiplos itens
   - Material e Assinaturas permite adicionar múltiplos itens com descrição e valor
   - Contatos de Emergência permite adicionar múltiplos contatos

4. **Validações**:
   - Emails devem ter formato válido
   - CPF e CNPJ devem ter formato válido
   - Telefones devem ter formato válido
   - Data de término não pode ser anterior à data de admissão
   - Pelo menos um telefone é obrigatório

5. **Campos com Valor Padrão**:
   - Material e Assinaturas: campo "Swile" aparece por padrão
   - Alergias, Doenças, Remédios e Contatos de Emergência: sempre há pelo menos um campo vazio disponível

## Formato de Dados

- **Moeda**: Formato brasileiro (R$ 1.234,56)
- **Data**: Formato ISO (YYYY-MM-DD) ou DD/MM/YYYY
- **Telefone**: Formato brasileiro ((11) 99999-9999)
- **CPF**: Formato brasileiro (123.456.789-00)
- **CNPJ**: Formato brasileiro (12.345.678/0001-90)
- **CEP**: Formato brasileiro (12345-678)

## Fluxo de Preenchimento

1. Preencha a aba "Dados Pessoais"
2. Clique em "Avançar" para ir para "Contrato"
3. Preencha os dados do contrato e horários
4. Clique em "Avançar" para ir para "Financeiro"
5. Preencha os dados financeiros
6. Clique em "Avançar" para ir para "Endereço"
7. Preencha o endereço (ou use a busca por CEP)
8. Clique em "Avançar" para ir para "Saúde"
9. Preencha as informações de saúde
10. Clique em "Salvar" para finalizar

