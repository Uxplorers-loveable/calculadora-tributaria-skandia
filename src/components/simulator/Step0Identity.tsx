import { useState } from 'react';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormData } from '@/lib/simulator-types';
import { getPersonalizedName } from '@/lib/personalization';

interface Step0Props {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onNext: () => void;
}

const documentSchema = z.object({
  documentType: z.enum(['Cédula de Ciudadanía', 'Cédula de Extranjería'], {
    errorMap: () => ({ message: 'Selecciona un tipo de documento.' }),
  }),
  documentNumber: z
    .string()
    .trim()
    .regex(/^\d{5,20}$/, 'Ingresa un número de documento válido.'),
});

const Step0Identity = ({ formData, setFormData, onNext }: Step0Props) => {
  const [errors, setErrors] = useState<{ documentType?: string; documentNumber?: string }>({});
  const userName = getPersonalizedName(formData.documentNumber);

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
    <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-6">
      <Card data-sami-key="step0_intro" className="skandia-card space-y-6">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Bienvenido</p>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-foreground max-w-3xl">
            {userName
              ? `Hola ${userName}, hagamos que tu estrategia patrimonial avance con una lectura simple de tu beneficio tributario.`
              : 'Haz que tu estrategia patrimonial avance con una lectura simple de tu beneficio tributario.'}
          </h1>
          <p className="text-base leading-8 text-muted-foreground max-w-3xl">
            En Skandia conectas tu capital con oportunidades globales y conviertes tu Fondo de Pensiones Voluntarias en una herramienta para crecer con mayor eficiencia. Este simulador te muestra ese panorama de forma clara y cercana.
          </p>
          <p className="text-sm leading-7 text-foreground max-w-3xl">
            Con el acompañamiento de nuestros Wealth Planners, información simple y seguimiento continuo, tu portafolio puede evolucionar contigo.
          </p>
        </div>
      </Card>

      <Card className="skandia-card space-y-8 mb-6">
        <div className="space-y-2">
          <h2 className="text-lg font-bold font-display text-foreground">
            {userName ? `Hola ${userName}, comencemos con tus datos básicos` : 'Comencemos con tus datos básicos'}
          </h2>
          <p className="text-sm text-muted-foreground">Solo te tomará un momento. Así iniciamos tu simulación con un contexto más preciso.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
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
              onChange={(e) => update({ documentNumber: e.target.value.replace(/\D/g, '') })}
            />
            <p className="text-xs text-muted-foreground">Escríbelo solo con números.</p>
            {errors.documentNumber && <p className="text-xs text-destructive">{errors.documentNumber}</p>}
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleContinue} className="h-12 rounded-full bg-primary px-8 text-primary-foreground hover:bg-primary/90">
          Empezar <ChevronRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export default Step0Identity;
