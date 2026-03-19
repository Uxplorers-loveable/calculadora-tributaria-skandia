import { motion } from 'framer-motion';
import { ArrowUpRight, Flag, Mountain, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCOP } from '@/lib/tax-engine';

interface BenefitOpportunityMountainProps {
  totalBenefit: number;
  usedBenefit: number;
  remainingBenefit: number;
  benefitPct: number;
  ahorroTotalEstimado: number;
  impNormal: number;
  impTopup: number;
  mesesInversion: number;
  aporteMensualSugerido: number;
  hasPACK: boolean;
  ahorroPAC: number;
  hasFE: boolean;
  dedFE1: number;
  onContact: () => void;
}

const ALTITUDE_MARKS = [100, 75, 50, 25];

const BenefitOpportunityMountain = ({
  totalBenefit,
  usedBenefit,
  remainingBenefit,
  benefitPct,
  ahorroTotalEstimado,
  impNormal,
  impTopup,
  mesesInversion,
  aporteMensualSugerido,
  hasPACK,
  ahorroPAC,
  hasFE,
  dedFE1,
  onContact,
}: BenefitOpportunityMountainProps) => {
  const markerBottom = Math.min(Math.max(benefitPct, 10), 92);

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_360px]">
      <div className="skandia-card space-y-6 overflow-hidden">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Tu oportunidad tributaria</p>
          <h2 className="text-2xl font-bold font-display text-foreground sm:text-3xl">
            Esta montaña te muestra cuánto beneficio ya activaste y cuánto te falta para llegar a la cima.
          </h2>
          <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
            El pico representa el máximo cupo de inversión con beneficio tributario que podrías aprovechar. Tu posición actual muestra lo que ya tienes activo; el resto es una oportunidad concreta para seguir construyendo patrimonio con eficiencia.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-border bg-secondary p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Beneficio total</p>
            <p className="mt-2 text-xl font-bold font-display text-foreground">${formatCOP(totalBenefit)}</p>
            <p className="mt-1 text-xs text-muted-foreground">Cupo total estimado</p>
          </div>
          <div className="rounded-2xl border border-border bg-secondary p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Ya activado</p>
            <p className="mt-2 text-xl font-bold font-display text-foreground">${formatCOP(usedBenefit)}</p>
            <p className="mt-1 text-xs text-muted-foreground">Lo que ya estás usando hoy</p>
          </div>
          <div className="rounded-2xl border border-border bg-secondary p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Aún disponible</p>
            <p className="mt-2 text-xl font-bold font-display text-primary">${formatCOP(remainingBenefit)}</p>
            <p className="mt-1 text-xs text-muted-foreground">Lo que todavía podrías activar</p>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-secondary p-5">
          <div className="mb-3 flex items-center gap-2 text-primary">
            <TrendingUp className="h-4 w-4" />
            <p className="text-xs font-semibold uppercase tracking-[0.18em]">Lectura rápida</p>
          </div>
          <p className="text-sm leading-7 text-foreground">
            {remainingBenefit > 0
              ? `Hoy estás aprovechando ${Math.round(benefitPct)}% de tu cupo. Si activas el valor que aún te falta, tu ahorro tributario estimado podría llegar a ${formatCOP(ahorroTotalEstimado)}.`
              : 'Ya estás muy cerca de la cima. Tu estructura actual está aprovechando prácticamente todo el cupo disponible.'}
          </p>
          {remainingBenefit > 0 && (
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Tienes {mesesInversion} meses para invertir este valor en algunos de tus contratos de inversión. Si empiezas hoy, tu aporte mensual sugerido sería de ${formatCOP(aporteMensualSugerido)}.
            </p>
          )}
          {hasPACK && (
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Si usas el escenario PAC, el ahorro estimado adicional es de ${formatCOP(ahorroPAC)}.
            </p>
          )}
          {hasFE && (
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Además, tus compras con factura electrónica podrían sumar hasta ${formatCOP(dedFE1)} de beneficio adicional.
            </p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Impuesto estimado actual</p>
            <p className="mt-2 text-2xl font-bold font-display text-foreground">${formatCOP(impNormal)}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Impuesto estimado optimizado</p>
            <p className="mt-2 text-2xl font-bold font-display text-primary">${formatCOP(impTopup)}</p>
          </div>
        </div>
      </div>

      <div className="skandia-card relative overflow-hidden p-5 sm:p-6">
        <div
          className="absolute inset-x-0 top-0 h-36"
          style={{ background: 'linear-gradient(180deg, hsl(var(--secondary)), hsl(var(--card)))' }}
        />
        <div className="relative space-y-5">
          <div className="flex items-center gap-2 text-foreground">
            <Mountain className="h-5 w-5 text-primary" />
            <p className="font-display text-lg font-bold">Mapa de oportunidad</p>
          </div>

          <div className="relative h-[440px] rounded-[32px] border border-border bg-secondary p-4">
            <div className="absolute inset-y-6 left-4 flex flex-col justify-between text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              {ALTITUDE_MARKS.map((mark) => (
                <span key={mark}>{mark}%</span>
              ))}
              <span>0%</span>
            </div>

            <div className="absolute inset-x-10 top-6 bottom-6 overflow-hidden rounded-[28px] border border-border bg-card">
              <div className="absolute inset-x-0 top-8 flex justify-center">
                <Badge className="border-border bg-card text-foreground">
                  <Flag className="mr-1.5 h-3.5 w-3.5 text-primary" /> Cima del beneficio
                </Badge>
              </div>

              <div className="absolute inset-x-0 top-[32%] border-t border-dashed border-border" />
              <div className="absolute right-4 top-[calc(32%-10px)] rounded-full bg-card px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Tu avance
              </div>

              <div className="benefit-mountain absolute inset-x-5 bottom-4 top-14 opacity-30" />
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${benefitPct}%` }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
                className="benefit-mountain-fill absolute bottom-4 left-5 right-5"
              />

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.2 }}
                className="absolute left-1/2 z-10 -translate-x-1/2"
                style={{ bottom: `calc(${markerBottom}% - 8px)` }}
              >
                <div className="rounded-full border border-border bg-card px-3 py-2 text-center shadow-sm">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Ya activado</p>
                  <p className="font-display text-sm font-bold text-foreground">${formatCOP(usedBenefit)}</p>
                </div>
              </motion.div>

              {remainingBenefit > 0 && (
                <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-skandia-gold-border bg-skandia-gold-light p-4">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Oportunidad pendiente</p>
                  <p className="mt-1 font-display text-xl font-bold text-foreground">${formatCOP(remainingBenefit)}</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Si empiezas hoy, podrías distribuirlo en {mesesInversion} meses con aportes de ${formatCOP(aporteMensualSugerido)} al mes.
                  </p>
                </div>
              )}
            </div>
          </div>

          <Button onClick={onContact} className="h-12 w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
            Contacta a tu asesor <ArrowUpRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BenefitOpportunityMountain;
