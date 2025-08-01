import { Progress } from "@/components/ui/progress";

interface ProgressIndicatorProps {
  currentModule: number;
  totalModules: number;
  percentage: number;
}

export default function ProgressIndicator({ currentModule, totalModules, percentage }: ProgressIndicatorProps) {
  return (
    <div className="bg-gradient-to-r from-green-100 to-blue-100 px-4 py-4 mx-4 rounded-2xl shadow-sm border border-green-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">Overall Progress</p>
          <p className="text-lg font-bold text-gray-800">{currentModule} of {totalModules} modules</p>
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
              stroke="rgb(209, 213, 219)" 
              strokeWidth="3"
            />
            <circle 
              cx="18" 
              cy="18" 
              r="16" 
              fill="none" 
              stroke="rgb(34, 197, 94)" 
              strokeWidth="3"
              strokeDasharray={`${percentage * 100.48 / 100}, 100.48`}
              strokeLinecap="round"
              className="transition-all duration-500 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold text-green-600">
              {Math.round(percentage)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
