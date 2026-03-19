import { motion } from 'framer-motion';
import { ArrowUpRight, CircleDollarSign, PiggyBank, Wallet } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCOP } from '@/lib/tax-engine';

interface BenefitOpportunityOverviewProps {
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

const SCALE_MARKS = [0, 25, 50, 75, 100];

const BenefitOpportunityOverview = ({
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
}: BenefitOpportunityOverviewProps) => {
  const usedPct = Math.min(Math.max(benefitPct, 0), 100);
  const remainingPct = totalBenefit > 0 ? Math.min(Math.max((remainingBenefit / totalBenefit) * 100, 0), 100 - usedPct) : 0;
  const taxDelta = Math.max(impNormal - impTopup, 0);
  const reductionPct = impNormal > 0 ? Math.round((taxDelta / impNormal) * 100) : 0;

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_380px]">
      <div className="skandia-card space-y-6 overflow-hidden">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Tu oportunidad tributaria</p>
          <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
            Así se ve el beneficio total que podrías aprovechar y cuánto de ese valor ya tienes activo.
          </h2>
          <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
            Este resumen te muestra tres cosas de forma simple: el cupo total estimado, lo que ya vienes usando y el valor que aún podrías activar para cerrar mejor tu año tributario.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_240px]">
          <div className="rounded-3xl border border-border bg-card p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Beneficio tributario total estimado</p>
                <p className="mt-2 font-display text-3xl font-bold text-foreground sm:text-4xl">${formatCOP(totalBenefit)}</p>
              </div>
              <Badge className="border-primary/20 bg-primary/10 text-primary">
                {usedPct}% activo
              </Badge>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex h-6 overflow-hidden rounded-full border border-border bg-secondary">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${usedPct}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="flex h-full items-center justify-center bg-primary"
                />
                {remainingPct > 0 && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${remainingPct}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.15 }}
                    className="h-full border-l border-skandia-gold-border bg-skandia-gold-light"
                  />
                )}
              </div>

              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {SCALE_MARKS.map((mark) => (
                  <span key={mark}>{mark}%</span>
                ))}
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-secondary p-4">
                <div className="flex items-center gap-2 text-primary">
                  <Wallet className="h-4 w-4" />
                  <p className="text-xs font-semibold uppercase tracking-[0.18em]">Ya estás usando</p>
                </div>
                <p className="mt-3 font-display text-2xl font-bold text-foreground">${formatCOP(usedBenefit)}</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Este es el valor del beneficio que hoy ya está participando dentro de tu resultado.
                </p>
              </div>

              <div className="rounded-2xl border border-skandia-gold-border bg-skandia-gold-light p-4">
                <div className="flex items-center gap-2 text-primary">
                  <PiggyBank className="h-4 w-4" />
                  <p className="text-xs font-semibold uppercase tracking-[0.18em]">Te falta activar</p>
                </div>
                <p className="mt-3 font-display text-2xl font-bold text-foreground">${formatCOP(remainingBenefit)}</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Es el valor adicional que aún podrías mover para acercarte al máximo estimado.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-secondary p-5 sm:p-6">
            <div className="flex items-center gap-2 text-primary">
              <CircleDollarSign className="h-5 w-5" />
              <p className="text-xs font-semibold uppercase tracking-[0.18em]">Impacto estimado</p>
            </div>

            <p className="mt-4 text-sm leading-6 text-muted-foreground">Si completas tu oportunidad estimada, este podría ser el ahorro tributario total proyectado.</p>
            <p className="mt-3 font-display text-3xl font-bold text-foreground">${formatCOP(ahorroTotalEstimado)}</p>

            <div className="mt-5 space-y-3 rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-muted-foreground">Impuesto estimado actual</span>
                <span className="font-display font-bold text-foreground">${formatCOP(impNormal)}</span>
              </div>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-muted-foreground">Impuesto estimado optimizado</span>
                <span className="font-display font-bold text-primary">${formatCOP(impTopup)}</span>
              </div>
            </div>

            {reductionPct > 0 && (
              <p className="mt-4 text-xs leading-6 text-muted-foreground">
                Esto representa una reducción estimada de hasta <span className="font-semibold text-foreground">{reductionPct}%</span> frente a tu escenario actual.
              </p>
            )}
          </div>
        </div>

        {remainingBenefit > 0 ? (
          <div className="rounded-3xl border border-skandia-gold-border bg-skandia-gold-light p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Siguiente paso sugerido</p>
            <p className="mt-2 text-sm leading-7 text-foreground">
              Tienes {mesesInversion} meses para invertir este valor en algunos de tus contratos de inversión. Si empezaras hoy, deberías hacer aportes mensuales de <span className="font-semibold">${formatCOP(aporteMensualSugerido)}</span>.
            </p>
            {hasPACK && (
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Si aprovechas el escenario PAC, el ahorro estimado adicional sería de ${formatCOP(ahorroPAC)}.
              </p>
            )}
            {hasFE && (
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Además, las compras con factura electrónica podrían sumar hasta ${formatCOP(dedFE1)} adicionales en beneficio.
              </p>
            )}
          </div>
        ) : (
          <div className="rounded-3xl border border-success-border bg-success-light p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-success">Muy buen nivel de aprovechamiento</p>
            <p className="mt-2 text-sm leading-7 text-foreground">
              Ya estás usando prácticamente todo tu cupo estimado de beneficio tributario. El siguiente paso es revisar con tu asesor cómo sostener esta estructura durante el año.
            </p>
          </div>
        )}
      </div>

      <div className="skandia-card flex h-full flex-col justify-between gap-5 overflow-hidden p-5 sm:p-6">
        <div className="space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Resumen visual</p>
            <h3 className="mt-2 font-display text-xl font-bold text-foreground">Lo que ya activaste vs. lo que aún está disponible</h3>
          </div>

          <div className="space-y-4 rounded-3xl border border-border bg-card p-5">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="text-muted-foreground">Total estimado</span>
              <span className="font-display text-lg font-bold text-foreground">${formatCOP(totalBenefit)}</span>
            </div>
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="text-muted-foreground">Valor usado</span>
              <span className="font-display text-lg font-bold text-primary">${formatCOP(usedBenefit)}</span>
            </div>
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="text-muted-foreground">Valor pendiente</span>
              <span className="font-display text-lg font-bold text-foreground">${formatCOP(remainingBenefit)}</span>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-secondary p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Lectura rápida</p>
            <p className="mt-3 text-sm leading-7 text-foreground">
              {remainingBenefit > 0
                ? `Hoy estás usando ${usedPct}% de tu beneficio estimado. Aún tienes ${formatCOP(remainingBenefit)} por activar para acercarte al total.`
                : 'Hoy ya estás usando prácticamente todo tu beneficio estimado, así que tu estructura se encuentra muy bien aprovechada.'}
            </p>
          </div>
        </div>

        <Button onClick={onContact} className="h-12 w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
          Contacta a tu asesor <ArrowUpRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default BenefitOpportunityOverview;
