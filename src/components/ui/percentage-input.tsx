import * as React from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export interface PercentageInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value?: string
  onChange?: (value: string) => void
}

const PercentageInput = React.forwardRef<HTMLInputElement, PercentageInputProps>(
  ({ className, value = '', onChange, ...props }, ref) => {
    const formatPercentage = (val: string): string => {
      // Remove tudo que não é dígito
      const numbers = val.replace(/\D/g, '')
      
      if (!numbers) return ''
      
      // Limita a 2 dígitos antes da vírgula e 2 depois
      const limited = numbers.slice(0, 4)
      
      if (limited.length <= 2) {
        return limited
      }
      
      // Adiciona vírgula após 2 dígitos
      return `${limited.slice(0, 2)},${limited.slice(2)}`
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatPercentage(e.target.value)
      if (onChange) {
        onChange(formatted)
      }
    }

    return (
      <div className="relative">
        <Input
          ref={ref}
          type="text"
          value={value}
          onChange={handleChange}
          placeholder="0,00"
          maxLength={5}
          className={cn(className)}
          {...props}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          %
        </span>
      </div>
    )
  }
)
PercentageInput.displayName = "PercentageInput"

export { PercentageInput }



