import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import SamiBubble from './SamiBubble';
import SkandiaTooltip from './SkandiaTooltip';
import CurrencyInput from './CurrencyInput';
import { FormData } from '@/lib/simulator-types';
import { UVT, TOPE_FE, formatCOP } from '@/lib/tax-engine';

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
    <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
      <SamiBubble text="Perfecto. Ahora veamos qué gastos tienes que ya te generan un beneficio tributario. Cada uno de estos reduce la base sobre la que se calcula tu impuesto. En conjunto tienen un tope máximo de $70.180.920 al año (1.340 UVT, Ley 2277 de 2022). Aquí verás cuánto de ese espacio ya está ocupado y cuánto queda disponible." />

      {/* Card 3: Dependientes */}
      <Card className="skandia-card space-y-6 mb-6">
        <h3 className="text-lg font-bold font-display text-foreground">¿Hay personas que dependen de ti económicamente?</h3>
        <div className="space-y-4">
          <Slider
            value={[formData.numDep]}
            onValueChange={([v]) => update({ numDep: v })}
            max={4}
            step={1}
            className="w-full" />
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0</span><span>1</span><span>2</span><span>3</span><span>4</span>
          </div>
          <p className="text-sm font-medium text-foreground">
            {formData.numDep === 0 ? 'Sin personas a cargo' : `${formData.numDep} persona${formData.numDep > 1 ? 's' : ''} a cargo`}
          </p>
          <p className="text-xs text-muted-foreground">Cuentan: hijos menores de edad, hijos estudiantes entre 18 y 23 años, hijos con discapacidad, el cónyuge o compañero permanente con bajos ingresos y padres o hermanos que dependan económicamente del contribuyente.

          </p>
        </div>
        <SkandiaTooltip color="blue" content="Art. 387 ET: puedes deducir el 10% de tu salario mensual × 12, hasta 32 UVT al mes (máx. $20.111.616/año). Adicional: 72 UVT extra por dependiente (Ley 2277/22, Art. 336 ET) — esas van por fuera del tope de $70 millones." />
      </Card>

      {/* Card 4: Crédito de vivienda */}
      <Card className="skandia-card space-y-6 mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold font-display text-foreground">¿Tienes un crédito de vivienda activo?</h3>
          <Switch checked={formData.hasHip} onCheckedChange={(v) => update({ hasHip: v, interesesVivienda: v ? formData.interesesVivienda : 0 })} />
        </div>
        {formData.hasHip && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4">
            <CurrencyInput label="¿Cuánto pagas al mes en intereses de tu crédito?"
          hint="Usa un promedio mensual solo de intereses. Nosotros lo multiplicamos × 12 automáticamente para calcular el total anual."
          value={formData.interesesVivienda}
          onChange={(v) => update({ interesesVivienda: v })} />
          
            <SkandiaTooltip color="blue" content="Art. 119 ET: puedes deducir hasta 100 UVT al mes — el equivalente a $62.848.800 al año. Si pagaste más intereses, tomamos el tope automáticamente. Aplica también para leasing habitacional." />
          </motion.div>
        }
      </Card>

      {/* Card 5: Medicina prepagada */}
      <Card className="skandia-card space-y-6 mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold font-display text-foreground">¿Pagas medicina prepagada o seguro de salud?</h3>
          <Switch checked={formData.hasSalud} onCheckedChange={(v) => update({ hasSalud: v, pagosSalud: v ? formData.pagosSalud : 0 })} />
        </div>
        {formData.hasSalud &&
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4">
            <CurrencyInput
            label="¿Cuánto pagas al mes por ese plan?"
            hint="Suma lo que pagas mensualmente por ti, tu cónyuge e hijos. Nosotros lo multiplicamos × 12 automáticamente. Aplica para planes de entidades vigiladas por la Superintendencia Nacional de Salud (Colsanitas, Compensar, Coomeva, Medisanitas, entre otras)."
            value={formData.pagosSalud}
            onChange={(v) => update({ pagosSalud: v })} />
          
            <SkandiaTooltip color="blue" content="Art. 387 ET: deducible hasta 16 UVT al mes — el equivalente a $10.055.808 al año." />
          </motion.div>
        }
      </Card>

      {/* Card 6: Factura electrónica */}
      <Card className="mb-6 p-8 rounded-lg border-t-4 border-t-success border border-border space-y-6">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-bold font-display text-foreground">¿Pides factura electrónica cuando haces compras?</h3>
          <Badge className="bg-success-light text-success border-success-border text-xs">Fuera del tope global</Badge>
        </div>
        <CurrencyInput
          label="¿Cuánto estimas gastar al mes con factura electrónica?"
          hint="Restaurantes, supermercados, ropa, servicios, viajes — cualquier compra pagada con tarjeta débito, crédito o transferencia, con factura electrónica a tu nombre. Nosotros lo multiplicamos × 12 automáticamente."
          value={formData.comprasFE}
          onChange={(v) => update({ comprasFE: v })} />
        
        {formData.comprasFE > 0 &&
        <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-secondary border border-border">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Norma vigente (1%)</p>
              <p className="text-lg font-bold font-display text-foreground">${formatCOP(dedFE1)}</p>
              <p className="text-xs text-muted-foreground">Tope: ${formatCOP(TOPE_FE)}/año</p>
            </div>
            <div className="p-4 rounded-lg border" style={{ background: 'hsl(var(--skandia-gold-light))', borderColor: 'hsl(var(--skandia-gold-border))' }}>
              <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: 'hsl(var(--info-amber-text))' }}>Propuesta Reforma 2026 (5%)</p>
              <p className="text-lg font-bold font-display text-foreground">${formatCOP(dedFE5)}</p>
              <p className="text-xs text-muted-foreground">Mismo tope: ${formatCOP(TOPE_FE)}</p>
            </div>
          </div>
        }
        <SkandiaTooltip color="green" content="¿Qué significa esto para ti? El 1% de tus compras con factura electrónica se descuenta de tu base gravable — y va por fuera del tope de $70 millones, así que no le quita espacio a ninguna otra deducción. (Art. 336 num. 5 ET, Ley 2277/22)" />
        <SkandiaTooltip color="amber" content="El Congreso está debatiendo subir esta deducción al 5% para el año gravable 2026 de forma transitoria (Ley de Financiamiento 2026). Aquí puedes ver los dos escenarios para que evalúes con información completa." />
      </Card>

      <div className="flex justify-between mt-8">
        <Button variant="ghost" onClick={onBack} className="h-12 text-muted-foreground">
          <ChevronLeft className="mr-2 w-4 h-4" /> Atrás
        </Button>
        <Button onClick={onNext} className="bg-primary hover:bg-skandia-green-dark text-primary-foreground h-12 px-8 rounded-full">
          Continuar <ChevronRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </motion.div>);

};

export default Step2Deductions;