import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronDown, RefreshCw, UserCheck, ArrowRight } from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    currentStudent, 
    allStudents, 
    switchStudentAccount, 
    currentStep, 
    goToStep, 
    resetDemoData 
  } = useApp();
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => goToStep(1)} 
            className="text-left group flex items-center gap-2 cursor-pointer focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm tracking-tight shadow-sm">
              SS
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
              CampusSkillSwap
            </span>
          </button>
        </div>

        {/* Zone 2: Clean text navigation links with subtle underline/active state */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => goToStep(1)}
            className={`transition-colors hover:text-slate-900 cursor-pointer ${
              currentStep === 1 ? 'text-indigo-600 font-semibold' : ''
            }`}
          >
            1. Login / Profile
          </button>
          <button
            onClick={() => goToStep(2)}
            className={`transition-colors hover:text-slate-900 cursor-pointer ${
              currentStep === 2 ? 'text-indigo-600 font-semibold' : ''
            }`}
          >
            2. My Skills
          </button>
          <button
            onClick={() => goToStep(3)}
            className={`transition-colors hover:text-slate-900 cursor-pointer ${
              currentStep === 3 ? 'text-indigo-600 font-semibold' : ''
            }`}
          >
            3. Want to Learn
          </button>
          <button
            onClick={() => goToStep(4)}
            className={`transition-colors hover:text-slate-900 cursor-pointer ${
              currentStep === 4 ? 'text-indigo-600 font-semibold' : ''
            }`}
          >
            4. Find Students
          </button>
          <button
            onClick={() => goToStep(5)}
            className={`transition-colors hover:text-slate-900 cursor-pointer ${
              currentStep === 5 ? 'text-indigo-600 font-semibold' : ''
            }`}
          >
            5. Matching
          </button>
          <button
            onClick={() => goToStep(6)}
            className={`transition-colors hover:text-slate-900 cursor-pointer ${
              currentStep === 6 ? 'text-indigo-600 font-semibold' : ''
            }`}
          >
            6. Swaps
          </button>
          <button
            onClick={() => goToStep(7)}
            className={`transition-colors hover:text-slate-900 cursor-pointer ${
              currentStep === 7 ? 'text-indigo-600 font-semibold' : ''
            }`}
          >
            7. Ratings
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions (Account Switcher & Fast action) */}
        <div className="flex items-center gap-3">
          {/* Quick Account Switcher */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer text-left"
              title="Click to switch student perspective or view account"
            >
              <div className="w-7 h-7 rounded-full bg-slate-200 overflow-hidden shrink-0 border border-slate-300">
                <img 
                  src={currentStudent.avatar} 
                  alt={currentStudent.name} 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="hidden sm:block text-xs">
                <div className="font-semibold text-slate-800 leading-tight truncate max-w-[110px]">
                  {currentStudent.name}
                </div>
                <div className="text-slate-500 text-[11px] truncate max-w-[110px]">
                  {currentStudent.university}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 py-2 border-b border-slate-100">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Logged in as
                  </div>
                  <div className="text-sm font-semibold text-slate-900 truncate">
                    {currentStudent.name}
                  </div>
                  <div className="text-xs text-slate-500">
                    {currentStudent.major} · {currentStudent.academicYear}
                  </div>
                </div>

                <div className="px-4 pt-2 pb-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Switch Student Demo Perspective
                </div>
                
                <div className="max-h-56 overflow-y-auto divide-y divide-slate-50">
                  {allStudents.map(student => (
                    <button
                      key={student.id}
                      onClick={() => {
                        switchStudentAccount(student.id);
                        setDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-2.5 flex items-center gap-3 text-left hover:bg-slate-50 transition-colors cursor-pointer ${
                        student.id === currentStudent.id ? 'bg-indigo-50/70 text-indigo-900' : 'text-slate-700'
                      }`}
                    >
                      <img 
                        src={student.avatar} 
                        alt={student.name} 
                        className="w-7 h-7 rounded-full object-cover shrink-0" 
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium truncate flex items-center justify-between">
                          <span>{student.name}</span>
                          {student.id === currentStudent.id && (
                            <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">
                          {student.university}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-2 pt-2 border-t border-slate-100 px-3 flex items-center justify-between">
                  <button
                    onClick={() => {
                      goToStep(1);
                      setDropdownOpen(false);
                    }}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-medium py-1 px-2 rounded hover:bg-indigo-50 cursor-pointer flex items-center gap-1"
                  >
                    Edit Profile <ArrowRight className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => {
                      resetDemoData();
                      setDropdownOpen(false);
                    }}
                    className="text-xs text-slate-400 hover:text-slate-600 py-1 px-2 rounded hover:bg-slate-100 cursor-pointer flex items-center gap-1"
                    title="Reset to default mock students and swaps"
                  >
                    <RefreshCw className="w-3 h-3" /> Reset
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick CTA to jump to Step 6 proposal */}
          <button
            onClick={() => goToStep(6)}
            className="hidden sm:inline-flex px-3.5 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer whitespace-nowrap shadow-sm"
          >
            New Swap Request
          </button>
        </div>

      </div>
    </header>
  );
};
