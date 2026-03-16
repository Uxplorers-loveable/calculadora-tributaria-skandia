import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CurrencyInputProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
}

const CurrencyInput = ({ label, hint, value, onChange, placeholder = '0' }: CurrencyInputProps) => (
  <div className="space-y-2">
    <Label className="text-sm font-semibold text-grey-600 font-display">{label}</Label>
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">$</span>
      <Input
        type="number"
        className="pl-8 h-12 text-lg font-medium font-body"
        placeholder={placeholder}
        value={value || ''}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
      />
    </div>
    {hint && <p className="text-xs text-muted-foreground leading-relaxed">{hint}</p>}
  </div>
);

export default CurrencyInput;
