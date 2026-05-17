'use client';

import React from 'react';
import { 
  ArrowLeft, Brain, Phone, Mail, Calendar, MapPin, 
  Clock, DollarSign, Target, Sparkles, Building, PlayCircle, FastForward, MoreHorizontal
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function LeadDetailView() {
  const params = useParams();
  
  // Mock data specifically tailored to the user's provided transcript
  const lead = {
    id: params?.id || "call_1779052739265",
    date: "5/15/2026, 5:22:15 AM",
    duration: "14m 23s",
    language: "English",
    temperature: "Warm Lead",
    aiSummary: "The conversation was between an agent and a customer regarding Campus Life events planning. The agent presents a digital escape adventure concept suitable for college orientations. The customer is part of the orientation programming team and expresses interest but notes budget constraints until July. Plans are being made to go over the event details and budget considerations, with follow-up meetings and calls suggested.",
    recommendedEmail: "Hi, here are the details and scheduling options for our digital escape adventure...",
    intelligence: {
      intent: 85,
      conversion: 75,
      requirements: {
        budget: "N/A",
        location: "N/A",
        type: "N/A",
        timeline: "N/A"
      }
    },
    context: "This lead was captured via an AI Phone Agent. Intelligence scores will update automatically once the conversation concludes.",
    transcript: [
      { role: 'Agent', text: "Good morning, Office of Campus Life." },
      { role: 'Customer', text: "Hi, good morning." },
      { role: 'Agent', text: "Good morning. I might as well come with a company call. So we're the ones, you know, we do these custom outdoor, indoor, digital escape adventures with colleges." },
      { role: 'Customer', text: "All right." },
      { role: 'Agent', text: "Did you recall meeting with us before? Did you jump on a call with us or see a demo? Does that sound familiar?" },
      { role: 'Customer', text: "Maybe. Yeah, I know, I'm sure, you know, I'm sure you meet with a lot of people." },
      { role: 'Agent', text: "Yeah, so just a quick refresher. So it's a custom outdoor, indoor, digital escape adventures we do with colleges." },
      { role: 'Customer', text: "Okay." },
      { role: 'Agent', text: "So all students or staff do is download our app and you can play this team-based escape adventure right on campus." },
      { role: 'Customer', text: "Now I think I recall that, yeah. I think I mentioned that that may be ideal for our orientation." },
      { role: 'Agent', text: "Okay. Yeah, yeah, yeah. Okay. I recall that, yes." },
      { role: 'Customer', text: "Oh, you do recall that." },
      { role: 'Agent', text: "Okay, yeah, because it does work well in the orientation space because we, you know, it doesn't take a lot of time to plan. We can customize the program or event so it coincides with your semester. So we've done like custom Halloween, you know, scavenger hunts, you know, welcome weeks, you know, spring days, fall festivals. We can really customize the program to any kind of event." },
      { role: 'Customer', text: "All right." },
      { role: 'Agent', text: "Are you part of the orientation programming?" },
      { role: 'Customer', text: "Yes, we are, yeah." },
      { role: 'Agent', text: "Oh, you are?" },
      { role: 'Customer', text: "Yeah." },
      { role: 'Agent', text: "Okay. And, yeah, because I don't know what the time, was it like timing, budget? Do you remember what was?" },
      { role: 'Customer', text: "It was timing. So, I mean, right now it's a good time to consider it because, I mean, we don't have the budget just yet, but the budget will be allocated somewhere in July." },
      { role: 'Agent', text: "Okay. It's a good time to actually think about what we are planning, you know, for next year." },
      { role: 'Customer', text: "Yeah, because we understand the process as colleges go. So this is why we contact colleges now so they think of us for some fall programming, you know." },
      { role: 'Agent', text: "Right. Because we know you have to plan ahead. And, of course, when is your orientation? Is your orientation, is it like Labor Day, August, October? When is that?" },
      { role: 'Customer', text: "It's in August. They have a calendar with me, but 22nd of August, around there." },
      { role: 'Agent', text: "Okay. Yeah, so, yeah, because we just wanted to, yeah, so that's why we're reaching out just to see if you'd still be open to considering the great game for orientation." },
      { role: 'Customer', text: "Yeah, yeah, yeah. We definitely are. Okay." },
      { role: 'Agent', text: "I'll definitely consider it. Thanks for the call. So I have that in mind." },
      { role: 'Customer', text: "Do you mind sending me an email with more info?" },
      { role: 'Agent', text: "Okay." },
      { role: 'Customer', text: "I do want to pitch this to the rest of the team. We need to start allocating funding for the different things that we want to pay for for orientation." },
      { role: 'Agent', text: "Yeah, you want to start. Yeah, perfect. So, well, this is what we did. Did you see the demo before? Do you remember?" },
      { role: 'Customer', text: "I believe so, yes. I think I remember that, yes." },
      { role: 'Agent', text: "You probably met with our CEO, my colleague. Yeah, so the best thing to do at this stage, because we want to go over the info, like you said, and just kind of brainstorm some ideas for orientation and, of course, talk about cost and things like that." },
      { role: 'Customer', text: "Right." },
      { role: 'Agent', text: "So you're going to be talking budget in July?" },
      { role: 'Customer', text: "Yes." },
      { role: 'Agent', text: "Yes, because we need to – I mean, we're actually going to start planning our orientation next month in April." },
      { role: 'Customer', text: "Just around the corner." },
      { role: 'Agent', text: "So you're going to start talking about planning orientation next month in April?" },
      { role: 'Customer', text: "Yes." },
      { role: 'Agent', text: "Okay. Yeah, exactly. So why don't we do this? Because the best thing to do is – why don't we – do you have some time? Because the best would be if you could do a quick phone call with Alex." },
      { role: 'Customer', text: "Okay." },
      { role: 'Agent', text: "And then he can kind of just go over what we went over last year and just kind of get you ready when you guys start talking about that in April. Would you have some time for a quick phone call, like here at the end of March? Or be a day?" },
      { role: 'Customer', text: "Ideally, I would like to schedule a call with my supervisor. I'll have to ask her. That's the only issue, because I know she's really busy. Because meeting with me wouldn't have much impact. I think the product is good, but I really want to show that to the rest of the team. See where our – budget-wise, where we are, and so how we can incorporate that into our programming." },
      { role: 'Agent', text: "Well, this is what you could do, because it's been a while since we talked. Why don't you do this? Why don't you just do like a – because it would be good to have all the information together when you do talk to your colleague. So it would be definitely worth your while just to – you don't have to see the demo, but just do like a quick 15-minute call with Alex." },
      { role: 'Customer', text: "Okay." },
      { role: 'Agent', text: "And then he can kind of get all your ducks in line with the information about cost and things like that. So then – yeah, it won't take a lot of your time. And then after you talk to him, you guys could set up like a demo with your director." },
      { role: 'Customer', text: "And then that would be the best move." },
      { role: 'Agent', text: "Could he talk to you, I was thinking, on Friday?" },
      { role: 'Customer', text: "Okay. I have a meeting on the 1st, April 1st, so any date afterwards. So April 2nd, April 3rd, Wednesday, Thursday." },
      { role: 'Agent', text: "Yeah, Wednesday. How's Wednesday the 2nd?" },
      { role: 'Customer', text: "Wednesday the 2nd." },
      { role: 'Agent', text: "Okay, that will work. Is this time good, 1145?" },
      { role: 'Customer', text: "Actually, yeah, that will work." },
      { role: 'Agent', text: "That works? Okay. And then – and what was your email again? Because we're going to send you a – Got you. Okay. And then – okay. All right, perfect. So we –" },
      { role: 'Customer', text: "Very good." },
      { role: 'Agent', text: "Okay. All right. We look forward to talking to you then. Have a great rest of your week." },
      { role: 'Customer', text: "You too. Thank you. Bye-bye." },
      { role: 'Agent', text: "Bye-bye." }
    ]
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Navigation */}
      <Link href="/lead-intelligence" className="inline-flex items-center gap-2 text-[13px] font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Lead Intelligence
      </Link>

      {/* Header Metrics */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-[13px] font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-white/10">{lead.date}</span>
        <span className="text-[13px] font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-white/10">{lead.duration}</span>
        <span className="text-[13px] font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-white/10">{lead.language}</span>
        <span className="text-[13px] font-semibold text-purple-600 dark:text-[#DBB7F2] bg-purple-50 dark:bg-[#DBB7F2]/10 px-3 py-1.5 rounded-lg border border-purple-100 dark:border-[#DBB7F2]/20">{lead.temperature}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Transcripts & Summary */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* AI Call Summary */}
          <div className="bg-white dark:bg-[#15121D] rounded-2xl border border-gray-200 dark:border-white/5 p-6 shadow-sm dark:shadow-none relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 dark:bg-[#DBB7F2]/5 rounded-full blur-[60px] pointer-events-none" />
            <div className="flex items-center gap-2 mb-4 relative z-10">
              <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-[#DBB7F2]/10 border border-purple-100 dark:border-[#DBB7F2]/20 flex items-center justify-center">
                <Brain className="w-4 h-4 text-purple-600 dark:text-[#DBB7F2]" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">AI Call Summary</h3>
            </div>
            <p className="text-[14px] leading-relaxed text-gray-600 dark:text-gray-300 relative z-10">
              {lead.aiSummary}
            </p>
          </div>

          {/* Recommended Actions */}
          <div className="bg-white dark:bg-[#15121D] rounded-2xl border border-gray-200 dark:border-white/5 p-6 shadow-sm dark:shadow-none">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-[13px] font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2">Recommended Follow-Up</h3>
                <p className="text-[14px] text-gray-600 dark:text-gray-300 italic">
                  "{lead.recommendedEmail}"
                </p>
              </div>
              <div className="flex-shrink-0 flex items-end">
                <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-[#DBB7F2] to-[#A392FF] text-[#181623] px-5 py-2.5 rounded-lg text-[13px] font-bold shadow-lg shadow-[#A392FF]/20 hover:shadow-[#A392FF]/40 transition-shadow">
                  <Mail className="w-4 h-4" /> Send Email
                </button>
              </div>
            </div>
          </div>

          {/* Transcript */}
          <div className="bg-white dark:bg-[#15121D] rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none overflow-hidden flex flex-col h-[600px]">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between bg-gray-50 dark:bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Live Transcript</h3>
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg text-gray-600 dark:text-gray-400 transition-colors">
                  <PlayCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {lead.transcript.map((msg, i) => (
                <div key={i} className={`flex w-full ${msg.role === 'Agent' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`flex flex-col max-w-[85%] ${msg.role === 'Agent' ? 'items-start' : 'items-end'}`}>
                    <span className="text-[11px] font-semibold text-gray-500 mb-1 px-1">
                      {msg.role}
                    </span>
                    <div className={`p-4 rounded-2xl text-[14px] leading-relaxed ${
                      msg.role === 'Agent' 
                        ? 'bg-purple-50 dark:bg-[#DBB7F2]/10 text-gray-900 dark:text-gray-200 rounded-tl-sm border border-purple-100 dark:border-[#DBB7F2]/10' 
                        : 'bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white rounded-tr-sm border border-gray-200 dark:border-white/5'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Intelligence Sidebar */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#15121D] rounded-2xl border border-gray-200 dark:border-white/5 p-6 shadow-sm dark:shadow-none sticky top-6">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-purple-600 dark:text-[#DBB7F2]" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">AI Intelligence</h3>
            </div>

            <div className="space-y-8">
              {/* Buyer Intent */}
              <div>
                <div className="flex justify-between items-end mb-3">
                  <h4 className="text-[13px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Buyer Intent Score</h4>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">{lead.intelligence.intent}%</span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-[#DBB7F2] to-[#A392FF]" 
                    style={{ width: `${lead.intelligence.intent}%` }}
                  />
                </div>
              </div>

              {/* Conversion Probability */}
              <div>
                <div className="flex justify-between items-end mb-3">
                  <h4 className="text-[13px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Conversion Prob.</h4>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">{lead.intelligence.conversion}%</span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-green-500 dark:bg-green-400" 
                    style={{ width: `${lead.intelligence.conversion}%` }}
                  />
                </div>
              </div>

              <hr className="border-gray-100 dark:border-white/5" />

              {/* Property Requirements */}
              <div>
                <h4 className="text-[13px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Extracted Requirements</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-xl">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-[13px] font-medium">Budget</span>
                    </div>
                    <span className="text-[13px] font-bold text-gray-900 dark:text-white">{lead.intelligence.requirements.budget}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-xl">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <MapPin className="w-4 h-4" />
                      <span className="text-[13px] font-medium">Location</span>
                    </div>
                    <span className="text-[13px] font-bold text-gray-900 dark:text-white">{lead.intelligence.requirements.location}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-xl">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Building className="w-4 h-4" />
                      <span className="text-[13px] font-medium">Type</span>
                    </div>
                    <span className="text-[13px] font-bold text-gray-900 dark:text-white">{lead.intelligence.requirements.type}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-xl">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span className="text-[13px] font-medium">Timeline</span>
                    </div>
                    <span className="text-[13px] font-bold text-gray-900 dark:text-white">{lead.intelligence.requirements.timeline}</span>
                  </div>
                </div>
              </div>

              {/* Live Context Alert */}
              <div className="p-4 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-xl">
                <h4 className="text-[12px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider mb-1">Live Context</h4>
                <p className="text-[13px] text-blue-600 dark:text-blue-300/80 leading-relaxed">
                  {lead.context}
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(150, 150, 150, 0.3);
          border-radius: 6px;
        }
      `}</style>
    </div>
  );
}
