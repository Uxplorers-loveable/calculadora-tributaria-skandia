import { CheckCircle2 } from 'lucide-react';

interface SimulatorHeaderProps {
  currentStep: number;
}

const STEP_LABELS = ['Tu capital hoy', 'Tu espacio tributario', 'Tu estrategia FVP', 'Tu panorama'];

const SimulatorHeader = ({ currentStep }: SimulatorHeaderProps) => {
  const showProgress = currentStep > 0;

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-skandia-green rounded-sm flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 74 96" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.42 31.73L62.66 91.67a4.5 4.5 0 007.1-3.58V30.17a9.5 9.5 0 00-9.54-9.49H7.03a4.5 4.5 0 00-4.6 4.56 4.5 4.5 0 001.39 3.25" fill="white"/>
              <path d="M4.09 90.3c8.72 8.68 23.63 2.54 23.63-9.73a13.87 13.87 0 00-27.72 0c0 3.65 1.46 7.16 4.05 9.74" fill="white"/>
            </svg>
          </div>
          <span className="font-bold tracking-tight text-lg sm:text-xl font-display text-foreground">Skandia</span>
        </div>

        {showProgress ? (
          <>
            <div className="hidden sm:flex items-center gap-1">
              {STEP_LABELS.map((label, i) => {
                const s = i + 1;
                return (
                  <div key={s} className="flex items-center">
                    <div className="flex items-center gap-1.5">
                      <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                        currentStep === s
                          ? 'bg-primary text-primary-foreground'
                          : currentStep > s
                          ? 'bg-success text-primary-foreground'
                          : 'bg-grey-200 text-grey-500'
                      }`}>
                        {currentStep > s ? <CheckCircle2 className="w-4 h-4" /> : s}
                      </div>
                      <span className={`text-xs font-medium hidden lg:inline ${
                        currentStep === s ? 'text-foreground' : 'text-muted-foreground'
                      }`}>{label}</span>
                    </div>
                    {i < STEP_LABELS.length - 1 && <div className={`w-6 h-px mx-1 ${currentStep > s ? 'bg-success' : 'bg-grey-200'}`} />}
                  </div>
                );
              })}
            </div>
            <div className="flex sm:hidden gap-1.5">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 w-8 rounded-full transition-colors ${
                    currentStep === s ? 'bg-primary' : currentStep > s ? 'bg-success' : 'bg-grey-200'
                  }`}
                />
              ))}
            </div>
          </>
        ) : (
          <span className="text-sm font-medium text-muted-foreground">Tu punto de partida</span>
        )}
      </div>
    </header>
  );
};

export default SimulatorHeader;
