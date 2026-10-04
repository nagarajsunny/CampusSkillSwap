import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { DeliveryMode, SwapRequest, Student } from '../../types';
import { 
  Send, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Repeat, 
  Calendar, 
  MessageSquare, 
  Sparkles, 
  Compass, 
  UserCheck, 
  Check, 
  PlusCircle, 
  Star,
  MapPin,
  FileText
} from 'lucide-react';

export const Step6SwapRequests: React.FC = () => {
  const { 
    currentStudent, 
    allStudents, 
    swapRequests, 
    targetSwapStudent, 
    setTargetSwapStudent, 
    sendSwapProposal, 
    acceptSwapRequest, 
    declineSwapRequest, 
    cancelSwapRequest, 
    logSwapSession, 
    completeSwapRequest, 
    goToStep 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'create' | 'incoming' | 'outgoing' | 'active' | 'completed'>('create');

  // Proposal Form State
  const [selectedPeerId, setSelectedPeerId] = useState<string>(
    targetSwapStudent ? targetSwapStudent.id : allStudents.find(s => s.id !== currentStudent.id)?.id || ''
  );

  const selectedPeer = allStudents.find(s => s.id === selectedPeerId);

  const [offeredSkill, setOfferedSkill] = useState<string>('');
  const [wantedSkill, setWantedSkill] = useState<string>('');
  const [frequency, setFrequency] = useState<string>('1.5 hours / week');
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>('Online (Video/Chat)');
  const [preferredTime, setPreferredTime] = useState<string>('Weekday evenings after 6 PM');
  const [proposalMessage, setProposalMessage] = useState<string>('');
  const [sessionNoteInput, setSessionNoteInput] = useState<{ [reqId: string]: string }>({});

  // Sync selected peer when targetSwapStudent changes from modal or Step 4/5
  useEffect(() => {
    if (targetSwapStudent) {
      setSelectedPeerId(targetSwapStudent.id);
      setActiveTab('create');
    }
  }, [targetSwapStudent]);

  // Set default skills when selectedPeer changes
  useEffect(() => {
    if (currentStudent.skillsOffered.length > 0) {
      setOfferedSkill(currentStudent.skillsOffered[0].name);
    }
    if (selectedPeer && selectedPeer.skillsOffered.length > 0) {
      setWantedSkill(selectedPeer.skillsOffered[0].name);
    }
  }, [selectedPeerId, currentStudent]);

  const handleSendProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPeerId || !offeredSkill || !wantedSkill) return;

    sendSwapProposal({
      receiverId: selectedPeerId,
      offeredSkillName: offeredSkill,
      wantedSkillName: wantedSkill,
      frequency,
      mode: deliveryMode,
      preferredTime,
      message: proposalMessage.trim() || `Hey ${selectedPeer?.name.split(' ')[0]}! Would love to trade ${offeredSkill} for ${wantedSkill}.`,
    });

    setProposalMessage('');
    setActiveTab('outgoing');
  };

  // Filter requests
  const incomingRequests = swapRequests.filter(r => r.receiverId === currentStudent.id && r.status === 'pending');
  const outgoingRequests = swapRequests.filter(r => r.senderId === currentStudent.id && r.status === 'pending');
  const inProgressSwaps = swapRequests.filter(r => 
    (r.senderId === currentStudent.id || r.receiverId === currentStudent.id) && 
    (r.status === 'accepted' || r.status === 'in_progress')
  );
  const completedSwaps = swapRequests.filter(r => 
    (r.senderId === currentStudent.id || r.receiverId === currentStudent.id) && 
    r.status === 'completed'
  );

  const getStudentById = (id: string): Student | undefined => {
    return allStudents.find(s => s.id === id);
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
            <Send className="w-3.5 h-3.5" />
            <span>Step 6 · Swap Proposals & Active Exchanges</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Send Swap Request & Manage Learning Sessions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Draft reciprocal agreements, accept incoming barter proposals, log weekly sessions, and mark swaps complete.
          </p>
        </div>

        <button
          onClick={() => goToStep(7)}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <span>Rate Swapped Peers (Step 7)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Tabs navigation */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
        <button
          onClick={() => setActiveTab('create')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'create'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Send className="w-3.5 h-3.5 text-indigo-600" />
          <span>New Proposal</span>
        </button>

        <button
          onClick={() => setActiveTab('incoming')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'incoming'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Incoming Requests</span>
          {incomingRequests.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
              {incomingRequests.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('outgoing')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'outgoing'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Outgoing Sent</span>
          {outgoingRequests.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-slate-400 text-white text-[10px] font-bold flex items-center justify-center">
              {outgoingRequests.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('active')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'active'
              ? 'bg-white text-emerald-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Repeat className="w-3.5 h-3.5 text-emerald-600" />
          <span>Active Swaps in Progress ({inProgressSwaps.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('completed')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'completed'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
          <span>Completed ({completedSwaps.length})</span>
        </button>
      </div>

      {/* TAB 1: New Proposal Creator */}
      {activeTab === 'create' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <form onSubmit={handleSendProposal} className="space-y-6">
            
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-slate-900">
                Create Reciprocal Skill Swap Proposal
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                You offer one of your skills in equal barter exchange for one of the peer's skills.
              </p>
            </div>

            {/* Recipient Peer Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Select Peer Student to Swap With *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {allStudents.filter(s => s.id !== currentStudent.id).map(peer => {
                  const isChosen = peer.id === selectedPeerId;
                  return (
                    <div
                      key={peer.id}
                      onClick={() => {
                        setSelectedPeerId(peer.id);
                        setTargetSwapStudent(peer);
                      }}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        isChosen
                          ? 'border-indigo-600 bg-indigo-50/70 ring-1 ring-indigo-600'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={peer.avatar} 
                          alt={peer.name} 
                          className="w-8 h-8 rounded-full object-cover shrink-0" 
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold text-slate-900 truncate">
                            {peer.name}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            {peer.university}
                          </div>
                        </div>
                        {isChosen && <Check className="w-4 h-4 text-indigo-600 shrink-0" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Skill Barter Exchange Selectors */}
            {selectedPeer && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Skill Exchange Agreement Terms
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* You Teach */}
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                    <label className="block text-xs font-semibold text-indigo-700 mb-1 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      I ({currentStudent.name.split(' ')[0]}) Will Teach:
                    </label>
                    {currentStudent.skillsOffered.length === 0 ? (
                      <div className="text-xs text-red-500 py-2">
                        You have not listed any skills yet. Please add a skill in Step 2.
                      </div>
                    ) : (
                      <select
                        value={offeredSkill}
                        onChange={e => setOfferedSkill(e.target.value)}
                        className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
                      >
                        {currentStudent.skillsOffered.map(s => (
                          <option key={s.id} value={s.name}>
                            {s.name} ({s.level})
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  {/* They Teach */}
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                    <label className="block text-xs font-semibold text-emerald-700 mb-1 flex items-center gap-1">
                      <Compass className="w-3.5 h-3.5" />
                      In Return, {selectedPeer.name.split(' ')[0]} Will Teach Me:
                    </label>
                    {selectedPeer.skillsOffered.length === 0 ? (
                      <div className="text-xs text-slate-500 py-2">
                        No skills listed by peer.
                      </div>
                    ) : (
                      <select
                        value={wantedSkill}
                        onChange={e => setWantedSkill(e.target.value)}
                        className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-white"
                      >
                        {selectedPeer.skillsOffered.map(s => (
                          <option key={s.id} value={s.name}>
                            {s.name} ({s.level})
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Logistics & Cadence */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Exchange Cadence
                </label>
                <select
                  value={frequency}
                  onChange={e => setFrequency(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
                >
                  <option value="1 hour / week">1 hour / week (30 min each)</option>
                  <option value="1.5 hours / week">1.5 hours / week (45 min each)</option>
                  <option value="2 hours / week">2 hours / week (60 min each)</option>
                  <option value="Weekend Intensive">Weekend Intensive Workshop</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Delivery Mode
                </label>
                <select
                  value={deliveryMode}
                  onChange={e => setDeliveryMode(e.target.value as DeliveryMode)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
                >
                  <option value="Online (Video/Chat)">Online (Video/Chat)</option>
                  <option value="In-Person (Campus)">In-Person (Campus Library)</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Preferred Day & Time
                </label>
                <input
                  type="text"
                  placeholder="e.g. Tuesday evenings (7 PM EST)"
                  value={preferredTime}
                  onChange={e => setPreferredTime(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            {/* Personalized Proposal Message */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Personalized Note to Peer
              </label>
              <textarea
                rows={3}
                placeholder="Introduce yourself, mention what projects you're working on, and why you'd be a great swap partner!"
                value={proposalMessage}
                onChange={e => setProposalMessage(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Recipient will receive an instant notification in their dashboard.
              </span>

              <button
                type="submit"
                disabled={!selectedPeerId || !offeredSkill || !wantedSkill}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors shadow-xs cursor-pointer disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Swap Proposal</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: Incoming Requests */}
      {activeTab === 'incoming' && (
        <div className="space-y-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Pending Swap Proposals Received ({incomingRequests.length})
          </div>

          {incomingRequests.length === 0 ? (
            <div className="text-center py-14 bg-white rounded-2xl border border-slate-200 p-6">
              <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-800">No incoming proposals right now</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Tip: You can use the profile switcher at top right to log in as Maya or Carlos and send a proposal to Alex!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {incomingRequests.map((req) => {
                const sender = getStudentById(req.senderId);
                if (!sender) return null;

                return (
                  <div key={req.id} className="p-5 rounded-2xl border border-indigo-200 bg-white shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <img 
                          src={sender.avatar} 
                          alt={sender.name} 
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0" 
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-900 text-sm">
                              {sender.name}
                            </h4>
                            <span className="text-[11px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded font-medium">
                              Wants to Swap With You
                            </span>
                          </div>
                          <div className="text-xs text-slate-500">
                            {sender.university} · {sender.major}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => declineSwapRequest(req.id)}
                          className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-red-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => acceptSwapRequest(req.id)}
                          className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer shadow-xs"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Accept & Start Swap</span>
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
                        <div>
                          <span className="text-[11px] font-semibold text-slate-500 uppercase block">They Teach You:</span>
                          <span className="font-bold text-slate-900">{req.offeredSkillName}</span>
                        </div>
                        <div>
                          <span className="text-[11px] font-semibold text-slate-500 uppercase block">You Teach Them:</span>
                          <span className="font-bold text-slate-900">{req.wantedSkillName}</span>
                        </div>
                      </div>
                      <div className="text-slate-600 italic border-t border-slate-200/60 pt-2">
                        "{req.message}"
                      </div>
                      <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-3">
                        <span>Format: {req.frequency}</span>
                        <span>·</span>
                        <span>Mode: {req.mode}</span>
                        <span>·</span>
                        <span>Timing: {req.preferredTime}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Outgoing Requests */}
      {activeTab === 'outgoing' && (
        <div className="space-y-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Swap Proposals Sent by You ({outgoingRequests.length})
          </div>

          {outgoingRequests.length === 0 ? (
            <div className="text-center py-14 bg-white rounded-2xl border border-slate-200 p-6">
              <Send className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-800">No outgoing proposals waiting</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-3">
                Send a swap proposal to any classmate to get the barter started!
              </p>
              <button
                onClick={() => setActiveTab('create')}
                className="text-xs font-semibold px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer shadow-xs"
              >
                Draft Proposal
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {outgoingRequests.map((req) => {
                const receiver = getStudentById(req.receiverId);
                if (!receiver) return null;

                return (
                  <div key={req.id} className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <img 
                          src={receiver.avatar} 
                          alt={receiver.name} 
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0" 
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-900 text-sm">
                              Proposal to {receiver.name}
                            </h4>
                            <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                              Awaiting Response
                            </span>
                          </div>
                          <div className="text-xs text-slate-500">
                            {receiver.university} · {receiver.major}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => cancelSwapRequest(req.id)}
                        className="text-xs text-slate-400 hover:text-red-600 cursor-pointer"
                      >
                        Cancel Request
                      </button>
                    </div>

                    <div className="mt-3.5 p-3 rounded-xl bg-slate-50 text-xs space-y-1.5">
                      <div className="flex items-center justify-between text-slate-700">
                        <span>You offered to teach: <strong>{req.offeredSkillName}</strong></span>
                        <span>In exchange for: <strong>{req.wantedSkillName}</strong></span>
                      </div>
                      <div className="text-slate-500 italic">
                        "{req.message}"
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: Active Swaps in Progress */}
      {activeTab === 'active' && (
        <div className="space-y-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Active Skill Swaps in Progress ({inProgressSwaps.length})
          </div>

          {inProgressSwaps.length === 0 ? (
            <div className="text-center py-14 bg-white rounded-2xl border border-slate-200 p-6">
              <Repeat className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-800">No active swaps currently</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-3">
                Accept an incoming request or propose a swap to start learning sessions.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {inProgressSwaps.map((req) => {
                const partnerId = req.senderId === currentStudent.id ? req.receiverId : req.senderId;
                const partner = getStudentById(partnerId);
                if (!partner) return null;

                const myRoleTeaches = req.senderId === currentStudent.id ? req.offeredSkillName : req.wantedSkillName;
                const partnerTeaches = req.senderId === currentStudent.id ? req.wantedSkillName : req.offeredSkillName;
                const progressRatio = Math.round((req.completedSessions / req.totalPlannedSessions) * 100);

                return (
                  <div key={req.id} className="p-6 rounded-2xl border-2 border-emerald-200 bg-white shadow-xs space-y-4">
                    
                    {/* Active Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <img 
                          src={partner.avatar} 
                          alt={partner.name} 
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0" 
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-900 text-base">
                              Swap with {partner.name}
                            </h4>
                            <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                              ● In Progress
                            </span>
                          </div>
                          <div className="text-xs text-slate-500">
                            {partner.university} · {req.mode} · {req.frequency}
                          </div>
                        </div>
                      </div>

                      {/* Complete Swap Action */}
                      <button
                        onClick={() => completeSwapRequest(req.id)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl transition-colors cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Finish & Mark Complete</span>
                      </button>
                    </div>

                    {/* Bilateral Skill Exchange Banner */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100">
                        <div className="text-[11px] font-semibold text-indigo-700 uppercase tracking-wider mb-0.5">
                          You Are Teaching:
                        </div>
                        <div className="text-sm font-bold text-slate-900">{myRoleTeaches}</div>
                      </div>

                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                        <div className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider mb-0.5">
                          {partner.name.split(' ')[0]} Is Teaching You:
                        </div>
                        <div className="text-sm font-bold text-slate-900">{partnerTeaches}</div>
                      </div>
                    </div>

                    {/* Session Progress Tracker */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-700">
                          Session Milestone: <strong className="text-slate-900 tabular-nums">{req.completedSessions} of {req.totalPlannedSessions}</strong> sessions completed
                        </span>
                        <span className="text-slate-500 font-medium tabular-nums">{progressRatio}%</span>
                      </div>

                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                          style={{ width: `${progressRatio}%` }}
                        />
                      </div>

                      {/* Log Session Action */}
                      <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <input
                          type="text"
                          placeholder="Session takeaway or next week agenda notes..."
                          value={sessionNoteInput[req.id] || ''}
                          onChange={e => setSessionNoteInput({ ...sessionNoteInput, [req.id]: e.target.value })}
                          className="flex-1 text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-white"
                        />
                        <button
                          onClick={() => {
                            logSwapSession(req.id, sessionNoteInput[req.id]);
                            setSessionNoteInput({ ...sessionNoteInput, [req.id]: '' });
                          }}
                          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shrink-0"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>+ Log Session #{req.completedSessions + 1}</span>
                        </button>
                      </div>

                      {/* Session Notes History */}
                      {req.sessionNotes && req.sessionNotes.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-200 space-y-1.5 text-xs text-slate-600">
                          <span className="font-semibold text-slate-700 block text-[11px] uppercase tracking-wider">
                            Session Journal:
                          </span>
                          {req.sessionNotes.map((note, nIdx) => (
                            <div key={nIdx} className="flex items-start gap-2 bg-white p-2 rounded-lg border border-slate-100">
                              <FileText className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                              <span>{note}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: Completed Swaps */}
      {activeTab === 'completed' && (
        <div className="space-y-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Finished Skill Exchanges ({completedSwaps.length})
          </div>

          {completedSwaps.length === 0 ? (
            <div className="text-center py-14 bg-white rounded-2xl border border-slate-200 p-6">
              <CheckCircle2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-800">No completed swaps in history yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Once an active swap finishes all planned sessions, it will appear here for peer rating and feedback!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {completedSwaps.map((req) => {
                const partnerId = req.senderId === currentStudent.id ? req.receiverId : req.senderId;
                const partner = getStudentById(partnerId);
                if (!partner) return null;

                return (
                  <div key={req.id} className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={partner.avatar} 
                          alt={partner.name} 
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0" 
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">
                            Finished Swap with {partner.name}
                          </h4>
                          <div className="text-xs text-slate-500">
                            Exchanged: {req.offeredSkillName} ⇄ {req.wantedSkillName}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => goToStep(7)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer shadow-xs"
                      >
                        <Star className="w-3.5 h-3.5" />
                        <span>Leave Rating & Review in Step 7</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Step 6 Footer */}
      <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-xs">
        <div>
          <div className="text-xs font-semibold text-indigo-400">Step 6 Ready</div>
          <div className="text-sm font-bold text-white">
            Ready to review peer reputation, ratings & endorsements?
          </div>
        </div>

        <button
          onClick={() => goToStep(7)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs whitespace-nowrap"
        >
          <span>Continue to Step 7: Ratings & Reviews</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
