import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SkillCategory, SkillLevel } from '../../types';
import { SKILL_CATEGORIES } from '../../data/mockData';
import { 
  Plus, 
  Trash2, 
  Compass, 
  ArrowRight, 
  Clock, 
  Target,
  Sparkles,
  Layers
} from 'lucide-react';

const SUGGESTED_TARGETS = [
  { name: 'Figma UI/UX Design', category: 'Design & Creative' as SkillCategory, goal: 'Design responsive mockups & components' },
  { name: 'React & Frontend Dev', category: 'Programming & Tech' as SkillCategory, goal: 'Build interactive web applications' },
  { name: 'Conversational Spanish', category: 'Languages & Linguistics' as SkillCategory, goal: 'Speak fluently for study abroad' },
  { name: 'Python & Data Structures', category: 'Programming & Tech' as SkillCategory, goal: 'Prep for software engineering interviews' },
  { name: 'Acoustic Guitar Basics', category: 'Music & Audio' as SkillCategory, goal: 'Learn open chords and song accompaniment' },
  { name: 'SQL & Database Design', category: 'Programming & Tech' as SkillCategory, goal: 'Write complex joins and optimize queries' },
  { name: 'Video Editing with Premiere', category: 'Design & Creative' as SkillCategory, goal: 'Create clean YouTube & documentary cuts' },
];

export const Step3SkillsToLearn: React.FC = () => {
  const { 
    currentStudent, 
    addWantedSkill, 
    removeWantedSkill, 
    goToStep 
  } = useApp();

  const [showAddForm, setShowAddForm] = useState(false);

  const [newWanted, setNewWanted] = useState({
    name: '',
    category: 'Design & Creative' as SkillCategory,
    currentLevel: 'Beginner' as SkillLevel,
    targetGoal: '',
    priority: 'High' as 'High' | 'Medium' | 'Casual',
    hoursPerWeek: 2,
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWanted.name.trim()) return;

    addWantedSkill({
      name: newWanted.name.trim(),
      category: newWanted.category,
      currentLevel: newWanted.currentLevel,
      targetGoal: newWanted.targetGoal.trim() || `Gain practical proficiency in ${newWanted.name}.`,
      priority: newWanted.priority,
      hoursPerWeek: Number(newWanted.hoursPerWeek) || 2,
    });

    setNewWanted({
      name: '',
      category: 'Design & Creative',
      currentLevel: 'Beginner',
      targetGoal: '',
      priority: 'High',
      hoursPerWeek: 2,
    });
    setShowAddForm(false);
  };

  const handleApplyPreset = (preset: typeof SUGGESTED_TARGETS[0]) => {
    setNewWanted(prev => ({
      ...prev,
      name: preset.name,
      category: preset.category,
      targetGoal: preset.goal,
    }));
    setShowAddForm(true);
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">
            <Compass className="w-3.5 h-3.5" />
            <span>Step 3 · Learning Wishlist</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Skills I Want to Learn (What I Desire from Peers)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Set your target learning ambitions. Our matching engine will find peers who teach these exact skills!
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{showAddForm ? 'Close Form' : 'Add Target Skill'}</span>
          </button>
        </div>
      </div>

      {/* Suggested Learning Goals */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
        <div className="text-xs font-semibold text-slate-600 mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Popular Learning Wishlists (Click to prefill):</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_TARGETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-emerald-500 hover:text-emerald-700 transition-colors cursor-pointer shadow-2xs"
            >
              + {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Add Desired Skill Form */}
      {showAddForm && (
        <form onSubmit={handleAddSubmit} className="bg-white rounded-2xl border-2 border-emerald-200 p-6 shadow-md space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-600" />
              Add a Skill Wishlist Goal
            </h3>
            <span className="text-xs text-slate-400">Match engine priority</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Skill / Subject *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Figma UI/UX Design, Data Structures, Conversational French"
                value={newWanted.name}
                onChange={e => setNewWanted({ ...newWanted, name: e.target.value })}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category
              </label>
              <select
                value={newWanted.category}
                onChange={e => setNewWanted({ ...newWanted, category: e.target.value as SkillCategory })}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-white"
              >
                {SKILL_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                My Current Level
              </label>
              <select
                value={newWanted.currentLevel}
                onChange={e => setNewWanted({ ...newWanted, currentLevel: e.target.value as SkillLevel })}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-white"
              >
                <option value="Beginner">Complete Beginner</option>
                <option value="Intermediate">Novice / Some Basics</option>
                <option value="Advanced">Intermediate</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Priority
              </label>
              <select
                value={newWanted.priority}
                onChange={e => setNewWanted({ ...newWanted, priority: e.target.value as any })}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-white"
              >
                <option value="High">High Priority (Immediate Need)</option>
                <option value="Medium">Medium (Semester Project)</option>
                <option value="Casual">Casual / Hobby Exploration</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Desired Study Hours/Week
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={newWanted.hoursPerWeek}
                onChange={e => setNewWanted({ ...newWanted, hoursPerWeek: parseInt(e.target.value) || 2 })}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Target Learning Goal / Milestone
            </label>
            <textarea
              rows={2}
              placeholder="What concrete result do you want to achieve with your peer? (e.g. Build my React portfolio site, pass exam, play 3 full songs)"
              value={newWanted.targetGoal}
              onChange={e => setNewWanted({ ...newWanted, targetGoal: e.target.value })}
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
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
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              Save to My Learning Wishlist
            </button>
          </div>
        </form>
      )}

      {/* Wanted Skills List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Desired Skills Wishlist ({currentStudent.skillsWanted.length})
          </div>
          <span className="text-xs text-slate-400">
            For: <strong className="text-slate-700">{currentStudent.name}</strong>
          </span>
        </div>

        {currentStudent.skillsWanted.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl border-2 border-dashed border-slate-200 bg-white">
            <Layers className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-slate-900">No learning wishlist items yet</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              Add at least one skill you wish to learn so our matching engine can connect you with peer mentors.
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Desired Skill
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentStudent.skillsWanted.map((skill) => (
              <div
                key={skill.id}
                className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs hover:border-slate-300 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{skill.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span>{skill.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-slate-600 font-medium">Level: {skill.currentLevel}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => removeWantedSkill(skill.id)}
                    className="text-slate-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1">
                    <Target className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Target Goal:</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {skill.targetGoal}
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span className="tabular-nums">{skill.hoursPerWeek} hrs/week planned</span>
                  </div>

                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                    skill.priority === 'High'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : skill.priority === 'Medium'
                      ? 'bg-blue-50 text-blue-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {skill.priority} Priority
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Step Completion Banner */}
      <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-xs">
        <div>
          <div className="text-xs font-semibold text-emerald-400">Step 3 Completed</div>
          <div className="text-sm font-bold text-white">
            {currentStudent.skillsWanted.length} learning goal{currentStudent.skillsWanted.length === 1 ? '' : 's'} defined.
          </div>
        </div>

        <button
          onClick={() => goToStep(4)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs whitespace-nowrap"
        >
          <span>Continue to Step 4: Find Students</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
