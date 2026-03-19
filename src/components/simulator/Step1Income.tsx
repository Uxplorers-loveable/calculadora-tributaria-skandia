import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import SkandiaTooltip from './SkandiaTooltip';
import CurrencyInput from './CurrencyInput';
import { FormData } from '@/lib/simulator-types';
import { MINIMO_INT, formatCOP } from '@/lib/tax-engine';

interface Step1Props {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  totalIngresos: number;
  onNext: () => void;
}

const Step1Income = ({ formData, setFormData, totalIngresos, onNext }: Step1Props) => {
  const [salaryError, setSalaryError] = useState<string | null>(null);

  const update = (partial: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...partial }));

    if ('salMensual' in partial && (partial.salMensual ?? 0) > 0) {
      setSalaryError(null);
    }
  };

  const handleNext = () => {
    if (!formData.salMensual || formData.salMensual <= 0) {
      setSalaryError('Completa tu salario básico mensual para continuar.');
      return;
    }

    setSalaryError(null);
    onNext();
  };

  return (
    <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="flex min-h-full flex-col">
      <div className="space-y-6">
        <Card className="skandia-card mb-6 space-y-8">
          <h2 className="text-lg font-bold font-display text-foreground">Tus ingresos</h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div data-sami-key="income_salary">
              <CurrencyInput
                label="Salario básico mensual *"
                hint="Tu salario base antes de descuentos. Si recibes otros ingresos, los veremos más abajo."
                value={formData.salMensual}
                onChange={(v) => update({ salMensual: v })}
              />
              {salaryError && <p className="mt-2 text-xs text-destructive">{salaryError}</p>}
              {formData.tipo === 'Integral' && formData.salMensual > 0 && formData.salMensual < MINIMO_INT && (
                <Badge variant="outline" className="mt-2 border-skandia-gold-border bg-skandia-gold-light text-foreground">
                  El mínimo para salario integral es ${formatCOP(MINIMO_INT)}
                </Badge>
              )}
            </div>

            <div data-sami-key="income_salary_type" className="space-y-2">
              <Label className="text-sm font-semibold text-grey-600 font-display">Tipo de salario</Label>
              <Select value={formData.tipo} onValueChange={(v) => update({ tipo: v as 'Ordinario' | 'Integral' })}>
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ordinario">Ordinario – recibo prima y cesantías</SelectItem>
                  <SelectItem value="Integral">Integral – todo va incluido en el salario</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Esto nos ayuda a proyectar tu ingreso anual correctamente.</p>
            </div>
          </div>

          <SkandiaTooltip
            color="blue"
            content="Si tu contrato dice salario integral, elige esa opción. Si no, normalmente corresponde a salario ordinario."
          />

          <div className="space-y-6 border-t border-border pt-6">
            <div data-sami-key="income_auxilios">
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">¿Recibes auxilios?</p>
                  <p className="text-xs text-muted-foreground">Por ejemplo, alimentación, conectividad o movilización.</p>
                </div>
                <Switch checked={formData.hasAuxilios} onCheckedChange={(v) => update({ hasAuxilios: v, auxMensual: v ? formData.auxMensual : 0 })} />
              </div>
              {formData.hasAuxilios && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-4">
                  <CurrencyInput
                    label="¿Cuánto recibes al mes en auxilios?"
                    hint="Si cambia mes a mes, usa un promedio."
                    value={formData.auxMensual}
                    onChange={(v) => update({ auxMensual: v })}
                  />
                </motion.div>
              )}
            </div>

            <div data-sami-key="income_variable">
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">¿Recibes comisiones o ingresos variables?</p>
                  <p className="text-xs text-muted-foreground">Si una parte de tu ingreso cambia, aquí puedes incluirla.</p>
                </div>
                <Switch checked={formData.hasVariable} onCheckedChange={(v) => update({ hasVariable: v, variableAnual: v ? formData.variableAnual : 0 })} />
              </div>
              {formData.hasVariable && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4">
                  <CurrencyInput
                    label="¿Cuánto recibes al mes en promedio?"
                    hint="Usa un promedio mensual para proyectar el total del año."
                    value={formData.variableAnual}
                    onChange={(v) => update({ variableAnual: v })}
                  />
                </motion.div>
              )}
            </div>

            <div data-sami-key="income_bono">
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">¿Recibes bonificación anual?</p>
                  <p className="text-xs text-muted-foreground">Por ejemplo, bono de desempeño, fin de año o utilidades.</p>
                </div>
                <Switch checked={formData.hasBono} onCheckedChange={(v) => update({ hasBono: v, bonoAnual: v ? formData.bonoAnual : 0 })} />
              </div>
              {formData.hasBono && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <CurrencyInput
                      label="Valor mensual equivalente de tu bono"
                      hint="Usa un promedio mensual equivalente para hacer la proyección anual."
                      value={formData.bonoAnual}
                      onChange={(v) => update({ bonoAnual: v })}
                    />
                    <div data-sami-key="income_bonus_type" className="space-y-2">
                      <Label className="text-sm font-semibold text-grey-600 font-display">¿Es un bono salarial?</Label>
                      <Select value={formData.bonoEsSalarial ? 'si' : 'no'} onValueChange={(v) => update({ bonoEsSalarial: v === 'si' })}>
                        <SelectTrigger className="h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="no">No salarial</SelectItem>
                          <SelectItem value="si">Salarial</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">Si no estás seguro, puedes validarlo con tu empresa.</p>
                    </div>
                  </div>
                  <SkandiaTooltip
                    color="amber"
                    content="El PAC es una forma de llevar parte de tu bono a ahorro pensional voluntario. Eso puede ayudarte a pagar menos impuesto y a construir patrimonio al mismo tiempo."
                  />
                </motion.div>
              )}
            </div>
          </div>
        </Card>

        <Card data-sami-key="income_pension" className="skandia-card mb-6 space-y-6">
          <h3 className="text-lg font-bold font-display text-foreground">Tu fondo de pensiones</h3>
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-grey-600 font-display">¿En qué fondo estás?</Label>
            <Select value={formData.fondoTipo} onValueChange={(v) => update({ fondoTipo: v })}>
              <SelectTrigger className="h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Fondo privado">Fondo privado (Skandia, Porvenir, Protección…)</SelectItem>
                <SelectItem value="Colpensiones">Colpensiones</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Esto nos ayuda a ubicar correctamente tus aportes dentro del simulador.</p>
          </div>

          <div data-sami-key="income_voluntary">
            <div className="mb-2 flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">¿Haces aportes voluntarios a tu fondo obligatorio?</p>
                <p className="text-xs text-muted-foreground">Si ya haces aportes extra, aquí los incluimos en tu panorama.</p>
              </div>
              <Switch checked={formData.hasVolOblig} onCheckedChange={(v) => update({ hasVolOblig: v, volObligAnual: v ? formData.volObligAnual : 0 })} />
            </div>
            {formData.hasVolOblig && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4">
                <CurrencyInput
                  label="¿Cuánto aportas al mes de manera voluntaria?"
                  hint="Ingresa tu promedio mensual."
                  value={formData.volObligAnual}
                  onChange={(v) => update({ volObligAnual: v })}
                />
                <SkandiaTooltip color="green" content="Estos aportes tienen un beneficio tributario diferente al del FVP y se calculan por separado." />
              </motion.div>
            )}
          </div>
        </Card>
      </div>

      <div className="sticky bottom-0 z-10 -mx-4 mt-auto border-t border-border bg-background/95 px-4 py-4 backdrop-blur-sm sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
        <div className="flex justify-end">
          <Button onClick={handleNext} className="h-11 rounded-full bg-primary px-7 text-primary-foreground hover:bg-primary/90">
            Continuar <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default Step1Income;
