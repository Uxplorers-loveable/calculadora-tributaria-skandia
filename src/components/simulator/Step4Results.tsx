import { motion } from 'framer-motion';
import { ChevronLeft, CheckCircle2, AlertTriangle, XCircle, TrendingUp, Wallet, Building2, MessageCircle } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import SamiBubble from './SamiBubble';
import { FormData } from '@/lib/simulator-types';
import { SimulatorResults, formatCOP, UVT, TOPE_FE } from '@/lib/tax-engine';
import { useState } from 'react';

interface Step4Props {
  formData: FormData;
  results: SimulatorResults;
  onBack: () => void;
}

const StatusBadge = ({ used, max }: { used: number; max: number }) => {
  const pct = max > 0 ? (used / max) * 100 : 0;
  if (pct >= 100) return <Badge className="bg-primary/10 text-primary border-primary/20"><XCircle className="w-3 h-3 mr-1" /> Tope alcanzado</Badge>;
  if (pct >= 75) return <Badge className="bg-skandia-gold-light text-foreground border-skandia-gold-border"><AlertTriangle className="w-3 h-3 mr-1" /> {Math.round(pct)}% usado</Badge>;
  return <Badge className="bg-success-light text-success border-success-border"><CheckCircle2 className="w-3 h-3 mr-1" /> {Math.round(pct)}% aprovechado</Badge>;
};

const MeterBar = ({ label, used, max, color = 'default' }: { label: string; used: number; max: number; color?: 'default' | 'gold' }) => {
  const pct = max > 0 ? Math.min((used / max) * 100, 100) : 0;
  const barColor = pct >= 100 ? 'bg-primary' : pct >= 75 ? 'bg-skandia-gold' : 'bg-success';

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end">
        <span className="font-bold text-foreground font-display">{label}</span>
        <span className="text-sm font-medium text-muted-foreground">${formatCOP(used)} / ${formatCOP(max)}</span>
      </div>
      <div className="h-3 bg-grey-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full rounded-full ${color === 'gold' ? 'bg-skandia-gold' : barColor}`}
        />
      </div>
      <p className="text-xs text-muted-foreground">{Math.round(pct)}% utilizado</p>
    </div>
  );
};

const formatCompactCOP = (value: number) =>
  `$${new Intl.NumberFormat('es-CO', { notation: 'compact', maximumFractionDigits: 1 }).format(value)}`;

