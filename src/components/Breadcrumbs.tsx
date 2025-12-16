import { useLocation, Link, useParams } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getProjectById } from '@/utils/project-storage'
import { getCollaborators } from '@/utils/storage'

interface BreadcrumbItem {
  label: string
  href?: string
}

function Breadcrumbs() {
  const location = useLocation()
  const params = useParams()
  const pathname = location.pathname
  const [contextLabel, setContextLabel] = useState<string>('')

  // Não mostra breadcrumbs na página de login
  if (pathname === '/' || pathname === '/login') {
    return null
  }

  // Carrega informações contextuais (nome do projeto/colaborador) quando em modo de edição
  useEffect(() => {
    const loadContext = async () => {
      if (params.id) {
        if (pathname.includes('/projects/edit/')) {
          const project = getProjectById(params.id)
          if (project) {
            setContextLabel(project.projectName)
          }
        } else if (pathname.includes('/collaborators/edit/')) {
          const collaborators = getCollaborators()
          const collaborator = collaborators.find(c => c.id === params.id)
          if (collaborator) {
            setContextLabel(collaborator.name)
          }
        }
      }
    }
    loadContext()
  }, [params.id, pathname])

  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const paths = pathname.split('/').filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Dashboard', href: '/dashboard' }
    ]

    if (paths[0] === 'dashboard') {
      return [{ label: 'Dashboard' }]
    }

    if (paths[0] === 'projects') {
      if (paths[1] === 'new') {
        breadcrumbs.push({ label: 'Projetos', href: '/dashboard' })
        breadcrumbs.push({ label: 'Novo Projeto' })
      } else if (paths[1] === 'edit' && paths[2]) {
        breadcrumbs.push({ label: 'Projetos', href: '/dashboard' })
        breadcrumbs.push({ 
          label: contextLabel || 'Editar Projeto',
          href: undefined 
        })
      }
    }

    if (paths[0] === 'collaborators') {
      if (paths[1] === 'new') {
        breadcrumbs.push({ label: 'Colaboradores', href: '/dashboard' })
        breadcrumbs.push({ label: 'Novo Colaborador' })
      } else if (paths[1] === 'edit' && paths[2]) {
        breadcrumbs.push({ label: 'Colaboradores', href: '/dashboard' })
        breadcrumbs.push({ 
          label: contextLabel || 'Editar Colaborador',
          href: undefined 
        })
      }
    }

    if (paths[0] === 'account') {
      breadcrumbs.push({ label: 'Minha Conta' })
    }

    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs()

  if (breadcrumbs.length === 0) {
    return null
  }

  return (
    <nav 
      className="flex items-center gap-2 text-sm mb-4 sm:mb-6 flex-wrap" 
      aria-label="Breadcrumb"
    >
      <Link
        to="/dashboard"
        className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
        style={{ color: '#28314d' }}
        aria-label="Ir para Dashboard"
      >
        <Home className="h-4 w-4" />
      </Link>
      
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1
        
        return (
          <div key={index} className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            {isLast ? (
              <span 
                className="font-medium truncate max-w-[200px] sm:max-w-none"
                style={{ color: '#28314d' }}
                title={crumb.label}
              >
                {crumb.label}
              </span>
            ) : (
              <Link
                to={crumb.href || '#'}
                className="text-muted-foreground hover:text-foreground transition-colors truncate max-w-[150px] sm:max-w-none"
                style={{ color: '#28314d' }}
              >
                {crumb.label}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}

export default Breadcrumbs

