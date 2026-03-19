import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { FormData } from '@/lib/simulator-types';
import { SimulatorResults, formatCOP } from '@/lib/tax-engine';
import { getPersonalizedName } from '@/lib/personalization';

interface Step4Props {
  formData: FormData;
  results: SimulatorResults;
  onBack: () => void;
  registerNavigation: (navigation: { back?: () => void; next?: () => void; nextLabel?: string }) => void;
}

const Step4Results = ({ formData, results, onBack, registerNavigation }: Step4Props) => {
  const userName = getPersonalizedName(formData.documentNumber);
  const totalCapacity = Math.max(results.topeFVP, 0);
  const occupiedCapacity = Math.min(results.afc, totalCapacity);
  const availableCapacity = Math.max(results.topup, 0);
  const occupiedPct = totalCapacity > 0 ? Math.min((occupiedCapacity / totalCapacity) * 100, 100) : 0;
  const availablePct = totalCapacity > 0 ? Math.min((availableCapacity / totalCapacity) * 100, 100 - occupiedPct) : 0;
  const estimatedBenefit = results.ahorroTopup + (formData.comprasFE > 0 ? results.ahorroFE1 : 0);

  useEffect(() => {
    registerNavigation({ back: onBack });
    return () => registerNavigation({});
  }, [onBack, registerNavigation]);

  return (
    <motion.div
      key="step4"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <section data-sami-key="results_mountain" className="space-y-3">
        <Card className="skandia-card overflow-hidden p-0">
          <div className="border-b border-border bg-secondary/60 px-5 py-4 sm:px-6 sm:py-5">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_260px] lg:items-end">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">Resultado</p>
                <h2 className="mt-2 font-display text-2xl font-bold leading-tight text-foreground sm:text-3xl">
                  {userName ? `${userName}, este es tu beneficio estimado.` : 'Este es tu beneficio estimado.'}
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                  Revisa tu total estimado, lo que ya usas y lo que aún puedes activar.
                </p>
              </div>

              <div className="rounded-xl border border-primary/10 bg-card px-4 py-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Beneficio estimado</p>
                <p className="mt-1.5 font-display text-3xl font-bold leading-none text-primary sm:text-4xl">$${formatCOP(estimatedBenefit)}</p>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  Valor que podrías activar.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 px-5 py-4 sm:px-6 sm:py-5">
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Capacidad total</p>
                  <p className="mt-1.5 font-display text-2xl font-bold leading-none text-foreground sm:text-3xl">$${formatCOP(totalCapacity)}</p>
                </div>
                <p className="text-xs text-muted-foreground">{Math.round(occupiedPct)}% usado</p>
              </div>

              <div className="mt-4 overflow-hidden rounded-full border border-border bg-secondary">
                <div className="flex h-3 w-full">
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

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-border bg-secondary/50 p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Total</p>
                  <p className="mt-2 font-display text-xl font-bold leading-none text-foreground">$${formatCOP(totalCapacity)}</p>
                </div>
                <div className="rounded-xl border border-primary/10 bg-primary/5 p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Activo</p>
                  <p className="mt-2 font-display text-xl font-bold leading-none text-primary">$${formatCOP(occupiedCapacity)}</p>
                </div>
                <div className="rounded-xl border border-skandia-gold-border bg-skandia-gold-light p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Disponible</p>
                  <p className="mt-2 font-display text-xl font-bold leading-none text-foreground">$${formatCOP(availableCapacity)}</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-primary/10 bg-secondary/60 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">Aporte sugerido</p>
              <h3 className="mt-2 font-display text-xl font-bold leading-tight text-foreground">
                Si te quedan 10 meses para optimizar tu planeación tributaria
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Si empezaras hoy podrías hacer un aporte mensual de <span className="font-semibold text-foreground">$${formatCOP(availableCapacity / 10)}</span> a uno de tus contratos de inversión.
              </p>
            </div>
          </div>
        </Card>
      </section>
    </motion.div>
  );
};

export default Step4Results;
