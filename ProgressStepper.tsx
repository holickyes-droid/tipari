import { CheckCircle2 } from 'lucide-react';

type FlowStep = 
  | 'investor-selection'
  | 'summary'
  | 'signature-method'
  | 'waiting-electronic'
  | 'electronic-signed'
  | 'waiting-physical-upload'
  | 'upload-document'
  | 'document-uploaded'
  | 'physical-confirmed'
  | 'reservation-pending';

interface ProgressStepperProps {
  currentStep: FlowStep;
  signatureMethod: 'electronic' | 'physical' | null;
}

export function ProgressStepper({ currentStep, signatureMethod }: ProgressStepperProps) {
  const getStepNumber = (step: FlowStep): number => {
    const stepMap: Record<FlowStep, number> = {
      'investor-selection': 1,
      'summary': 2,
      'signature-method': 3,
      'waiting-electronic': 4,
      'electronic-signed': 5,
      'waiting-physical-upload': 4,
      'upload-document': 5,
      'document-uploaded': 6,
      'physical-confirmed': 7,
      'reservation-pending': 5,
    };
    return stepMap[step] || 1;
  };

  const steps = [
    { number: 1, label: 'Výběr investora' },
    { number: 2, label: 'Shrnutí' },
    { number: 3, label: 'Způsob podpisu' },
    { number: 4, label: 'Podpis' },
    { number: 5, label: 'Dokončeno' },
  ];

  const currentStepNum = getStepNumber(currentStep);

  return (
    <div className="mb-6 px-2">
      <div className="flex items-center justify-between relative">
        {/* Progress line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-10">
          <div 
            className="h-full bg-[#215EF8] transition-all duration-300"
            style={{ width: `${((currentStepNum - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {steps.map((step) => {
          const isActive = currentStepNum === step.number;
          const isCompleted = currentStepNum > step.number;
          
          return (
            <div key={step.number} className="flex flex-col items-center">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  isCompleted 
                    ? 'bg-[#14AE6B] text-white' 
                    : isActive
                    ? 'bg-[#215EF8] text-white ring-4 ring-[#215EF8]/20'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : step.number}
              </div>
              <div className={`text-xs mt-2 font-medium whitespace-nowrap ${
                isActive ? 'text-[#215EF8]' : isCompleted ? 'text-[#14AE6B]' : 'text-gray-500'
              }`}>
                {step.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
