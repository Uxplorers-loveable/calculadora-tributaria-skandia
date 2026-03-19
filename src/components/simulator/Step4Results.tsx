import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FormData } from '@/lib/simulator-types';
import { SimulatorResults, formatCOP } from '@/lib/tax-engine';
import { getPersonalizedName } from '@/lib/personalization';

interface Step4Props {
  formData: FormData;
  results: SimulatorResults;
  onBack: () => void;
}

const Step4Results = ({ formData, results }: Step4Props) => {
  const userName = getPersonalizedName(formData.documentNumber);
  const totalCapacity = Math.max(results.topeFVP, 0);
  const occupiedCapacity = Math.min(results.afc, totalCapacity);
  const availableCapacity = Math.max(results.topup, 0);
  const occupiedPct = totalCapacity > 0 ? Math.min((occupiedCapacity / totalCapacity) * 100, 100) : 0;
  const availablePct = totalCapacity > 0 ? Math.min((availableCapacity / totalCapacity) * 100, 100 - occupiedPct) : 0;
  const estimatedBenefit = results.ahorroTopup + (formData.comprasFE > 0 ? results.ahorroFE1 : 0);
  const currentTax = results.impNormal;
  const optimizedTax = results.impTopup;
  const taxReduction = Math.max(currentTax - optimizedTax, 0);

  return (
    <motion.div
      key="step4"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <section data-sami-key="results_mountain" className="space-y-6">
        <Card className="skandia-card overflow-hidden p-0">
          <div className="border-b border-border bg-secondary/60 px-6 py-6 sm:px-8 sm:py-8">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_320px] lg:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Resultado de optimización</p>
                <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-foreground sm:text-4xl">
                  {userName ? `${userName}, este es tu potencial de beneficio tributario.` : 'Este es tu potencial de beneficio tributario.'}
                </h2>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">
                  Aquí ves de forma clara el valor total que podrías alcanzar, cuánto ya estás ocupando y cuánto te falta activar para completar tu capacidad estimada.
                </p>
              </div>

              <div className="rounded-2xl border border-primary/10 bg-card px-5 py-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Beneficio tributario estimado</p>
                <p className="mt-2 font-display text-4xl font-bold leading-none text-primary sm:text-5xl">$${formatCOP(estimatedBenefit)}</p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Valor estimado que podrías materializar al activar tu capacidad disponible.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6 px-6 py-6 sm:px-8 sm:py-8">
            <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Capacidad de beneficio tributario</p>
                  <p className="mt-2 font-display text-3xl font-bold leading-none text-foreground sm:text-4xl">$${formatCOP(totalCapacity)}</p>
                </div>
                <p className="text-sm text-muted-foreground">{Math.round(occupiedPct)}% de tu capacidad ya está ocupada</p>
              </div>

              <div className="mt-6 overflow-hidden rounded-full border border-border bg-secondary">
                <div className="flex h-4 w-full">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${occupiedPct}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full bg-primary"
                  />
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${availablePct}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.12 }}
                    className="h-full bg-skandia-gold"
                  />
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-border bg-secondary/50 p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Total posible</p>
                  <p className="mt-3 font-display text-2xl font-bold leading-none text-foreground">$${formatCOP(totalCapacity)}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">Es la capacidad máxima estimada que podrías utilizar.</p>
                </div>
                <div className="rounded-2xl border border-primary/10 bg-primary/5 p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Hoy estás ocupando</p>
                  <p className="mt-3 font-display text-2xl font-bold leading-none text-primary">$${formatCOP(occupiedCapacity)}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">Corresponde al beneficio que ya tienes activo actualmente.</p>
                </div>
                <div className="rounded-2xl border border-skandia-gold-border bg-skandia-gold-light p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Te falta activar</p>
                  <p className="mt-3 font-display text-2xl font-bold leading-none text-foreground">$${formatCOP(availableCapacity)}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">Es el valor que aún podrías convertir en optimización tributaria.</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-border bg-secondary/50 p-5 sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Comparativo de impuesto</p>
                <div className="mt-5 grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-border bg-card p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Escenario actual</p>
                    <p className="mt-3 font-display text-2xl font-bold leading-none text-foreground">$${formatCOP(currentTax)}</p>
                  </div>
                  <div className="rounded-2xl border border-primary/10 bg-card p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Escenario optimizado</p>
                    <p className="mt-3 font-display text-2xl font-bold leading-none text-primary">$${formatCOP(optimizedTax)}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-success-border bg-success-light p-5 sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-success">Lectura ejecutiva</p>
                <p className="mt-3 text-base leading-7 text-foreground">
                  {userName
                    ? `${userName}, si activas el valor disponible podrías acercarte a un ahorro tributario estimado de $${formatCOP(estimatedBenefit)}.`
                    : `Si activas el valor disponible podrías acercarte a un ahorro tributario estimado de $${formatCOP(estimatedBenefit)}.`}
                </p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  La diferencia proyectada entre tu escenario actual y el optimizado es de <span className="font-semibold text-foreground">$${formatCOP(taxReduction)}</span>.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-primary/10 bg-secondary/60 p-6 sm:p-8">
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-center">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Cómo empezar a invertir para cumplir ese beneficio tributario</p>
                  <h3 className="mt-2 font-display text-2xl font-bold leading-tight text-foreground">Convierte tu capacidad disponible en una estrategia accionable.</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    Un asesor financiero puede ayudarte a definir el instrumento, el ritmo de aporte y la mejor forma de activar el valor que aún tienes disponible dentro de tu capacidad tributaria estimada.
                  </p>
                </div>

                <Button
                  onClick={() => window.open('https://inversiones.skandia.com.co/asesoria', '_blank', 'noopener,noreferrer')}
                  className="h-12 rounded-full bg-primary px-6 text-primary-foreground hover:bg-primary/90"
                >
                  Agenda una sesión con tu Asesor financiero
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </section>
    </motion.div>
  );
};

export default Step4Results;
