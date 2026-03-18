import { useState } from 'react';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SamiBubble from './SamiBubble';
import { FormData } from '@/lib/simulator-types';

interface Step0Props {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onNext: () => void;
}

const documentSchema = z.object({
  documentType: z.enum([
    'Cédula de Ciudadanía',
    'Tarjeta de Identidad',
    'Cédula de Extranjería',
    'Registro Civil de Nacimiento',
  ], {
    errorMap: () => ({ message: 'Selecciona un tipo de documento.' }),
  }),
  documentNumber: z
    .string()
    .trim()
    .regex(/^\d{5,20}$/, 'Ingresa un número de documento válido.'),
});

const Step0Identity = ({ formData, setFormData, onNext }: Step0Props) => {
  const [errors, setErrors] = useState<{ documentType?: string; documentNumber?: string }>({});

  const update = (partial: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...partial }));
    setErrors((prev) => ({ ...prev, ...Object.keys(partial).reduce((acc, key) => ({ ...acc, [key]: undefined }), {}) }));
  };

  const handleContinue = () => {
    const result = documentSchema.safeParse({
      documentType: formData.documentType,
      documentNumber: formData.documentNumber,
    });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        documentType: fieldErrors.documentType?.[0],
        documentNumber: fieldErrors.documentNumber?.[0],
      });
      return;
    }

    setErrors({});
    onNext();
  };

  return (
    <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
      <SamiBubble text="Antes de comenzar, necesitamos validar tus datos para empezar tu simulación tributaria." />

      <Card className="skandia-card space-y-8 mb-6">
        <div className="space-y-2">
          <h3 className="text-lg font-bold font-display text-foreground">Validación inicial</h3>
          <p className="text-sm text-muted-foreground">Ingresa tu tipo y número de documento para continuar con la calculadora.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-grey-600 font-display">Tipo de documento</Label>
            <Select value={formData.documentType} onValueChange={(value) => update({ documentType: value })}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Selecciona una opción" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cédula de Ciudadanía">Cédula de Ciudadanía</SelectItem>
                <SelectItem value="Tarjeta de Identidad">Tarjeta de Identidad</SelectItem>
                <SelectItem value="Cédula de Extranjería">Cédula de Extranjería</SelectItem>
                <SelectItem value="Registro Civil de Nacimiento">Registro Civil de Nacimiento</SelectItem>
              </SelectContent>
            </Select>
            {errors.documentType && <p className="text-xs text-destructive">{errors.documentType}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-grey-600 font-display">
              Número de documento <span className="text-destructive">*</span>
            </Label>
            <Input
              type="text"
              inputMode="numeric"
              required
              aria-required="true"
              aria-invalid={errors.documentNumber ? 'true' : 'false'}
              className="h-12 text-base font-medium"
              placeholder="Ingresa tu número"
              value={formData.documentNumber}
              onChange={(e) => update({ documentNumber: e.target.value.replace(/\D/g, '') })}
            />
            <p className="text-xs text-muted-foreground">Solo números, sin puntos ni espacios.</p>
            {errors.documentNumber && <p className="text-xs text-destructive">{errors.documentNumber}</p>}
          </div>
        </div>
      </Card>

      <div className="skandia-hero-dark p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-sm text-grey-400">Paso previo obligatorio</p>
          <p className="text-lg font-bold font-display">Valida tu documento para iniciar</p>
        </div>
        <Button onClick={handleContinue} className="bg-primary hover:bg-skandia-green-dark text-primary-foreground h-12 px-8 rounded-full">
          Empezar <ChevronRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export default Step0Identity;
