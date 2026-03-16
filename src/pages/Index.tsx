import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import SimulatorHeader from '@/components/simulator/SimulatorHeader';
import Step1Income from '@/components/simulator/Step1Income';
import Step2Deductions from '@/components/simulator/Step2Deductions';
import Step3FVP from '@/components/simulator/Step3FVP';
import Step4Results from '@/components/simulator/Step4Results';
import Step5Plan from '@/components/simulator/Step5Plan';
import { defaultFormData, FormData } from '@/lib/simulator-types';
import { ejecutarSimulador, SimulatorInputs } from '@/lib/tax-engine';

const Index = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const mainRef = useRef<HTMLDivElement>(null);

  const goTo = useCallback((s: number) => {
    setStep(s);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 50);
  }, []);

  // Compute afcTotal from sub-fields
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

  return (
    <div className="min-h-screen bg-secondary font-body pb-20">
      <SimulatorHeader currentStep={step} />
      <main ref={mainRef} className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
        <AnimatePresence mode="wait">
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
              onNext={() => goTo(5)}
              onBack={() => goTo(3)}
            />
          )}
          {step === 5 && (
            <Step5Plan
              formData={formData}
              setFormData={setFormData}
              results={results}
              onBack={() => goTo(4)}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Index;
