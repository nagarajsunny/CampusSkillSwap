import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  UserCheck, 
  GraduationCap, 
  Mail, 
  MapPin, 
  Clock, 
  ArrowRight, 
  Sparkles,
  CheckCircle2,
  BookOpen
} from 'lucide-react';

export const Step1Auth: React.FC = () => {
  const { 
    currentStudent, 
    allStudents, 
    switchStudentAccount, 
    registerOrUpdateStudent, 
    goToStep 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'demo' | 'register'>('demo');

  // Form state for registration
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    university: '',
    major: '',
    academicYear: 'Sophomore' as const,
    bio: '',
    availability: 'Weekday afternoons & Weekend mornings',
    preferredMode: 'Hybrid' as const,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Valid student email is required';
    if (!formData.university.trim()) newErrors.university = 'University / College is required';
    if (!formData.major.trim()) newErrors.major = 'Major is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    registerOrUpdateStudent({
      name: formData.name,
      email: formData.email,
      university: formData.university,
      major: formData.major,
      academicYear: formData.academicYear,
      bio: formData.bio || `Student at ${formData.university} excited to exchange knowledge with peers.`,
      availability: formData.availability,
      preferredMode: formData.preferredMode,
      avatar: formData.avatar,
      skillsOffered: [],
      skillsWanted: [],
    });

    goToStep(2); // Automatically transition to Step 2: My Skills
  };

  return (
    <div className="space-y-10">
      
      {/* Hero Welcome Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 text-white">
        <div className="absolute inset-0 opacity-25">
          <img 
            src="/src/assets/images/hero_skill_swap_1791126033537.jpg" 
            alt="Students collaborating" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative z-10 px-6 py-10 sm:px-10 sm:py-12 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            Step 1 · Student Onboarding & Login
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Exchange Knowledge 1-on-1 with Fellow Students.
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
            CampusSkillSwap lets university students teach what they love in exchange for skills they want to learn. No fees, no tutors—just pure peer-to-peer reciprocal learning.
          </p>

          <div className="flex flex-wrap items-center gap-6 mt-6 pt-6 border-t border-white/10 text-xs text-slate-300">
            <div>
              <span className="font-bold text-white text-sm block">100% Free</span>
              Peer skill barter
            </div>
            <div>
              <span className="font-bold text-white text-sm block">Verified Peers</span>
              College & major matching
            </div>
            <div>
              <span className="font-bold text-white text-sm block">Mutual Rating</span>
              Reputation & badges
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Active Student Card & Auth Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Active Logged In Student Session (4 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Active Student Session
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <CheckCircle2 className="w-3 h-3" /> Logged In
              </span>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                <img 
                  src={currentStudent.avatar} 
                  alt={currentStudent.name} 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-bold text-slate-900 truncate">
                  {currentStudent.name}
                </h3>
                <div className="text-xs text-slate-500 truncate flex items-center gap-1 mt-0.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {currentStudent.email}
                </div>
                <div className="text-xs text-slate-600 truncate flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                  {currentStudent.university}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded-lg bg-slate-50">
                <span className="block text-base font-bold text-slate-900 tabular-nums">
                  {currentStudent.skillsOffered.length}
                </span>
                <span className="text-[11px] text-slate-500">I Teach</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-50">
                <span className="block text-base font-bold text-slate-900 tabular-nums">
                  {currentStudent.skillsWanted.length}
                </span>
                <span className="text-[11px] text-slate-500">I Want</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-50">
                <span className="block text-base font-bold text-slate-900 tabular-nums">
                  {currentStudent.rating}★
                </span>
                <span className="text-[11px] text-slate-500">{currentStudent.reviewCount} reviews</span>
              </div>
            </div>

            <div className="mt-4 text-xs text-slate-600 space-y-1.5">
              <div className="flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                <span><strong>Major:</strong> {currentStudent.major} ({currentStudent.academicYear})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span><strong>Availability:</strong> {currentStudent.availability}</span>
              </div>
            </div>

            <button
              onClick={() => goToStep(2)}
              className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors shadow-xs cursor-pointer"
            >
              <span>Continue with {currentStudent.name.split(' ')[0]} to Step 2</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right: Switch Demo Student or Register New (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          
          {/* Segmented Tab Controls */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => setActiveTab('demo')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'demo'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              1-Click Demo Profiles ({allStudents.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'register'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Register New Student
            </button>
          </div>

          {/* TAB 1: 1-Click Demo Profiles */}
          {activeTab === 'demo' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                Select any student profile below to instantly simulate their account, view their offered skills, test reciprocal matching, and send or receive swap requests.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[460px] overflow-y-auto pr-1">
                {allStudents.map((student) => {
                  const isSelected = student.id === currentStudent.id;
                  return (
                    <div
                      key={student.id}
                      onClick={() => switchStudentAccount(student.id)}
                      className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/60 ring-1 ring-indigo-600'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={student.avatar} 
                          alt={student.name} 
                          className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0" 
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 text-xs truncate">
                              {student.name}
                            </span>
                            {isSelected && (
                              <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            {student.university}
                          </div>
                        </div>
                      </div>

                      <div className="mt-2.5 pt-2.5 border-t border-slate-100 text-[11px] text-slate-600 space-y-1">
                        <div className="truncate">
                          <span className="font-semibold text-slate-700">Teaches:</span>{' '}
                          {student.skillsOffered.map(s => s.name).join(', ') || 'None listed'}
                        </div>
                        <div className="truncate">
                          <span className="font-semibold text-slate-700">Wants:</span>{' '}
                          {student.skillsWanted.map(s => s.name).join(', ') || 'None listed'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Tip: Switch between Maya and Alex to test two-way swap requests!</span>
                <button
                  onClick={() => goToStep(2)}
                  className="font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer flex items-center gap-1"
                >
                  Go to Step 2 <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Registration Form */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jordan Lee"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  />
                  {errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Student Email (.edu) *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. jordan.lee@stanford.edu"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  />
                  {errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    University / College *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Stanford University"
                    value={formData.university}
                    onChange={e => setFormData({ ...formData, university: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  />
                  {errors.university && <p className="text-[11px] text-red-500 mt-1">{errors.university}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Academic Major *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cognitive Science"
                    value={formData.major}
                    onChange={e => setFormData({ ...formData, major: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  />
                  {errors.major && <p className="text-[11px] text-red-500 mt-1">{errors.major}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Academic Standing
                  </label>
                  <select
                    value={formData.academicYear}
                    onChange={e => setFormData({ ...formData, academicYear: e.target.value as any })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
                  >
                    <option value="Freshman">Freshman (1st Year)</option>
                    <option value="Sophomore">Sophomore (2nd Year)</option>
                    <option value="Junior">Junior (3rd Year)</option>
                    <option value="Senior">Senior (4th Year)</option>
                    <option value="Graduate">Graduate Student (Masters)</option>
                    <option value="PhD">PhD Candidate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Preferred Swap Mode
                  </label>
                  <select
                    value={formData.preferredMode}
                    onChange={e => setFormData({ ...formData, preferredMode: e.target.value as any })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
                  >
                    <option value="Hybrid">Hybrid (Online & Campus)</option>
                    <option value="Online (Video/Chat)">Online (Video/Chat)</option>
                    <option value="In-Person (Campus)">In-Person (Campus Library)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Availability Details
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mon & Wed evenings (6-8 PM), Saturdays"
                  value={formData.availability}
                  onChange={e => setFormData({ ...formData, availability: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Student Bio & Learning Ambitions
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe your background, what you enjoy teaching, and what you are eager to pick up."
                  value={formData.bio}
                  onChange={e => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors shadow-xs cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Register & Proceed to Step 2 (My Skills)</span>
                </button>
              </div>
            </form>
          )}

        </div>

      </div>

    </div>
  );
};
