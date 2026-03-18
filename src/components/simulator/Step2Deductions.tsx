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
      <SamiBubble text="Ahora revisemos los beneficios que ya hacen parte de tu realidad. La idea es simple: entender cuánto espacio de optimización ya estás usando y cuánto capital adicional podrías poner a trabajar de manera más inteligente." />

      {/* Card 3: Dependientes */}
      <Card className="skandia-card space-y-6 mb-6">
        <h3 className="text-lg font-bold font-display text-foreground">Tu entorno familiar también cuenta</h3>
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
          <p className="text-xs text-muted-foreground">Aquí cuentan hijos, cónyuge o familiares que dependan económicamente de ti y que puedan sumar eficiencia a tu planeación tributaria.</p>
        </div>
        <SkandiaTooltip color="blue" content="Art. 387 ET: esta deducción puede reducir tu base gravable y ayudarte a liberar espacio para tomar decisiones patrimoniales con más información y menos fricción." />
      </Card>

      {/* Card 4: Crédito de vivienda */}
      <Card className="skandia-card space-y-6 mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold font-display text-foreground">¿Tu vivienda ya está aportando a tu eficiencia tributaria?</h3>
          <Switch checked={formData.hasHip} onCheckedChange={(v) => update({ hasHip: v, interesesVivienda: v ? formData.interesesVivienda : 0 })} />
        </div>
        {formData.hasHip && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4">
            <CurrencyInput label="¿Cuánto pagas al mes en intereses de tu crédito?"
          hint="Usa un promedio mensual solo de intereses y nosotros calculamos la proyección anual."
          value={formData.interesesVivienda}
          onChange={(v) => update({ interesesVivienda: v })} />
          
            <SkandiaTooltip color="blue" content="Art. 119 ET: los intereses de vivienda pueden ayudarte a reducir tu carga tributaria. Aquí los incorporamos para mostrarte el efecto completo dentro de tu panorama." />
          </motion.div>
        }
      </Card>

      {/* Card 5: Medicina prepagada */}
      <Card className="skandia-card space-y-6 mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold font-display text-foreground">¿Tu plan de salud suma a tu estrategia?</h3>
          <Switch checked={formData.hasSalud} onCheckedChange={(v) => update({ hasSalud: v, pagosSalud: v ? formData.pagosSalud : 0 })} />
        </div>
        {formData.hasSalud &&
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4">
            <CurrencyInput
            label="¿Cuánto pagas al mes por ese plan?"
            hint="Suma lo que pagas mensualmente por ti y tu familia. Nosotros lo proyectamos al año automáticamente."
            value={formData.pagosSalud}
            onChange={(v) => update({ pagosSalud: v })} />
          
            <SkandiaTooltip color="blue" content="Art. 387 ET: este valor puede convertirse en una deducción útil para hacer más eficiente tu resultado tributario final." />
          </motion.div>
        }
      </Card>

      {/* Card 6: Factura electrónica */}
      <Card className="mb-6 p-8 rounded-lg border-t-4 border-t-success border border-border space-y-6">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-bold font-display text-foreground">Tus compras también pueden abrir espacio</h3>
          <Badge className="bg-success-light text-success border-success-border text-xs">Fuera del tope global</Badge>
        </div>
        <CurrencyInput
          label="¿Cuánto estimas gastar al mes con factura electrónica?"
          hint="Incluye compras cotidianas hechas con factura electrónica a tu nombre. Nosotros calculamos la proyección anual para mostrarte su impacto."
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
        <SkandiaTooltip color="green" content="¿Qué hace especial este beneficio? Va por fuera del tope global, así que puede sumar eficiencia adicional sin restarle espacio a otras deducciones." />
        <SkandiaTooltip color="amber" content="Aquí ves el escenario vigente y el posible escenario de reforma para que tomes decisiones con contexto, no solo con cálculo." />
      </Card>

      <div className="flex justify-between mt-8">
        <Button variant="ghost" onClick={onBack} className="h-12 text-muted-foreground">
          <ChevronLeft className="mr-2 w-4 h-4" /> Atrás
        </Button>
        <Button onClick={onNext} className="bg-primary hover:bg-skandia-green-dark text-primary-foreground h-12 px-8 rounded-full">
          Ver oportunidades de inversión <ChevronRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </motion.div>);

};

export default Step2Deductions;