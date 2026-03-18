import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, CheckCircle2, AlertTriangle, XCircle, MessageCircle, Mountain, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { FormData } from '@/lib/simulator-types';
import { SimulatorResults, formatCOP, UVT, TOPE_FE } from '@/lib/tax-engine';

interface Step4Props {
  formData: FormData;
  results: SimulatorResults;
  onBack: () => void;
}

const StatusBadge = ({ used, max }: { used: number; max: number }) => {
  const pct = max > 0 ? (used / max) * 100 : 0;
  if (pct >= 100) return <Badge className="bg-primary/10 text-primary border-primary/20"><XCircle className="w-3 h-3 mr-1" /> Tope alcanzado</Badge>;
  if (pct >= 75) return <Badge className="bg-skandia-gold-light text-foreground border-skandia-gold-border"><AlertTriangle className="w-3 h-3 mr-1" /> {Math.round(pct)}% usado</Badge>;
  return <Badge className="bg-success-light text-success border-success-border"><CheckCircle2 className="w-3 h-3 mr-1" /> {Math.round(pct)}% activo</Badge>;
};

const Step4Results = ({ formData, results, onBack }: Step4Props) => {
  const [showBenefits, setShowBenefits] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const hasPACK = formData.usePACK && formData.hasBono;
  const hasFE = formData.comprasFE > 0;

  const totalBenefit = results.topeFVP;
  const usedBenefit = Math.min(results.afc, totalBenefit);
  const remainingBenefit = Math.max(results.topup, 0);
  const benefitPct = totalBenefit > 0 ? Math.min((usedBenefit / totalBenefit) * 100, 100) : 0;
  const mesesInversion = 10;
  const aporteMensualSugerido = remainingBenefit > 0 ? remainingBenefit / mesesInversion : 0;
  const ahorroTotalEstimado = results.ahorroTopup + (hasFE ? results.ahorroFE1 : 0);

  const benefits = [
    {
      icon: '🏥', name: 'Seguridad social y aportes voluntarios al fondo obligatorio',
      desc: `EPS $${formatCOP(results.eps)} + Pensión $${formatCOP(results.pension)} + FSP $${formatCOP(results.fsp)}`,
      used: results.incNoCons, max: results.incNoCons, article: 'Art. 55 ET',
      show: true
    },
    {
      icon: '👨‍👩‍👧‍👦', name: 'Dependientes',
      desc: `${formData.numDep} dependiente${formData.numDep !== 1 ? 's' : ''}`,
      used: results.dep, max: UVT * 32 * 12, article: 'Art. 387 ET',
      show: formData.numDep > 0
    },
    {
      icon: '🏠', name: 'Intereses de crédito de vivienda',
      desc: 'Intereses pagados en 2026',
      used: results.hip, max: 100 * UVT * 12, article: 'Art. 119 ET',
      show: formData.hasHip
    },
    {
      icon: '💙', name: 'Salud prepagada o seguro de salud',
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
      icon: '📈', name: 'FVP + AFC + PAC Skandia',
      desc: 'Aportes voluntarios con beneficio tributario',
      used: results.afc, max: results.topeFVP, article: 'Art. 126-1 y 126-4 ET',
      show: true
    },
    {
      icon: '📋', name: 'Renta exenta laboral 25%',
      desc: 'Beneficio sobre renta líquida laboral',
      used: results.reLaboral, max: UVT * 790, article: 'Art. 206 num. 10 ET',
      show: true
    },
  ];

  return (
    <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-8">
      <div data-sami-key="results_mountain" className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_320px]">
        <Card className="skandia-card overflow-hidden">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-center">
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Tu panorama tributario</p>
                <h2 className="text-2xl sm:text-3xl font-bold font-display text-foreground">Tu meta está en la cima: aprovechar al máximo tu beneficio tributario.</h2>
                <p className="text-sm leading-7 text-muted-foreground max-w-2xl">
                  Esta visual te muestra cuánto cupo de FVP, AFC y PAC ya está activo, cuánto te falta por usar y qué impacto podría tener en tu impuesto estimado.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-border bg-secondary p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Beneficio total</p>
                  <p className="mt-2 text-xl font-bold font-display text-foreground">${formatCOP(totalBenefit)}</p>
                  <p className="text-xs text-muted-foreground mt-1">Cupo disponible total</p>
                </div>
                <div className="rounded-2xl border border-border bg-secondary p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Ya en uso</p>
                  <p className="mt-2 text-xl font-bold font-display text-foreground">${formatCOP(usedBenefit)}</p>
                  <p className="text-xs text-muted-foreground mt-1">Hoy ya está activo</p>
                </div>
                <div className="rounded-2xl border border-border bg-secondary p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Aún disponible</p>
                  <p className="mt-2 text-xl font-bold font-display text-primary">${formatCOP(remainingBenefit)}</p>
                  <p className="text-xs text-muted-foreground mt-1">Espacio por aprovechar</p>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center gap-2 text-primary mb-3">
                  <TrendingUp className="w-4 h-4" />
                  <p className="text-xs font-semibold uppercase tracking-[0.18em]">Lectura del resultado</p>
                </div>
                <p className="text-sm leading-7 text-foreground">
                  {remainingBenefit > 0
                    ? `Hoy estás aprovechando ${Math.round(benefitPct)}% de tu cupo. Si activaras el valor disponible, tu ahorro estimado en impuesto podría llegar a $${formatCOP(ahorroTotalEstimado)}.`
                    : `Ya estás aprovechando prácticamente todo tu cupo disponible. Tu estructura actual ya muestra un uso muy alto del beneficio tributario.`}
                </p>
                {remainingBenefit > 0 && (
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    Tienes {mesesInversion} meses para invertir este valor en algunos de tus contratos de inversión. Si empezaras hoy deberías hacer aportes mensuales de ${formatCOP(aporteMensualSugerido)}.
                  </p>
                )}
                {hasPACK && (
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    Si comparas el escenario con PAC, el ahorro estimado adicional es de ${formatCOP(results.ahorroPAC)}.
                  </p>
                )}
                {hasFE && (
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    Además, tus compras con factura electrónica podrían sumar hasta $${formatCOP(results.dedFE1)} de beneficio adicional por fuera del tope global.
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => window.open('https://inversiones.skandia.com.co/asesoria', '_blank', 'noopener,noreferrer')}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-8 rounded-full"
                >
                  Contacta a tu asesor
                </Button>
                <Button variant="outline" onClick={onBack} className="h-12 px-6">
                  <ChevronLeft className="mr-2 w-4 h-4" /> Ajustar mis datos
                </Button>
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-secondary p-5">
              <div className="mb-4 flex items-center gap-2 text-foreground">
                <Mountain className="w-5 h-5 text-primary" />
                <p className="font-display text-lg font-bold">Mapa de ascenso</p>
              </div>

              <div className="relative mx-auto h-[360px] max-w-[240px]">
                <div className="absolute inset-y-4 left-2 flex flex-col justify-between text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  <span>100%</span>
                  <span>75%</span>
                  <span>50%</span>
                  <span>25%</span>
                  <span>0%</span>
                </div>
                <div className="absolute inset-x-8 bottom-0 top-2 overflow-hidden rounded-[28px] border border-border bg-card">
                  <div className="benefit-mountain absolute inset-4" />
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${benefitPct}%` }}
                    transition={{ duration: 0.9, ease: 'easeOut' }}
                    className="benefit-mountain-fill absolute bottom-4 left-4 right-4"
                  />
                  <div className="absolute left-0 right-0 top-6 flex justify-center">
                    <Badge className="bg-card text-foreground border-border">${formatCOP(usedBenefit)} en uso</Badge>
                  </div>
                  {remainingBenefit > 0 && (
                    <div className="absolute inset-x-5 bottom-6 rounded-2xl border border-skandia-gold-border bg-skandia-gold-light p-3 text-center">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Te falta por subir</p>
                      <p className="mt-1 font-display text-lg font-bold text-foreground">${formatCOP(remainingBenefit)}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid gap-4">
          <Card className="skandia-card p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Impuesto estimado actual</p>
            <p className="mt-2 text-2xl font-bold font-display text-foreground">${formatCOP(results.impNormal)}</p>
          </Card>
          <Card className="skandia-card p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Impuesto estimado optimizado</p>
            <p className="mt-2 text-2xl font-bold font-display text-primary">${formatCOP(results.impTopup)}</p>
          </Card>
          <Card className="skandia-card p-5">
            <div className="flex items-center gap-2 text-primary">
              <MessageCircle className="w-4 h-4" />
              <p className="text-xs uppercase tracking-[0.18em]">Siguiente conversación</p>
            </div>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">Tu asesor puede ayudarte a convertir este resultado en una ruta de inversión alineada con tus contratos y tu momento patrimonial.</p>
          </Card>
        </div>
      </div>

      <Card className="skandia-card space-y-4">
        <div data-sami-key="results_benefits" className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-bold font-display text-foreground">Beneficios tributarios activos</h3>
            <p className="text-sm text-muted-foreground">Despliega este bloque para ver el detalle de lo que ya está participando en tu resultado.</p>
          </div>
          <Collapsible open={showBenefits} onOpenChange={setShowBenefits}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="h-11">
                {showBenefits ? 'Ocultar detalle' : 'Ver beneficios activos'}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-6 divide-y divide-border">
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
            </CollapsibleContent>
          </Collapsible>
        </div>
      </Card>

      <Collapsible open={showDetail} onOpenChange={setShowDetail}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full h-12">
            {showDetail ? 'Ocultar detalle de cálculos' : 'Ver detalle completo de cálculos'}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Card className="skandia-card mt-6 overflow-x-auto">
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
                  ['Renta exenta sin límite', results.reSinLim],
                  ['Renta exenta laboral', results.reLaboral],
                  ['Total deducciones', results.totalDed],
                  ['Deducciones admisibles', results.dedAdmis],
                  ['Tope global', results.maxBeneficio],
                  ['Tope FVP', results.topeFVP],
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
    </motion.div>
  );
};

export default Step4Results;
