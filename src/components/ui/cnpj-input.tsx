import * as React from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export interface CNPJInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value?: string
  onChange?: (value: string) => void
}

const CNPJInput = React.forwardRef<HTMLInputElement, CNPJInputProps>(
  ({ className, value = '', onChange, ...props }, ref) => {
    const formatCNPJ = (val: string): string => {
      // Remove tudo que não é dígito
      const numbers = val.replace(/\D/g, '')
      
      if (!numbers) return ''
      
      // Limita a 14 dígitos
      const limited = numbers.slice(0, 14)
      
      // Aplica máscara: XX.XXX.XXX/XXXX-XX
      return limited
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d{1,2})$/, '$1-$2')
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatCNPJ(e.target.value)
      if (onChange) {
        onChange(formatted)
      }
    }

    return (
      <Input
        ref={ref}
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="00.000.000/0000-00"
        maxLength={18}
        className={cn(className)}
        {...props}
      />
    )
  }
)
CNPJInput.displayName = "CNPJInput"

export { CNPJInput }

