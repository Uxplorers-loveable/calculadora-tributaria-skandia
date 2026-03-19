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
  caption: string;
};

const getSummaryContent = (step: number, userName: string | null): SummaryContent => {
  switch (step) {
    case 0:
      return {
        stepLabel: 'Inicio',
        title: userName ? `Hola ${userName}, iniciemos tu simulación` : 'Iniciemos tu simulación',
        caption: 'Completa tus datos para construir tu panorama tributario.',
      };
    case 1:
      return {
        stepLabel: 'Paso 1 de 4',
        title: userName ? `${userName}, así avanza tu proyección de ingresos` : 'Así avanza tu proyección de ingresos',
        caption: 'Tu ingreso bruto anual estimado se actualiza mientras completas el simulador.',
      };
    case 2:
      return {
        stepLabel: 'Paso 2 de 4',
        title: userName ? `${userName}, seguimos afinando tu panorama` : 'Seguimos afinando tu panorama',
        caption: 'Las deducciones complementan la lectura de tu resultado final.',
      };
    case 3:
      return {
        stepLabel: 'Paso 3 de 4',
        title: 'Ajusta los instrumentos de optimización',
        caption: 'FVP, AFC y PAC completan la base de tu resultado de optimización.',
      };
    case 4:
      return {
        stepLabel: 'Resultado final',
        title: userName ? `${userName}, ya tienes tu panorama consolidado` : 'Ya tienes tu panorama consolidado',
        caption: 'Con este contexto de ingresos puedes interpretar mejor tu resultado de optimización.',
      };
    default:
      return {
        stepLabel: 'Simulador',
        title: 'Resumen del simulador',
        caption: 'Estamos consolidando tu información.',
      };
  }
};

const SimulatorSummaryBar = ({ step, formData, results }: SimulatorSummaryBarProps) => {
  const userName = getPersonalizedName(formData.documentNumber);
  const summary = getSummaryContent(step, userName);

  return (
    <div className="sticky top-16 sm:top-20 z-40 border-b border-border/20 bg-background/95 backdrop-blur-sm">
      <div className="mx-auto max-w-[1280px] px-4 py-3 sm:px-6 sm:py-4">
        <div className="skandia-hero-green rounded-[28px] border border-primary/15 px-5 py-5 sm:px-6 sm:py-6">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground/80">{summary.stepLabel}</p>
              <h2 className="font-display text-2xl font-bold leading-tight text-primary-foreground sm:text-3xl">{summary.title}</h2>
              <p className="max-w-2xl text-sm leading-6 text-primary-foreground/80">{summary.caption}</p>
            </div>

            <div className="rounded-2xl border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-4 backdrop-blur-sm sm:px-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary-foreground/75">Ingreso bruto anual estimado</p>
              <p className="mt-2 font-display text-3xl font-bold leading-none text-primary-foreground sm:text-4xl">$${formatCOP(results.totalIngresos)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulatorSummaryBar;
