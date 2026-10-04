import React from 'react';
import { Student } from '../types';
import { useApp } from '../context/AppContext';
import { 
  X, 
  MapPin, 
  GraduationCap, 
  Clock, 
  Star, 
  Send, 
  Award, 
  MessageSquare,
  Sparkles,
  Compass
} from 'lucide-react';

interface StudentProfileModalProps {
  student: Student | null;
  onClose: () => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({ student, onClose }) => {
  const { currentStudent, setTargetSwapStudent, goToStep, reviews } = useApp();

  if (!student) return null;

  const isMe = student.id === currentStudent.id;
  const studentReviews = reviews.filter(r => r.toStudentId === student.id);

  const handleStartSwap = () => {
    setTargetSwapStudent(student);
    goToStep(6);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto overflow-x-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header Banner */}
        <div className="relative bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-white/30 bg-slate-800 shrink-0">
              <img 
                src={student.avatar} 
                alt={student.name} 
                className="w-full h-full object-cover" 
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white tracking-tight truncate">
                  {student.name}
                </h3>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded text-[11px] font-medium">
                  Verified Student
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-300 mt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                  {student.university}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                  {student.major} ({student.academicYear})
                </span>
              </div>

              <div className="flex items-center gap-3 mt-3 text-xs">
                <div className="flex items-center gap-1 text-amber-400 font-semibold">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="tabular-nums">{student.rating}</span>
                  <span className="text-slate-400 font-normal">({student.reviewCount} reviews)</span>
                </div>
                <span className="text-slate-500">·</span>
                <span className="text-slate-300">
                  <span className="font-semibold text-white tabular-nums">{student.completedSwapsCount}</span> swaps completed
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          
          {/* Bio */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              About
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed">
              {student.bio}
            </p>
            <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Availability: <strong className="text-slate-700 font-medium">{student.availability}</strong></span>
              <span>·</span>
              <span>Mode: <strong className="text-slate-700 font-medium">{student.preferredMode}</strong></span>
            </div>
          </div>

          {/* Badges */}
          {student.badges.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                Peer Endorsements
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {student.badges.map((badge, idx) => (
                  <span 
                    key={idx}
                    className="text-xs font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md"
                  >
                    ★ {badge}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Skills Offered (What they teach) */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              Skills Offered ({student.skillsOffered.length})
            </h4>
            <div className="space-y-2.5">
              {student.skillsOffered.map((skill) => (
                <div 
                  key={skill.id}
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50/60"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-slate-900 text-sm">{skill.name}</span>
                    <span className="text-xs text-slate-500">
                      {skill.level} · {skill.yearsExperience}y exp
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{skill.description}</p>
                  <div className="text-[11px] text-slate-400 mt-1 italic">
                    Format: {skill.teachingStyle}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Wanted (What they want to learn) */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-emerald-500" />
              Skills Wanted ({student.skillsWanted.length})
            </h4>
            <div className="space-y-2">
              {student.skillsWanted.map((skill) => (
                <div 
                  key={skill.id}
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50/60"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-slate-900 text-sm">{skill.name}</span>
                    <span className="text-xs text-slate-500">
                      Priority: {skill.priority} · Goal: {skill.currentLevel}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{skill.targetGoal}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews list */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
              Peer Reviews ({studentReviews.length})
            </h4>
            {studentReviews.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No reviews yet for this student.</p>
            ) : (
              <div className="space-y-3">
                {studentReviews.map((rev) => (
                  <div key={rev.id} className="p-3 rounded-lg border border-slate-100 bg-white shadow-xs">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-medium text-slate-800">
                        Skill: {rev.skillSwapped}
                      </span>
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span className="font-semibold">{rev.overallRating}.0</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 italic">"{rev.comment}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            Close
          </button>

          {!isMe ? (
            <button
              onClick={handleStartSwap}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Propose Skill Swap (Step 6)</span>
            </button>
          ) : (
            <span className="text-xs text-slate-400 italic">This is your active profile</span>
          )}
        </div>

      </div>
    </div>
  );
};
