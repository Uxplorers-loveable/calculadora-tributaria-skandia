import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormData } from '@/lib/simulator-types';

interface Step0Props {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onNext: () => void;
  registerNavigation: (navigation: {back?: () => void;next?: () => void;nextLabel?: string;}) => void;
}

const documentSchema = z.object({
  documentType: z.enum(['Cédula de Ciudadanía', 'Cédula de Extranjería'], {
    errorMap: () => ({ message: 'Selecciona un tipo de documento.' })
  }),
  documentNumber: z.
  string().
  trim().
  regex(/^\d{5,20}$/, 'Ingresa un número de documento válido.'),
  acceptedPolicy: z.literal(true, {
    errorMap: () => ({ message: 'Debes aceptar la política de tratamiento de datos.' })
  })
});

const Step0Identity = ({ formData, setFormData, onNext, registerNavigation }: Step0Props) => {
  const [errors, setErrors] = useState<{documentType?: string;documentNumber?: string;}>({});

  const update = (partial: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...partial }));
    setErrors((prev) => ({ ...prev, ...Object.keys(partial).reduce((acc, key) => ({ ...acc, [key]: undefined }), {}) }));
  };

  const handleContinue = useCallback(() => {
    const result = documentSchema.safeParse({
      documentType: formData.documentType,
      documentNumber: formData.documentNumber
    });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        documentType: fieldErrors.documentType?.[0],
        documentNumber: fieldErrors.documentNumber?.[0]
      });
      return;
    }

    setErrors({});
    onNext();
  }, [formData.documentNumber, formData.documentType, onNext]);

  useEffect(() => {
    registerNavigation({ next: handleContinue, nextLabel: 'Empezar' });
    return () => registerNavigation({});
  }, [handleContinue, registerNavigation]);

  return (
    <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="flex min-h-full flex-col">
      <div className="space-y-6">
        <Card data-sami-key="step0_intro" className="skandia-card space-y-6">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Te damos la bienvenida</p>
            <h1 className="max-w-3xl font-display text-3xl font-bold text-foreground sm:text-2xl">
              Las inversiones que buscas están aquí.
            </h1>
            <p className="max-w-3xl text-base leading-8 text-muted-foreground">Convertimos tu Fondo de Pensiones Voluntarias en una herramienta de optimización tributaria, para que tu patrimonio crezca con mayor eficiencia.</p>
            <p className="max-w-3xl text-sm leading-7 text-foreground">Este simulador te muestra ese panorama de forma clara y cercana.</p>
          </div>
        </Card>

        <Card className="skandia-card mb-6 space-y-8">
          <div className="space-y-2">
            <h2 className="text-lg font-bold font-display text-foreground">Comencemos con tus datos básicos</h2>
            <p className="text-sm text-muted-foreground">Solo te tomará un momento. Así iniciamos tu simulación con un contexto más preciso.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div data-sami-key="documentType" className="space-y-2">
              <Label className="text-sm font-semibold text-grey-600 font-display">Tipo de documento</Label>
              <Select value={formData.documentType} onValueChange={(value) => update({ documentType: value })}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Selecciona una opción" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cédula de Ciudadanía">Cédula de Ciudadanía</SelectItem>
                  <SelectItem value="Cédula de Extranjería">Cédula de Extranjería</SelectItem>
                </SelectContent>
              </Select>
              {errors.documentType && <p className="text-xs text-destructive">{errors.documentType}</p>}
            </div>

            <div data-sami-key="documentNumber" className="space-y-2">
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
                placeholder="Ej. 123456789"
                value={formData.documentNumber}
                onChange={(e) => update({ documentNumber: e.target.value.replace(/\D/g, '') })} />
              

              <p className="text-xs text-muted-foreground">Escríbelo solo con números.</p>
              {errors.documentNumber && <p className="text-xs text-destructive">{errors.documentNumber}</p>}
            </div>
          </div>
        </Card>
      </div>
    </motion.div>);

};

export default Step0Identity;