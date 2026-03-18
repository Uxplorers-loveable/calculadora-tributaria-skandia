import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import BenefitOpportunityMountain from './BenefitOpportunityMountain';
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
  const benefitPct = totalBenefit > 0 ? Math.min((usedBenefit / totalBenefit) * 100, 100) : 0;
  const mesesInversion = 10;
  const aporteMensualSugerido = remainingBenefit > 0 ? remainingBenefit / mesesInversion : 0;
  const ahorroTotalEstimado = results.ahorroTopup + (hasFE ? results.ahorroFE1 : 0);

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
      <div data-sami-key="results_mountain">
        <BenefitOpportunityMountain
          totalBenefit={totalBenefit}
          usedBenefit={usedBenefit}
          remainingBenefit={remainingBenefit}
          benefitPct={benefitPct}
          ahorroTotalEstimado={ahorroTotalEstimado}
          impNormal={results.impNormal}
          impTopup={results.impTopup}
          mesesInversion={mesesInversion}
          aporteMensualSugerido={aporteMensualSugerido}
          hasPACK={hasPACK}
          ahorroPAC={results.ahorroPAC}
          hasFE={hasFE}
          dedFE1={results.dedFE1}
          onContact={() => window.open('https://inversiones.skandia.com.co/asesoria', '_blank', 'noopener,noreferrer')}
        />
      </div>

      <Card className="skandia-card space-y-4">
        <div data-sami-key="results_benefits" className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-bold font-display text-foreground">Beneficios tributarios activos</h3>
            <p className="text-sm text-muted-foreground">
              Despliega este bloque para ver el detalle de lo que ya está participando en tu resultado.
            </p>
          </div>
          <Collapsible open={showBenefits} onOpenChange={setShowBenefits}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="h-11">
                {showBenefits ? 'Ocultar detalle' : 'Ver beneficios activos'}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-6 divide-y divide-border">
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
            </CollapsibleContent>
          </Collapsible>
        </div>
      </Card>

      <div className="flex justify-start">
        <Button variant="outline" onClick={onBack} className="h-12 px-6">
          Ajustar mis datos
        </Button>
      </div>

      <Collapsible open={showDetail} onOpenChange={setShowDetail}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="h-12 w-full">
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
      </Collapsible>
    </motion.div>
  );
};

export default Step4Results;
