import { useState, useEffect, useRef } from 'react';

export default function App() {
  const [stage, setStage] = useState('welcome');
  const [msgs, setMsgs] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [left, setLeft] = useState(2);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs]);

  const getResp = (m: string) => {
    if (m.includes('stuck')) return "Being stuck is only the pause between breaths. Stillness isn't failure.";
    if (m.includes('lonely')) return "Loneliness isn't the absence of people. It's forgetting how to be with yourself.";
    return "The answer is already forming inside you. What would your wisest self say?";
  };

  const send = () => {
    if (!input.trim()) return;
    if (left <= 0) {
      setMsgs(p => [...p, { role: 'user', txt: input }, { role: 'bot', txt: '🔒 Upgrade to Pro for unlimited' }]);
      setInput('');
      return;
    }
    setMsgs(p => [...p, { role: 'user', txt: input }]);
    const msg = input;
    setInput('');
    setTimeout(() => {
      setMsgs(p => [...p, { role: 'bot', txt: getResp(msg) }]);
      setLeft(left - 1);
    }, 1000);
  };

  if (stage === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0D1B2A] to-[#1B263B] flex items-center justify-center p-6">
        <div className="max-w-2xl w-full text-center space-y-6">
          <div className="text-7xl">🌙</div>
          <h1 className="text-6xl font-bold text-[#F5F2EB]">Reflections</h1>
          <p className="text-2xl text-[#3FB68B]">A mirror for the soul</p>
          <p className="text-lg text-[#F5F2EB] opacity-90 max-w-xl mx-auto">Not a guru, not a therapist, but a permission slip to access the answers already within.</p>
          <button onClick={() => { setStage('chat'); setMsgs([{ role: 'bot', txt: 'Welcome. This is you, speaking back to you.\n\nAsk what you need to remember.' }]); }} className="bg-[#3FB68B] text-[#0D1B2A] px-10 py-5 rounded-xl font-semibold text-lg hover:bg-[#35a278] transition-all mt-6">Begin</button>
          <p className="text-sm text-[#F5F2EB] opacity-60">Free • 2 reflections</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0D1B2A] to-[#1B263B] flex flex-col">
      <div className="bg-[#1B263B] border-b border-[#3FB68B] border-opacity-20 p-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🌙</span>
            <h1 className="text-xl font-bold text-[#F5F2EB]">Reflections</h1>
          </div>
          <button onClick={() => window.location.reload()} className="text-[#3FB68B] text-sm">Reset</button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6 pb-32">
        <div className="max-w-3xl mx-auto space-y-6">
          {msgs.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl p-5 ${m.role === 'user' ? 'bg-[#3FB68B] bg-opacity-20 text-[#F5F2EB]' : 'bg-[#1B263B] text-[#F5F2EB] border border-[#3FB68B] border-opacity-20'}`}>
                <p className="text-base leading-relaxed whitespace-pre-line">{m.txt}</p>
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-[#0D1B2A] border-t border-[#3FB68B] border-opacity-20 p-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex space-x-2 mb-3">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && send()} placeholder="Ask when you feel the pull..." disabled={left <= 0} className="flex-1 bg-[#1B263B] text-[#F5F2EB] text-lg border border-[#3FB68B] border-opacity-30 rounded-lg px-5 py-4 focus:outline-none focus:border-[#3FB68B] disabled:opacity-50 placeholder-[#3FB68B] placeholder-opacity-40" />
            <button onClick={send} disabled={!input.trim() || left <= 0} className="bg-[#3FB68B] text-[#0D1B2A] px-7 py-4 rounded-lg hover:bg-[#35a278] disabled:opacity-50 font-bold text-2xl">→</button>
          </div>
          <div className="text-center text-sm text-[#F6C90E]">{left} reflections left today</div>
        </div>
      </div>
    </div>
  );
}