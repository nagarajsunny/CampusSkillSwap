import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  UserPlus, 
  Sparkles, 
  Compass, 
  Search, 
  GitCompare, 
  Send, 
  Star,
  ChevronLeft,
  ChevronRight,
  Check
} from 'lucide-react';

interface StepMeta {
  number: number;
  title: string;
  shortDesc: string;
  icon: React.ElementType;
}

const STEPS: StepMeta[] = [
  { number: 1, title: 'Student Registration & Login', shortDesc: 'Profile & Campus Info', icon: UserPlus },
  { number: 2, title: 'My Skills', shortDesc: 'Skills You Can Teach', icon: Sparkles },
  { number: 3, title: 'Skills I Want to Learn', shortDesc: 'Your Learning Wishlist', icon: Compass },
  { number: 4, title: 'Find Students', shortDesc: 'Search Peer Directory', icon: Search },
  { number: 5, title: 'Skill Matching', shortDesc: 'Reciprocal Pair Engine', icon: GitCompare },
  { number: 6, title: 'Send Swap Request', shortDesc: 'Proposals & Active Swaps', icon: Send },
  { number: 7, title: 'Ratings & Reviews', shortDesc: 'Peer Reputation & Feedback', icon: Star },
];

export const StepNavigation: React.FC = () => {
  const { currentStep, goToStep, nextStep, prevStep } = useApp();

  const progressPercent = Math.round((currentStep / 7) * 100);

  return (
    <div className="bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        
        {/* Stepper Header Row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider">
              <span>Step {currentStep} of 7</span>
              <span className="text-slate-300">·</span>
              <span className="text-slate-500 font-normal">{progressPercent}% complete</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              {STEPS[currentStep - 1].title}
            </h2>
          </div>

          {/* Stepper controls */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                currentStep === 1
                  ? 'border-slate-200 text-slate-300 cursor-not-allowed bg-slate-50'
                  : 'border-slate-300 text-slate-700 bg-white hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={nextStep}
              disabled={currentStep === 7}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                currentStep === 7
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
              }`}
            >
              <span>Next Step</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Linear Progress Bar */}
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-3.5">
          <div 
            className="bg-indigo-600 h-full transition-all duration-300 ease-out rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* 7-Step Interactive Rail */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5 sm:gap-2">
          {STEPS.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;

            return (
              <button
                key={step.number}
                onClick={() => goToStep(step.number)}
                className={`group flex items-center gap-2 p-2 rounded-lg text-left transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-indigo-50/90 border-indigo-200 ring-1 ring-indigo-500/20 shadow-xs'
                    : isCompleted
                    ? 'bg-slate-50/70 border-slate-200/80 hover:bg-slate-100 hover:border-slate-300'
                    : 'bg-white border-transparent hover:bg-slate-50 text-slate-400'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-md shrink-0 flex items-center justify-center text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : isCompleted
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : step.number}
                </div>
                <div className="min-w-0 flex-1">
                  <div
                    className={`text-[11px] font-semibold truncate leading-tight ${
                      isActive
                        ? 'text-indigo-950 font-bold'
                        : isCompleted
                        ? 'text-slate-800'
                        : 'text-slate-500 group-hover:text-slate-700'
                    }`}
                  >
                    {step.title.split(' ')[0]} {step.number === 1 ? 'Login' : step.number === 6 ? 'Requests' : step.title.split(' ')[1] || ''}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate hidden sm:block">
                    {step.shortDesc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
