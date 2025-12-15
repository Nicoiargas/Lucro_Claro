import * as React from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export interface RGInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value?: string
  onChange?: (value: string) => void
}

const RGInput = React.forwardRef<HTMLInputElement, RGInputProps>(
  ({ className, value = '', onChange, ...props }, ref) => {
    const formatRG = (val: string): string => {
      // Remove tudo que não é dígito ou X
      const cleaned = val.replace(/[^\dXx]/g, '')
      
      if (!cleaned) return ''
      
      // Limita a 9 caracteres (8 dígitos + X opcional)
      const limited = cleaned.slice(0, 9)
      
      // Se tiver mais de 8 caracteres e o último não for X, adiciona X
      if (limited.length === 9 && !limited.endsWith('X') && !limited.endsWith('x')) {
        return limited.slice(0, 8) + 'X'
      }
      
      // Aplica máscara: XX.XXX.XXX-X
      return limited
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})([\dXx])$/, '$1-$2')
        .toUpperCase()
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatRG(e.target.value)
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
        placeholder="00.000.000-0"
        maxLength={12}
        className={cn(className)}
        {...props}
      />
    )
  }
)
RGInput.displayName = "RGInput"

export { RGInput }

