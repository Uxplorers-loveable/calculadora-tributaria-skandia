import { motion } from 'framer-motion';
import { ChevronLeft, ShieldCheck, Building2, Wallet, Shield, Droplets, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SamiBubble from './SamiBubble';
import SkandiaTooltip from './SkandiaTooltip';
import { FormData } from '@/lib/simulator-types';
import { SimulatorResults, formatCOP } from '@/lib/tax-engine';

interface Step5Props {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  results: SimulatorResults;
  onBack: () => void;
}

const contracts = [
  { id: 'multifund', icon: <Building2 className="w-6 h-6" />, emoji: '🏦', name: 'FVP Skandia Multifund', desc: 'Múltiples portafolios, beneficio tributario y rentabilidad a largo plazo' },
  { id: 'pac', icon: <Wallet className="w-6 h-6" />, emoji: '🏢', name: 'PAC Skandia', desc: 'Plan corporativo: combina los aportes de tu empresa con los tuyos', requiresPAC: true },
  { id: 'capital-seguro', icon: <Shield className="w-6 h-6" />, emoji: '🛡️', name: 'Skandia Capital Seguro', desc: 'Seguro de vida incluido y ahorro protegido. Desde $20M' },
  { id: 'inversion-plus', icon: <Droplets className="w-6 h-6" />, emoji: '💧', name: 'Skandia Inversión Plus', desc: 'Disponible en cualquier momento. Ideal para metas de corto plazo' },
];

const Step5Plan = ({ formData, setFormData, results, onBack }: Step5Props) => {
  const update = (partial: Partial<FormData>) => setFormData(prev => ({ ...prev, ...partial }));
  const mesesRestantes = Math.max(1, 12 - new Date().getMonth());
  const aporteMensual = results.topup > 0 ? results.topup / mesesRestantes : 0;

  const samiMsg = results.topup > 0
    ? `Puedes aportar $${formatCOP(results.topup)} al Fondo Voluntario de Pensión Skandia y reducir tu impuesto en $${formatCOP(results.ahorroTopup)}. Si lo distribuyes en el año, son $${formatCOP(aporteMensual)} al mes durante ${mesesRestantes} meses. Aquí puedes elegir el contrato al que quieres enviarlos — la decisión es tuya.`
    : 'Tu planeación tributaria 2026 está bien optimizada. Tu Financial Planner puede acompañarte en explorar otras estrategias de inversión y patrimonio.';

  const availableContracts = contracts.filter(c => !c.requiresPAC || formData.hasPAC);

  return (
    <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
      <SamiBubble text={samiMsg} />

      {/* Hero CTA Banner */}
      {results.topup > 0 && (
        <div className="rounded-2xl p-8 mb-8" style={{ background: 'linear-gradient(135deg, hsl(145 100% 24%), hsl(145 100% 39%))' }}>
          <h2 className="text-xl font-bold font-display mb-2" style={{ color: 'white' }}>
            Este es tu potencial de ahorro tributario en 2026
          </h2>
          <p className="text-sm mb-6 opacity-90" style={{ color: 'white' }}>
            Aprovechando el cupo disponible en tu Fondo Voluntario de Pensión, puedes reducir tu impuesto de renta en ${formatCOP(results.ahorroTopup)}.
          </p>
          <p className="text-4xl font-bold font-display mb-2" style={{ color: 'hsl(145 80% 85%)' }}>
            ${formatCOP(results.topup)}
          </p>
          <p className="text-sm mb-8 opacity-80" style={{ color: 'white' }}>
            Si quieres distribuirlo, son ${formatCOP(aporteMensual)} al mes durante {mesesRestantes} meses
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="h-12 px-6 font-semibold rounded-full border-white/80 hover:bg-white/10" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.8)' }}>
              Explorar cómo programar mis aportes
            </Button>
            <Button variant="outline" className="h-12 px-6 rounded-full border-white/80 hover:bg-white/10" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.8)' }}>
              Hablar con mi Financial Planner
            </Button>
          </div>
        </div>
      )}

      {/* Contract selector */}
      <h3 className="text-lg font-bold font-display text-foreground mb-4">Elige tu contrato</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {availableContracts.map((c) => (
          <Card
            key={c.id}
            onClick={() => update({ selectedContract: c.id })}
            className={`p-6 cursor-pointer transition-all hover:shadow-md ${
              formData.selectedContract === c.id
                ? 'ring-2 ring-primary border-primary'
                : 'border-border hover:border-grey-300'
            }`}
          >
            <div className="flex items-start gap-4">
              <span className="text-2xl">{c.emoji}</span>
              <div>
                <p className="font-bold font-display text-foreground">{c.name}</p>
                <p className="text-sm text-muted-foreground mt-1">{c.desc}</p>
              </div>
            </div>
            {formData.selectedContract === c.id && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 flex items-center gap-2 text-primary">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm font-medium">Seleccionado</span>
              </motion.div>
            )}
          </Card>
        ))}
      </div>

      {/* Confirmation */}
      {formData.selectedContract && results.topup > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="p-6 mb-8 border-success-border bg-success-light">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-foreground font-display">
                  Aporte mensual programado en {contracts.find(c => c.id === formData.selectedContract)?.name}
                </p>
                <p className="text-2xl font-bold font-display text-foreground mt-2">${formatCOP(aporteMensual)} al mes</p>
                <SkandiaTooltip
                  color="green"
                  content="Con este plan, al cierre de diciembre de 2026 habrás aprovechado tu máximo beneficio tributario disponible. Tu Financial Planner Skandia se comunica contigo para acompañarte en los siguientes pasos."
                />
                <Button className="mt-6 bg-primary hover:bg-skandia-green-dark text-primary-foreground h-12 px-8 rounded-full">
                  Confirmar y notificar a mi Financial Planner
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Navigation */}
      <div className="flex justify-start mt-8">
        <Button variant="ghost" onClick={onBack} className="h-12 text-muted-foreground">
          <ChevronLeft className="mr-2 w-4 h-4" /> Ajustar datos
        </Button>
      </div>

      {/* Legal footer */}
      <div className="mt-16 pt-8 border-t border-border">
        <div className="flex gap-3 text-muted-foreground">
          <ShieldCheck className="w-5 h-5 flex-shrink-0" />
          <p className="text-xs leading-relaxed">
            📋 Información legal: Este simulador es una herramienta de planeación. Los valores son estimados con base en la normativa vigente (UVT 2026: $52.374). Para una asesoría personalizada, habla con tu Financial Planner Skandia.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Step5Plan;
