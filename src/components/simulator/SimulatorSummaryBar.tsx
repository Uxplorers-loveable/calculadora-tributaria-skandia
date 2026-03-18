import { Badge } from '@/components/ui/badge';
import { FormData } from '@/lib/simulator-types';
import { SimulatorResults, formatCOP } from '@/lib/tax-engine';

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

const getSummaryContent = (step: number, formData: FormData, results: SimulatorResults): SummaryContent => {
  switch (step) {
    case 0:
      return {
        stepLabel: 'Inicio',
        title: 'Activa tu simulación patrimonial',
        value: formData.documentType || 'Tu recorrido comienza aquí',
        caption: 'Completa tus datos básicos para empezar.',
      };
    case 1:
      return {
        stepLabel: 'Paso 1 de 4',
        title: 'Ingreso bruto anual estimado',
        value: `$${formatCOP(results.totalIngresos)}`,
        caption: 'Proyección construida con tu salario, variable y bonificación.',
      };
    case 2:
      return {
        stepLabel: 'Paso 2 de 4',
        title: 'Beneficio tributario ya reconocido',
        value: `$${formatCOP(results.dedAdmis)}`,
        caption: 'Lo que ya está entrando hoy en tu resultado estimado.',
      };
    case 3:
      return {
        stepLabel: 'Paso 3 de 4',
        title: 'Oportunidad adicional por activar',
        value: `$${formatCOP(results.topup)}`,
        caption: 'Espacio disponible para seguir optimizando con FVP, AFC o PAC.',
      };
    case 4:
      return {
        stepLabel: 'Resultado final',
        title: 'Ahorro tributario estimado',
        value: `$${formatCOP(results.ahorroTopup)}`,
        caption: 'La oportunidad potencial si activas el valor que aún tienes disponible.',
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
  const summary = getSummaryContent(step, formData, results);

  return (
    <div className="sticky top-16 sm:top-20 z-40 border-b border-border/40">
      <div className="skandia-hero-dark rounded-none">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-grey-400">{summary.stepLabel}</p>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:gap-3">
              <h2 className="text-xl font-bold font-display text-primary-foreground sm:text-2xl">{summary.value}</h2>
              <p className="text-sm text-grey-400">{summary.title}</p>
            </div>
            <p className="text-xs text-grey-400 sm:text-sm">{summary.caption}</p>
          </div>

          <Badge className="w-fit border-border/50 bg-primary/15 text-primary-foreground">
            Resumen siempre visible
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default SimulatorSummaryBar;
