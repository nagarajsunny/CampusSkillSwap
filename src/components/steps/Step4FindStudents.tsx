import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import { StudentProfileModal } from '../StudentProfileModal';
import { 
  Search, 
  Filter, 
  MapPin, 
  GraduationCap, 
  Star, 
  Send, 
  Sparkles, 
  Compass, 
  ArrowRight,
  UserCheck,
  RotateCcw
} from 'lucide-react';

export const Step4FindStudents: React.FC = () => {
  const { 
    allStudents, 
    currentStudent, 
    setTargetSwapStudent, 
    goToStep 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState<string>('All');
  const [selectedMode, setSelectedMode] = useState<string>('All');
  const [minRating, setMinRating] = useState<number>(0);
  const [selectedStudentForModal, setSelectedStudentForModal] = useState<Student | null>(null);

  // Extract unique universities
  const universities = useMemo(() => {
    const list = Array.from(new Set(allStudents.map(s => s.university)));
    return ['All', ...list];
  }, [allStudents]);

  // Filter students (exclude current logged-in student)
  const filteredStudents = useMemo(() => {
    return allStudents.filter(student => {
      if (student.id === currentStudent.id) return false;

      // University filter
      if (selectedUniversity !== 'All' && student.university !== selectedUniversity) {
        return false;
      }

      // Mode filter
      if (selectedMode !== 'All' && student.preferredMode !== selectedMode) {
        return false;
      }

      // Rating filter
      if (minRating > 0 && student.rating < minRating) {
        return false;
      }

      // Search query (search across name, university, major, offered skills, wanted skills)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = student.name.toLowerCase().includes(q);
        const matchesUni = student.university.toLowerCase().includes(q);
        const matchesMajor = student.major.toLowerCase().includes(q);
        const matchesOffered = student.skillsOffered.some(s => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q));
        const matchesWanted = student.skillsWanted.some(s => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q));
        
        return matchesName || matchesUni || matchesMajor || matchesOffered || matchesWanted;
      }

      return true;
    });
  }, [allStudents, currentStudent.id, selectedUniversity, selectedMode, minRating, searchQuery]);

  const handleProposeSwap = (student: Student) => {
    setTargetSwapStudent(student);
    goToStep(6);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedUniversity('All');
    setSelectedMode('All');
    setMinRating(0);
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
            <Search className="w-3.5 h-3.5" />
            <span>Step 4 · Campus Student Network</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Find Students & Explore Swappers
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse active students across universities. Discover what peers can teach you and what they want in return.
          </p>
        </div>

        <button
          onClick={() => goToStep(5)}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <span>Run Reciprocal Matcher (Step 5)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student name, college, skill (e.g. 'Python', 'Figma', 'Spanish', 'Calculus')..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
          />
        </div>

        {/* Filter controls row */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          {/* University selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">University:</span>
            <select
              value={selectedUniversity}
              onChange={e => setSelectedUniversity(e.target.value)}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              {universities.map(u => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>

          {/* Delivery Mode selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Swap Mode:</span>
            <select
              value={selectedMode}
              onChange={e => setSelectedMode(e.target.value)}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="All">All Modes</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Online (Video/Chat)">Online</option>
              <option value="In-Person (Campus)">In-Person (Campus)</option>
            </select>
          </div>

          {/* Min Rating */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Min Rating:</span>
            <select
              value={minRating}
              onChange={e => setMinRating(parseFloat(e.target.value))}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value={0}>Any Rating</option>
              <option value={4.5}>4.5★ or higher</option>
              <option value={4.8}>4.8★ or higher</option>
            </select>
          </div>

          {(searchQuery || selectedUniversity !== 'All' || selectedMode !== 'All' || minRating > 0) && (
            <button
              onClick={handleResetFilters}
              className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium cursor-pointer ml-auto"
            >
              <RotateCcw className="w-3 h-3" /> Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>Showing <strong className="text-slate-800">{filteredStudents.length}</strong> student peer{filteredStudents.length === 1 ? '' : 's'}</span>
        <span>Looking as: <strong className="text-indigo-600">{currentStudent.name}</strong></span>
      </div>

      {/* Students Directory Grid */}
      {filteredStudents.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white rounded-2xl border border-slate-200">
          <Filter className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-slate-800">No students found matching your criteria</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            Try adjusting your search terms or clearing filters to see more students.
          </p>
          <button
            onClick={handleResetFilters}
            className="text-xs font-semibold text-indigo-600 hover:underline cursor-pointer"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredStudents.map((student) => {
            return (
              <div
                key={student.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Card Header: Avatar & Info */}
                  <div className="flex items-start gap-3">
                    <img 
                      src={student.avatar} 
                      alt={student.name} 
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <h3 className="font-bold text-slate-900 text-sm truncate">
                          {student.name}
                        </h3>
                        <div className="flex items-center gap-0.5 text-xs text-amber-500 font-bold shrink-0">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span className="tabular-nums">{student.rating}</span>
                        </div>
                      </div>

                      <div className="text-xs text-slate-500 truncate flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{student.university}</span>
                      </div>

                      <div className="text-[11px] text-slate-500 truncate flex items-center gap-1 mt-0.5">
                        <GraduationCap className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{student.major}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bio snippet */}
                  <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                    {student.bio}
                  </p>

                  {/* Skills Offered (What they can teach) */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="text-[11px] font-semibold text-indigo-900 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-indigo-600" />
                      Can Teach ({student.skillsOffered.length}):
                    </div>
                    <div className="space-y-1">
                      {student.skillsOffered.slice(0, 2).map(skill => (
                        <div key={skill.id} className="text-xs text-slate-700 flex items-center justify-between">
                          <span className="font-medium truncate max-w-[170px]">{skill.name}</span>
                          <span className="text-[11px] text-slate-400">{skill.level}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Skills Wanted (What they seek) */}
                  <div className="mt-3 pt-2 border-t border-slate-100">
                    <div className="text-[11px] font-semibold text-emerald-900 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <Compass className="w-3 h-3 text-emerald-600" />
                      Wants to Learn:
                    </div>
                    <div className="space-y-1">
                      {student.skillsWanted.slice(0, 2).map(skill => (
                        <div key={skill.id} className="text-xs text-slate-700 flex items-center justify-between">
                          <span className="truncate max-w-[170px]">{skill.name}</span>
                          <span className="text-[11px] text-slate-400">{skill.priority}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedStudentForModal(student)}
                    className="flex-1 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer text-center"
                  >
                    View Details
                  </button>

                  <button
                    onClick={() => handleProposeSwap(student)}
                    className="flex-1 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-2xs"
                  >
                    <Send className="w-3 h-3" />
                    <span>Swap</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Step 4 Footer */}
      <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-xs">
        <div>
          <div className="text-xs font-semibold text-indigo-400">Next Step Available</div>
          <div className="text-sm font-bold text-white">
            Ready to find bidirectional 100% reciprocal matches?
          </div>
        </div>

        <button
          onClick={() => goToStep(5)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs whitespace-nowrap"
        >
          <span>Continue to Step 5: Skill Matching Engine</span>
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
