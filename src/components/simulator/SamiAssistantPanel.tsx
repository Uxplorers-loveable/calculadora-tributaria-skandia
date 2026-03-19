import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FormData } from '@/lib/simulator-types';
import { SimulatorResults, formatCOP } from '@/lib/tax-engine';
import { getPersonalizedName } from '@/lib/personalization';

interface SamiAssistantPanelProps {
  step: number;
  activeKey?: string;
  formData: FormData;
  results: SimulatorResults;
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
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
    body: 'En Skandia conectas tu capital con portafolios globales y conviertes tu planeación tributaria en una decisión estratégica. ',
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
    eyebrow: 'Resultado',
    title: 'Aquí ves lo que ya usas y lo que aún puedes activar',
    body: 'Revisa tres datos clave: total posible, valor activo y valor disponible.',
    note: 'Si quieres avanzar, un asesor puede ayudarte a definir el siguiente paso.',
  },
  results_benefits: {
    eyebrow: 'Detalle',
    title: 'Tus beneficios activos quedan resumidos aquí',
    body: 'Puedes desplegar este bloque cuando quieras ver de dónde sale cada valor y cómo participa dentro del resultado final.',
  },
};

const SamiAssistantPanel = ({ step, activeKey, formData, results, onBack, onNext, nextLabel }: SamiAssistantPanelProps) => {
  const selectedKey = activeKey && CONTENT[activeKey] ? activeKey : STEP_DEFAULT_KEYS[step] ?? 'step0_intro';
  const baseContent = CONTENT[selectedKey];
  const userName = getPersonalizedName(formData.documentNumber);
  const suggestedMonthlyContribution = Math.max(results.topup, 0) / 10;
  const shouldShowUserName = step > 0 && Boolean(userName);
  const content = shouldShowUserName
    ? {
        ...baseContent,
        title:
          selectedKey === 'step0_intro'
            ? `Hola ${userName}, empecemos a construir tu panorama tributario`
            : baseContent.title,
      }
    : baseContent;
  const hasNavigation = Boolean(onBack || onNext);
  const navAlignment = onBack && onNext ? 'justify-between' : onNext ? 'justify-end' : 'justify-start';

  return (
    <>
      <motion.aside
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35 }}
      >
        <Card className="skandia-card overflow-hidden p-0 lg:flex lg:flex-col">
          <div className="border-b border-border bg-secondary/60 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/10 bg-primary/5 text-primary">
                <MessageCircle className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">SAMI te acompaña</p>
                {shouldShowUserName && <p className="mt-1 text-xs font-medium text-foreground">Hola {userName}</p>}
              </div>
            </div>
          </div>

          <div className="space-y-4 px-5 py-5">
            <Badge className="w-fit rounded-full border border-primary/10 bg-primary/5 px-3 py-1 text-xs text-primary">{content.eyebrow}</Badge>
            <div className="space-y-3">
              <h4 className="font-display text-xl font-bold leading-tight text-foreground">{content.title}</h4>
              <p className="text-sm leading-6 text-muted-foreground">{content.body}</p>
              {content.note && <p className="border-l-2 border-primary/20 pl-3 text-sm leading-6 text-foreground">{content.note}</p>}
            </div>

            {step === 4 && (
              <div className="rounded-xl border border-primary/10 bg-secondary/60 p-4">
                <h3 className="font-display text-xl font-bold leading-tight text-foreground">Aún estas a tiempo</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Tu asesor financiero puede ayudarte a cosntruir la mejor estrategia tributaria.
                </p>
                <p className="mt-3 text-sm leading-6 text-foreground">
                  Si empiezas hoy, podrías aportar <span className="font-semibold">${formatCOP(suggestedMonthlyContribution)}</span> al mes.
                </p>

                <Button
                  onClick={() => window.open('https://inversiones.skandia.com.co/asesoria', '_blank', 'noopener,noreferrer')}
                  className="mt-4 h-10 rounded-full bg-primary px-5 text-sm text-primary-foreground hover:bg-primary/90"
                >
                  Agendar una cita con mi asesor
                </Button>
              </div>
            )}
          </div>

          {hasNavigation && (
            <div className="hidden border-t border-border bg-background/95 px-5 py-4 backdrop-blur-sm lg:block">
              <div className={`flex gap-3 ${navAlignment}`}>
                {onBack && (
                  <Button variant="ghost" onClick={onBack} className="h-11 text-muted-foreground">
                    <ChevronLeft className="mr-2 h-4 w-4" /> Atrás
                  </Button>
                )}
                {onNext && (
                  <Button onClick={onNext} className="h-11 w-full shrink-0 whitespace-nowrap rounded-full bg-primary px-4 text-sm text-primary-foreground hover:bg-primary/90">
                    {nextLabel ?? 'Siguiente'} <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          )}
        </Card>
      </motion.aside>

      {hasNavigation && (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 px-4 py-4 backdrop-blur-sm lg:hidden">
          <div className={`mx-auto flex max-w-[1200px] gap-3 ${navAlignment}`}>
            {onBack && (
              <Button variant="ghost" onClick={onBack} className="h-11 text-muted-foreground">
                <ChevronLeft className="mr-2 h-4 w-4" /> Atrás
              </Button>
            )}
            {onNext && (
              <Button onClick={onNext} className="h-11 w-auto shrink-0 whitespace-nowrap rounded-full bg-primary px-7 text-primary-foreground hover:bg-primary/90">
                {nextLabel ?? 'Siguiente'} <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SamiAssistantPanel;