const Step4Results = ({ formData, results, onBack }: Step4Props) => {
  const [showDetail, setShowDetail] = useState(false);
  const hasPACK = formData.usePACK && formData.hasBono;
  const hasFE = formData.comprasFE > 0;

  const mesesRestantes = Math.max(1, 12 - new Date().getMonth());
  const aporteMensual = results.topup > 0 ? results.topup / mesesRestantes : 0;
  const pacAnual = (formData.pacEmpresa + formData.pacPropio) * 12;
  const ahorroPct = results.impNormal > 0 ? (results.ahorroTopup / results.impNormal) * 100 : 0;

  const scenarioChartData = [
    {
      escenario: 'Impuesto estimado',
      sinOptimizar: results.impNormal,
      ...(hasPACK ? { conPAC: results.impPAC } : {}),
      fvpOptimo: results.impTopup,
    },
  ];

  const scenarioChartConfig = {
    sinOptimizar: {
      label: 'Sin optimizar',
      color: 'hsl(var(--grey-500))',
    },
    conPAC: {
      label: 'Con PAC',
      color: 'hsl(var(--skandia-gold))',
    },
    fvpOptimo: {
      label: 'FVP óptimo',
      color: 'hsl(var(--primary))',
    },
  } satisfies ChartConfig;

  const samiMsg = results.topup > 0
    ? `Aquí está tu panorama. Tu impuesto estimado sin optimizar es $${formatCOP(results.impNormal)}. Tienes $${formatCOP(results.topup)} de cupo disponible en el FVP — si lo usas, tu impuesto quedaría en $${formatCOP(results.impTopup)}, un ahorro de $${formatCOP(results.ahorroTopup)}.${hasPACK ? ` El PAC, adicionalmente, representa un ahorro de $${formatCOP(results.ahorroPAC)}.` : ''}${hasFE ? ` Y con tus compras con factura electrónica puedes descontar hasta $${formatCOP(results.dedFE1)} más — por fuera del tope global.` : ''}`
    : 'Ya estás aprovechando prácticamente todo el cupo tributario disponible para 2026. Tu impuesto estimado es $' + formatCOP(results.impTopup) + '. Si quieres revisar nuevas oportunidades, tu Asesor comercial puede acompañarte.';

  const benefits = [
    {
      icon: '🏥', name: 'Seguridad social y aportes vol. obligatorio',
      desc: `EPS $${formatCOP(results.eps)} + Pensión $${formatCOP(results.pension)} + FSP $${formatCOP(results.fsp)}`,
      used: results.incNoCons, max: results.incNoCons, article: 'Art. 55 ET',
      show: true
    },
    {
      icon: '👨‍👩‍👧‍👦', name: 'Personas a cargo / dependientes',
      desc: `${formData.numDep} dependiente${formData.numDep !== 1 ? 's' : ''}`,
      used: results.dep, max: UVT * 32 * 12, article: 'Art. 387 ET',
      show: formData.numDep > 0
    },
    {
      icon: '🏠', name: 'Intereses crédito de vivienda',
      desc: 'Intereses pagados en 2026',
      used: results.hip, max: 100 * UVT * 12, article: 'Art. 119 ET',
      show: formData.hasHip
    },
    {
      icon: '🏥', name: 'Medicina prepagada o seguro de salud',
      desc: 'Plan de salud complementario',
      used: results.salud, max: 16 * UVT * 12, article: 'Art. 387 ET',
      show: formData.hasSalud
    },
    {
      icon: '💼', name: 'Cesantías exentas',
      desc: 'Equivalente a un mes de salario',
      used: results.ces, max: results.ces, article: 'Art. 206 num. 4 ET',
      show: formData.tipo === 'Ordinario'
    },
    {
      icon: '📊', name: 'FVP + AFC + PAC Skandia',
      desc: 'Aportes voluntarios con beneficio tributario',
      used: results.afc, max: results.topeFVP, article: 'Art. 126-1 y 126-4 ET',
      show: true
    },
    {
      icon: '📋', name: 'Renta exenta por ingresos laborales 25%',
      desc: '25% de la renta líquida laboral',
      used: results.reLaboral, max: UVT * 790, article: 'Art. 206 num. 10 ET',
      show: true
    },
  ];

  return (
    <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
      <SamiBubble text={samiMsg} type={results.topup > 0 ? 'default' : 'gold'} />

      <div className={`grid gap-4 mb-8 ${hasPACK ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
        <Card className="p-6 bg-secondary border-border">
          <p className="text-sm text-muted-foreground mb-1">Sin optimizar</p>
          <p className="text-2xl font-bold font-display text-muted-foreground">${formatCOP(results.impNormal)}</p>
          <p className="text-[10px] uppercase tracking-wider mt-2 text-muted-foreground">Impuesto estimado 2026</p>
        </Card>

        {hasPACK && (
          <Card className="p-6 border-skandia-gold-border bg-skandia-gold-light">
            <p className="text-sm font-medium mb-1 text-foreground">Con PAC</p>
            <p className="text-2xl font-bold font-display text-foreground">${formatCOP(results.impPAC)}</p>
            <p className="text-[10px] uppercase tracking-wider mt-2 text-muted-foreground">Ahorro: ${formatCOP(results.ahorroPAC)}</p>
          </Card>
        )}

        <Card className="p-6 shadow-lg bg-primary text-primary-foreground">
          <p className="text-sm mb-1 opacity-80">FVP Óptimo</p>
          <p className="text-2xl font-bold font-display">${formatCOP(results.impTopup)}</p>
          <p className="text-[10px] uppercase tracking-wider mt-2 opacity-80">Ahorro: ${formatCOP(results.ahorroTopup)}</p>
        </Card>
      </div>

      <Card className="skandia-card mb-8 overflow-hidden">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium text-primary mb-1">Visualízalo rápido</p>
            <h3 className="text-xl font-bold font-display text-foreground">Comparativo de tu impuesto estimado</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
              Esta gráfica compara tu escenario actual frente a las alternativas optimizadas para que entiendas de inmediato el impacto potencial en tu impuesto.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-secondary px-4 py-3">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Reducción estimada</p>
            <p className="text-2xl font-bold font-display text-primary">{Math.round(ahorroPct)}%</p>
            <p className="text-xs text-muted-foreground">vs. escenario sin optimizar</p>
          </div>
        </div>

        <ChartContainer config={scenarioChartConfig} className="mt-6 h-[300px] w-full aspect-auto">
          <BarChart data={scenarioChartData} barGap={16} margin={{ top: 12, right: 12, left: 12, bottom: 8 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="escenario" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} width={88} tickFormatter={(value) => formatCompactCOP(Number(value))} />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value, name) => (
                    <div className="flex min-w-[180px] items-center justify-between gap-4">
                      <span className="text-muted-foreground">{scenarioChartConfig[name as keyof typeof scenarioChartConfig]?.label ?? String(name)}</span>
                      <span className="font-mono font-medium text-foreground">${formatCOP(Number(value))}</span>
                    </div>
                  )}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="sinOptimizar" fill="var(--color-sinOptimizar)" radius={[10, 10, 0, 0]} maxBarSize={72} />
            {hasPACK && <Bar dataKey="conPAC" fill="var(--color-conPAC)" radius={[10, 10, 0, 0]} maxBarSize={72} />}
            <Bar dataKey="fvpOptimo" fill="var(--color-fvpOptimo)" radius={[10, 10, 0, 0]} maxBarSize={72} />
          </BarChart>
        </ChartContainer>
      </Card>

      <div className="skandia-hero-dark p-8 mb-8">
        <div className={`grid gap-6 ${hasFE ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4' : 'grid-cols-1 md:grid-cols-3'}`}>
          <div>
            <Wallet className="w-5 h-5 mb-2 text-skandia-gold" />
            <p className="text-xs text-grey-400 mb-1">Cupo disponible FVP</p>
            <p className="text-xl font-bold font-display text-skandia-gold">${formatCOP(results.topup)}</p>
            <p className="text-[10px] text-grey-400 mt-1">Sin usar en 2026</p>
          </div>
          <div>
            <TrendingUp className="w-5 h-5 mb-2" />
            <p className="text-xs text-grey-400 mb-1">Ahorro posible en impuesto</p>
            <p className="text-xl font-bold font-display">${formatCOP(results.ahorroTopup)}</p>
            <p className="text-[10px] text-grey-400 mt-1">Menos en tu declaración 2027</p>
          </div>
          <div>
            <Building2 className="w-5 h-5 mb-2 text-skandia-green-light" />
            <p className="text-xs text-grey-400 mb-1">Aporte mensual estimado</p>
            <p className="text-xl font-bold font-display text-skandia-green-light">${formatCOP(aporteMensual)}</p>
            <p className="text-[10px] text-grey-400 mt-1">{mesesRestantes} meses para el cierre</p>
          </div>
          {hasFE && (
            <div>
              <CheckCircle2 className="w-5 h-5 mb-2 text-success" />
              <p className="text-xs text-grey-400 mb-1">Ahorro factura electrónica</p>
              <p className="text-xl font-bold font-display">${formatCOP(results.dedFE1)}</p>
              <p className="text-[10px] text-grey-400 mt-1">Fuera del tope global</p>
            </div>
          )}
        </div>
        {formData.hasPAC && formData.pacSaldo > 0 && (
          <div className="mt-6 pt-6 border-t border-grey-700">
            <p className="text-xs text-grey-400 mb-1">Saldo acumulado PAC</p>
            <p className="text-xl font-bold font-display text-skandia-gold">${formatCOP(formData.pacSaldo)}</p>
            <p className="text-[10px] text-grey-400 mt-1">En tu cuenta Skandia hoy</p>
          </div>
        )}
      </div>

      <Card className="skandia-card space-y-8 mb-8">
        <MeterBar label="Cupo global de deducciones — 1.340 UVT" used={results.dedAdmis} max={results.maxBeneficio} />
        <div className="border-t border-border pt-8">
          <MeterBar label="Cupo FVP + AFC + PAC — 30% del ingreso o 3.800 UVT" used={results.afc} max={results.topeFVP} />
          <p className="text-xs text-muted-foreground italic mt-2">Este cupo corresponde al 30% de tu ingreso o 3.800 UVT, lo que sea menor.</p>
        </div>
        {formData.hasPAC && (
          <div className="border-t border-border pt-8">
            <MeterBar label="PAC Skandia" used={pacAnual} max={results.topeFVP} color="gold" />
            <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
              <span>Empresa: ${formatCOP(formData.pacEmpresa * 12)}/año</span>
              <span>Propios: ${formatCOP(formData.pacPropio * 12)}/año</span>
            </div>
          </div>
        )}
      </Card>

      <Card className="skandia-card space-y-4 mb-8">
        <h3 className="text-lg font-bold font-display text-foreground">Beneficios tributarios activos</h3>
        <div className="divide-y divide-border">
          {benefits.filter(b => b.show).map((b, i) => (
            <div key={i} className="py-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span>{b.icon}</span>
                  <p className="font-medium text-sm text-foreground">{b.name}</p>
                </div>
                <p className="text-xs text-muted-foreground">{b.desc}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{b.article}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-semibold text-foreground">${formatCOP(b.used)}</p>
                <p className="text-[10px] text-muted-foreground">de ${formatCOP(b.max)}</p>
              </div>
              <StatusBadge used={b.used} max={b.max} />
            </div>
          ))}
          {hasFE && (
            <div className="py-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span>🧾</span>
                  <p className="font-medium text-sm text-foreground">Compras con factura electrónica</p>
                </div>
                <p className="text-xs text-muted-foreground">Art. 336 num. 5 ET</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-semibold text-foreground">${formatCOP(results.dedFE1)}</p>
                <p className="text-[10px] text-muted-foreground">de ${formatCOP(TOPE_FE)}</p>
              </div>
              <div className="flex gap-2">
                <StatusBadge used={results.dedFE1} max={TOPE_FE} />
                <Badge className="bg-success-light text-success border-success-border text-[10px]">Fuera del tope</Badge>
              </div>
            </div>
          )}
        </div>
      </Card>

      <Collapsible open={showDetail} onOpenChange={setShowDetail}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full mb-8 h-12">
            {showDetail ? '▾ Ocultar detalle de cálculos' : '▸ Ver detalle completo de cálculos'}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Card className="skandia-card mb-8 overflow-x-auto">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-border">
                {[
                  ['Salario anual', results.salAnual],
                  ['Auxilios anuales', results.auxAnual],
                  ['Variable anual', results.variable],
                  ['Bono anual', results.bono],
                  ['Total ingresos', results.totalIngresos],
                  ['Base seg. social', results.baseSS],
                  ['Base SS bono', results.baseBono],
                  ['Aporte EPS', results.eps],
                  ['Aporte pensión', results.pension],
                  ['FSP', results.fsp],
                  ['Ingreso no constitutivo', results.incNoCons],
                  ['Renta líquida', results.rentaLiq],
                  ['Dependientes', results.dep],
                  ['Intereses vivienda', results.hip],
                  ['Salud prepagada', results.salud],
                  ['Cesantías', results.ces],
                  ['AFC total', results.afc],
                  ['Renta exenta sin lím.', results.reSinLim],
                  ['Renta exenta laboral', results.reLaboral],
                  ['Total deducciones', results.totalDed],
                  ['Deducciones admisibles', results.dedAdmis],
                  ['Tope global (1.340 UVT)', results.maxBeneficio],
                  ['Tope FVP (30%/3.800)', results.topeFVP],
                  ['Top-up disponible', results.topup],
                  ['Base gravable normal', results.baseGrav],
                  ['Base gravable top-up', results.baseGravTU],
                  ['Impuesto normal', results.impNormal],
                  ['Impuesto optimizado', results.impTopup],
                  ['Ahorro', results.ahorroTopup],
                ].map(([label, val], i) => (
                  <tr key={i}>
                    <td className="py-2 pr-4 text-muted-foreground">{label}</td>
                    <td className="py-2 text-right font-medium font-display text-foreground">${formatCOP(val as number)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      <Card className="skandia-card space-y-4 border-primary/20 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary">
              <MessageCircle className="w-5 h-5" />
              <p className="font-bold font-display">Contacta a tu Asesor comercial</p>
            </div>
            <p className="text-sm text-muted-foreground">
              {results.topup > 0
                ? 'Ya tienes tu panorama tributario. El siguiente paso es hablar con tu Asesor comercial para revisar las opciones disponibles contigo.'
                : 'Ya terminaste la calculadora. Si quieres revisar alternativas o resolver dudas, tu Asesor comercial puede ayudarte.'}
            </p>
          </div>
          <Button
            onClick={() => window.open('https://inversiones.skandia.com.co/asesoria', '_blank', 'noopener,noreferrer')}
            className="bg-primary hover:bg-skandia-green-dark text-primary-foreground h-12 px-8 rounded-full"
          >
            Contactar a mi Asesor comercial
          </Button>
        </div>
      </Card>

      <div className="flex justify-start">
        <Button variant="ghost" onClick={onBack} className="h-12 text-muted-foreground">
          <ChevronLeft className="mr-2 w-4 h-4" /> Ajustar mis datos
        </Button>
      </div>
    </motion.div>
  );
};

export default Step4Results;
