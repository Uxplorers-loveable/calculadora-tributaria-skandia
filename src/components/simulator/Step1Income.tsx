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
    <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
      {/* Card 1: Tu salario */}
      <Card className="skandia-card space-y-8 mb-6">
        <h3 className="text-lg font-bold font-display text-foreground">Tu ingreso hoy</h3>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <CurrencyInput
              label="Salario básico mensual *"
              hint="El valor base que aparece en tu desprendible, antes de descuentos. No incluyas auxilios ni comisiones; esos los revisamos por separado."
              value={formData.salMensual}
              onChange={(v) => update({ salMensual: v })}
            />
            {salaryError && <p className="mt-2 text-xs text-destructive">{salaryError}</p>}
            {formData.tipo === 'Integral' && formData.salMensual > 0 && formData.salMensual < MINIMO_INT && (
              <Badge variant="outline" className="mt-2 bg-skandia-gold-light text-foreground border-skandia-gold-border">
                El mínimo para salario integral es ${formatCOP(MINIMO_INT)}
              </Badge>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-grey-600 font-display">Tipo de salario</Label>
            <Select value={formData.tipo} onValueChange={(v) => update({ tipo: v as 'Ordinario' | 'Integral' })}>
              <SelectTrigger className="h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ordinario">Ordinario – recibo prima y cesantías</SelectItem>
                <SelectItem value="Integral">Integral – no recibo prima ni cesantías, están incluidas en el salario</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Esto cambia cómo calculamos tu ingreso anual y la base sobre la que se proyecta tu panorama.</p>
          </div>
        </div>

        <SkandiaTooltip
          color="blue"
          content="¿Cómo sé cuál es el mío? El salario integral aplica cuando ganas más de 13 salarios mínimos (~$22.7M) y tu contrato lo dice expresamente. Si eres comercial con comisiones altas, probablemente eres ordinario aunque superes ese valor. ¿Por qué importa? El salario ordinario se multiplica × 14.12 para calcular el ingreso anual; el integral se multiplica × 12."
        />

        <div className="space-y-6 pt-6 border-t border-border">
          {/* Auxilios */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="font-medium text-foreground">¿Recibes auxilios?</p>
                <p className="text-xs text-muted-foreground">También hacen parte de tu ingreso gravado, así que es útil incluirlos para mostrarte un panorama más preciso.</p>
              </div>
              <Switch checked={formData.hasAuxilios} onCheckedChange={(v) => update({ hasAuxilios: v, auxMensual: v ? formData.auxMensual : 0 })} />
            </div>
            {formData.hasAuxilios && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-4">
                <CurrencyInput
                  label="¿Cuánto recibes en auxilios al mes, en promedio?"
                  hint="Si varía según el mes, usa un promedio. Nosotros lo proyectamos al año automáticamente."
                  value={formData.auxMensual}
                  onChange={(v) => update({ auxMensual: v })}
                />
              </motion.div>
            )}
          </div>

          {/* Variables */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="font-medium text-foreground">¿Recibes comisiones o ingresos variables?</p>
                <p className="text-xs text-muted-foreground">Estos valores también impactan tu base gravable y ayudan a dimensionar mejor tus oportunidades de optimización.</p>
              </div>
              <Switch checked={formData.hasVariable} onCheckedChange={(v) => update({ hasVariable: v, variableAnual: v ? formData.variableAnual : 0 })} />
            </div>
            {formData.hasVariable && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4">
                <CurrencyInput
                  label="¿Cuánto estimas recibir al mes en comisiones o variable?"
                  hint="Ingresa un promedio mensual y nosotros calculamos la proyección anual automáticamente."
                  value={formData.variableAnual}
                  onChange={(v) => update({ variableAnual: v })}
                />
              </motion.div>
            )}
          </div>

          {/* Bono */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="font-medium text-foreground">¿Recibes bonificación anual?</p>
                <p className="text-xs text-muted-foreground">Este dato puede abrir una conversación muy valiosa entre liquidez inmediata y construcción eficiente de patrimonio.</p>
              </div>
              <Switch checked={formData.hasBono} onCheckedChange={(v) => update({ hasBono: v, bonoAnual: v ? formData.bonoAnual : 0 })} />
            </div>
            {formData.hasBono && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <CurrencyInput
                    label="¿Cuál es el valor mensual equivalente de tu bono?"
                    hint="Ingresa el promedio mensual equivalente y nosotros proyectamos su impacto anual."
                    value={formData.bonoAnual}
                    onChange={(v) => update({ bonoAnual: v })}
                  />
                  <div className="space-y-2">
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
                    <p className="text-xs text-muted-foreground">Tu empresa puede confirmártelo. Si es salarial, también hace parte de la base de seguridad social.</p>
                  </div>
                </div>
                <SkandiaTooltip
                  color="amber"
                  content="¿Qué papel puede jugar tu bono? En algunos casos, puede convertirse en una puerta de entrada para invertir vía PAC dentro del Fondo Voluntario de Pensión. Así, en lugar de verlo solo como ingreso, puedes entenderlo como una herramienta para optimizar impuestos y hacer crecer tu patrimonio con mayor eficiencia."
                />
              </motion.div>
            )}
          </div>
        </div>
      </Card>

      {/* Card 2: Fondo de pensiones */}
      <Card className="skandia-card space-y-6 mb-6">
        <h3 className="text-lg font-bold font-display text-foreground">La base de tu estrategia pensional</h3>
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
          <p className="text-xs text-muted-foreground">Esto nos ayuda a entender desde qué punto parte hoy tu estructura de ahorro pensional.</p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="font-medium text-foreground">¿Haces aportes voluntarios a tu fondo obligatorio?</p>
              <p className="text-xs text-muted-foreground">Si ya los haces, tu estrategia actual ya está construyendo eficiencia tributaria desde una base diferente al FVP.</p>
            </div>
            <Switch checked={formData.hasVolOblig} onCheckedChange={(v) => update({ hasVolOblig: v, volObligAnual: v ? formData.volObligAnual : 0 })} />
          </div>
          {formData.hasVolOblig && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4">
              <CurrencyInput
                label="¿Cuánto aportas al mes al fondo obligatorio de manera voluntaria?"
                hint="Ingresa tu aporte mensual promedio. Nosotros lo proyectamos al año. Este beneficio tiene un cupo propio, independiente del FVP y del AFC."
                value={formData.volObligAnual}
                onChange={(v) => update({ volObligAnual: v })}
              />
              <SkandiaTooltip color="green" content="Art. 55 ET: estos aportes se restan de tus ingresos brutos antes de calcular otras deducciones. En la práctica, ayudan a construir una base tributaria más eficiente." />
            </motion.div>
          )}
        </div>
      </Card>

      {/* Summary bar */}
      <div className="skandia-hero-dark p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-grey-400 text-sm">Tu ingreso bruto anual estimado 2026</p>
          <p className="text-2xl font-bold font-display">${formatCOP(totalIngresos)}</p>
          <p className="text-xs text-grey-400 mt-1">La base para entender cuánto capital puedes poner a trabajar con mayor eficiencia.</p>
        </div>
        <Button onClick={handleNext} className="bg-primary hover:bg-skandia-green-dark text-primary-foreground h-12 px-8 rounded-full">
          Ver beneficios disponibles <ChevronRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export default Step1Income;
