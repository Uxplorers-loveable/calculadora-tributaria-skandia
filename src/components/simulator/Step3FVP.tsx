import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import SamiBubble from './SamiBubble';
import SkandiaTooltip from './SkandiaTooltip';
import CurrencyInput from './CurrencyInput';
import { FormData } from '@/lib/simulator-types';

interface Step3Props {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onNext: () => void;
  onBack: () => void;
}

const Step3FVP = ({ formData, setFormData, onNext, onBack }: Step3Props) => {
  const update = (partial: Partial<FormData>) => setFormData((prev) => ({ ...prev, ...partial }));

  return (
    <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
      <SamiBubble text="Aquí está el mayor potencial de optimización. El Fondo Voluntario de Pensión y el PAC Skandia son los instrumentos que más impactan tu declaración de renta. Cuéntame qué tienes activo hoy para calcular cuánto espacio te queda." />

      {/* Card 7: PAC */}
      <Card className="mb-6 p-8 rounded-lg border-t-4 space-y-6" style={{ borderTopColor: 'hsl(var(--skandia-gold))', borderColor: 'hsl(var(--border))' }}>
        <div className="flex items-center gap-3 flex-wrap">
          <h3 className="text-lg font-bold font-display text-foreground">Plan de Ahorro Corporativo (PAC) Skandia</h3>
          <Badge className="bg-skandia-gold-light text-foreground border-skandia-gold-border text-xs">Beneficio exclusivo</Badge>
        </div>

        <SkandiaTooltip color="amber" content="El PAC es un programa donde tu empresa hace aportes a tu nombre dentro del Fondo Voluntario de Pensión Skandia. Tú también puedes hacer aportes adicionales. El beneficio tributario es el mismo que el del FVP individual — y el aporte de tu empresa también es deducible para ella. (Art. 126-1 ET)" />

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-foreground">¿Tu empresa tiene un PAC Skandia activo para ti?</p>
            <p className="text-xs text-muted-foreground">Si no estás seguro, revisa tu extracto del Fondo Voluntario Skandia o consulta con tu área de RR.HH. o Financial Planner.</p>
          </div>
          <Switch checked={formData.hasPAC} onCheckedChange={(v) => update({ hasPAC: v })} />
        </div>

        {formData.hasPAC &&
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-6 pt-4 border-t border-border">
            <CurrencyInput
            label="¿Cuánto aporta tu empresa al PAC durante el año?"
            hint="Total anual. Lo encuentras en tu extracto del FVP o en el portal de clientes Skandia."
            value={formData.pacEmpresa}
            onChange={(v) => update({ pacEmpresa: v })} />
          
            <CurrencyInput
            label="¿Y tú cuánto aportas adicional al PAC durante el año?"
            hint="Aportes voluntarios tuyos, por encima de los de tu empresa. Ingresa el total del año."
            value={formData.pacPropio}
            onChange={(v) => update({ pacPropio: v })} />
          
            <CurrencyInput
            label="¿Cuánto tienes acumulado en el PAC hoy?"
            hint="El saldo total a la fecha. Lo encuentras en el portal de clientes o en tu último extracto mensual."
            value={formData.pacSaldo}
            onChange={(v) => update({ pacSaldo: v })} />
          
            <SkandiaTooltip color="green" content="¿Cómo funciona el beneficio tributario del PAC? Los aportes de tu empresa son deducibles para ella (hasta 3.800 UVT por empleado). Los tuyos cuentan como renta exenta para ti — igual que el FVP. Ambos comparten el cupo de 30% del ingreso / 3.800 UVT." />
          </motion.div>
        }
      </Card>

      {/* Card 8: PACK */}
      {formData.hasBono &&
      <Card className="mb-6 p-8 rounded-lg border-t-4 space-y-6" style={{ borderTopColor: 'hsl(var(--skandia-gold))', borderColor: 'hsl(var(--border))' }}>
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="text-lg font-bold font-display text-foreground">PAC — enviar el bono al PAC antes de recibirlo</h3>
            <Badge className="bg-skandia-gold-light text-foreground border-skandia-gold-border text-xs">Mayor impacto posible</Badge>
          </div>

          <SkandiaTooltip color="amber" content="¿Cómo funciona el PACK? Cuando envías tu bono al Fondo Voluntario de Pensión antes de recibirlo, ese valor no aparece en tu certificado de ingresos y retenciones. No paga impuesto de renta ni retención en la fuente en el año en que se recibe. Es la estrategia con mayor impacto para reducir tu declaración." />

          <div className="flex items-center justify-between">
            <p className="font-medium text-foreground">¿Quieres evaluar el impacto del PAC con tu bono?</p>
            <Switch checked={formData.usePACK} onCheckedChange={(v) => update({ usePACK: v })} />
          </div>
          <SkandiaTooltip color="blue" content="El simulador te muestra los dos escenarios — con PACK y sin PACK — para que evalúes con números reales y tomes la decisión que más te convenga." />
        </Card>
      }

      {/* Card 9: FVP individual / AFC */}
      <Card className="skandia-card space-y-6 mb-6">
        <h3 className="text-lg font-bold font-display text-foreground">¿Tienes FVP individual o cuenta AFC?</h3>
        <p className="text-xs text-muted-foreground">El FVP es un ahorro voluntario en Skandia que puedes hacer de forma independiente a tu empleador. La AFC (Ahorro para el Fomento a la Construcción) es una cuenta de ahorro para vivienda con beneficio tributario equivalente.</p>

        <div className="flex items-center justify-between">
          <p className="font-medium text-foreground">¿Tienes aportes al FVP o AFC en 2026?</p>
          <Switch checked={formData.hasFVP} onCheckedChange={(v) => update({ hasFVP: v })} />
        </div>

        {formData.hasFVP &&
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-6 pt-4 border-t border-border">
            <CurrencyInput
            label="¿Cuánto aportaste al FVP en 2026? (total del año)"
            hint="Suma todos los aportes al FVP Skandia individual. Lo encuentras en tu extracto o en el portal de clientes."
            value={formData.fvpTotal}
            onChange={(v) => update({ fvpTotal: v })} />
          
            <CurrencyInput
            label="¿Cuánto aportaste a cuenta AFC en 2026? (total del año)"
            hint="Si tienes una cuenta AFC en una entidad financiera, ingresa el total aportado. Si no tienes AFC, deja en cero."
            value={formData.afcTotal}
            onChange={(v) => update({ afcTotal: v })} />
          
            <SkandiaTooltip color="blue" content="Art. 126-1 y 126-4 ET: FVP + AFC + PAC comparten el mismo cupo — hasta el 30% de tu ingreso anual o $199.021.200 (3.800 UVT), lo que sea menor. El simulador calcula automáticamente cuánto te queda disponible." />
          </motion.div>
        }
      </Card>

      <div className="flex justify-between mt-8">
        <Button variant="ghost" onClick={onBack} className="h-12 text-muted-foreground">
          <ChevronLeft className="mr-2 w-4 h-4" /> Atrás
        </Button>
        <Button onClick={onNext} className="bg-primary hover:bg-skandia-green-dark text-primary-foreground h-12 px-8 rounded-full">
          Ver mi panorama <ChevronRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </motion.div>);

};

export default Step3FVP;