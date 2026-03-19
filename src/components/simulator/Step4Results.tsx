import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, AlertTriangle, CheckCircle2, ChevronDown, XCircle } from 'lucide-react';
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

  if (pct >= 100) {
    return (
      <Badge className="border-primary/20 bg-primary/10 text-primary">
        <XCircle className="mr-1 h-3 w-3" /> Tope alcanzado
      </Badge>
    );
  }

  if (pct >= 75) {
    return (
      <Badge className="border-skandia-gold-border bg-skandia-gold-light text-foreground">
        <AlertTriangle className="mr-1 h-3 w-3" /> {Math.round(pct)}% usado
      </Badge>
    );
  }

  return (
    <Badge className="border-success-border bg-success-light text-success">
      <CheckCircle2 className="mr-1 h-3 w-3" /> {Math.round(pct)}% activo
    </Badge>
  );
};

const Step4Results = ({ formData, results, onBack }: Step4Props) => {
  const [showBenefits, setShowBenefits] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  const hasPACK = formData.usePACK && formData.hasBono;
  const hasFE = formData.comprasFE > 0;

  const totalBenefit = results.topeFVP;
  const usedBenefit = Math.min(results.afc, totalBenefit);
  const remainingBenefit = Math.max(results.topup, 0);
  const usedPct = totalBenefit > 0 ? Math.min((usedBenefit / totalBenefit) * 100, 100) : 0;
  const remainingPct = totalBenefit > 0 ? Math.min((remainingBenefit / totalBenefit) * 100, 100 - usedPct) : 0;
  const mesesInversion = 10;
  const aporteMensualSugerido = remainingBenefit > 0 ? remainingBenefit / mesesInversion : 0;
  const ahorroTotalEstimado = results.ahorroTopup + (hasFE ? results.ahorroFE1 : 0);
  const taxDelta = Math.max(results.impNormal - results.impTopup, 0);
  const reductionPct = results.impNormal > 0 ? Math.round((taxDelta / results.impNormal) * 100) : 0;

  const benefits = [
    {
      icon: '🏥',
      name: 'Seguridad social y aportes voluntarios al fondo obligatorio',
      desc: `EPS $${formatCOP(results.eps)} + Pensión $${formatCOP(results.pension)} + FSP $${formatCOP(results.fsp)}`,
      used: results.incNoCons,
      max: results.incNoCons,
      article: 'Art. 55 ET',
      show: true,
    },
    {
      icon: '👨‍👩‍👧‍👦',
      name: 'Dependientes',
      desc: `${formData.numDep} dependiente${formData.numDep !== 1 ? 's' : ''}`,
      used: results.dep,
      max: UVT * 32 * 12,
      article: 'Art. 387 ET',
      show: formData.numDep > 0,
    },
    {
      icon: '🏠',
      name: 'Intereses de crédito de vivienda',
      desc: 'Intereses pagados en 2026',
      used: results.hip,
      max: 100 * UVT * 12,
      article: 'Art. 119 ET',
      show: formData.hasHip,
    },
    {
      icon: '💙',
      name: 'Salud prepagada o seguro de salud',
      desc: 'Plan de salud complementario',
      used: results.salud,
      max: 16 * UVT * 12,
      article: 'Art. 387 ET',
      show: formData.hasSalud,
    },
    {
      icon: '💼',
      name: 'Cesantías exentas',
      desc: 'Equivalente a un mes de salario',
      used: results.ces,
      max: results.ces,
      article: 'Art. 206 num. 4 ET',
      show: formData.tipo === 'Ordinario',
    },
    {
      icon: '📈',
      name: 'FVP + AFC + PAC Skandia',
      desc: 'Aportes voluntarios con beneficio tributario',
      used: results.afc,
      max: results.topeFVP,
      article: 'Art. 126-1 y 126-4 ET',
      show: true,
    },
    {
      icon: '📋',
      name: 'Renta exenta laboral 25%',
      desc: 'Beneficio sobre renta líquida laboral',
      used: results.reLaboral,
      max: UVT * 790,
      article: 'Art. 206 num. 10 ET',
      show: true,
    },
  ];

  return (
    <motion.div
      key="step4"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <section data-sami-key="results_mountain" className="space-y-6">
        <Card className="skandia-card overflow-hidden p-0">
          <div className="border-b border-border bg-secondary px-6 py-5 sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Resultado de optimización</p>
            <div className="mt-2 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
                  Este es el beneficio tributario que podrías obtener y cómo se distribuye hoy.
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground">
                  La lectura es simple: cuánto beneficio total podrías alcanzar, cuánto ya estás usando y cuánto aún te falta activar.
                </p>
              </div>
              <div className="rounded-2xl border border-success-border bg-success-light px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-success">Ahorro estimado</p>
                <p className="mt-1 font-display text-2xl font-bold text-foreground">${formatCOP(ahorroTotalEstimado)}</p>
              </div>
            </div>
          </div>

          <div className="space-y-8 px-6 py-6 sm:px-8 sm:py-8">
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_340px]">
              <div className="rounded-3xl border border-border bg-card p-5 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Beneficio tributario total estimado</p>
                    <p className="mt-2 font-display text-3xl font-bold text-foreground sm:text-4xl">${formatCOP(totalBenefit)}</p>
                  </div>
                  <Badge className="w-fit border-primary/20 bg-primary/10 text-primary">
                    {Math.round(usedPct)}% ya activo
                  </Badge>
                </div>

                <div className="mt-8">
                  <div className="relative overflow-hidden rounded-[28px] border border-border bg-secondary p-4 sm:p-5">
                    <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]">
                      <div className="rounded-2xl border border-border bg-card p-4">
                        <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Total posible</p>
                        <p className="mt-3 font-display text-2xl font-bold text-foreground">${formatCOP(totalBenefit)}</p>
                      </div>
                      <div className="rounded-2xl border border-border bg-card p-4">
                        <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Ya usado</p>
                        <p className="mt-3 font-display text-2xl font-bold text-primary">${formatCOP(usedBenefit)}</p>
                      </div>
                      <div className="rounded-2xl border border-skandia-gold-border bg-skandia-gold-light p-4">
                        <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Te falta</p>
                        <p className="mt-3 font-display text-2xl font-bold text-foreground">${formatCOP(remainingBenefit)}</p>
                      </div>
                    </div>

                    <div className="mt-6 space-y-3">
                      <div className="overflow-hidden rounded-full border border-border bg-card">
                        <div className="flex h-7 w-full">
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
                      </div>
                      <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                        <span>0%</span>
                        <span>25%</span>
                        <span>50%</span>
                        <span>75%</span>
                        <span>100%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-3xl border border-border bg-card p-5 sm:p-6">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Impacto en impuesto</p>
                  <div className="mt-4 space-y-4">
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-muted-foreground">Escenario actual</span>
                      <span className="font-display text-xl font-bold text-foreground">${formatCOP(results.impNormal)}</span>
                    </div>
                    <div className="flex items-center justify-center text-primary">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-muted-foreground">Escenario optimizado</span>
                      <span className="font-display text-xl font-bold text-primary">${formatCOP(results.impTopup)}</span>
                    </div>
                  </div>
                  {reductionPct > 0 && (
                    <p className="mt-4 text-xs leading-6 text-muted-foreground">
                      Esto equivale a una reducción estimada de hasta <span className="font-semibold text-foreground">{reductionPct}%</span> frente a tu escenario actual.
                    </p>
                  )}
                </div>

                <div className="rounded-3xl border border-border bg-secondary p-5 sm:p-6">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Lectura rápida</p>
                  <p className="mt-3 text-sm leading-7 text-foreground">
                    {remainingBenefit > 0
                      ? `Hoy ya estás aprovechando ${formatCOP(usedBenefit)} y todavía tienes ${formatCOP(remainingBenefit)} disponibles para acercarte al beneficio total estimado.`
                      : 'Ya estás aprovechando prácticamente todo tu beneficio estimado con tu estructura actual.'}
                  </p>
                </div>
              </div>
            </div>

            {remainingBenefit > 0 ? (
              <div className="rounded-3xl border border-skandia-gold-border bg-skandia-gold-light p-5 sm:p-6">
                <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-center">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Oportunidad pendiente</p>
                    <p className="mt-2 text-sm leading-7 text-foreground">
                      Tienes {mesesInversion} meses para invertir este valor en algunos de tus contratos de inversión. Si empezaras hoy, deberías hacer aportes mensuales de <span className="font-semibold">${formatCOP(aporteMensualSugerido)}</span>.
                    </p>
                    {hasPACK && (
                      <p className="mt-3 text-sm leading-7 text-muted-foreground">
                        Si aprovechas el escenario PAC, el ahorro estimado adicional sería de ${formatCOP(results.ahorroPAC)}.
                      </p>
                    )}
                    {hasFE && (
                      <p className="mt-3 text-sm leading-7 text-muted-foreground">
                        Además, las compras con factura electrónica podrían sumar hasta ${formatCOP(results.dedFE1)} adicionales en beneficio.
                      </p>
                    )}
                  </div>
                  <Button onClick={() => window.open('https://inversiones.skandia.com.co/asesoria', '_blank', 'noopener,noreferrer')} className="h-12 rounded-full bg-primary px-6 text-primary-foreground hover:bg-primary/90">
                    Contacta a tu asesor
                  </Button>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border border-success-border bg-success-light p-5 sm:p-6">
                <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-center">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-success">Beneficio bien aprovechado</p>
                    <p className="mt-2 text-sm leading-7 text-foreground">
                      Ya estás usando prácticamente todo tu beneficio tributario estimado. Vale la pena revisarlo con tu asesor para mantener esta estructura durante el año.
                    </p>
                  </div>
                  <Button onClick={() => window.open('https://inversiones.skandia.com.co/asesoria', '_blank', 'noopener,noreferrer')} className="h-12 rounded-full bg-primary px-6 text-primary-foreground hover:bg-primary/90">
                    Contacta a tu asesor
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      </section>

      <Collapsible open={showBenefits} onOpenChange={setShowBenefits}>
        <Card className="skandia-card overflow-hidden p-0">
          <div data-sami-key="results_benefits" className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <div>
              <h3 className="font-display text-lg font-bold text-foreground">Beneficios tributarios activos</h3>
              <p className="text-sm text-muted-foreground">
                Despliega este bloque para ver el detalle de lo que ya participa dentro del resultado.
              </p>
            </div>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="h-11 gap-2">
                {showBenefits ? 'Ocultar detalle' : 'Ver beneficios activos'}
                <ChevronDown className={`h-4 w-4 transition-transform ${showBenefits ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
          </div>

          <CollapsibleContent>
            <div className="border-t border-border px-6 py-2 sm:px-8">
              <div className="divide-y divide-border">
                {benefits
                  .filter((benefit) => benefit.show)
                  .map((benefit, index) => (
                    <div key={index} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center">
                      <div className="flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <span>{benefit.icon}</span>
                          <p className="text-sm font-medium text-foreground">{benefit.name}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">{benefit.desc}</p>
                        <p className="mt-1 text-[10px] text-muted-foreground">{benefit.article}</p>
                      </div>
                      <div className="text-right sm:min-w-36">
                        <p className="text-sm font-semibold text-foreground">${formatCOP(benefit.used)}</p>
                        <p className="text-[10px] text-muted-foreground">de ${formatCOP(benefit.max)}</p>
                      </div>
                      <StatusBadge used={benefit.used} max={benefit.max} />
                    </div>
                  ))}

                {hasFE && (
                  <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center">
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <span>🧾</span>
                        <p className="text-sm font-medium text-foreground">Compras con factura electrónica</p>
                      </div>
                      <p className="text-xs text-muted-foreground">Art. 336 num. 5 ET</p>
                    </div>
                    <div className="text-right sm:min-w-36">
                      <p className="text-sm font-semibold text-foreground">${formatCOP(results.dedFE1)}</p>
                      <p className="text-[10px] text-muted-foreground">de ${formatCOP(TOPE_FE)}</p>
                    </div>
                    <div className="flex gap-2">
                      <StatusBadge used={results.dedFE1} max={TOPE_FE} />
                      <Badge className="border-success-border bg-success-light text-[10px] text-success">Fuera del tope</Badge>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="outline" onClick={onBack} className="h-12 px-6">
          Ajustar mis datos
        </Button>

        <Collapsible open={showDetail} onOpenChange={setShowDetail}>
          <div className="space-y-4">
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="h-12 w-full sm:w-auto">
                {showDetail ? 'Ocultar detalle de cálculos' : 'Ver detalle completo de cálculos'}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <Card className="skandia-card overflow-x-auto">
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
                    ].map(([label, value], index) => (
                      <tr key={index}>
                        <td className="py-2 pr-4 text-muted-foreground">{label}</td>
                        <td className="py-2 text-right font-display font-medium text-foreground">${formatCOP(value as number)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </CollapsibleContent>
          </div>
        </Collapsible>
      </div>
    </motion.div>
  );
};

export default Step4Results;