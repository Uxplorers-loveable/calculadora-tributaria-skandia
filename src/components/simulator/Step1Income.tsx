import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import SamiBubble from './SamiBubble';
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
  const update = (partial: Partial<FormData>) => setFormData(prev => ({ ...prev, ...partial }));

  return (
    <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
      <SamiBubble text="Hola 👋 Esta herramienta te ayuda a entender cuánto puedes optimizar en tu declaración de renta 2027, usando los beneficios tributarios disponibles para el año gravable 2026. Para empezar, cuéntame sobre tus ingresos. Si tienes tu desprendible de nómina a la mano, mejor — muchos de estos datos están ahí." />

      {/* Card 1: Tu salario */}
      <Card className="skandia-card space-y-8 mb-6">
        <h3 className="text-lg font-bold font-display text-foreground">Tu salario</h3>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <CurrencyInput
              label="Salario básico mensual"
              hint="El valor base que aparece en tu desprendible, antes de cualquier descuento. No incluyas auxilios ni comisiones — esos los preguntamos por separado."
              value={formData.salMensual}
              onChange={(v) => update({ salMensual: v })}
            />
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
                <SelectItem value="Integral">Integral– no recibo prima ni cesantías, están incluidas en el salario</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Esto cambia cómo calculamos tu ingreso anual y tu base de seguridad social.</p>
          </div>
        </div>

        <SkandiaTooltip
          color="blue"
          content="¿Cómo sé cuál es el mío? El salario integral aplica cuando ganas más de 13 salarios mínimos (~$22.7M) y tu contrato lo dice expresamente. Si eres comercial con comisiones altas, probablemente eres ordinario aunque superes ese valor. ¿Por qué importa? El salario ordinario se multiplica × 14.12 para calcular el ingreso anual (incluye prima y cesantías). El integral se multiplica × 12."
        />

        <div className="space-y-6 pt-6 border-t border-border">
          {/* Auxilios */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="font-medium text-foreground">¿Recibes auxilios?</p>
                <p className="text-xs text-muted-foreground">Los auxilios son ingreso gravado — pagas impuesto sobre ellos — pero no entran a la base de seguridad social.</p>
              </div>
              <Switch checked={formData.hasAuxilios} onCheckedChange={(v) => update({ hasAuxilios: v, auxMensual: v ? formData.auxMensual : 0 })} />
            </div>
            {formData.hasAuxilios && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-4">
                <CurrencyInput
                  label="¿Cuánto recibes en auxilios al mes, en promedio?"
                  hint="Si varía según festivos, usa un promedio. Ingresa el valor mensual — lo multiplicamos × 12 automáticamente."
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
                <p className="text-xs text-muted-foreground">Las comisiones sí cuentan como salario — afectan tu base de seguridad social y tu ingreso gravable.</p>
              </div>
              <Switch checked={formData.hasVariable} onCheckedChange={(v) => update({ hasVariable: v, variableAnual: v ? formData.variableAnual : 0 })} />
            </div>
            {formData.hasVariable && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4">
                <CurrencyInput
                  label="¿Cuánto estimas recibir en comisiones o variable durante todo el 2026?"
                  hint="Ingresa el total del año. Si es difícil estimarlo, lo que recibiste en 2025 es una buena referencia."
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
                <p className="text-xs text-muted-foreground">Por ejemplo: bono de desempeño, bono de fin de año o participación en utilidades.</p>
              </div>
              <Switch checked={formData.hasBono} onCheckedChange={(v) => update({ hasBono: v, bonoAnual: v ? formData.bonoAnual : 0 })} />
            </div>
            {formData.hasBono && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <CurrencyInput
                    label="¿Cuánto es el bono? (total del año)"
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
                    <p className="text-xs text-muted-foreground">Tu empresa debe indicártelo. Si es salarial, paga seguridad social. El bono Skandia, por ejemplo, no es salarial.</p>
                  </div>
                </div>
                <SkandiaTooltip
                  color="amber"
                  content="¿Qué es el PAC? Es una estrategia que te permite enviar tu bono al Fondo Voluntario de Pensión antes de recibirlo. Cuando lo haces, ese valor no aparece en tu certificado de ingresos y retenciones — no paga impuesto de renta ese año. Más adelante te mostramos en pesos cuánto representaría este beneficio para ti."
                />
              </motion.div>
            )}
          </div>
        </div>
      </Card>

      {/* Card 2: Fondo de pensiones */}
      <Card className="skandia-card space-y-6 mb-6">
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
          <p className="text-xs text-muted-foreground">Fondos privados: Skandia, Porvenir, Protección, Colfondos. Fondo público: Colpensiones.</p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="font-medium text-foreground">¿Haces aportes voluntarios a tu fondo obligatorio?</p>
              <p className="text-xs text-muted-foreground">Solo aplica si estás en fondo privado. Son aportes adicionales al 4% obligatorio, con un beneficio tributario diferente al del FVP.</p>
            </div>
            <Switch checked={formData.hasVolOblig} onCheckedChange={(v) => update({ hasVolOblig: v, volObligAnual: v ? formData.volObligAnual : 0 })} />
          </div>
          {formData.hasVolOblig && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4">
              <CurrencyInput
                label="¿Cuánto aportaste al fondo obligatorio de manera voluntaria en 2026? (total del año)"
                hint="Este beneficio tiene su propio cupo independiente — no comparte tope con el FVP ni el AFC. Máximo: 25% de tu ingreso anual o $130.935.000 (2.500 UVT), lo que sea menor."
                value={formData.volObligAnual}
                onChange={(v) => update({ volObligAnual: v })}
              />
              <SkandiaTooltip color="green" content="Art. 55 ET: estos aportes son ingreso no constitutivo de renta — se restan de tus ingresos brutos antes de calcular cualquier otra cosa." />
            </motion.div>
          )}
        </div>
      </Card>

      {/* Summary bar */}
      <div className="skandia-hero-dark p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-grey-400 text-sm">Tu ingreso bruto anual estimado 2026</p>
          <p className="text-2xl font-bold font-display">${formatCOP(totalIngresos)}</p>
          <p className="text-xs text-grey-400 mt-1">Salario {formData.tipo === 'Integral' ? '× 12' : '× 14.12'} meses + auxilios + variable + bono</p>
        </div>
        <Button onClick={onNext} className="bg-primary hover:bg-skandia-green-dark text-primary-foreground h-12 px-8 rounded-full">
          Continuar <ChevronRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export default Step1Income;
