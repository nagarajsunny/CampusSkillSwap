export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
export type SkillCategory = 
  | 'Programming & Tech' 
  | 'Design & Creative' 
  | 'Languages & Linguistics' 
  | 'Math & Sciences' 
  | 'Music & Audio' 
  | 'Business & Marketing' 
  | 'Writing & Humanities';

export type SwapStatus = 'pending' | 'accepted' | 'declined' | 'in_progress' | 'completed' | 'cancelled';

export type DeliveryMode = 'Online (Video/Chat)' | 'In-Person (Campus)' | 'Hybrid';

export interface SkillOffered {
  id: string;
  name: string;
  category: SkillCategory;
  level: SkillLevel;
  yearsExperience: number;
  teachingStyle: string;
  description: string;
  portfolioUrl?: string;
  isActive: boolean;
}

export interface SkillWanted {
  id: string;
  name: string;
  category: SkillCategory;
  currentLevel: SkillLevel;
  targetGoal: string;
  priority: 'High' | 'Medium' | 'Casual';
  hoursPerWeek: number;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  avatar: string;
  university: string;
  major: string;
  academicYear: 'Freshman' | 'Sophomore' | 'Junior' | 'Senior' | 'Graduate' | 'PhD';
  bio: string;
  availability: string;
  preferredMode: DeliveryMode;
  skillsOffered: SkillOffered[];
  skillsWanted: SkillWanted[];
  rating: number;
  reviewCount: number;
  completedSwapsCount: number;
  joinedDate: string;
  badges: string[];
}

export interface SwapRequest {
  id: string;
  senderId: string;
  receiverId: string;
  offeredSkillName: string;
  wantedSkillName: string;
  frequency: string; // e.g., "1 hour / week"
  mode: DeliveryMode;
  preferredTime: string;
  message: string;
  status: SwapStatus;
  createdAt: string;
  updatedAt: string;
  completedSessions: number;
  totalPlannedSessions: number;
  sessionNotes?: string[];
}

export interface RatingReview {
  id: string;
  swapRequestId?: string;
  fromStudentId: string;
  toStudentId: string;
  overallRating: number;
  teachingRating: number;
  punctualityRating: number;
  badgesAwarded: string[];
  comment: string;
  createdAt: string;
  skillSwapped: string;
}

export interface MatchResult {
  student: Student;
  matchType: 'mutual' | 'they_teach_what_you_want' | 'they_want_what_you_teach';
  matchScore: number;
  matchedTeachSkills: string[];
  matchedLearnSkills: string[];
  reason: string;
}
