import { motion } from 'framer-motion';
import { MessageCircle, Sparkles, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FormData } from '@/lib/simulator-types';
import { SimulatorResults, formatCOP } from '@/lib/tax-engine';

interface SamiAssistantPanelProps {
  step: number;
  activeKey?: string;
  formData: FormData;
  results: SimulatorResults;
}

type SamiContent = {
  eyebrow: string;
  title: string;
  body: string;
  note?: string;
};

const STEP_DEFAULT_KEYS: Record<number, string> = {
  0: 'step0_intro',
  1: 'income_salary',
  2: 'ded_dependents',
  3: 'pac',
  4: 'results_mountain',
};

const CONTENT: Record<string, SamiContent> = {
  step0_intro: {
    eyebrow: 'Bienvenida',
    title: 'Tu patrimonio también puede crecer con eficiencia tributaria',
    body: 'En Skandia conectas tu capital con portafolios globales y conviertes tu planeación tributaria en una decisión estratégica. Empecemos con tus datos básicos para construir un panorama claro y relevante para ti.',
    note: 'Voy contigo durante todo el recorrido para explicarte cada dato en un lenguaje simple.',
  },
  documentType: {
    eyebrow: 'Identificación',
    title: 'Selecciona tu tipo de documento',
    body: 'Para este simulador solo necesitamos una identificación simple. Déjalo en la opción que corresponda y seguimos con el siguiente paso.',
  },
  documentNumber: {
    eyebrow: 'Identificación',
    title: 'Ingresa tu número de documento',
    body: 'Usa únicamente números, sin puntos ni espacios. Este dato nos ayuda a iniciar el flujo de forma ordenada.',
  },
  income_salary: {
    eyebrow: 'Ingresos',
    title: 'Partamos de tu ingreso base',
    body: 'Este valor es el punto de partida para estimar tu panorama tributario. Si tienes desprendible de nómina, normalmente aquí encuentras la cifra más confiable.',
  },
  income_salary_type: {
    eyebrow: 'Ingresos',
    title: 'El tipo de salario cambia la forma de calcular',
    body: 'No cambia tu patrimonio, pero sí la manera en que proyectamos tu ingreso anual y algunos aportes. Si tu contrato dice salario integral, elige esa opción.',
  },
  income_auxilios: {
    eyebrow: 'Ingresos',
    title: 'Auxilios: ingresos adicionales a tu salario base',
    body: 'Aquí puedes incluir apoyos como alimentación, conectividad o movilización. Si los recibes, solo necesitamos un promedio mensual.',
  },
  income_variable: {
    eyebrow: 'Ingresos variables',
    title: 'Comisiones o variable',
    body: 'Si una parte de tu ingreso cambia mes a mes, usa un promedio. Con eso obtenemos una proyección más realista de tu cierre anual.',
  },
  income_bono: {
    eyebrow: 'Bonificación',
    title: 'Tu bono también puede jugar a tu favor',
    body: 'Si recibes una bonificación anual, este dato nos permite mostrarte cómo podría impactar tu impuesto y qué oportunidades podrías activar alrededor de ese ingreso.',
  },
  income_bonus_type: {
    eyebrow: 'Bonificación',
    title: 'Salarial o no salarial',
    body: 'Tu empresa suele definir esta clasificación. Si no estás seguro, puedes usar la información que aparezca en tu soporte de pago o validarlo después con tu asesor.',
  },
  income_pension: {
    eyebrow: 'Pensiones',
    title: 'Tu fondo también hace parte del análisis',
    body: 'Con esta información identificamos si ya tienes aportes con beneficio tributario y cómo se integran al resto de tu estrategia.',
  },
  income_voluntary: {
    eyebrow: 'Aportes voluntarios',
    title: 'Aportes adicionales al fondo obligatorio',
    body: 'Si ya haces aportes extra, aquí medimos cuánto espacio tributario ya vienes aprovechando para no duplicar el cálculo.',
  },
  ded_dependents: {
    eyebrow: 'Deducciones',
    title: 'Las personas a tu cargo pueden sumar beneficios',
    body: 'Si apoyas económicamente a hijos, pareja o familiares elegibles, este dato puede ayudarte a reducir la base sobre la que se calcula tu impuesto.',
  },
  ded_housing: {
    eyebrow: 'Deducciones',
    title: 'Tu crédito de vivienda también cuenta',
    body: 'Solo necesitamos el valor de intereses para estimar el beneficio. Es una de las deducciones más conocidas y puede ser relevante en tu resultado.',
  },
  ded_health: {
    eyebrow: 'Deducciones',
    title: 'Salud prepagada o seguro de salud',
    body: 'Si pagas este tipo de cobertura, el simulador puede reconocer ese valor como parte de tus beneficios tributarios permitidos.',
  },
  ded_invoice: {
    eyebrow: 'Factura electrónica',
    title: 'Tus compras también pueden aportar',
    body: 'Cuando pides factura electrónica a tu nombre, algunas compras pueden ayudarte a sumar un beneficio adicional por fuera del tope global.',
  },
  pac: {
    eyebrow: 'PAC Skandia',
    title: 'El PAC convierte aportes en eficiencia tributaria',
    body: 'Si tu empresa o tú hacen aportes al PAC, aquí medimos cuánto de ese beneficio ya está activo y cuánto más podrías aprovechar.',
  },
  pac_bonus_eval: {
    eyebrow: 'PAC + bono',
    title: 'Evalúa el impacto del bono dentro del PAC',
    body: 'Con esta opción comparas tu panorama actual frente a un escenario donde parte de tu bono apoya una estrategia de ahorro con beneficio tributario.',
  },
  fvp_afc: {
    eyebrow: 'FVP y AFC',
    title: 'Aquí está el mayor espacio de optimización',
    body: 'Estos instrumentos pueden ayudarte a construir patrimonio con mayor eficiencia. El simulador te muestra cuánto beneficio ya usas y cuánto te falta por activar.',
  },
  results_mountain: {
    eyebrow: 'Tu panorama',
    title: 'Esta montaña te muestra qué tan cerca estás de aprovechar tu beneficio',
    body: 'La meta es llegar a la cima del cupo tributario disponible. Verás cuánto ya está activo, cuánto te falta y cuál podría ser tu siguiente paso.',
  },
  results_benefits: {
    eyebrow: 'Detalle',
    title: 'Tus beneficios activos quedan resumidos aquí',
    body: 'Puedes desplegar este bloque cuando quieras ver de dónde sale cada valor y cómo participa dentro del resultado final.',
  },
};

