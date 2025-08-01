import { Progress } from "@/components/ui/progress";

interface ProgressIndicatorProps {
  currentModule: number;
  totalModules: number;
  percentage: number;
}

export default function ProgressIndicator({ currentModule, totalModules, percentage }: ProgressIndicatorProps) {
  return (
    <div className="bg-gradient-to-r from-[hsl(227,39%,23%)] to-[hsl(240,10%,6%)] px-4 py-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-[hsl(215,16%,47%)]">Overall Progress</p>
          <p className="text-lg font-semibold">{currentModule} of {totalModules} modules</p>
        </div>
        <div className="relative w-16 h-16">
          <svg 
            className="progress-ring w-full h-full transform -rotate-90" 
            viewBox="0 0 36 36"
          >
            <circle 
              cx="18" 
              cy="18" 
              r="16" 
              fill="none" 
              stroke="hsl(227, 39%, 23%)" 
              strokeWidth="2"
            />
            <circle 
              cx="18" 
              cy="18" 
              r="16" 
              fill="none" 
              stroke="hsl(120, 100%, 50%)" 
              strokeWidth="2"
              strokeDasharray={`${percentage * 100.48 / 100}, 100.48`}
              strokeLinecap="round"
              className="transition-all duration-500 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-semibold text-[hsl(120,100%,50%)]">
              {Math.round(percentage)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
