import { Badge } from '@/components/ui/badge';
import { FormData } from '@/lib/simulator-types';
import { SimulatorResults, formatCOP } from '@/lib/tax-engine';
import { getPersonalizedName } from '@/lib/personalization';

interface SimulatorSummaryBarProps {
  step: number;
  formData: FormData;
  results: SimulatorResults;
}

type SummaryContent = {
  stepLabel: string;
  title: string;
  value: string;
  caption: string;
};

const getSummaryContent = (step: number, formData: FormData, results: SimulatorResults, userName: string | null): SummaryContent => {
  switch (step) {
    case 0:
      return {
        stepLabel: 'Inicio',
        title: userName ? `Hola ${userName}, tu simulación ya comenzó` : 'Activa tu simulación patrimonial',
        value: userName ? `Hola ${userName}` : formData.documentType || 'Tu recorrido comienza aquí',
        caption: 'Completa tus datos básicos para empezar a proyectar tu capacidad tributaria.',
      };
    case 1:
      return {
        stepLabel: 'Paso 1 de 4',
        title: userName ? `${userName}, así va tu ingreso bruto anual estimado` : 'Ingreso bruto anual estimado',
        value: `$${formatCOP(results.totalIngresos)}`,
        caption: 'La proyección se construye con tu salario, variable y bonificación.',
      };
    case 2:
      return {
        stepLabel: 'Paso 2 de 4',
        title: 'Beneficio tributario ya reconocido',
        value: `$${formatCOP(results.dedAdmis)}`,
        caption: userName ? `${userName}, esto es lo que ya entra hoy en tu resultado estimado.` : 'Lo que ya está entrando hoy en tu resultado estimado.',
      };
    case 3:
      return {
        stepLabel: 'Paso 3 de 4',
        title: 'Capacidad adicional por activar',
        value: `$${formatCOP(results.topup)}`,
        caption: 'Espacio disponible para seguir optimizando con FVP, AFC o PAC.',
      };
    case 4:
      return {
        stepLabel: 'Resultado final',
        title: userName ? `${userName}, este es tu resultado de optimización` : 'Resultado de optimización',
        value: `$${formatCOP(results.ahorroTopup)}`,
        caption: 'Visualiza cuánto beneficio puedes alcanzar, cuánto ocupas hoy y cuánto te falta activar.',
      };
    default:
      return {
        stepLabel: 'Simulador',
        title: 'Resumen de tu recorrido',
        value: 'Sigue avanzando',
        caption: 'Estamos calculando tu panorama tributario.',
      };
  }
};

const SimulatorSummaryBar = ({ step, formData, results }: SimulatorSummaryBarProps) => {
  const userName = getPersonalizedName(formData.documentNumber);
  const summary = getSummaryContent(step, formData, results, userName);
  const totalBenefit = Math.max(results.topeFVP, 0);
  const usedBenefit = Math.min(results.afc, totalBenefit);
  const availableBenefit = Math.max(results.topup, 0);
  const usedPct = totalBenefit > 0 ? Math.min((usedBenefit / totalBenefit) * 100, 100) : 0;
  const availablePct = totalBenefit > 0 ? Math.min((availableBenefit / totalBenefit) * 100, 100 - usedPct) : 0;

  return (
    <div className="sticky top-16 sm:top-20 z-40 border-b border-border/20">
      <div className="skandia-hero-green rounded-none">
        <div className="mx-auto grid max-w-[1280px] gap-5 px-4 py-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground/80">{summary.stepLabel}</p>
              {userName && (
                <Badge className="w-fit border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground">
                  Perfil personalizado para {userName}
                </Badge>
              )}
            </div>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:gap-3">
              <h2 className="text-xl font-bold font-display text-primary-foreground sm:text-2xl">{summary.value}</h2>
              <p className="text-sm text-primary-foreground/80">{summary.title}</p>
            </div>
            <p className="text-xs text-primary-foreground/80 sm:text-sm">{summary.caption}</p>
          </div>

          <div className="rounded-[20px] border border-primary-foreground/20 bg-primary-foreground/10 p-4 backdrop-blur-sm">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary-foreground/75">Capacidad de beneficio tributario</p>
                <p className="mt-1 font-display text-lg font-bold text-primary-foreground">$${formatCOP(totalBenefit)}</p>
              </div>
              <p className="text-xs text-primary-foreground/80">{Math.round(usedPct)}% ocupado</p>
            </div>

            <div className="overflow-hidden rounded-full border border-primary-foreground/20 bg-primary-foreground/10">
              <div className="flex h-4 w-full">
                <div className="h-full bg-primary-foreground" style={{ width: `${usedPct}%` }} />
                <div className="h-full bg-primary-foreground/35" style={{ width: `${availablePct}%` }} />
              </div>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-3 text-primary-foreground">
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-primary-foreground/70">Total</p>
                <p className="mt-1 text-sm font-semibold">$${formatCOP(totalBenefit)}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-primary-foreground/70">Ocupado</p>
                <p className="mt-1 text-sm font-semibold">$${formatCOP(usedBenefit)}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-primary-foreground/70">Disponible</p>
                <p className="mt-1 text-sm font-semibold">$${formatCOP(availableBenefit)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulatorSummaryBar;
