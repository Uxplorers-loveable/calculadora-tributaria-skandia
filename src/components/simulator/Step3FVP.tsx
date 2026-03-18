import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
      {/* Card 7: PAC */}
      <Card className="mb-6 p-8 rounded-lg border-t-4 space-y-6" style={{ borderTopColor: 'hsl(var(--skandia-gold))', borderColor: 'hsl(var(--border))' }}>
        <div className="flex items-center gap-3 flex-wrap">
          <h3 className="text-lg font-bold font-display text-foreground">Plan de Ahorro Corporativo (PAC) Skandia</h3>
          <Badge className="bg-skandia-gold-light text-foreground border-skandia-gold-border text-xs">Potencial estratégico</Badge>
        </div>

        <SkandiaTooltip color="amber" content="El PAC conecta aportes de tu empresa y aportes tuyos dentro del Fondo Voluntario de Pensión. En la práctica, convierte parte de tu compensación en una estrategia que puede mejorar la eficiencia tributaria mientras fortalece tu patrimonio." />

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-foreground">¿Tu empresa tiene un PAC Skandia activo para ti?</p>
            <p className="text-xs text-muted-foreground">Si no lo tienes claro, puedes revisarlo en tu extracto o conversarlo con tu área de RR. HH. o con tu wealth planner.</p>
          </div>
          <Switch checked={formData.hasPAC} onCheckedChange={(v) => update({ hasPAC: v })} />
        </div>

        {formData.hasPAC &&
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-6 pt-4 border-t border-border">
            <CurrencyInput
            label="¿Cuánto aporta tu empresa al PAC cada mes?"
            hint="Ingresa el aporte mensual y nosotros proyectamos su impacto anual."
            value={formData.pacEmpresa}
            onChange={(v) => update({ pacEmpresa: v })} />

            <CurrencyInput
            label="¿Cuánto aportas tú adicionalmente al PAC cada mes?"
            hint="Ingresa tu aporte mensual promedio y nosotros calculamos la proyección anual."
            value={formData.pacPropio}
            onChange={(v) => update({ pacPropio: v })} />

            <CurrencyInput
            label="¿Cuánto tienes acumulado en el PAC hoy?"
            hint="Este saldo nos ayuda a conectar tu situación actual con una conversación más completa sobre tu patrimonio."
            value={formData.pacSaldo}
            onChange={(v) => update({ pacSaldo: v })} />

            <SkandiaTooltip color="green" content="PAC, FVP y AFC comparten el mismo cupo tributario. Por eso es tan valioso verlo en conjunto: no se trata solo de aportar más, sino de decidir mejor cómo usar tu espacio disponible." />
          </motion.div>
        }

        {formData.hasBono && (
          <div className="space-y-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between gap-4">
              <p className="font-medium text-foreground">¿Quieres ver cómo cambiaría tu panorama si conectas tu bono con el PAC?</p>
              <Switch checked={formData.usePACK} onCheckedChange={(v) => update({ usePACK: v })} />
            </div>
            <SkandiaTooltip color="blue" content="Te mostramos ambos escenarios para que hagas tangible el impacto y entiendas con números reales cuánto puede cambiar tu resultado." />
          </div>
        )}
      </Card>

      {/* Card 9: FVP individual / AFC */}
      <Card className="skandia-card space-y-6 mb-6">
        <h3 className="text-lg font-bold font-display text-foreground">Tu ahorro voluntario también puede trabajar mejor</h3>
        <p className="text-xs text-muted-foreground">El FVP y la AFC son vehículos que pueden ayudarte a optimizar impuestos mientras fortaleces tu estrategia de largo plazo.</p>

        <div className="flex items-center justify-between">
          <p className="font-medium text-foreground">¿Tienes aportes al FVP o AFC en 2026?</p>
          <Switch checked={formData.hasFVP} onCheckedChange={(v) => update({ hasFVP: v })} />
        </div>

        {formData.hasFVP &&
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-6 pt-4 border-t border-border">
            <CurrencyInput
            label="¿Cuánto aportas al mes al FVP?"
            hint="Ingresa tu aporte mensual promedio y nosotros lo proyectamos al año."
            value={formData.fvpTotal}
            onChange={(v) => update({ fvpTotal: v })} />

            <CurrencyInput
            label="¿Cuánto aportas al mes a cuenta AFC?"
            hint="Si tienes AFC, ingresa tu promedio mensual. Si no, puedes dejarlo en cero."
            value={formData.afcTotal}
            onChange={(v) => update({ afcTotal: v })} />

            <SkandiaTooltip color="blue" content="Aquí no solo medimos un ahorro. También medimos cuánto más eficiente puede volverse tu capital cuando el beneficio tributario y la estrategia de inversión avanzan juntos." />
          </motion.div>
        }
      </Card>

      <div className="flex justify-between mt-8">
        <Button variant="ghost" onClick={onBack} className="h-12 text-muted-foreground">
          <ChevronLeft className="mr-2 w-4 h-4" /> Atrás
        </Button>
        <Button onClick={onNext} className="bg-primary hover:bg-skandia-green-dark text-primary-foreground h-12 px-8 rounded-full">
          Descubrir mi panorama <ChevronRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </motion.div>);

};

export default Step3FVP;