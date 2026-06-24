import { motion } from 'framer-motion';

export const ProgressBar = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => {
  const percentage = Math.round(((currentStep - 1) / (totalSteps - 1)) * 100) || 0;
  return (
    <div className="mx-auto mb-8 w-full max-w-4xl px-4 pt-6">
      <div className="mb-2 flex justify-between text-sm font-semibold text-brand-700">
        <span>Giai đoạn {currentStep} / {totalSteps}</span><span>{percentage}%</span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-brand-100 shadow-inner">
        <motion.div className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600" initial={{ width: 0 }} animate={{ width: `${percentage}%` }} transition={{ duration: .8 }} />
      </div>
    </div>
  );
};
