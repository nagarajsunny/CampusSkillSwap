import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Student, 
  SkillOffered, 
  SkillWanted, 
  SwapRequest, 
  RatingReview, 
  MatchResult,
  DeliveryMode 
} from '../types';
import { INITIAL_STUDENTS, INITIAL_SWAP_REQUESTS, INITIAL_REVIEWS } from '../data/mockData';

interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}

interface AppContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  goToStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  
  currentStudent: Student;
  setCurrentStudent: (student: Student) => void;
  allStudents: Student[];
  switchStudentAccount: (studentId: string) => void;
  registerOrUpdateStudent: (studentData: Partial<Student> & { name: string; email: string }) => void;
  
  // Step 2: My Skills (Offered)
  addOfferedSkill: (skill: Omit<SkillOffered, 'id'>) => void;
  updateOfferedSkill: (id: string, skill: Partial<SkillOffered>) => void;
  removeOfferedSkill: (id: string) => void;
  toggleOfferedSkillActive: (id: string) => void;
  
  // Step 3: Skills I Want to Learn
  addWantedSkill: (skill: Omit<SkillWanted, 'id'>) => void;
  updateWantedSkill: (id: string, skill: Partial<SkillWanted>) => void;
  removeWantedSkill: (id: string) => void;

  // Step 4 & 5: Matching & Discovery
  targetSwapStudent: Student | null;
  setTargetSwapStudent: (student: Student | null) => void;
  getMatchesForCurrentStudent: () => MatchResult[];
  
  // Step 6: Swap Requests
  swapRequests: SwapRequest[];
  sendSwapProposal: (proposal: {
    receiverId: string;
    offeredSkillName: string;
    wantedSkillName: string;
    frequency: string;
    mode: DeliveryMode;
    preferredTime: string;
    message: string;
  }) => void;
  acceptSwapRequest: (requestId: string) => void;
  declineSwapRequest: (requestId: string) => void;
  cancelSwapRequest: (requestId: string) => void;
  logSwapSession: (requestId: string, note?: string) => void;
  completeSwapRequest: (requestId: string) => void;

  // Step 7: Ratings & Reviews
  reviews: RatingReview[];
  submitReview: (reviewData: {
    swapRequestId?: string;
    toStudentId: string;
    overallRating: number;
    teachingRating: number;
    punctualityRating: number;
    badgesAwarded: string[];
    comment: string;
    skillSwapped: string;
  }) => void;

  // Feedback notifications
  toasts: ToastMessage[];
  dismissToast: (id: string) => void;
  notify: (message: string, type?: 'success' | 'info' | 'warning') => void;

  // Reset demo data
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CURRENT_STEP: 'css_current_step',
  CURRENT_STUDENT_ID: 'css_current_student_id',
  STUDENTS: 'css_students_v1',
  SWAPS: 'css_swaps_v1',
  REVIEWS: 'css_reviews_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Initialize Step
  const [currentStep, setCurrentStepState] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_STEP);
    return saved ? Math.min(Math.max(parseInt(saved, 10), 1), 7) : 1;
  });

  const setCurrentStep = (step: number) => {
    const clamped = Math.min(Math.max(step, 1), 7);
    setCurrentStepState(clamped);
    localStorage.setItem(STORAGE_KEYS.CURRENT_STEP, clamped.toString());
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const nextStep = () => {
    if (currentStep < 7) {
      goToStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    }
  };

  // 2. Initialize Students
  const [allStudents, setAllStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_STUDENTS;
  });

  // Current logged in student ID
  const [currentStudentId, setCurrentStudentId] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_STUDENT_ID) || 'student-alex';
  });

  const currentStudent = allStudents.find(s => s.id === currentStudentId) || allStudents[0] || INITIAL_STUDENTS[0];

  // 3. Initialize Swaps
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SWAPS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_SWAP_REQUESTS;
  });

  // 4. Initialize Reviews
  const [reviews, setReviews] = useState<RatingReview[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_REVIEWS;
  });

  // 5. Target Student for Swap
  const [targetSwapStudent, setTargetSwapStudent] = useState<Student | null>(null);

  // 6. Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const notify = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(allStudents));
  }, [allStudents]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SWAPS, JSON.stringify(swapRequests));
  }, [swapRequests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_STUDENT_ID, currentStudentId);
  }, [currentStudentId]);

  // Account switching
  const switchStudentAccount = (studentId: string) => {
    const found = allStudents.find(s => s.id === studentId);
    if (found) {
      setCurrentStudentId(studentId);
      notify(`Switched session to ${found.name} (${found.university})`, 'info');
    }
  };

  const setCurrentStudent = (updatedStudent: Student) => {
    setAllStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
  };

  const registerOrUpdateStudent = (studentData: Partial<Student> & { name: string; email: string }) => {
    const existingIndex = allStudents.findIndex(s => s.email.toLowerCase() === studentData.email.toLowerCase());
    
    if (existingIndex >= 0) {
      // Update existing student
      const updated = {
        ...allStudents[existingIndex],
        ...studentData,
      };
      setAllStudents(prev => prev.map((s, idx) => idx === existingIndex ? updated : s));
      setCurrentStudentId(updated.id);
      notify(`Welcome back, ${updated.name}! Profile updated.`, 'success');
    } else {
      // Create new student
      const newId = `student-custom-${Date.now()}`;
      const newStudent: Student = {
        id: newId,
        name: studentData.name,
        email: studentData.email,
        avatar: studentData.avatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
        university: studentData.university || 'State University',
        major: studentData.major || 'Undeclared',
        academicYear: studentData.academicYear || 'Sophomore',
        bio: studentData.bio || 'Excited to share knowledge and learn from peers on CampusSkillSwap!',
        availability: studentData.availability || 'Weekdays after 5 PM & Weekends',
        preferredMode: studentData.preferredMode || 'Hybrid',
        skillsOffered: studentData.skillsOffered || [],
        skillsWanted: studentData.skillsWanted || [],
        rating: 5.0,
        reviewCount: 0,
        completedSwapsCount: 0,
        joinedDate: 'Oct 2026',
        badges: ['New Explorer'],
      };
      setAllStudents(prev => [newStudent, ...prev]);
      setCurrentStudentId(newId);
      notify(`Account created successfully! Welcome to CampusSkillSwap, ${newStudent.name}.`, 'success');
    }
  };

  // Step 2: Offered Skills Management
  const addOfferedSkill = (skill: Omit<SkillOffered, 'id'>) => {
    const newSkill: SkillOffered = {
      ...skill,
      id: `sk-off-${Date.now()}`,
    };
    const updatedStudent: Student = {
      ...currentStudent,
      skillsOffered: [...currentStudent.skillsOffered, newSkill],
    };
    setCurrentStudent(updatedStudent);
    notify(`Skill "${skill.name}" added to what you can teach!`, 'success');
  };

  const updateOfferedSkill = (id: string, partial: Partial<SkillOffered>) => {
    const updatedStudent: Student = {
      ...currentStudent,
      skillsOffered: currentStudent.skillsOffered.map(sk => sk.id === id ? { ...sk, ...partial } : sk),
    };
    setCurrentStudent(updatedStudent);
    notify('Offered skill updated.', 'info');
  };

  const removeOfferedSkill = (id: string) => {
    const updatedStudent: Student = {
      ...currentStudent,
      skillsOffered: currentStudent.skillsOffered.filter(sk => sk.id !== id),
    };
    setCurrentStudent(updatedStudent);
    notify('Skill removed from teaching list.', 'info');
  };

  const toggleOfferedSkillActive = (id: string) => {
    const skill = currentStudent.skillsOffered.find(s => s.id === id);
    if (!skill) return;
    updateOfferedSkill(id, { isActive: !skill.isActive });
  };

  // Step 3: Desired Skills Management
  const addWantedSkill = (skill: Omit<SkillWanted, 'id'>) => {
    const newSkill: SkillWanted = {
      ...skill,
      id: `sk-wan-${Date.now()}`,
    };
    const updatedStudent: Student = {
      ...currentStudent,
      skillsWanted: [...currentStudent.skillsWanted, newSkill],
    };
    setCurrentStudent(updatedStudent);
    notify(`Goal "${skill.name}" added to your learning wishlist!`, 'success');
  };

  const updateWantedSkill = (id: string, partial: Partial<SkillWanted>) => {
    const updatedStudent: Student = {
      ...currentStudent,
      skillsWanted: currentStudent.skillsWanted.map(sk => sk.id === id ? { ...sk, ...partial } : sk),
    };
    setCurrentStudent(updatedStudent);
    notify('Learning goal updated.', 'info');
  };

  const removeWantedSkill = (id: string) => {
    const updatedStudent: Student = {
      ...currentStudent,
      skillsWanted: currentStudent.skillsWanted.filter(sk => sk.id !== id),
    };
    setCurrentStudent(updatedStudent);
    notify('Skill removed from learning wishlist.', 'info');
  };

  // Step 5: Reciprocal Skill Matching Engine
  const getMatchesForCurrentStudent = (): MatchResult[] => {
    const myOffered = currentStudent.skillsOffered.filter(s => s.isActive).map(s => s.name.toLowerCase());
    const myWanted = currentStudent.skillsWanted.map(s => s.name.toLowerCase());

    const results: MatchResult[] = [];

    const otherStudents = allStudents.filter(s => s.id !== currentStudent.id);

    for (const peer of otherStudents) {
      const peerOffered = peer.skillsOffered.filter(s => s.isActive);
      const peerWanted = peer.skillsWanted;

      // 1. Skills they offer that I want to learn
      const matchedLearn: string[] = [];
      for (const po of peerOffered) {
        const poName = po.name.toLowerCase();
        if (myWanted.some(w => poName.includes(w) || w.includes(poName))) {
          matchedLearn.push(po.name);
        }
      }

      // 2. Skills I offer that they want to learn
      const matchedTeach: string[] = [];
      for (const pw of peerWanted) {
        const pwName = pw.name.toLowerCase();
        if (myOffered.some(o => pwName.includes(o) || o.includes(pwName))) {
          matchedTeach.push(pw.name);
        }
      }

      // Compute compatibility
      if (matchedLearn.length > 0 && matchedTeach.length > 0) {
        // MUTUAL SWAP!
        const score = Math.min(99, 88 + (matchedLearn.length + matchedTeach.length) * 3);
        results.push({
          student: peer,
          matchType: 'mutual',
          matchScore: score,
          matchedTeachSkills: matchedTeach,
          matchedLearnSkills: matchedLearn,
          reason: `100% Reciprocal Swap! You can teach ${matchedTeach.join(', ')} while ${peer.name.split(' ')[0]} teaches you ${matchedLearn.join(', ')}.`,
        });
      } else if (matchedLearn.length > 0) {
        results.push({
          student: peer,
          matchType: 'they_teach_what_you_want',
          matchScore: 78 + matchedLearn.length * 4,
          matchedTeachSkills: [],
          matchedLearnSkills: matchedLearn,
          reason: `${peer.name.split(' ')[0]} can teach you ${matchedLearn.join(', ')}. Propose a swap with any of your skills!`,
        });
      } else if (matchedTeach.length > 0) {
        results.push({
          student: peer,
          matchType: 'they_want_what_you_teach',
          matchScore: 72 + matchedTeach.length * 4,
          matchedTeachSkills: matchedTeach,
          matchedLearnSkills: [],
          reason: `${peer.name.split(' ')[0]} is actively looking to learn ${matchedTeach.join(', ')}.`,
        });
      }
    }

    // Sort by match score descending (mutual first)
    return results.sort((a, b) => b.matchScore - a.matchScore);
  };

  // Step 6: Send Swap Proposal
  const sendSwapProposal = (proposal: {
    receiverId: string;
    offeredSkillName: string;
    wantedSkillName: string;
    frequency: string;
    mode: DeliveryMode;
    preferredTime: string;
    message: string;
  }) => {
    const newRequest: SwapRequest = {
      id: `swap-req-${Date.now()}`,
      senderId: currentStudent.id,
      receiverId: proposal.receiverId,
      offeredSkillName: proposal.offeredSkillName,
      wantedSkillName: proposal.wantedSkillName,
      frequency: proposal.frequency,
      mode: proposal.mode,
      preferredTime: proposal.preferredTime,
      message: proposal.message,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completedSessions: 0,
      totalPlannedSessions: 4,
      sessionNotes: [],
    };

    setSwapRequests(prev => [newRequest, ...prev]);
    const receiver = allStudents.find(s => s.id === proposal.receiverId);
    notify(`Swap proposal sent to ${receiver ? receiver.name : 'peer'}!`, 'success');
  };

  const acceptSwapRequest = (requestId: string) => {
    setSwapRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          status: 'in_progress',
          updatedAt: new Date().toISOString(),
          sessionNotes: req.sessionNotes || [`Swap accepted on ${new Date().toLocaleDateString()}. Initial session kickoff scheduled.`],
        };
      }
      return req;
    }));
    notify('Swap request accepted! The exchange is now active in your dashboard.', 'success');
  };

  const declineSwapRequest = (requestId: string) => {
    setSwapRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        return { ...req, status: 'declined', updatedAt: new Date().toISOString() };
      }
      return req;
    }));
    notify('Swap proposal declined.', 'info');
  };

  const cancelSwapRequest = (requestId: string) => {
    setSwapRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        return { ...req, status: 'cancelled', updatedAt: new Date().toISOString() };
      }
      return req;
    }));
    notify('Swap request cancelled.', 'info');
  };

  const logSwapSession = (requestId: string, note?: string) => {
    setSwapRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        const nextCompleted = req.completedSessions + 1;
        const newNotes = [...(req.sessionNotes || [])];
        newNotes.push(note || `Session ${nextCompleted} completed on ${new Date().toLocaleDateString()}`);
        
        const isNowComplete = nextCompleted >= req.totalPlannedSessions;
        return {
          ...req,
          completedSessions: nextCompleted,
          status: isNowComplete ? 'completed' : 'in_progress',
          sessionNotes: newNotes,
          updatedAt: new Date().toISOString(),
        };
      }
      return req;
    }));
    notify('Session logged successfully!', 'success');
  };

  const completeSwapRequest = (requestId: string) => {
    setSwapRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          status: 'completed',
          completedSessions: req.totalPlannedSessions,
          updatedAt: new Date().toISOString(),
        };
      }
      return req;
    }));

    // Increment completed swaps for both students
    const req = swapRequests.find(r => r.id === requestId);
    if (req) {
      setAllStudents(prev => prev.map(s => {
        if (s.id === req.senderId || s.id === req.receiverId) {
          return { ...s, completedSwapsCount: s.completedSwapsCount + 1 };
        }
        return s;
      }));
    }

    notify('Swap marked as completed! You can now rate and review your peer in Step 7.', 'success');
  };

  // Step 7: Ratings & Reviews
  const submitReview = (reviewData: {
    swapRequestId?: string;
    toStudentId: string;
    overallRating: number;
    teachingRating: number;
    punctualityRating: number;
    badgesAwarded: string[];
    comment: string;
    skillSwapped: string;
  }) => {
    const newReview: RatingReview = {
      id: `rev-${Date.now()}`,
      swapRequestId: reviewData.swapRequestId,
      fromStudentId: currentStudent.id,
      toStudentId: reviewData.toStudentId,
      overallRating: reviewData.overallRating,
      teachingRating: reviewData.teachingRating,
      punctualityRating: reviewData.punctualityRating,
      badgesAwarded: reviewData.badgesAwarded,
      comment: reviewData.comment,
      createdAt: new Date().toISOString(),
      skillSwapped: reviewData.skillSwapped,
    };

    setReviews(prev => [newReview, ...prev]);

    // Recalculate target student's average rating and badge count
    setAllStudents(prev => prev.map(s => {
      if (s.id === reviewData.toStudentId) {
        const studentReviews = [...reviews.filter(r => r.toStudentId === s.id), newReview];
        const avg = studentReviews.reduce((sum, r) => sum + r.overallRating, 0) / studentReviews.length;
        const newBadges = Array.from(new Set([...s.badges, ...reviewData.badgesAwarded]));
        return {
          ...s,
          rating: Number(avg.toFixed(2)),
          reviewCount: studentReviews.length,
          badges: newBadges,
        };
      }
      return s;
    }));

    notify('Review submitted successfully! Reputation scores updated.', 'success');
  };

  // Reset to initial demo data
  const resetDemoData = () => {
    setAllStudents(INITIAL_STUDENTS);
    setSwapRequests(INITIAL_SWAP_REQUESTS);
    setReviews(INITIAL_REVIEWS);
    setCurrentStudentId('student-alex');
    setCurrentStep(1);
    localStorage.clear();
    notify('Reset to default campus demo state.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        goToStep,
        nextStep,
        prevStep,
        currentStudent,
        setCurrentStudent,
        allStudents,
        switchStudentAccount,
        registerOrUpdateStudent,
        addOfferedSkill,
        updateOfferedSkill,
        removeOfferedSkill,
        toggleOfferedSkillActive,
        addWantedSkill,
        updateWantedSkill,
        removeWantedSkill,
        targetSwapStudent,
        setTargetSwapStudent,
        getMatchesForCurrentStudent,
        swapRequests,
        sendSwapProposal,
        acceptSwapRequest,
        declineSwapRequest,
        cancelSwapRequest,
        logSwapSession,
        completeSwapRequest,
        reviews,
        submitReview,
        toasts,
        dismissToast,
        notify,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
