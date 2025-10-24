import React, { useState, useEffect, useRef } from 'react';

export default function App() {
  const [stage, setStage] = useState('welcome');
  const [step, setStep] = useState(0);
  const [intake, setIntake] = useState({
    birthYear: '', signFeel: '', familyRole: '', familyRole2: '',
    hardest: '', hardest2: '', disconnect: '', disconnect2: '',
    connect: '', connect2: '', wound: '', wound2: '', whisper: ''
  });
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [reflecting, setReflecting] = useState(false);
  const [used, setUsed] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const questions = [
    { text: "Hello. It's me… the part of you that already knows.\n\nWhen did you arrive in this life? What year were you born?", field: 'birthYear', type: 'text', ph: 'e.g., 1995' },
    { text: "Do you feel your birth season or sign shapes you?", field: 'signFeel', type: 'choice', opts: ['Yes, very much', 'A little', 'Not at all'] },
    { text: "In your family, you were often seen as…", field: 'familyRole', field2: 'familyRole2', type: 'ranked', opts: ['The Caretaker', 'The Rebel', 'The Achiever', 'The Invisible one', 'Something else'] },
    { text: "The hardest relationship dynamic for you has been with…", field: 'hardest', field2: 'hardest2', type: 'ranked', opts: ['Parent/child', 'Romantic partner', 'Friendships', 'Work/authority', 'Myself'] },
    { text: "I feel most disconnected from myself when…", field: 'disconnect', field2: 'disconnect2', type: 'ranked', opts: ["I'm overwhelmed", "I'm criticized", "I'm alone", "I'm ignored"] },
    { text: "I feel most like myself when…", field: 'connect', field2: 'connect2', type: 'ranked', opts: ["I'm creating", "I'm helping", "I'm resting", "I'm learning"] },
    { text: "Every generation carries a shared challenge. For you, it feels most like…", field: 'wound', field2: 'wound2', type: 'ranked', opts: ['Loneliness', 'Anxiety / overstimulation', 'Purpose / meaning', 'Money / survival', 'Trust in the future'] },
    { text: "If you could whisper one reminder to everyone in your generation, what would it be?", field: 'whisper', type: 'text', ph: 'Optional...' }
  ];

  const reflect = (msg: string) => {
    const m = msg.toLowerCase();
    if (m.includes('stuck')) return "Being stuck is only the pause between breaths. Stillness isn't failure — it's how clarity returns.";
    if (m.includes('lonely')) return "Loneliness isn't the absence of people. It's forgetting how to be with yourself. This moment of reaching out? That's you remembering.";
    if (m.includes('lost')) return "The path isn't lost. Sometimes we need to stand still long enough to let our eyes adjust to where we actually are.";
    if (m.includes('fear') || m.includes('afraid')) return "What if fear is just energy waiting for direction? What if it's not warning you away, but preparing you for something real?";
    if (m.includes('tired')) return "Exhaustion is your body's way of saying 'we've been performing instead of being.' Rest isn't weakness. It's remembering.";
    if (m.includes('angry')) return "Anger is just a guard standing in front of something tender. What's it protecting?";
    if (m.includes('anxious')) return "Anxiety is tomorrow's storm in today's sky. But you're only asked to be here, in this breath.";
    return "The answer is already forming inside you. What would the wisest version of you say right now?";
  };

  const next = () => {
    if (step < questions.length - 1) setStep(step + 1);
    else {
      setStage('chat');
      setMessages([{ role: 'reflector', content: "Welcome. This is you, speaking back to you.\n\nThis space is yours. Ask what you need to remember." }]);
    }
  };

  const send = () => {
    if (!input.trim() || reflecting) return;
    if (used) {
      setMessages(prev => [...prev, { role: 'user', content: input }, { role: 'reflector', content: 'Your wisdom runs deeper than one question a day. 🔒 Upgrade to Pro for unlimited reflections.' }]);
      setInput('');
      return;
    }
    const msg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setReflecting(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'reflector', content: reflect(msg) }]);
      setReflecting(false);
      setUsed(true);
    }, 1500);
  };

  const selectRanked = (field: string, field2: string, val: string) => {
    const curr = intake[field as keyof typeof intake];
    const curr2 = intake[field2 as keyof typeof intake];
    if (!curr) setIntake({...intake, [field]: val});
    else if (curr === val) setIntake({...intake, [field]: '', [field2]: ''});
    else if (!curr2) setIntake({...intake, [field2]: val});
    else if (curr2 === val) setIntake({...intake, [field2]: ''});
  };

  if (stage === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0D1B2A] to-[#1B263B] flex items-center justify-center p-6">
        <div className="max-w-2xl w-full text-center space-y-6">
          <div className="text-7xl mb-4">🌙</div>
          <h1 className="text-6xl font-bold text-[#F5F2EB]">Reflections</h1>
          <p className="text-2xl text-[#3FB68B] font-medium">A mirror for the soul</p>
          <p className="text-lg text-[#F5F2EB] opacity-90 max-w-xl mx-auto">Not a guru, not a therapist, but a permission slip to access the answers already within.</p>
          <button onClick={() => setStage('intake')} className="bg-[#3FB68B] text-[#0D1B2A] px-10 py-5 rounded-xl font-semibold text-lg hover:bg-[#35a278] transition-all transform hover:scale-105 shadow-lg mt-6">
            Begin Your Practice
          </button>
          <p className="text-sm text-[#F5F2EB] opacity-60">Free • One reflection to start</p>
        </div>
      </div>
    );
  }

  if (stage === 'intake') {
    const q = questions[step];
    const prog = ((step + 1) / questions.length) * 100;
    const canGo = q.type === 'ranked' ? intake[q.field as keyof typeof intake] : intake[q.field as keyof typeof intake];

    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0D1B2A] to-[#1B263B] flex items-center justify-center p-6">
        <div className="max-w-lg w-full">
          <div className="h-1 bg-[#1B263B] rounded-full mb-6"><div className="h-full bg-[#3FB68B] transition-all" style={{width: `${prog}%`}} /></div>
          <div className="bg-[#1B263B] rounded-2xl p-8 border border-[#3FB68B] border-opacity-20">
            <p className="text-[#F5F2EB] text-lg text-center mb-6 whitespace-pre-line">{q.text}</p>
            <div className="space-y-3">
              {q.type === 'text' ? (
                <input type="text" value={intake[q.field as keyof typeof intake] as string} onChange={(e) => setIntake({...intake, [q.field]: e.target.value})} placeholder={q.ph} className="w-full bg-[#0D1B2A] text-[#F5F2EB] border border-[#3FB68B] border-opacity-30 rounded-lg px-4 py-3 text-center focus:outline-none focus:border-[#3FB68B]" onKeyPress={(e) => e.key === 'Enter' && canGo && next()} />
              ) : q.type === 'ranked' ? (
                <>
                  {q.opts?.map((opt: string, i: number) => {
                    const is1 = intake[q.field as keyof typeof intake] === opt;
                    const is2 = intake[q.field2 as keyof typeof intake] === opt;
                    return (
                      <button key={i} onClick={() => selectRanked(q.field, q.field2!, opt)} className={`w-full px-4 py-3 rounded-lg border transition-all text-center ${is1 ? 'bg-[#3FB68B] border-[#3FB68B] text-[#0D1B2A] font-semibold' : is2 ? 'bg-[#3FB68B] bg-opacity-30 border-[#3FB68B] text-[#F5F2EB]' : 'bg-[#0D1B2A] border-[#3FB68B] border-opacity-30 text-[#F5F2EB] hover:border-[#3FB68B]'}`}>
                        {opt} {is1 && '1st'} {is2 && '2nd'}
                      </button>
                    );
                  })}
                  {intake[q.field as keyof typeof intake] && !intake[q.field2 as keyof typeof intake] && <p className="text-xs text-[#3FB68B] opacity-60 italic text-center mt-2">Optional: Choose 2nd if pulled between two</p>}
                </>
              ) : (
                q.opts?.map((opt: string, i: number) => (
                  <button key={i} onClick={() => { setIntake({...intake, [q.field]: opt}); setTimeout(next, 300); }} className={`w-full px-4 py-3 rounded-lg border transition-all text-center ${intake[q.field as keyof typeof intake] === opt ? 'bg-[#3FB68B] bg-opacity-20 border-[#3FB68B] text-[#F5F2EB]' : 'bg-[#0D1B2A] border-[#3FB68B] border-opacity-30 text-[#F5F2EB] hover:border-[#3FB68B]'}`}>
                    {opt}
                  </button>
                ))
              )}
              {(q.type === 'text' || q.type === 'ranked') && <button onClick={next} disabled={!canGo} className="w-full bg-[#3FB68B] text-[#0D1B2A] py-3 rounded-lg font-medium hover:bg-[#35a278] transition-all disabled:opacity-50 mt-4">{step === questions.length - 1 ? 'Complete' : 'Continue'}</button>}
              {step > 0 && <button onClick={() => setStep(step - 1)} className="w-full text-[#3FB68B] py-2 text-sm hover:opacity-70">Back</button>}
            </div>
            <p className="text-xs text-[#3FB68B] opacity-60 text-center mt-4">{step + 1} of {questions.length}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0D1B2A] to-[#1B263B] flex flex-col">
      <div className="bg-[#1B263B] border-b border-[#3FB68B] border-opacity-20 p-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2"><span className="text-2xl">🌙</span><h1 className="text-xl font-bold text-[#F5F2EB]">Reflections</h1></div>
          <button className="text-[#F6C90E] text-sm font-medium hover:opacity-80">⭐ Pro</button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6 pb-32">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl p-4 ${m.role === 'user' ? 'bg-[#3FB68B] bg-opacity-20 text-[#F5F2EB]' : 'bg-[#1B263B] text-[#F5F2EB] border border-[#3FB68B] border-opacity-20'}`}>
                <p className="whitespace-pre-line">{m.content}</p>
              </div>
            </div>
          ))}
          {reflecting && <div className="flex justify-start"><div className="bg-[#1B263B] rounded-2xl p-4 border border-[#3FB68B] border-opacity-20"><span className="text-[#3FB68B] text-sm animate-pulse">✨ Reflecting...</span></div></div>}
          <div ref={endRef} />
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-[#0D1B2A] border-t border-[#3FB68B] border-opacity-20 p-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex space-x-2">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && send()} placeholder="Ask when you feel the pull..." disabled={used} className="flex-1 bg-[#1B263B] text-[#F5F2EB] border border-[#3FB68B] border-opacity-30 rounded-lg px-4 py-3 focus:outline-none focus:border-[#3FB68B] disabled:opacity-50" />
            <button onClick={send} disabled={!input.trim() || reflecting || used} className="bg-[#3FB68B] text-[#0D1B2A] px-6 py-3 rounded-lg hover:bg-[#35a278] transition-all disabled:opacity-50 font-bold text-xl">→</button>
          </div>
          <div className="flex justify-between mt-2 text-xs">
            <span className="text-[#3FB68B] opacity-60">Pause. Reflect. Return.</span>
            <span className="text-[#F6C90E] opacity-70">{used ? 'Daily used' : '1 free today'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}