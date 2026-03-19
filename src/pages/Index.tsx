import { useState, useMemo, useCallback, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import SimulatorHeader from '@/components/simulator/SimulatorHeader';
import SimulatorSummaryBar from '@/components/simulator/SimulatorSummaryBar';
import Step0Identity from '@/components/simulator/Step0Identity';
import Step1Income from '@/components/simulator/Step1Income';
import Step2Deductions from '@/components/simulator/Step2Deductions';
import Step3FVP from '@/components/simulator/Step3FVP';
import Step4Results from '@/components/simulator/Step4Results';
import SamiAssistantPanel from '@/components/simulator/SamiAssistantPanel';
import { defaultFormData, FormData } from '@/lib/simulator-types';
import { ejecutarSimulador, SimulatorInputs } from '@/lib/tax-engine';

const DEFAULT_SAMI_KEY_BY_STEP: Record<number, string> = {
  0: 'step0_intro',
  1: 'income_salary',
  2: 'ded_dependents',
  3: 'pac',
  4: 'results_mountain',
};

const Index = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const [activeSamiKey, setActiveSamiKey] = useState(DEFAULT_SAMI_KEY_BY_STEP[0]);
  const mainRef = useRef<HTMLDivElement>(null);

  const goTo = useCallback((s: number) => {
    setStep(s);
    setActiveSamiKey(DEFAULT_SAMI_KEY_BY_STEP[s] ?? DEFAULT_SAMI_KEY_BY_STEP[0]);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 50);
  }, []);

  const afcTotal = useMemo(() => {
    let total = 0;
    if (formData.hasFVP) total += formData.fvpTotal + formData.afcTotal;
    if (formData.hasPAC) total += formData.pacEmpresa + formData.pacPropio;
    return total;
  }, [formData.hasFVP, formData.fvpTotal, formData.afcTotal, formData.hasPAC, formData.pacEmpresa, formData.pacPropio]);

  const inputs: SimulatorInputs = useMemo(() => ({
    salMensual: formData.salMensual,
    tipo: formData.tipo,
    auxMensual: formData.hasAuxilios ? formData.auxMensual : 0,
    variableAnual: formData.hasVariable ? formData.variableAnual : 0,
    bonoAnual: formData.hasBono ? formData.bonoAnual : 0,
    bonoEsSalarial: formData.bonoEsSalarial,
    volObligAnual: formData.hasVolOblig ? formData.volObligAnual : 0,
    numDep: formData.numDep,
    interesesVivienda: formData.hasHip ? formData.interesesVivienda : 0,
    pagosSalud: formData.hasSalud ? formData.pagosSalud : 0,
    comprasFE: formData.comprasFE,
    afcTotal: afcTotal,
  }), [formData, afcTotal]);

  const results = useMemo(() => ejecutarSimulador(inputs), [inputs]);

  const handleSamiContext = useCallback((event: React.SyntheticEvent<HTMLElement>) => {
    const target = event.target as HTMLElement | null;
    const key = target?.closest?.('[data-sami-key]')?.getAttribute('data-sami-key');
    if (key) setActiveSamiKey(key);
  }, []);

  return (
    <div className="min-h-screen bg-secondary font-body lg:h-screen lg:overflow-hidden">
      <SimulatorHeader currentStep={step} />
      {step > 0 && <SimulatorSummaryBar step={step} formData={formData} results={results} />}
      <main
        ref={mainRef}
        className="mx-auto max-w-[1200px] px-4 pt-4 sm:px-6 sm:pt-6 lg:grid lg:h-[calc(100vh-9.75rem)] lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-6 lg:items-start lg:overflow-hidden"
      >
        <section onClickCapture={handleSamiContext} onFocusCapture={handleSamiContext} className="pb-16 lg:h-full lg:overflow-y-auto lg:pr-2 lg:pb-8"
          <AnimatePresence mode="wait">
            {step === 0 && (
              <Step0Identity
                formData={formData}
                setFormData={setFormData}
                onNext={() => goTo(1)}
              />
            )}
            {step === 1 && (
              <Step1Income
                formData={formData}
                setFormData={setFormData}
                totalIngresos={results.totalIngresos}
                onNext={() => goTo(2)}
              />
            )}
            {step === 2 && (
              <Step2Deductions
                formData={formData}
                setFormData={setFormData}
                onNext={() => goTo(3)}
                onBack={() => goTo(1)}
              />
            )}
            {step === 3 && (
              <Step3FVP
                formData={formData}
                setFormData={setFormData}
                onNext={() => goTo(4)}
                onBack={() => goTo(2)}
              />
            )}
            {step === 4 && (
              <Step4Results
                formData={formData}
                results={results}
                onBack={() => goTo(3)}
              />
            )}
          </AnimatePresence>
        </section>

        <div className="mt-8 lg:mt-0 lg:h-full lg:overflow-hidden">
          <SamiAssistantPanel step={step} activeKey={activeSamiKey} formData={formData} results={results} />
        </div>
      </main>
    </div>
  );
};

export default Index;
