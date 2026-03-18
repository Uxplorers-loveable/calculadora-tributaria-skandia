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
      <Card data-sami-key="pac" className="mb-6 p-8 rounded-lg border-t-4 space-y-6" style={{ borderTopColor: 'hsl(var(--skandia-gold))', borderColor: 'hsl(var(--border))' }}>
        <div className="flex items-center gap-3 flex-wrap">
          <h3 className="text-lg font-bold font-display text-foreground">Plan de Ahorro Corporativo (PAC) Skandia</h3>
          <Badge className="bg-skandia-gold-light text-foreground border-skandia-gold-border text-xs">Beneficio exclusivo</Badge>
        </div>

        <SkandiaTooltip color="amber" content="El PAC es una forma de ahorrar con aportes de tu empresa y, si quieres, también tuyos. Puede ayudarte a construir patrimonio y a activar un beneficio tributario dentro de tu cupo disponible." />

        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-medium text-foreground">¿Tu empresa tiene un PAC Skandia activo para ti?</p>
            <p className="text-xs text-muted-foreground">Si no estás seguro, puedes revisarlo en tu extracto o validarlo con tu equipo de talento humano.</p>
          </div>
          <Switch checked={formData.hasPAC} onCheckedChange={(v) => update({ hasPAC: v })} />
        </div>

        {formData.hasPAC && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-6 pt-4 border-t border-border">
            <CurrencyInput
              label="¿Cuánto aporta tu empresa al PAC cada mes?"
              hint="Ingresa el aporte mensual."
              value={formData.pacEmpresa}
              onChange={(v) => update({ pacEmpresa: v })}
            />

            <CurrencyInput
              label="¿Cuánto aportas tú al PAC cada mes?"
              hint="Si no haces aportes propios, puedes dejarlo en cero."
              value={formData.pacPropio}
              onChange={(v) => update({ pacPropio: v })}
            />

            <CurrencyInput
              label="¿Cuánto tienes acumulado en el PAC hoy?"
              hint="Usa el saldo total más reciente que veas en tu extracto."
              value={formData.pacSaldo}
              onChange={(v) => update({ pacSaldo: v })}
            />

            <SkandiaTooltip color="green" content="Los aportes al PAC comparten el mismo cupo tributario del FVP y la AFC. Aquí calculamos cuánto espacio ya estás usando y cuánto todavía podrías aprovechar." />
          </motion.div>
        )}

        {formData.hasBono && (
          <div data-sami-key="pac_bonus_eval" className="space-y-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between gap-4">
              <p className="font-medium text-foreground">¿Quieres ver el impacto del PAC sobre tu bono?</p>
              <Switch checked={formData.usePACK} onCheckedChange={(v) => update({ usePACK: v })} />
            </div>
            <SkandiaTooltip color="blue" content="Activando esta opción comparas tu panorama actual con un escenario en el que el PAC ayuda a mejorar tu eficiencia tributaria." />
          </div>
        )}
      </Card>

      <Card data-sami-key="fvp_afc" className="skandia-card space-y-6 mb-6">
        <h3 className="text-lg font-bold font-display text-foreground">¿Tienes FVP individual o cuenta AFC?</h3>
        <p className="text-xs text-muted-foreground">Estos instrumentos pueden ayudarte a ahorrar e invertir con beneficio tributario dentro del mismo cupo del PAC.</p>

        <div className="flex items-center justify-between gap-4">
          <p className="font-medium text-foreground">¿Tienes aportes al FVP o AFC en 2026?</p>
          <Switch checked={formData.hasFVP} onCheckedChange={(v) => update({ hasFVP: v })} />
        </div>

        {formData.hasFVP && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-6 pt-4 border-t border-border">
            <CurrencyInput
              label="¿Cuánto aportas al mes al FVP?"
              hint="Ingresa tu promedio mensual."
              value={formData.fvpTotal}
              onChange={(v) => update({ fvpTotal: v })}
            />

            <CurrencyInput
              label="¿Cuánto aportas al mes a cuenta AFC?"
              hint="Si no tienes AFC, puedes dejarlo en cero."
              value={formData.afcTotal}
              onChange={(v) => update({ afcTotal: v })}
            />

            <SkandiaTooltip color="blue" content="El simulador reúne FVP, AFC y PAC para mostrarte el beneficio que ya tienes activo y el espacio que todavía podrías usar." />
          </motion.div>
        )}
      </Card>

      <div className="flex justify-between mt-8">
        <Button variant="ghost" onClick={onBack} className="h-12 text-muted-foreground">
          <ChevronLeft className="mr-2 w-4 h-4" /> Atrás
        </Button>
        <Button onClick={onNext} className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-8 rounded-full">
          Ver mi panorama <ChevronRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export default Step3FVP;
