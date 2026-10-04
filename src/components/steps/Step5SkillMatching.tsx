import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StudentProfileModal } from '../StudentProfileModal';
import { Student, MatchResult } from '../../types';
import { 
  GitCompare, 
  Sparkles, 
  Compass, 
  ArrowRight, 
  Send, 
  Star, 
  CheckCircle2, 
  Repeat, 
  HelpCircle,
  Zap
} from 'lucide-react';

export const Step5SkillMatching: React.FC = () => {
  const { 
    currentStudent, 
    getMatchesForCurrentStudent, 
    setTargetSwapStudent, 
    goToStep 
  } = useApp();

  const [selectedStudentForModal, setSelectedStudentForModal] = useState<Student | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'mutual' | 'mentor' | 'learner'>('all');

  const matches = getMatchesForCurrentStudent();

  const mutualMatches = matches.filter(m => m.matchType === 'mutual');
  const mentorMatches = matches.filter(m => m.matchType === 'they_teach_what_you_want');
  const learnerMatches = matches.filter(m => m.matchType === 'they_want_what_you_teach');

  const displayedMatches = matches.filter(m => {
    if (filterType === 'mutual') return m.matchType === 'mutual';
    if (filterType === 'mentor') return m.matchType === 'they_teach_what_you_want';
    if (filterType === 'learner') return m.matchType === 'they_want_what_you_teach';
    return true;
  });

  const handleStartSwapProposal = (student: Student) => {
    setTargetSwapStudent(student);
    goToStep(6);
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
            <GitCompare className="w-3.5 h-3.5" />
            <span>Step 5 · Intelligent Reciprocal Match Engine</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Skill Compatibility & Mutual Matching
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            We cross-reference what you can teach with what peers want to learn to discover high-value barter pairs.
          </p>
        </div>

        <button
          onClick={() => goToStep(6)}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <span>Go to Swap Proposals (Step 6)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Reciprocal Engine Status Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-sm border border-indigo-950">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-400/30">
              <Zap className="w-3 h-3 text-amber-400" />
              Real-Time Cross-Campus Pairing
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Matching for {currentStudent.name} ({currentStudent.university})
            </h3>
            <div className="text-xs text-slate-300 flex flex-wrap items-center gap-3">
              <span>Offers: <strong className="text-white">{currentStudent.skillsOffered.map(s => s.name).join(', ') || 'None'}</strong></span>
              <span>·</span>
              <span>Wants: <strong className="text-white">{currentStudent.skillsWanted.map(s => s.name).join(', ') || 'None'}</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white/10 p-3 rounded-xl backdrop-blur-xs shrink-0">
            <div className="text-center px-2">
              <div className="text-xl font-extrabold text-amber-300 tabular-nums">
                {mutualMatches.length}
              </div>
              <div className="text-[11px] text-slate-300">100% Mutual</div>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center px-2">
              <div className="text-xl font-extrabold text-white tabular-nums">
                {matches.length}
              </div>
              <div className="text-[11px] text-slate-300">Total Matches</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              filterType === 'all'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Potential Matches ({matches.length})
          </button>
          <button
            onClick={() => setFilterType('mutual')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
              filterType === 'mutual'
                ? 'bg-white text-indigo-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Repeat className="w-3 h-3 text-indigo-600" />
            <span>Mutual Swaps ({mutualMatches.length})</span>
          </button>
          <button
            onClick={() => setFilterType('mentor')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              filterType === 'mentor'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            They Teach What I Want ({mentorMatches.length})
          </button>
          <button
            onClick={() => setFilterType('learner')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              filterType === 'learner'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            They Want What I Teach ({learnerMatches.length})
          </button>
        </div>

        <div className="text-xs text-slate-500">
          Ranked by skill reciprocity score
        </div>
      </div>

      {/* Matches Grid */}
      {displayedMatches.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white rounded-2xl border border-slate-200">
          <HelpCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-slate-800">No matches found for this filter</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
            Try adding more skills in Step 2 or learning goals in Step 3 to expand your compatibility network.
          </p>
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => goToStep(2)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 cursor-pointer"
            >
              Add Offered Skills
            </button>
            <button
              onClick={() => goToStep(3)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 cursor-pointer"
            >
              Add Desired Skills
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedMatches.map((match) => {
            const isMutual = match.matchType === 'mutual';
            const student = match.student;

            return (
              <div
                key={student.id}
                className={`p-6 rounded-2xl border transition-all ${
                  isMutual
                    ? 'border-indigo-300 bg-white ring-1 ring-indigo-200 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  
                  {/* Student Details Left */}
                  <div className="flex items-start gap-4 min-w-[280px]">
                    <img 
                      src={student.avatar} 
                      alt={student.name} 
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-base truncate">
                          {student.name}
                        </h4>
                        {isMutual && (
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 flex items-center gap-1 shrink-0">
                            <Repeat className="w-3 h-3" /> Mutual Match
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {student.university} · {student.major}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-600 mt-1">
                        <div className="flex items-center gap-1 text-amber-500 font-semibold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span className="tabular-nums">{student.rating}</span>
                          <span className="text-slate-400 font-normal">({student.reviewCount})</span>
                        </div>
                        <span className="text-slate-300">·</span>
                        <span className="tabular-nums">{student.completedSwapsCount} swaps finished</span>
                      </div>
                    </div>
                  </div>

                  {/* Visual Reciprocal Exchange Center Block */}
                  <div className="flex-1 bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <div className="text-xs font-semibold text-slate-800 mb-2">
                      {match.reason}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {/* What you teach them */}
                      <div className="p-2.5 rounded-lg bg-white border border-slate-200/80">
                        <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider block mb-1">
                          You Teach {student.name.split(' ')[0]}:
                        </span>
                        <div className="font-medium text-slate-800">
                          {match.matchedTeachSkills.length > 0
                            ? match.matchedTeachSkills.join(', ')
                            : currentStudent.skillsOffered.map(s => s.name).join(', ') || 'Any of your skills'}
                        </div>
                      </div>

                      {/* What they teach you */}
                      <div className="p-2.5 rounded-lg bg-white border border-slate-200/80">
                        <span className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider block mb-1">
                          {student.name.split(' ')[0]} Teaches You:
                        </span>
                        <div className="font-medium text-slate-800">
                          {match.matchedLearnSkills.length > 0
                            ? match.matchedLearnSkills.join(', ')
                            : student.skillsOffered.map(s => s.name).join(', ')}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Match Score & Action Right */}
                  <div className="flex lg:flex-col items-center justify-between lg:justify-center gap-3 shrink-0">
                    <div className="text-right lg:text-center">
                      <div className="text-2xl font-black text-indigo-600 tabular-nums">
                        {match.matchScore}%
                      </div>
                      <div className="text-[11px] text-slate-400 font-medium">
                        Compatibility
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedStudentForModal(student)}
                        className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                      >
                        Profile
                      </button>

                      <button
                        onClick={() => handleStartSwapProposal(student)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer shadow-xs whitespace-nowrap"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Swap Request</span>
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Next Step Action Box */}
      <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-xs">
        <div>
          <div className="text-xs font-semibold text-indigo-400">Step 5 Ready</div>
          <div className="text-sm font-bold text-white">
            Ready to send formal 1-on-1 swap proposals and manage active sessions?
          </div>
        </div>

        <button
          onClick={() => goToStep(6)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs whitespace-nowrap"
        >
          <span>Continue to Step 6: Send Swap Request</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Student Profile Modal */}
      {selectedStudentForModal && (
        <StudentProfileModal
          student={selectedStudentForModal}
          onClose={() => setSelectedStudentForModal(null)}
        />
      )}

    </div>
  );
};
