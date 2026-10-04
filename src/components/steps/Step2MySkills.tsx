import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SkillCategory, SkillLevel, SkillOffered } from '../../types';
import { SKILL_CATEGORIES } from '../../data/mockData';
import { 
  Plus, 
  Trash2, 
  Sparkles, 
  ExternalLink, 
  Check, 
  ArrowRight,
  BookOpen,
  SlidersHorizontal
} from 'lucide-react';

const SUGGESTED_SKILLS = [
  { name: 'Python Scripting', category: 'Programming & Tech' as SkillCategory, level: 'Advanced' as SkillLevel },
  { name: 'Figma UI/UX Design', category: 'Design & Creative' as SkillCategory, level: 'Expert' as SkillLevel },
  { name: 'Conversational Spanish', category: 'Languages & Linguistics' as SkillCategory, level: 'Expert' as SkillLevel },
  { name: 'Calculus & Linear Algebra', category: 'Math & Sciences' as SkillCategory, level: 'Advanced' as SkillLevel },
  { name: 'Acoustic Guitar', category: 'Music & Audio' as SkillCategory, level: 'Advanced' as SkillLevel },
  { name: 'Video Editing & Premiere', category: 'Design & Creative' as SkillCategory, level: 'Intermediate' as SkillLevel },
  { name: 'Digital Marketing & SEO', category: 'Business & Marketing' as SkillCategory, level: 'Intermediate' as SkillLevel },
];

