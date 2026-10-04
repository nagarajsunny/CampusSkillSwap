import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Star, 
  Award, 
  MessageSquare, 
  CheckCircle2, 
  Sparkles, 
  Send, 
  ThumbsUp, 
  UserCheck, 
  RotateCcw,
  Clock,
  Layers
} from 'lucide-react';

const AVAILABLE_BADGES = [
  'Patient Explainer',
  'Code Wizard',
  'Design Guru',
  'Super Creative',
  'Punctual & Organized',
  'Clear Notes',
  'Inspiring Mentor',
  'Fast Responder',
  'Hands-on Projects',
  'Fun Energy',
];

export const Step7Ratings: React.FC = () => {
  const { 
    currentStudent, 
    allStudents, 
    reviews, 
    submitReview, 
    swapRequests,
    goToStep 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'feed' | 'submit'>('feed');

  // Review Form State
  const eligiblePeers = allStudents.filter(s => s.id !== currentStudent.id);

  const [toStudentId, setToStudentId] = useState<string>(eligiblePeers[0]?.id || '');
  const [skillSwapped, setSkillSwapped] = useState<string>('Python & Data Structures');
  const [overallRating, setOverallRating] = useState<number>(5);
  const [teachingRating, setTeachingRating] = useState<number>(5);
  const [punctualityRating, setPunctualityRating] = useState<number>(5);
  const [selectedBadges, setSelectedBadges] = useState<string[]>(['Patient Explainer', 'Clear Notes']);
  const [comment, setComment] = useState<string>('');

  const toggleBadge = (badge: string) => {
    setSelectedBadges(prev => 
      prev.includes(badge) ? prev.filter(b => b !== badge) : [...prev, badge]
    );
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!toStudentId || !comment.trim()) return;

    submitReview({
      toStudentId,
      overallRating,
      teachingRating,
      punctualityRating,
      badgesAwarded: selectedBadges,
      comment: comment.trim(),
      skillSwapped,
    });

    setComment('');
    setActiveTab('feed');
  };

  // Find reviews concerning the current student
  const reviewsAboutMe = reviews.filter(r => r.toStudentId === currentStudent.id);
  const reviewsGivenByMe = reviews.filter(r => r.fromStudentId === currentStudent.id);

  const getStudent = (id: string) => allStudents.find(s => s.id === id);

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 uppercase tracking-wider mb-1">
            <Star className="w-3.5 h-3.5 fill-amber-500" />
            <span>Step 7 · Peer Trust & Rating System</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Ratings, Reviews & Skill Endorsements
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Give honest feedback on your swap partner's teaching quality, communication, and punctuality.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('submit')}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Write a Peer Review</span>
        </button>
      </div>

      {/* Student Reputation Score Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          <div className="md:col-span-4 flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-200 shrink-0">
              <img 
                src={currentStudent.avatar} 
                alt={currentStudent.name} 
                className="w-full h-full object-cover" 
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                My Reputation Card
              </div>
              <h3 className="text-lg font-bold text-slate-900 truncate">
                {currentStudent.name}
              </h3>
              <div className="text-xs text-slate-500">
                {currentStudent.university} · {currentStudent.academicYear}
              </div>
            </div>
          </div>

          <div className="md:col-span-4 flex items-center justify-around border-y md:border-y-0 md:border-x border-slate-100 py-3 md:py-0">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-2xl font-black text-slate-900 tabular-nums">
                <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
                <span>{currentStudent.rating}</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Average Rating</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-black text-slate-900 tabular-nums">
                {currentStudent.reviewCount}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Reviews Received</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-black text-indigo-600 tabular-nums">
                {currentStudent.completedSwapsCount}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Swaps Completed</div>
            </div>
          </div>

          <div className="md:col-span-4">
            <div className="text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>Earned Peer Badges:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {currentStudent.badges.length > 0 ? (
                currentStudent.badges.map((b, idx) => (
                  <span key={idx} className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                    ★ {b}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400 italic">No badges earned yet. Complete swaps to earn badges!</span>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl max-w-md">
        <button
          onClick={() => setActiveTab('feed')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'feed'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Community Feed ({reviews.length})
        </button>
        <button
          onClick={() => setActiveTab('submit')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'submit'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Submit New Review
        </button>
      </div>

      {/* TAB 1: Review Submission Form */}
      {activeTab === 'submit' && (
        <div className="bg-white rounded-2xl border-2 border-indigo-200 p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
              Leave Rating & Endorsement for a Peer
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Your feedback is published to the student's profile to reward high-quality mentoring.
            </p>
          </div>

          <form onSubmit={handleReviewSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Peer Student *
                </label>
                <select
                  value={toStudentId}
                  onChange={e => setToStudentId(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
                >
                  {eligiblePeers.map(peer => (
                    <option key={peer.id} value={peer.id}>
                      {peer.name} ({peer.university})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Skill Swapped *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Figma UI/UX Design, React, Conversational Spanish"
                  value={skillSwapped}
                  onChange={e => setSkillSwapped(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            {/* Star Rating Sliders / Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              
              {/* Overall Rating */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Overall Experience
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setOverallRating(star)}
                      className="p-1 cursor-pointer hover:scale-110 transition-transform"
                    >
                      <Star 
                        className={`w-5 h-5 ${
                          star <= overallRating
                            ? 'fill-amber-400 text-amber-500'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-700 ml-1.5 tabular-nums">{overallRating}.0</span>
                </div>
              </div>

              {/* Teaching Quality */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Teaching Clarity & Knowledge
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setTeachingRating(star)}
                      className="p-1 cursor-pointer hover:scale-110 transition-transform"
                    >
                      <Star 
                        className={`w-5 h-5 ${
                          star <= teachingRating
                            ? 'fill-amber-400 text-amber-500'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-700 ml-1.5 tabular-nums">{teachingRating}.0</span>
                </div>
              </div>

              {/* Punctuality */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Punctuality & Communication
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setPunctualityRating(star)}
                      className="p-1 cursor-pointer hover:scale-110 transition-transform"
                    >
                      <Star 
                        className={`w-5 h-5 ${
                          star <= punctualityRating
                            ? 'fill-amber-400 text-amber-500'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-700 ml-1.5 tabular-nums">{punctualityRating}.0</span>
                </div>
              </div>

            </div>

            {/* Award Badges */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Award Endorsement Badges (Select all that apply)
              </label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_BADGES.map((badge) => {
                  const isSelected = selectedBadges.includes(badge);
                  return (
                    <button
                      key={badge}
                      type="button"
                      onClick={() => toggleBadge(badge)}
                      className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-amber-100 text-amber-900 border-amber-300 font-semibold'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {isSelected ? '★ ' : '+ '}
                      {badge}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Written Testimonial */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Detailed Testimonial / Feedback *
              </label>
              <textarea
                rows={3}
                required
                placeholder="How was the session? What specifically did you learn from them? Were they patient, prepared, and clear?"
                value={comment}
                onChange={e => setComment(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveTab('feed')}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!comment.trim()}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors shadow-xs cursor-pointer disabled:bg-slate-200 disabled:text-slate-400"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Official Rating</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: Community Reviews Feed */}
      {activeTab === 'feed' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Recent Peer Testimonials ({reviews.length})
            </span>
            <span className="text-xs text-slate-400">
              Verified campus exchange reviews
            </span>
          </div>

          <div className="space-y-4">
            {reviews.map((rev) => {
              const fromStudent = getStudent(rev.fromStudentId);
              const toStudent = getStudent(rev.toStudentId);

              return (
                <div key={rev.id} className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {fromStudent ? (
                        <img 
                          src={fromStudent.avatar} 
                          alt={fromStudent.name} 
                          className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0" 
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-slate-200" />
                      )}
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          {fromStudent ? fromStudent.name : 'A student'} reviewed{' '}
                          <span className="text-indigo-600">{toStudent ? toStudent.name : 'peer'}</span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Skill: <strong className="text-slate-700 font-medium">{rev.skillSwapped}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 text-amber-700 text-xs font-bold self-start sm:self-auto">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span className="tabular-nums">{rev.overallRating}.0</span>
                      <span className="text-[11px] text-amber-600/70 font-normal">/ 5.0</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 italic leading-relaxed pl-2 border-l-2 border-indigo-200">
                    "{rev.comment}"
                  </p>

                  {rev.badgesAwarded.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {rev.badgesAwarded.map((badge, bIdx) => (
                        <span key={bIdx} className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          ★ {badge}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                    <span>Teaching Clarity: {rev.teachingRating}/5 · Punctuality: {rev.punctualityRating}/5</span>
                    <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Completion Trophy Card (All 7 Steps Finished!) */}
      <div className="rounded-2xl bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 p-8 text-white text-center shadow-lg border border-indigo-900 relative overflow-hidden">
        <div className="relative z-10 max-w-xl mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center mx-auto text-amber-400">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          </div>
          
          <h3 className="text-2xl font-black text-white tracking-tight">
            Complete 7-Step Skill Swap Cycle Mastered!
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            You've explored the complete student skill swap workflow: registration & login, offering skills, defining target goals, directory discovery, mutual matching, swap proposals, and peer ratings.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => goToStep(4)}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-xs cursor-pointer"
            >
              Explore More Students (Step 4)
            </button>
            <button
              onClick={() => goToStep(1)}
              className="px-5 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl transition-colors cursor-pointer"
            >
              Back to Step 1
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
