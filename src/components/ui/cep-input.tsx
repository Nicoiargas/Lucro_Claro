import * as React from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export interface CEPInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value?: string
  onChange?: (value: string) => void
  onAddressFound?: (address: {
    street: string
    neighborhood: string
    city: string
    state: string
  }) => void
}

const CEPInput = React.forwardRef<HTMLInputElement, CEPInputProps>(
  ({ className, value = '', onChange, onAddressFound, ...props }, ref) => {
    const formatCEP = (val: string): string => {
      // Remove tudo que não é dígito
      const numbers = val.replace(/\D/g, '')
      
      if (!numbers) return ''
      
      // Limita a 8 dígitos
      const limited = numbers.slice(0, 8)
      
      // Aplica máscara: XXXXX-XXX
      return limited.replace(/(\d{5})(\d{1,3})$/, '$1-$2')
    }

    const fetchAddress = async (cep: string) => {
      // Remove formatação
      const cleanCEP = cep.replace(/\D/g, '')
      
      if (cleanCEP.length !== 8) return
      
      try {
        // Usa a API ViaCEP
        const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`)
        const data = await response.json()
        
        if (data.erro) {
          console.warn('CEP não encontrado')
          return
        }
        
        if (onAddressFound && data.logradouro) {
          onAddressFound({
            street: data.logradouro || '',
            neighborhood: data.bairro || '',
            city: data.localidade || '',
            state: data.uf || '',
          })
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error)
      }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatCEP(e.target.value)
      if (onChange) {
        onChange(formatted)
      }
      
      // Busca endereço quando CEP estiver completo
      if (formatted.length === 9) {
        fetchAddress(formatted)
      }
    }

    return (
      <Input
        ref={ref}
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="00000-000"
        maxLength={9}
        className={cn(className)}
        {...props}
      />
    )
  }
)
CEPInput.displayName = "CEPInput"

export { CEPInput }