export const Step2MySkills: React.FC = () => {
  const { 
    currentStudent, 
    addOfferedSkill, 
    removeOfferedSkill, 
    toggleOfferedSkillActive,
    goToStep 
  } = useApp();

  const [showAddForm, setShowAddForm] = useState(false);

  const [newSkill, setNewSkill] = useState({
    name: '',
    category: 'Programming & Tech' as SkillCategory,
    level: 'Advanced' as SkillLevel,
    yearsExperience: 2,
    teachingStyle: 'Hands-on practice & real-world project teardown',
    description: '',
    portfolioUrl: '',
    isActive: true,
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.name.trim()) return;

    addOfferedSkill({
      name: newSkill.name.trim(),
      category: newSkill.category,
      level: newSkill.level,
      yearsExperience: Number(newSkill.yearsExperience) || 1,
      teachingStyle: newSkill.teachingStyle.trim() || 'Interactive 1-on-1 walkthrough',
      description: newSkill.description.trim() || `Practical guidance and mentoring in ${newSkill.name}.`,
      portfolioUrl: newSkill.portfolioUrl.trim() || undefined,
      isActive: true,
    });

    // Reset form
    setNewSkill({
      name: '',
      category: 'Programming & Tech',
      level: 'Advanced',
      yearsExperience: 2,
      teachingStyle: 'Hands-on practice & real-world project teardown',
      description: '',
      portfolioUrl: '',
      isActive: true,
    });
    setShowAddForm(false);
  };

  const handleApplyPreset = (preset: typeof SUGGESTED_SKILLS[0]) => {
    setNewSkill(prev => ({
      ...prev,
      name: preset.name,
      category: preset.category,
      level: preset.level,
      description: `Comprehensive mentorship in ${preset.name}, covering core fundamentals to practical applications.`,
    }));
    setShowAddForm(true);
  };

  return (
    <div className="space-y-8">
      
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Step 2 · Knowledge Exchange Portfolio</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            My Skills (What I Can Teach & Share)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Specify the skills, tools, or subjects you feel confident teaching other students in reciprocal swaps.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{showAddForm ? 'Close Form' : 'Add New Skill'}</span>
          </button>
        </div>
      </div>

      {/* Suggested Quick Starters */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
        <div className="text-xs font-semibold text-slate-600 mb-2 flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
          <span>Quick Starters (Click to pre-fill):</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_SKILLS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-indigo-400 hover:text-indigo-600 transition-colors cursor-pointer shadow-2xs"
            >
              + {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Add New Skill Form (Collapsible) */}
      {showAddForm && (
        <form onSubmit={handleAddSubmit} className="bg-white rounded-2xl border-2 border-indigo-200 p-6 shadow-md space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Add a Skill to Teach
            </h3>
            <span className="text-xs text-slate-400">All fields customizable</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Skill / Topic Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. React & TypeScript, Organic Chemistry, French Conversation"
                value={newSkill.name}
                onChange={e => setNewSkill({ ...newSkill, name: e.target.value })}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category
              </label>
              <select
                value={newSkill.category}
                onChange={e => setNewSkill({ ...newSkill, category: e.target.value as SkillCategory })}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
              >
                {SKILL_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Proficiency Level
              </label>
              <select
                value={newSkill.level}
                onChange={e => setNewSkill({ ...newSkill, level: e.target.value as SkillLevel })}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
              >
                <option value="Beginner">Beginner (Foundations)</option>
                <option value="Intermediate">Intermediate (Coursework/Projects)</option>
                <option value="Advanced">Advanced (Teaching assistant/Experienced)</option>
                <option value="Expert">Expert (Industry intern/Specialist)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Years Experience / Semesters
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={newSkill.yearsExperience}
                onChange={e => setNewSkill({ ...newSkill, yearsExperience: parseInt(e.target.value) || 1 })}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Teaching Style & Session Format
            </label>
            <input
              type="text"
              placeholder="e.g. Live coding walkthroughs, portfolio teardowns, conversation drills"
              value={newSkill.teachingStyle}
              onChange={e => setNewSkill({ ...newSkill, teachingStyle: e.target.value })}
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description & What You'll Cover
            </label>
            <textarea
              rows={2}
              placeholder="Brief overview of the syllabus or topics you are comfortable guiding someone through."
              value={newSkill.description}
              onChange={e => setNewSkill({ ...newSkill, description: e.target.value })}
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Portfolio / GitHub / Work Sample Link (Optional)
            </label>
            <input
              type="url"
              placeholder="https://github.com/..."
              value={newSkill.portfolioUrl}
              onChange={e => setNewSkill({ ...newSkill, portfolioUrl: e.target.value })}
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              Save & Add to Teaching List
            </button>
          </div>
        </form>
      )}

      {/* Active Skills List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Offered Skills ({currentStudent.skillsOffered.length})
          </div>
          <span className="text-xs text-slate-400">
            Teaching for: <strong className="text-slate-700">{currentStudent.name}</strong>
          </span>
        </div>

        {currentStudent.skillsOffered.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl border-2 border-dashed border-slate-200 bg-white">
            <SlidersHorizontal className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-slate-900">No skills added yet</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              Add at least one skill you can teach so other students can discover and match with you.
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Your First Skill
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentStudent.skillsOffered.map((skill) => (
              <div
                key={skill.id}
                className={`p-5 rounded-2xl border transition-all ${
                  skill.isActive
                    ? 'border-slate-200 bg-white shadow-xs hover:border-slate-300'
                    : 'border-slate-200 bg-slate-50/70 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{skill.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span>{skill.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-medium text-indigo-600">{skill.level}</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">{skill.yearsExperience}y exp</span>
                    </div>
                  </div>

                  <button
                    onClick={() => removeOfferedSkill(skill.id)}
                    className="text-slate-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
                    title="Delete skill"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                  {skill.description}
                </p>

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="truncate max-w-[200px] text-[11px]">
                    Format: {skill.teachingStyle}
                  </span>

                  <div className="flex items-center gap-2 shrink-0">
                    {skill.portfolioUrl && (
                      <a
                        href={skill.portfolioUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-indigo-600 hover:underline"
                      >
                        Proof <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    <button
                      onClick={() => toggleOfferedSkillActive(skill.id)}
                      className={`text-[11px] px-2 py-0.5 rounded cursor-pointer transition-colors ${
                        skill.isActive
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                      }`}
                    >
                      {skill.isActive ? 'Active' : 'Paused'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Next Step Action Box */}
      <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-xs">
        <div>
          <div className="text-xs font-semibold text-indigo-400">Step 2 Completed</div>
          <div className="text-sm font-bold text-white">
            {currentStudent.skillsOffered.length} skill{currentStudent.skillsOffered.length === 1 ? '' : 's'} registered to teach.
          </div>
        </div>

        <button
          onClick={() => goToStep(3)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs whitespace-nowrap"
        >
          <span>Continue to Step 3: Skills I Want to Learn</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
