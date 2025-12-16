import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Pencil } from 'lucide-react'
import { getProjectById, type Project } from '@/utils/project-storage'
import { getCollaborators } from '@/utils/storage'

interface ProjectDetailsModalProps {
  projectId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Mock de clientes - será substituído quando o módulo de clientes estiver pronto
const mockClients: Record<string, string> = {
  '1': 'Empresa ABC Ltda',
  '2': 'Tech Solutions SA',
  '3': 'Digital Marketing Corp',
  '4': 'Inovação Tech',
}

function ProjectDetailsModal({ projectId, open, onOpenChange }: ProjectDetailsModalProps) {
  const navigate = useNavigate()
  const [project, setProject] = useState<Project | null>(null)
  const [collaborators, setCollaborators] = useState<any[]>([])

  useEffect(() => {
    if (projectId && open) {
      const projectData = getProjectById(projectId)
      setProject(projectData)
      
      if (projectData) {
        const allCollaborators = getCollaborators()
        const projectCollaborators = allCollaborators.filter(c => 
          projectData.collaborators.includes(c.id)
        )
        setCollaborators(projectCollaborators)
      }
    }
  }, [projectId, open])

  const handleEdit = () => {
    if (projectId) {
      onOpenChange(false)
      navigate(`/projects/edit/${projectId}`)
    }
  }

  if (!project) return null

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(date)
  }

  const formatCurrency = (value: string) => {
    // Se já está formatado, retorna como está
    if (value.includes(',')) {
      return `R$ ${value}`
    }
    // Se for número, formata
    const numericValue = parseFloat(value.replace(/\./g, '').replace(',', '.')) || 0
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(numericValue)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#51ad78'
      case 'onhold':
        return '#f59e0b'
      case 'completed':
        return '#6b7280'
      default:
        return '#6b7280'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativo'
      case 'onhold':
        return 'Em Pausa'
      case 'completed':
        return 'Finalizado'
      default:
        return status
    }
  }

  const getContractTypeLabel = (type: string) => {
    return type === 'fixed' ? 'Valor Fechado' : 'Mensal'
  }

  const clientName = mockClients[project.clientId] || `Cliente ID: ${project.clientId}`

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header com gradiente e badge */}
        <div 
          className="relative px-6 pt-6 pb-4 border-b"
          style={{ 
            background: `linear-gradient(135deg, ${getStatusColor(project.status)}15 0%, transparent 100%)`
          }}
        >
          <div className="flex items-start justify-between gap-4 pr-8">
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-2xl font-bold mb-2" style={{ color: '#28314d' }}>
                {project.projectName}
              </DialogTitle>
              <div className="flex items-center gap-3 flex-wrap">
                <Badge
                  variant="outline"
                  className="text-sm font-medium px-3 py-1"
                  style={{
                    backgroundColor: getStatusColor(project.status) + '20',
                    color: getStatusColor(project.status),
                    borderColor: getStatusColor(project.status)
                  }}
                >
                  {getStatusLabel(project.status)}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {getContractTypeLabel(project.contractType)}
                </span>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleEdit}
              className="flex-shrink-0"
              style={{ borderColor: '#28314d', color: '#28314d' }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Conteúdo com padding */}
        <div className="px-6 py-6 space-y-6">
          {/* Valor destacado */}
          <div className="bg-muted/50 rounded-lg p-6 border-2" style={{ borderColor: getStatusColor(project.status) + '40' }}>
            <p className="text-sm text-muted-foreground mb-2">
              {project.contractType === 'monthly' ? 'Valor Mensal' : 'Valor Total do Projeto'}
            </p>
            <p className="font-bold text-3xl" style={{ color: getStatusColor(project.status) }}>
              {formatCurrency(project.value)}
            </p>
          </div>

          {/* Informações Básicas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2" style={{ color: '#28314d' }}>
              Informações do Projeto
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border bg-card">
                <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">Cliente</p>
                <p className="font-semibold text-base" style={{ color: '#28314d' }}>{clientName}</p>
              </div>
              <div className="p-4 rounded-lg border bg-card">
                <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">Data de Início</p>
                <p className="font-semibold text-base" style={{ color: '#28314d' }}>
                  {formatDate(project.startDate)}
                </p>
              </div>
              <div className="p-4 rounded-lg border bg-card">
                <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">Data de Finalização</p>
                <p className="font-semibold text-base" style={{ color: '#28314d' }}>
                  {formatDate(project.endDate)}
                </p>
              </div>
              <div className="p-4 rounded-lg border bg-card">
                <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">Duração</p>
                <p className="font-semibold text-base" style={{ color: '#28314d' }}>
                  {(() => {
                    const start = new Date(project.startDate)
                    const end = new Date(project.endDate)
                    const diffTime = Math.abs(end.getTime() - start.getTime())
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                    return `${diffDays} ${diffDays === 1 ? 'dia' : 'dias'}`
                  })()}
                </p>
              </div>
            </div>
          </div>

          {/* Colaboradores */}
          {collaborators.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2" style={{ color: '#28314d' }}>
                Colaboradores ({collaborators.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {collaborators.map((collaborator) => {
                  const customCost = project.collaboratorCosts?.[collaborator.id]
                  const defaultCost = collaborator.hourlyRate || '0,00'
                  const cost = customCost || defaultCost
                  
                  return (
                    <div
                      key={collaborator.id}
                      className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold mb-1" style={{ color: '#28314d' }}>
                            {collaborator.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {collaborator.role}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs text-muted-foreground mb-1">Custo/Hora</p>
                          <p className="font-bold text-base" style={{ color: '#28314d' }}>
                            R$ {cost}
                          </p>
                          {customCost && (
                            <Badge variant="outline" className="text-xs mt-1">
                              Customizado
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Despesas */}
          {project.expenses.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2" style={{ color: '#28314d' }}>
                Despesas Adicionais ({project.expenses.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {project.expenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow flex items-center justify-between"
                  >
                    <p className="font-medium" style={{ color: '#28314d' }}>
                      {expense.name || 'Sem nome'}
                    </p>
                    <p className="font-bold text-base" style={{ color: '#28314d' }}>
                      {formatCurrency(expense.value)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Impostos */}
          {project.taxes.filter(t => t.selected).length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2" style={{ color: '#28314d' }}>
                Impostos Aplicados ({project.taxes.filter(t => t.selected).length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {project.taxes
                  .filter(tax => tax.selected)
                  .map((tax) => (
                    <div
                      key={tax.id}
                      className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow flex items-center justify-between"
                    >
                      <p className="font-medium" style={{ color: '#28314d' }}>
                        {tax.name}
                      </p>
                      <Badge variant="outline" className="font-semibold">
                        {tax.percentage || '0'}%
                      </Badge>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Mensagem quando não há colaboradores, despesas ou impostos */}
          {collaborators.length === 0 && project.expenses.length === 0 && 
           project.taxes.filter(t => t.selected).length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              Nenhuma informação adicional cadastrada
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ProjectDetailsModal

