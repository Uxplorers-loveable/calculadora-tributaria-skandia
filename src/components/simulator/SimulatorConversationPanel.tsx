import { motion } from 'framer-motion';
import { BadgeDollarSign, CheckCircle2, Compass, Landmark, Sparkles, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { FormData } from '@/lib/simulator-types';
import { SimulatorResults, formatCOP } from '@/lib/tax-engine';

interface SimulatorConversationPanelProps {
  currentStep: number;
  formData: FormData;
  results: SimulatorResults;
}

const STEP_LABELS = [
  'Identificación',
  'Capital actual',
  'Beneficios activos',
  'FVP y PAC',
  'Panorama final',
];

const SimulatorConversationPanel = ({ currentStep, formData, results }: SimulatorConversationPanelProps) => {
  const remainingFvp = Math.max(results.topup, 0);
  const currentSection = STEP_LABELS[currentStep] ?? STEP_LABELS[0];

  const conversation = {
    0: {
      eyebrow: 'Tu punto de partida',
      title: 'Abramos tu panorama con claridad',
      message:
        'Las inversiones que buscas están aquí. Empecemos por validar tu información para construir una lectura clara, confiable y alineada con la forma en que hoy se mueve tu capital.',
      checklist: [
        'Selecciona tu tipo de documento.',
        'Ingresa tu número sin puntos ni espacios.',
        'Continúa para mapear cómo se compone tu ingreso.',
      ],
      note: 'Este paso abre una conversación más precisa sobre eficiencia tributaria y crecimiento patrimonial.',
    },
    1: {
      eyebrow: 'Cómo entra tu capital',
      title: 'Mapeemos tu ingreso con una lectura real',
      message:
        'Aquí identificamos qué parte de tu ingreso ya construye base patrimonial y qué componentes pueden abrir nuevas decisiones inteligentes: salario, variables, bonos y aportes.',
      checklist: [
        'Confirma tu salario básico y el tipo de contrato.',
        'Activa auxilios, variable o bono si hacen parte de tu realidad.',
        'Incluye aportes voluntarios al fondo obligatorio si ya los haces.',
      ],
      note: 'Mientras más fiel sea esta foto, más útil será el panorama que descubrirás después.',
    },
    2: {
      eyebrow: 'Eficiencia que ya existe',
      title: 'Ahora veamos qué beneficios ya trabajan a tu favor',
      message:
        'No se trata solo de calcular deducciones. Se trata de entender cuánto espacio de optimización ya estás aprovechando y cuánto capital adicional podrías conectar con una estrategia más eficiente.',
      checklist: [
        'Indica dependientes, vivienda y salud si aplican.',
        'Incluye tus compras con factura electrónica.',
        'Avanza para descubrir cómo FVP y PAC pueden complementar lo que ya tienes activo.',
      ],
      note: 'Este paso ayuda a ordenar tu realidad tributaria antes de proyectar nuevas oportunidades.',
    },
    3: {
      eyebrow: 'Tu espacio de inversión eficiente',
      title: 'Aquí empieza la conversación estratégica',
      message:
        'El FVP y el PAC pueden convertir parte de tu capital en una herramienta de optimización tributaria y evolución patrimonial. Aquí visualizamos cuánto ya estás usando y cuánto espacio sigue disponible.',
      checklist: [
        'Activa PAC si tu empresa ya lo tiene para ti.',
        'Incluye tus aportes mensuales a FVP y AFC.',
        'Si recibes bono, explora cómo podría conectarse con tu estrategia.',
      ],
      note: 'Este es el puente entre beneficio tributario, diversificación y decisiones más inteligentes sobre tu patrimonio.',
    },
    4: {
      eyebrow: 'Tu panorama',
      title: remainingFvp > 0 ? 'Tu capital todavía tiene espacio para trabajar mejor' : 'Tu estrategia ya está bastante avanzada',
      message:
        remainingFvp > 0
          ? `Hoy identificamos un espacio potencial de $${formatCOP(remainingFvp)} para conectar tu capital con mayor eficiencia. Eso puede traducirse en una reducción estimada de $${formatCOP(results.ahorroTopup)} en impuesto y en un portafolio que evoluciona contigo.`
          : 'Tu lectura muestra que ya estás aprovechando gran parte del espacio disponible. El siguiente nivel de la conversación puede enfocarse en diversificación, seguimiento y evolución de portafolio con acompañamiento experto.',
      checklist: [
        'Compara tu escenario actual con el optimizado.',
        'Revisa cuánto espacio FVP sigue disponible.',
        'Usa este panorama como base para conversar con un wealth planner.',
      ],
      note: 'El objetivo no es solo pagar menos impuesto: es ganar más control sobre cómo crece tu patrimonio.',
    },
  }[currentStep as 0 | 1 | 2 | 3 | 4];

  const highlights = [
    formData.salMensual > 0
      ? {
          icon: Landmark,
          label: 'Ingreso anual estimado',
          value: `$${formatCOP(results.totalIngresos)}`,
        }
      : null,
    currentStep >= 2 && results.totalDed > 0
      ? {
          icon: BadgeDollarSign,
          label: 'Beneficios identificados',
          value: `$${formatCOP(results.totalDed)}`,
        }
      : null,
    currentStep >= 3
      ? {
          icon: TrendingUp,
          label: 'Espacio FVP disponible',
          value: `$${formatCOP(remainingFvp)}`,
        }
      : null,
  ].filter(Boolean) as Array<{ icon: typeof Landmark; label: string; value: string }>;

  return (
    <aside className="self-start lg:sticky lg:top-24">
      <Card className="sami-panel overflow-hidden">
        <div className="sami-panel-hero p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background/80">
                <span className="font-display text-xs font-bold tracking-[0.24em] text-foreground">SAMI</span>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Sabio + Amigo</p>
                <h2 className="font-display text-xl font-bold text-foreground">Campo conversacional</h2>
              </div>
            </div>
            <Badge variant="outline" className="rounded-full border-border bg-background/70 text-foreground">
              {currentSection}
            </Badge>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            En Skandia conectamos tu capital con decisiones claras, seguimiento continuo y una conversación pensada para que tu patrimonio trabaje a tu favor.
          </p>
        </div>

        <div className="max-h-[calc(100vh-12rem)] overflow-y-auto">
          <div className="space-y-6 p-6">
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-primary">
                <Sparkles className="h-4 w-4" />
                <p className="text-xs font-semibold uppercase tracking-[0.24em]">{conversation.eyebrow}</p>
              </div>

              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="sami-panel-section space-y-3"
              >
                <h3 className="font-display text-2xl font-bold text-foreground">{conversation.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{conversation.message}</p>
              </motion.div>
            </section>

            <section className="space-y-3">
              <div className="flex items-center gap-2 text-foreground">
                <Compass className="h-4 w-4 text-primary" />
                <p className="font-display text-sm font-bold">Cómo avanzar en este paso</p>
              </div>
              <div className="space-y-2">
                {conversation.checklist.map((item) => (
                  <div key={item} className="flex gap-3 rounded-2xl border border-border bg-secondary/70 px-4 py-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                    <p className="text-sm text-foreground">{item}</p>
                  </div>
                ))}
              </div>
            </section>

            {highlights.length > 0 && (
              <section className="space-y-3">
                <p className="font-display text-sm font-bold text-foreground">Lo que ya descubrimos</p>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  {highlights.map(({ icon: Icon, label, value }) => (
                    <div key={label} className="rounded-2xl border border-border bg-card px-4 py-4 shadow-sm">
                      <Icon className="mb-2 h-4 w-4 text-primary" />
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
                      <p className="mt-1 font-display text-xl font-bold text-foreground">{value}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section className="space-y-3">
              <p className="font-display text-sm font-bold text-foreground">Recorrido del simulador</p>
              <div className="space-y-3">
                {STEP_LABELS.map((label, index) => {
                  const isActive = index === currentStep;
                  const isComplete = index < currentStep;

                  return (
                    <div key={label} className="flex items-center gap-3">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold ${
                          isActive
                            ? 'border-primary bg-primary text-primary-foreground'
                            : isComplete
                              ? 'border-primary/20 bg-secondary text-primary'
                              : 'border-border bg-card text-muted-foreground'
                        }`}
                      >
                        {isComplete ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>{label}</p>
                        {isActive && <p className="text-xs text-muted-foreground">Estás aquí ahora</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-secondary px-4 py-4">
              <p className="font-display text-sm font-bold text-foreground">Lectura de SAMI</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{conversation.note}</p>
            </section>
          </div>
        </div>
      </Card>
    </aside>
  );
};

export default SimulatorConversationPanel;
