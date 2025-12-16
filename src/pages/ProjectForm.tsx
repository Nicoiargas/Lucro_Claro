import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getCollaborators, type Collaborator, addProjectToCollaboratorHistory, updateCollaborator } from '@/utils/storage'
import { saveProject, updateProject, deleteProject, getProjectById, getActiveProjectsByCollaborator, type Project } from '@/utils/project-storage'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Combobox } from '@/components/ui/combobox'
import { Checkbox } from '@/components/ui/checkbox'
import { CurrencyInput } from '@/components/ui/currency-input'
import { PercentageInput } from '@/components/ui/percentage-input'
import { DateInput } from '@/components/ui/date-input'
import Breadcrumbs from '@/components/Breadcrumbs'
import UserMenu from '@/components/UserMenu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Trash2, Save, Plus, X } from 'lucide-react'

// Dados mockados - serão substituídos quando os módulos estiverem prontos
const mockClients = [
  { value: '1', label: 'Empresa ABC Ltda' },
  { value: '2', label: 'Tech Solutions SA' },
  { value: '3', label: 'Digital Marketing Corp' },
  { value: '4', label: 'Inovação Tech' },
]


const mockTaxes = [
  { id: '1', name: 'ISS' },
  { id: '2', name: 'IRRF' },
  { id: '3', name: 'PIS' },
  { id: '4', name: 'COFINS' },
]

interface ExpenseItem {
  id: string
  name: string
  value: string
}

interface TaxItem {
  id: string
  name: string
  percentage: string
  selected: boolean
}

function ProjectForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = !!id
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])

  useEffect(() => {
    // Carrega colaboradores do storage
    const loadCollaborators = () => {
      const loadedCollaborators = getCollaborators()
      setCollaborators(loadedCollaborators)
    }
    
    loadCollaborators()
    
    // Recarrega quando a janela recebe foco (quando volta da página de cadastro)
    const handleFocus = () => {
      loadCollaborators()
    }
    
    window.addEventListener('focus', handleFocus)
    
    return () => {
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  // Carrega projeto existente se for edição
  useEffect(() => {
    if (isEdit && id) {
      const project = getProjectById(id)
      if (project) {
        setFormData({
          projectName: project.projectName,
          clientId: project.clientId,
          startDate: project.startDate,
          endDate: project.endDate,
          contractType: project.contractType,
          value: project.value,
          collaborators: project.collaborators,
          expenses: project.expenses,
          taxes: project.taxes.map(t => ({
            id: t.id,
            name: t.name,
            percentage: t.percentage,
            selected: t.selected
          })),
        })
        setCollaboratorCosts(project.collaboratorCosts || {})
      }
    }
  }, [isEdit, id])

  const [formData, setFormData] = useState({
    projectName: '',
    clientId: '',
    startDate: '',
    endDate: '',
    contractType: 'fixed' as 'fixed' | 'monthly',
    value: '',
    collaborators: [] as string[],
    expenses: [] as ExpenseItem[],
    taxes: [] as TaxItem[],
  })
  const [collaboratorCosts, setCollaboratorCosts] = useState<Record<string, string>>({})
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteConfirmed, setDeleteConfirmed] = useState(false)

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleClientChange = (value: string) => {
    handleInputChange('clientId', value)
  }

  const handleAddNewClient = () => {
    // Aqui será implementado quando o módulo de clientes estiver pronto
    alert('Funcionalidade de adicionar cliente será implementada no módulo de clientes')
  }

  const handleCollaboratorToggle = (collaboratorId: string) => {
    setFormData(prev => {
      const isSelected = prev.collaborators.includes(collaboratorId)
      const newCollaborators = isSelected
        ? prev.collaborators.filter(id => id !== collaboratorId)
        : [...prev.collaborators, collaboratorId]
      
      // Remove custo customizado se colaborador foi removido
      if (isSelected) {
        setCollaboratorCosts(prev => {
          const newCosts = { ...prev }
          delete newCosts[collaboratorId]
          return newCosts
        })
      } else {
        // Define custo padrão do colaborador quando adicionado
        const collaborator = collaborators.find(c => c.id === collaboratorId)
        if (collaborator?.hourlyRate) {
          setCollaboratorCosts(prev => ({
            ...prev,
            [collaboratorId]: collaborator.hourlyRate
          }))
        }
      }
      
      return {
        ...prev,
        collaborators: newCollaborators
      }
    })
  }

  const handleCollaboratorCostChange = (collaboratorId: string, cost: string) => {
    setCollaboratorCosts(prev => ({
      ...prev,
      [collaboratorId]: cost
    }))
  }

  const handleAddExpense = () => {
    const newExpense: ExpenseItem = {
      id: Date.now().toString(),
      name: '',
      value: '',
    }
    setFormData(prev => ({
      ...prev,
      expenses: [...prev.expenses, newExpense]
    }))
  }

  const handleRemoveExpense = (id: string) => {
    setFormData(prev => ({
      ...prev,
      expenses: prev.expenses.filter(exp => exp.id !== id)
    }))
  }

  const handleExpenseChange = (id: string, field: 'name' | 'value', value: string) => {
    setFormData(prev => ({
      ...prev,
      expenses: prev.expenses.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }))
  }

  const handleTaxToggle = (taxId: string) => {
    setFormData(prev => {
      const tax = prev.taxes.find(t => t.id === taxId)
      if (tax) {
        // Se já existe, apenas alterna o selected
        return {
          ...prev,
          taxes: prev.taxes.map(t =>
            t.id === taxId ? { ...t, selected: !t.selected } : t
          )
        }
      } else {
        // Se não existe, adiciona
        const mockTax = mockTaxes.find(t => t.id === taxId)
        if (mockTax) {
          return {
            ...prev,
            taxes: [...prev.taxes, { ...mockTax, percentage: '', selected: true }]
          }
        }
      }
      return prev
    })
  }

  const handleTaxPercentageChange = (taxId: string, percentage: string) => {
    setFormData(prev => ({
      ...prev,
      taxes: prev.taxes.map(t =>
        t.id === taxId ? { ...t, percentage } : t
      )
    }))
  }

  const handleSave = () => {
    // Validação básica
    if (!formData.projectName || !formData.clientId || !formData.startDate || !formData.endDate) {
      alert('Por favor, preencha todos os campos obrigatórios')
      return
    }

    if (!formData.value) {
      alert('Por favor, informe o valor do projeto')
      return
    }

    // Validação de data
    const startDate = new Date(formData.startDate)
    const endDate = new Date(formData.endDate)
    if (endDate < startDate) {
      alert('A data de finalização não pode ser anterior à data de início')
      return
    }

    const projectData: Omit<Project, 'id'> = {
      projectName: formData.projectName,
      clientId: formData.clientId,
      startDate: formData.startDate,
      endDate: formData.endDate,
      contractType: formData.contractType,
      value: formData.value,
      collaborators: formData.collaborators,
      collaboratorCosts: Object.keys(collaboratorCosts).length > 0 ? collaboratorCosts : undefined,
      expenses: formData.expenses,
      taxes: formData.taxes.map(t => ({
        id: t.id,
        name: t.name,
        percentage: t.percentage,
        selected: t.selected
      })),
      status: 'active'
    }

    let savedProject: Project

    if (isEdit && id) {
      // Atualizar projeto existente
      const updated = updateProject(id, projectData)
      if (!updated) {
        alert('Erro ao atualizar projeto')
        return
      }
      savedProject = updated
    } else {
      // Criar novo projeto
      savedProject = saveProject(projectData)
    }

    // Se for edição, verificar colaboradores removidos
    if (isEdit && id) {
      const oldProject = getProjectById(id)
      if (oldProject) {
        // Colaboradores que foram removidos
        const removedCollaborators = oldProject.collaborators.filter(
          id => !formData.collaborators.includes(id)
        )
        
        removedCollaborators.forEach(collaboratorId => {
          const collaborator = collaborators.find(c => c.id === collaboratorId)
            // Se o currentProject era este projeto, limpa
          if (collaborator && collaborator.currentProject === oldProject.projectName) {
            // Verifica se o colaborador está em outros projetos ativos
            const activeProjects = getActiveProjectsByCollaborator(collaboratorId)
            const otherActiveProjects = activeProjects.filter(p => p.id !== id)
            
            if (otherActiveProjects.length > 0) {
              // Atualiza para o primeiro projeto ativo
              updateCollaborator(collaboratorId, {
                currentProject: otherActiveProjects[0].projectName,
                status: 'busy' as const
              })
            } else {
              // Não tem outros projetos, fica disponível
              updateCollaborator(collaboratorId, {
                currentProject: undefined,
                status: 'available' as const
              })
            }
          }
        })
      }
    }

    // Atualizar histórico de colaboradores
    formData.collaborators.forEach(collaboratorId => {
      const hourlyRate = collaboratorCosts[collaboratorId] || 
        collaborators.find(c => c.id === collaboratorId)?.hourlyRate || 
        '0,00'
      
      addProjectToCollaboratorHistory(
        collaboratorId,
        savedProject.id,
        savedProject.projectName,
        savedProject.startDate,
        savedProject.endDate,
        hourlyRate
      )

      // Atualizar currentProject do colaborador
      const collaborator = collaborators.find(c => c.id === collaboratorId)
      if (collaborator) {
        updateCollaborator(collaboratorId, {
          currentProject: savedProject.projectName,
          status: 'busy' as const
        })
      }
    })

    alert('Projeto salvo com sucesso!')
    navigate('/dashboard')
  }

  const handleDeleteClick = () => {
    setShowDeleteDialog(true)
    setDeleteConfirmed(false)
  }

  const handleDeleteConfirm = () => {
    if (!isEdit || !id) return

    if (!deleteConfirmed) {
      setDeleteConfirmed(true)
      return
    }

    const deleted = deleteProject(id)
    if (deleted) {
      // Atualizar colaboradores para remover referência ao projeto
      formData.collaborators.forEach(collaboratorId => {
        const collaborator = collaborators.find(c => c.id === collaboratorId)
        if (collaborator && collaborator.currentProject === formData.projectName) {
          updateCollaborator(collaboratorId, {
            currentProject: undefined,
            status: 'available' as const
          })
        }
      })
      
      alert('Projeto deletado com sucesso!')
      navigate('/dashboard')
    } else {
      alert('Erro ao deletar projeto')
    }
  }


  return (
    <div className="min-h-screen bg-muted/50">
      <div className="container mx-auto px-4 py-8">
        {/* Header com Logo e Menu do Usuário */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex-1"></div>
          <div className="flex-1 flex justify-center">
            <img 
              src="/logo2.svg" 
              alt="Lucro Claro" 
              style={{ height: '50px', width: 'auto' }}
            />
          </div>
          <div className="flex-1 flex justify-end">
            <UserMenu />
          </div>
        </div>

        {/* Breadcrumbs */}
        <div className="max-w-4xl mx-auto mb-6">
          <Breadcrumbs />
        </div>

        <Card className="max-w-4xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl" style={{ color: '#28314d' }}>
              {isEdit ? 'Editar Projeto' : 'Cadastro de Projeto'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Nome do Projeto */}
            <div className="space-y-2">
              <Label htmlFor="projectName" style={{ color: '#28314d' }}>
                Nome do Projeto *
              </Label>
              <Input
                id="projectName"
                value={formData.projectName}
                onChange={(e) => handleInputChange('projectName', e.target.value)}
                placeholder="Digite o nome do projeto"
                className="border-primary/20 focus:border-primary"
              />
            </div>

            {/* Nome do Cliente */}
            <div className="space-y-2">
              <Label htmlFor="client" style={{ color: '#28314d' }}>
                Nome do Cliente *
              </Label>
              <Combobox
                options={mockClients}
                value={formData.clientId}
                onValueChange={handleClientChange}
                placeholder="Selecione ou busque um cliente"
                searchPlaceholder="Buscar cliente..."
                emptyText="Cliente não encontrado"
                onAddNew={handleAddNewClient}
                addNewText="Adicionar cliente"
              />
            </div>

            {/* Datas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate" style={{ color: '#28314d' }}>
                  Data de Início *
                </Label>
                <DateInput
                  id="startDate"
                  value={formData.startDate}
                  onChange={(value) => handleInputChange('startDate', value)}
                  placeholder="DD/MM/AAAA"
                  className="border-primary/20 focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate" style={{ color: '#28314d' }}>
                  Data Prevista de Finalização *
                </Label>
                <DateInput
                  id="endDate"
                  value={formData.endDate}
                  onChange={(value) => handleInputChange('endDate', value)}
                  placeholder="DD/MM/AAAA"
                  className="border-primary/20 focus:border-primary"
                />
              </div>
            </div>

            {/* Tipo de Contrato */}
            <div className="space-y-2">
              <Label htmlFor="contractType" style={{ color: '#28314d' }}>
                Tipo de Contrato *
              </Label>
              <Select
                value={formData.contractType}
                onValueChange={(value: 'fixed' | 'monthly') => {
                  handleInputChange('contractType', value)
                  handleInputChange('value', '')
                }}
              >
                <SelectTrigger className="border-primary/20 focus:border-primary">
                  <SelectValue placeholder="Selecione o tipo de contrato" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Valor Fechado</SelectItem>
                  <SelectItem value="monthly">Mensal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Valor */}
            <div className="space-y-2">
              <Label htmlFor="value" style={{ color: '#28314d' }}>
                {formData.contractType === 'monthly' ? 'Valor Mensal *' : 'Valor Total *'}
              </Label>
              <CurrencyInput
                id="value"
                value={formData.value}
                onChange={(value) => handleInputChange('value', value)}
                className="border-primary/20 focus:border-primary"
              />
            </div>

            {/* Colaboradores */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label style={{ color: '#28314d' }}>
                  Colaboradores que executarão o projeto
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/collaborators/new')}
                  className="text-xs"
                >
                  + Novo Colaborador
                </Button>
              </div>
              <div className="border rounded-md p-4 space-y-4 max-h-96 overflow-y-auto">
                {collaborators.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Nenhum colaborador cadastrado. Clique em "Novo Colaborador" para adicionar.
                  </p>
                ) : (
                  collaborators.map((collaborator) => {
                    const isSelected = formData.collaborators.includes(collaborator.id)
                    const defaultRate = collaborator.hourlyRate || '0,00'
                    const customRate = collaboratorCosts[collaborator.id] || defaultRate
                    
                    return (
                      <div key={collaborator.id} className="space-y-2 pb-3 border-b last:border-b-0">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`collab-${collaborator.id}`}
                            checked={isSelected}
                            onCheckedChange={() => handleCollaboratorToggle(collaborator.id)}
                          />
                          <Label
                            htmlFor={`collab-${collaborator.id}`}
                            className="font-normal cursor-pointer flex-1"
                          >
                            <div>
                              <span>{collaborator.name}</span>
                              <span className="text-xs text-muted-foreground ml-2">
                                ({collaborator.role})
                              </span>
                            </div>
                          </Label>
                        </div>
                        {isSelected && (
                          <div className="ml-7 space-y-2">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 space-y-1">
                                <Label htmlFor={`cost-${collaborator.id}`} className="text-xs">
                                  Custo/Hora (padrão: R$ {defaultRate})
                                </Label>
                                <CurrencyInput
                                  id={`cost-${collaborator.id}`}
                                  value={customRate}
                                  onChange={(value) => handleCollaboratorCostChange(collaborator.id, value)}
                                  className="border-primary/20 focus:border-primary text-sm"
                                />
                              </div>
                            </div>
                            {customRate !== defaultRate && (
                              <p className="text-xs text-muted-foreground">
                                Custo customizado para este projeto
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })
                )}
              </div>
            </div>

            {/* Despesas Adicionais - Inventário */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label style={{ color: '#28314d' }}>
                  Despesas Adicionais (Inventário)
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddExpense}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Adicionar Item
                </Button>
              </div>
              <div className="space-y-3 border rounded-md p-4">
                {formData.expenses.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Nenhum item adicionado. Clique em "Adicionar Item" para começar.
                  </p>
                ) : (
                  formData.expenses.map((expense) => (
                    <div key={expense.id} className="flex gap-3 items-end">
                      <div className="flex-1 space-y-2">
                        <Label htmlFor={`expense-name-${expense.id}`} className="text-xs">
                          Nome do Item
                        </Label>
                        <Input
                          id={`expense-name-${expense.id}`}
                          value={expense.name}
                          onChange={(e) => handleExpenseChange(expense.id, 'name', e.target.value)}
                          placeholder="Ex: Computador"
                          className="border-primary/20 focus:border-primary"
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <Label htmlFor={`expense-value-${expense.id}`} className="text-xs">
                          Valor
                        </Label>
                        <CurrencyInput
                          id={`expense-value-${expense.id}`}
                          value={expense.value}
                          onChange={(value) => handleExpenseChange(expense.id, 'value', value)}
                          className="border-primary/20 focus:border-primary"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveExpense(expense.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Impostos */}
            <div className="space-y-2">
              <Label style={{ color: '#28314d' }}>
                Impostos Aplicados a Este Projeto
              </Label>
              <div className="border rounded-md p-4 space-y-4 max-h-96 overflow-y-auto">
                {mockTaxes.map((tax) => {
                  const selectedTax = formData.taxes.find(t => t.id === tax.id)
                  const isSelected = selectedTax?.selected || false
                  
                  return (
                    <div key={tax.id} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`tax-${tax.id}`}
                          checked={isSelected}
                          onCheckedChange={() => handleTaxToggle(tax.id)}
                        />
                        <Label
                          htmlFor={`tax-${tax.id}`}
                          className="font-normal cursor-pointer flex-1"
                        >
                          {tax.name}
                        </Label>
                      </div>
                      {isSelected && (
                        <div className="ml-6 space-y-2">
                          <Label htmlFor={`tax-percentage-${tax.id}`} className="text-xs">
                            Percentual
                          </Label>
                          <PercentageInput
                            id={`tax-percentage-${tax.id}`}
                            value={selectedTax?.percentage || ''}
                            onChange={(value) => handleTaxPercentageChange(tax.id, value)}
                            className="border-primary/20 focus:border-primary"
                          />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Botões */}
            <div className="flex justify-between pt-4 border-t">
              <Button
                variant="destructive"
                onClick={handleDeleteClick}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Deletar Contrato
              </Button>
              <Button
                onClick={handleSave}
                className="flex items-center gap-2"
                style={{ backgroundColor: '#28314d', borderColor: '#28314d' }}
              >
                <Save className="h-4 w-4" />
                Salvar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Dialog de Confirmação de Exclusão */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Exclusão</DialogTitle>
              <DialogDescription>
                {!deleteConfirmed
                  ? 'Tem certeza que deseja deletar este contrato? Esta ação não pode ser desfeita.'
                  : 'Esta é a confirmação final. Clique novamente em "Confirmar" para deletar permanentemente.'}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteDialog(false)
                  setDeleteConfirmed(false)
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteConfirm}
              >
                {deleteConfirmed ? 'Confirmar Exclusão' : 'Confirmar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default ProjectForm

