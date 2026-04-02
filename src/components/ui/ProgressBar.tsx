import { motion } from 'framer-motion'

interface ProgressBarProps {
  currentStep: number
  totalSteps: number
}

export const ProgressBar = ({ currentStep, totalSteps }: ProgressBarProps) => {
  const percentage = Math.round(((currentStep - 1) / (totalSteps - 1)) * 100) || 0;
  
  return (
    <div className="w-full max-w-4xl mx-auto mb-8 px-4 pt-6">
      <div className="flex justify-between text-sm font-semibold text-brand-700 mb-2">
        <span>Giai đoạn {currentStep} / {totalSteps}</span>
        <span>{percentage}%</span>
      </div>
      <div className="h-3 w-full bg-brand-100 rounded-full overflow-hidden shadow-inner">
        <motion.div
          className="h-full bg-gradient-to-r from-brand-400 to-brand-600 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  )
}
