import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import SkandiaTooltip from './SkandiaTooltip';
import CurrencyInput from './CurrencyInput';
import { FormData } from '@/lib/simulator-types';
import { TOPE_FE, formatCOP } from '@/lib/tax-engine';

interface Step2Props {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onNext: () => void;
  onBack: () => void;
}

const Step2Deductions = ({ formData, setFormData, onNext, onBack }: Step2Props) => {
  const update = (partial: Partial<FormData>) => setFormData((prev) => ({ ...prev, ...partial }));

  const comprasFEAnuales = formData.comprasFE * 12;
  const dedFE1 = Math.min(comprasFEAnuales * 0.01, TOPE_FE);
  const dedFE5 = Math.min(comprasFEAnuales * 0.05, TOPE_FE);

  return (
    <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="flex min-h-full flex-col">
      <div className="space-y-6">
        <Card data-sami-key="ded_dependents" className="skandia-card mb-6 space-y-6">
          <h3 className="text-lg font-bold font-display text-foreground">¿Hay personas que dependen de ti económicamente?</h3>
          <div className="space-y-4">
            <Slider
              value={[formData.numDep]}
              onValueChange={([v]) => update({ numDep: v })}
              max={4}
              step={1}
              className="w-full"
            />

            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0</span><span>1</span><span>2</span><span>3</span><span>4</span>
            </div>
            <p className="text-sm font-medium text-foreground">
              {formData.numDep === 0 ? 'Sin personas a cargo' : `${formData.numDep} persona${formData.numDep > 1 ? 's' : ''} a cargo`}
            </p>
            <p className="text-xs text-muted-foreground">Pueden contar hijos, pareja o familiares elegibles que dependan de ti económicamente.</p>
          </div>
          <SkandiaTooltip color="blue" content="Si aplica en tu caso, esta deducción ayuda a reducir la base sobre la que se calcula tu impuesto." />
        </Card>

        <Card data-sami-key="ded_housing" className="skandia-card mb-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold font-display text-foreground">¿Tienes un crédito de vivienda activo?</h3>
            <Switch checked={formData.hasHip} onCheckedChange={(v) => update({ hasHip: v, interesesVivienda: v ? formData.interesesVivienda : 0 })} />
          </div>
          {formData.hasHip && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4">
              <CurrencyInput
                label="¿Cuánto pagas al mes en intereses?"
                hint="Usa un promedio mensual solo de intereses."
                value={formData.interesesVivienda}
                onChange={(v) => update({ interesesVivienda: v })}
              />

              <SkandiaTooltip color="blue" content="Tomamos este dato para estimar si tu crédito de vivienda ya te está dando un beneficio tributario." />
            </motion.div>
          )}
        </Card>

        <Card data-sami-key="ded_health" className="skandia-card mb-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold font-display text-foreground">¿Pagas medicina prepagada o seguro de salud?</h3>
            <Switch checked={formData.hasSalud} onCheckedChange={(v) => update({ hasSalud: v, pagosSalud: v ? formData.pagosSalud : 0 })} />
          </div>
          {formData.hasSalud && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4">
              <CurrencyInput
                label="¿Cuánto pagas al mes por ese plan?"
                hint="Incluye lo que pagas por ti y tu familia, si aplica."
                value={formData.pagosSalud}
                onChange={(v) => update({ pagosSalud: v })}
              />

              <SkandiaTooltip color="blue" content="Este valor puede sumar dentro de tus deducciones permitidas." />
            </motion.div>
          )}
        </Card>

        <Card data-sami-key="ded_invoice" className="mb-6 rounded-lg border border-border border-t-4 border-t-success p-8 space-y-6">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold font-display text-foreground">¿Pides factura electrónica cuando haces compras?</h3>
            <Badge className="border-success-border bg-success-light text-xs text-success">Fuera del tope global</Badge>
          </div>
          <CurrencyInput
            label="¿Cuánto estimas gastar al mes con factura electrónica?"
            hint="Incluye compras a tu nombre con medios de pago formales."
            value={formData.comprasFE}
            onChange={(v) => update({ comprasFE: v })}
          />

          {formData.comprasFE > 0 && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-border bg-secondary p-4">
                <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">Norma vigente (1%)</p>
                <p className="text-lg font-bold font-display text-foreground">${formatCOP(dedFE1)}</p>
                <p className="text-xs text-muted-foreground">Tope: ${formatCOP(TOPE_FE)}/año</p>
              </div>
              <div className="rounded-lg border border-skandia-gold-border bg-skandia-gold-light p-4">
                <p className="mb-1 text-xs font-medium uppercase tracking-wider text-foreground">Escenario 5%</p>
                <p className="text-lg font-bold font-display text-foreground">${formatCOP(dedFE5)}</p>
                <p className="text-xs text-muted-foreground">Mismo tope: ${formatCOP(TOPE_FE)}</p>
              </div>
            </div>
          )}
          <SkandiaTooltip color="green" content="La factura electrónica puede darte un beneficio adicional y no le quita espacio a otras deducciones." />
        </Card>
      </div>

      <div className="sticky bottom-0 z-10 -mx-4 mt-auto border-t border-border bg-background/95 px-4 py-4 backdrop-blur-sm sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
        <div className="flex justify-between gap-3">
          <Button variant="ghost" onClick={onBack} className="h-11 text-muted-foreground">
            <ChevronLeft className="mr-2 h-4 w-4" /> Atrás
          </Button>
          <Button onClick={onNext} className="h-11 rounded-full bg-primary px-7 text-primary-foreground hover:bg-primary/90">
            Continuar <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default Step2Deductions;