const getStepSummary = (step: number, formData: FormData, results: SimulatorResults) => {
  switch (step) {
    case 0:
      return {
        label: 'Inicio del journey',
        value: formData.documentType || 'Aún sin documento seleccionado',
      };
    case 1:
      return {
        label: 'Ingreso estimado',
        value: formData.salMensual > 0 ? `$${formatCOP(results.totalIngresos)}` : 'Completa tu ingreso base',
      };
    case 2:
      return {
        label: 'Beneficio global en uso',
        value: `$${formatCOP(results.dedAdmis)}`,
      };
    case 3:
      return {
        label: 'Cupo FVP disponible',
        value: `$${formatCOP(results.topup)}`,
      };
    case 4:
      return {
        label: 'Ahorro potencial estimado',
        value: `$${formatCOP(results.ahorroTopup)}`,
      };
    default:
      return {
        label: 'Resumen',
        value: 'Sigue avanzando en el simulador',
      };
  }
};

const SamiAssistantPanel = ({ step, activeKey, formData, results }: SamiAssistantPanelProps) => {
  const selectedKey = activeKey && CONTENT[activeKey] ? activeKey : STEP_DEFAULT_KEYS[step] ?? 'step0_intro';
  const content = CONTENT[selectedKey];
  const summary = getStepSummary(step, formData, results);

  return (
    <motion.aside
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35 }}
      className="lg:sticky lg:top-24"
    >
      <Card className="skandia-card overflow-hidden p-0">
        <div className="border-b border-border px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-primary">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">SAMI te acompaña</p>
              <h3 className="font-display text-lg font-bold text-foreground">Guía conversacional</h3>
            </div>
          </div>
        </div>

        <div className="space-y-5 px-6 py-6">
          <Badge className="w-fit bg-secondary text-secondary-foreground border-border">{content.eyebrow}</Badge>
          <div className="space-y-3">
            <h4 className="font-display text-xl font-bold leading-tight text-foreground">{content.title}</h4>
            <p className="text-sm leading-7 text-muted-foreground">{content.body}</p>
            {content.note && <p className="text-sm leading-7 text-foreground">{content.note}</p>}
          </div>

          <div className="rounded-2xl border border-border bg-secondary p-4">
            <div className="mb-2 flex items-center gap-2 text-primary">
              <Sparkles className="h-4 w-4" />
              <p className="text-xs font-semibold uppercase tracking-[0.18em]">Lectura rápida</p>
            </div>
            <p className="text-xs text-muted-foreground">{summary.label}</p>
            <p className="mt-1 font-display text-lg font-bold text-foreground">{summary.value}</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="mb-2 flex items-center gap-2 text-primary">
              <TrendingUp className="h-4 w-4" />
              <p className="text-xs font-semibold uppercase tracking-[0.18em]">Qué estás construyendo</p>
            </div>
            <p className="text-sm leading-7 text-muted-foreground">
              Un panorama simple para decidir mejor cómo alinear ingresos, beneficios tributarios y estrategia patrimonial.
            </p>
          </div>
        </div>
      </Card>
    </motion.aside>
  );
};

export default SamiAssistantPanel;
