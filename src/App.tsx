/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { StepNavigation } from './components/StepNavigation';
import { Step1Auth } from './components/steps/Step1Auth';
import { Step2MySkills } from './components/steps/Step2MySkills';
import { Step3SkillsToLearn } from './components/steps/Step3SkillsToLearn';
import { Step4FindStudents } from './components/steps/Step4FindStudents';
import { Step5SkillMatching } from './components/steps/Step5SkillMatching';
import { Step6SwapRequests } from './components/steps/Step6SwapRequests';
import { Step7Ratings } from './components/steps/Step7Ratings';
import { NotificationToast } from './components/NotificationToast';

const AppContent: React.FC = () => {
  const { currentStep } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Zone 1: Sticky Top Bar Contract */}
      <Header />

      {/* Step Execution Navigator with Linear Progress & 7 Milestones */}
      <StepNavigation />

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {currentStep === 1 && <Step1Auth />}
        {currentStep === 2 && <Step2MySkills />}
        {currentStep === 3 && <Step3SkillsToLearn />}
        {currentStep === 4 && <Step4FindStudents />}
        {currentStep === 5 && <Step5SkillMatching />}
        {currentStep === 6 && <Step6SwapRequests />}
        {currentStep === 7 && <Step7Ratings />}
      </main>

      {/* Clean Campus Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-indigo-600 flex items-center justify-center text-white text-[10px] font-bold">
              SS
            </div>
            <span className="font-semibold text-slate-700">CampusSkillSwap</span>
            <span aria-hidden="true">·</span>
            <span>Student Peer-to-Peer Learning Network</span>
          </div>

          <div className="flex items-center gap-6">
            <span>Built for collegiate barter & collaborative study</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">7 Interactive Workflow Steps</span>
          </div>
        </div>
      </footer>

      {/* Notification Toast Stack */}
      <NotificationToast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
