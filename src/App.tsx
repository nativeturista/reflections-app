import { useState, useEffect, useRef } from 'react';

export default function App() {
  const [stage, setStage] = useState('welcome');
  const [step, setStep] = useState(0);
  const [intake, setIntake] = useState({
    birthYear: '',
    signFeel: '',
    familyRole: { first: '', second: '' },
    hardest: { first: '', second: '' },
    turnTo: { first: '', second: '' },
    disconnect: { first: '', second: '' },
    connect: { first: '', second: '' },
    wound: ''
  });
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [left, setLeft] = useState(2);
  const [reflecting, setReflecting] = useState(false);
  const [firstReflectionGiven, setFirstReflectionGiven] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const questions = [
    {
      text: "Before we begin, let's create a small mirror of you. What year were you born?",
      field: 'birthYear',
      type: 'text',
      subtitle: "Each generation holds unique lessons. Knowing your moment of arrival helps me speak in your language."
    },
    {
      text: "Do you feel your birth season or sign shapes who you are?",
      field: 'signFeel',
      type: 'single',
      options: ['Yes, very much', 'A little', 'Not at all']
    },
    {
      text: "Often our first mirror is our family. Which role felt most like you?",
      field: 'familyRole',
      type: 'ranked',
      subtitle: "Choose your strongest resonance first, then a second if you feel pulled.",
      options: [
        'The Caretaker (kept things together)',
        'The Rebel (pushed against the current)',
        'The Achiever (proved myself)',
        'The Invisible One (stayed small, unseen)',
        'Something else entirely'
      ]
    },
    {
      text: "What was the hardest relationship dynamic for you?",
      field: 'hardest',
      type: 'ranked',
      options: [
        'Parent/child',
        'Romantic partnerships',
        'Friendships',
        'Work or authority',
        'Myself'
      ]
    },
    {
      text: "When life feels heavy, where do you usually turn?",
      field: 'turnTo',
      type: 'ranked',
      options: [
        'Food or comfort',
        'People I trust',
        'Work or projects',
        'Spiritual practice',
        'Numbing or distraction'
      ]
    },
    {
      text: "I feel most disconnected from myself when...",
      field: 'disconnect',
      type: 'ranked',
      options: [
        "I'm overwhelmed",
        "I'm criticized",
        "I'm alone",
        "I'm ignored",
        "I'm in conflict"
      ]
    },
    {
      text: "I feel most like myself when...",
      field: 'connect',
      type: 'ranked',
      options: [
        "I'm creating",
        "I'm helping others",
        "I'm resting",
        "I'm learning",
        "I'm in nature"
      ]
    },
    {
      text: "Every generation carries a shared wound. What feels like yours?",
      field: 'wound',
      type: 'text',
      subtitle: "There's no wrong answer — only what feels true for you."
    }
  ];

  const getFirstReflection = () => {
    const role = intake.familyRole.first;
    const disconnect = intake.disconnect.first;
    
    let reflection = "You already know this: ";
    
    if (role.includes('Caretaker')) {
      reflection += "You've spent so much energy holding space for others that you forgot you needed holding too. ";
    } else if (role.includes('Rebel')) {
      reflection += "Pushing against the current taught you your own strength, but sometimes rebellion becomes its own cage. ";
    } else if (role.includes('Achiever')) {
      reflection += "Proving yourself became a language, but worthiness was never something you needed to earn. ";
    } else if (role.includes('Invisible')) {
      reflection += "Being unseen felt safer than being misunderstood, didn't it? But you were never truly invisible. ";
    }
    
    if (disconnect.includes('overwhelmed')) {
      reflection += "When everything feels like too much, that's often when clarity is trying to break through. What if the overwhelm is just the sound of your truth getting louder?";
    } else if (disconnect.includes('criticized')) {
      reflection += "Criticism stings most when it echoes something we're already afraid might be true. But what if that fear is just old protection that doesn't serve you anymore?";
    } else if (disconnect.includes('alone')) {
      reflection += "Aloneness and loneliness aren't the same thing. One is solitude, the other is separation from self. Which one are you really feeling?";
    } else if (disconnect.includes('ignored')) {
      reflection += "Being unseen hurts because you know your presence matters. What would it mean to see yourself first, before waiting for others to notice?";
    }
    
    return reflection;
  };

  const getReflection = (msg: string) => {
    const lower = msg.toLowerCase();
    
    // Varied responses that ask questions back
    const responses = [
      {
        triggers: ['stuck', 'trapped', 'can\'t move'],
        reflection: "You already know this: being stuck isn't the opposite of moving forward — it's the pause before the leap. What's one small thing that feels true right now, even in the stillness?"
      },
      {
        triggers: ['lonely', 'alone', 'isolated'],
        reflection: "Loneliness often arrives when we've drifted from ourselves, not others. When you're alone, who are you missing most — someone else, or a part of you?"
      },
      {
        triggers: ['scared', 'afraid', 'fear'],
        reflection: "Fear is just energy waiting to be understood. What if instead of pushing it away, you asked it: 'What are you trying to protect me from?' Listen. You might be surprised by the answer."
      },
      {
        triggers: ['confused', 'don\'t know', 'unclear'],
        reflection: "Confusion isn't absence of knowing — it's the presence of too many voices. If you could hear just one voice clearly right now, whose would you want it to be?"
      },
      {
        triggers: ['tired', 'exhausted', 'drained'],
        reflection: "Exhaustion is sometimes the body's way of saying 'stop performing.' What would rest look like if it didn't require you to deserve it first?"
      },
      {
        triggers: ['angry', 'frustrated', 'mad'],
        reflection: "Anger is energy that hasn't found its voice yet. What's underneath the frustration? What boundary wants to be spoken?"
      },
      {
        triggers: ['sad', 'depressed', 'down'],
        reflection: "Sadness isn't weakness — it's tenderness looking for permission to be felt. What part of you needs to be held right now without judgment?"
      },
      {
        triggers: ['anxious', 'worried', 'stress'],
        reflection: "Anxiety lives in the future, trying to control what hasn't happened yet. What's here, right now in this moment, that's actually okay?"
      },
      {
        triggers: ['lost', 'direction', 'path'],
        reflection: "Being lost assumes there's a 'right' place you should be. But what if you're exactly where you need to be to find what's next? What does your body know that your mind is trying to figure out?"
      },
      {
        triggers: ['relationship', 'partner', 'love'],
        reflection: "The relationship you have with others mirrors the one you have with yourself. What pattern keeps showing up? What's it trying to teach you about your own needs?"
      },
      {
        triggers: ['work', 'job', 'career'],
        reflection: "Work that drains you is asking you to remember what lights you up. If money wasn't a factor, what would you be doing differently?"
      },
      {
        triggers: ['change', 'transform', 'different'],
        reflection: "Change feels scary because it requires us to let go of what's familiar, even when it no longer serves. What are you holding onto that's ready to be released?"
      }
    ];
    
    for (const response of responses) {
      if (response.triggers.some(trigger => lower.includes(trigger))) {
        return response.reflection;
      }
    }
    
    // Default reflective responses
    const defaults = [
      "That sounds like it's weighing on you. If your higher self could whisper one truth about this right now, what would it be?",
      "You already know this: the answer isn't outside you. What does the quietest part of you want to say about this?",
      "I'm hearing what you're saying... and I'm curious. What would change if you gave yourself full permission to feel this without fixing it?",
      "That's real. And sometimes the most powerful thing we can do is just witness what's true. What needs to be seen here that hasn't been yet?",
      "Notice what's present. Not what should be, but what actually is. What are you noticing in your body as you think about this?"
    ];
    
    return defaults[Math.floor(Math.random() * defaults.length)];
  };

  const reflect = async (msg: string) => {
    const resp = getReflection(msg);
    setMessages(prev => [...prev, { role: 'assistant', content: resp }]);
  };

  const renderQuestion = () => {
    const q = questions[step];
    
    if (q.type === 'text') {
      return (
        <div>
          <input
            type="text"
            value={intake[q.field as keyof typeof intake] as string}
            onChange={(e) => setIntake({...intake, [q.field]: e.target.value})}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && intake[q.field as keyof typeof intake]) {
                if (step < questions.length - 1) {
                  setStep(step + 1);
                } else {
                  setStage('reflect');
                  setFirstReflectionGiven(false);
                }
              }
            }}
            placeholder="Type your response..."
            style={{
              width: '100%',
              padding: '16px 20px',
              fontSize: '16px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '2px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              color: '#e8e8e8',
              marginBottom: '20px',
              transition: 'all 0.3s ease',
              outline: 'none',
              textAlign: 'center'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#3FB68B';
              e.target.style.background = 'rgba(255, 255, 255, 0.08)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.target.style.background = 'rgba(255, 255, 255, 0.05)';
            }}
          />
        </div>
      );
    }
    
    if (q.type === 'single') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {q.options?.map((option, i) => (
            <button
              key={i}
              onClick={() => {
                setIntake({...intake, [q.field]: option});
                setTimeout(() => {
                  if (step < questions.length - 1) {
                    setStep(step + 1);
                  } else {
                    setStage('reflect');
                    setFirstReflectionGiven(false);
                  }
                }, 300);
              }}
              style={{
                padding: '16px 24px',
                fontSize: '15px',
                background: intake[q.field as keyof typeof intake] === option 
                  ? 'linear-gradient(135deg, #3FB68B 0%, #3FB68B 100%)'
                  : 'rgba(255, 255, 255, 0.05)',
                border: '2px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                color: '#e8e8e8',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'center'
              }}
              onMouseOver={(e) => {
                if (intake[q.field as keyof typeof intake] !== option) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                }
              }}
              onMouseOut={(e) => {
                if (intake[q.field as keyof typeof intake] !== option) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                }
              }}
            >
              {option}
            </button>
          ))}
        </div>
      );
    }
    
    if (q.type === 'ranked') {
      const currentValue = intake[q.field as keyof typeof intake] as { first: string; second: string };
      
      return (
        <div>
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '14px', color: '#9999b3', marginBottom: '12px', textAlign: 'center' }}>
              Choose your first resonance:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {q.options?.map((option, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setIntake({
                      ...intake, 
                      [q.field]: { 
                        ...currentValue, 
                        first: option,
                        second: currentValue.second === option ? '' : currentValue.second
                      }
                    });
                  }}
                  disabled={currentValue.second === option}
                  style={{
                    padding: '14px 20px',
                    fontSize: '15px',
                    background: currentValue.first === option
                      ? 'linear-gradient(135deg, #3FB68B 0%, #3FB68B 100%)'
                      : currentValue.second === option
                      ? 'rgba(255, 255, 255, 0.03)'
                      : 'rgba(255, 255, 255, 0.05)',
                    border: currentValue.first === option
                      ? '2px solid #3FB68B'
                      : '2px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                    color: currentValue.second === option ? '#666680' : '#e8e8e8',
                    cursor: currentValue.second === option ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    textAlign: 'left',
                    position: 'relative'
                  }}
                >
                  {currentValue.first === option && (
                    <span style={{
                      position: 'absolute',
                      right: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: 'rgba(255, 255, 255, 0.9)'
                    }}>
                      1st
                    </span>
                  )}
                  {option}
                </button>
              ))}
            </div>
          </div>
          
          {currentValue.first && (
            <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <div style={{ fontSize: '13px', color: '#7777a1', marginBottom: '12px', textAlign: 'center', fontStyle: 'italic' }}>
                If a second choice calls to you, you may choose it (optional):
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {q.options?.filter(opt => opt !== currentValue.first).map((option, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setIntake({
                        ...intake, 
                        [q.field]: { 
                          ...currentValue, 
                          second: currentValue.second === option ? '' : option
                        }
                      });
                    }}
                    style={{
                      padding: '12px 16px',
                      fontSize: '14px',
                      background: currentValue.second === option
                        ? 'rgba(63, 182, 139, 0.2)'
                        : 'rgba(255, 255, 255, 0.03)',
                      border: currentValue.second === option
                        ? '1px solid rgba(63, 182, 139, 0.5)'
                        : '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '8px',
                      color: '#b8b8d1',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      textAlign: 'left',
                      position: 'relative'
                    }}
                  >
                    {currentValue.second === option && (
                      <span style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        fontSize: '11px',
                        fontWeight: '600',
                        color: 'rgba(63, 182, 139, 0.9)'
                      }}>
                        2nd
                      </span>
                    )}
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <button
            onClick={() => {
              if (step < questions.length - 1) {
                setStep(step + 1);
              } else {
                setStage('reflect');
                setFirstReflectionGiven(false);
              }
            }}
            disabled={!currentValue.first}
            style={{
              width: '100%',
              marginTop: '32px',
              background: currentValue.first
                ? 'linear-gradient(135deg, #3FB68B 0%, #3FB68B 100%)'
                : 'rgba(255, 255, 255, 0.1)',
              color: currentValue.first ? '#0D1B2A' : '#666680',
              border: 'none',
              padding: '16px 40px',
              fontSize: '16px',
              fontWeight: '600',
              borderRadius: '12px',
              cursor: currentValue.first ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s ease',
              opacity: currentValue.first ? 1 : 0.5
            }}
          >
            {step < questions.length - 1 ? 'Continue' : 'Begin Your Reflections'}
          </button>
        </div>
      );
    }
  };

  useEffect(() => {
    if (stage === 'reflect' && !firstReflectionGiven) {
      setFirstReflectionGiven(true);
      setTimeout(() => {
        const firstMsg = getFirstReflection();
        setMessages([{ role: 'assistant', content: firstMsg }]);
      }, 800);
    }
  }, [stage, firstReflectionGiven]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0D1B2A 0%, #1a1a2e 100%)',
      color: '#F5F2EB',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      
      {stage === 'welcome' && (
        <div style={{
          maxWidth: '600px',
          width: '100%',
          textAlign: 'center',
          padding: '40px 20px'
        }}>
          <h1 style={{
            fontSize: '52px',
            fontWeight: '700',
            marginBottom: '20px',
            background: 'linear-gradient(135deg, #3FB68B 0%, #F6C90E 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-1px'
          }}>
            Reflections
          </h1>
          <p style={{
            fontSize: '20px',
            lineHeight: '1.6',
            marginBottom: '30px',
            color: '#b8b8d1',
            fontWeight: '400'
          }}>
            A mirror for the soul
          </p>
          <p style={{
            fontSize: '17px',
            lineHeight: '1.8',
            marginBottom: '40px',
            color: '#9999b3',
            maxWidth: '500px',
            margin: '0 auto 40px'
          }}>
            Not a guru, not a therapist, but a permission slip to access the answers already within.
          </p>
          <button
            onClick={() => setStage('intake')}
            style={{
              background: 'linear-gradient(135deg, #3FB68B 0%, #3FB68B 100%)',
              color: '#0D1B2A',
              border: 'none',
              padding: '18px 52px',
              fontSize: '18px',
              fontWeight: '600',
              borderRadius: '12px',
              cursor: 'pointer',
              boxShadow: '0 8px 20px rgba(63, 182, 139, 0.3)',
              transition: 'all 0.3s ease',
              letterSpacing: '0.5px'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 28px rgba(63, 182, 139, 0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(63, 182, 139, 0.3)';
            }}
          >
            Begin Your Practice
          </button>
          <p style={{
            marginTop: '30px',
            fontSize: '14px',
            color: '#7777a1',
            fontStyle: 'italic'
          }}>
            Free • 2 reflections
          </p>
        </div>
      )}

      {stage === 'intake' && (
        <div style={{
          maxWidth: '600px',
          width: '100%',
          padding: '40px 20px',
          textAlign: 'center'
        }}>
          <div style={{
            marginBottom: '30px',
            minHeight: '80px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            <div style={{
              fontSize: '18px',
              lineHeight: '1.7',
              color: '#F5F2EB',
              fontWeight: '500'
            }}>
              {questions[step].text}
            </div>
            {questions[step].subtitle && (
              <div style={{
                fontSize: '14px',
                lineHeight: '1.6',
                color: '#9999b3',
                fontStyle: 'italic',
                maxWidth: '500px'
              }}>
                {questions[step].subtitle}
              </div>
            )}
          </div>
          
          {renderQuestion()}
          
          {questions[step].type !== 'ranked' && (
            <button
              onClick={() => {
                const currentField = questions[step].field;
                const hasValue = questions[step].type === 'text' 
                  ? intake[currentField as keyof typeof intake]
                  : true;
                  
                if (hasValue) {
                  if (step < questions.length - 1) {
                    setStep(step + 1);
                  } else {
                    setStage('reflect');
                    setFirstReflectionGiven(false);
                  }
                }
              }}
              disabled={questions[step].type === 'text' && !intake[questions[step].field as keyof typeof intake]}
              style={{
                marginTop: '20px',
                background: (questions[step].type === 'text' && intake[questions[step].field as keyof typeof intake]) || questions[step].type !== 'text'
                  ? 'linear-gradient(135deg, #3FB68B 0%, #3FB68B 100%)'
                  : 'rgba(255, 255, 255, 0.1)',
                color: '#0D1B2A',
                border: 'none',
                padding: '14px 40px',
                fontSize: '16px',
                fontWeight: '600',
                borderRadius: '10px',
                cursor: (questions[step].type === 'text' && intake[questions[step].field as keyof typeof intake]) || questions[step].type !== 'text' ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s ease',
                opacity: (questions[step].type === 'text' && intake[questions[step].field as keyof typeof intake]) || questions[step].type !== 'text' ? 1 : 0.5,
                display: questions[step].type === 'text' ? 'inline-block' : 'none'
              }}
            >
              {step < questions.length - 1 ? 'Continue' : 'Begin Your Reflections'}
            </button>
          )}
          
          <div style={{
            marginTop: '30px',
            fontSize: '13px',
            color: '#7777a1'
          }}>
            Question {step + 1} of {questions.length}
          </div>
        </div>
      )}

      {stage === 'reflect' && (
        <div style={{
          maxWidth: '700px',
          width: '100%',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          height: '90vh'
        }}>
          <div style={{
            textAlign: 'center',
            padding: '20px 0',
            borderBottom: '1px solid rgba(245, 242, 235, 0.1)'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '600',
              marginBottom: '8px',
              color: '#F5F2EB'
            }}>
              Your Reflection Space
            </h2>
            <p style={{
              fontSize: '14px',
              color: '#7777a1'
            }}>
              {left} reflection{left !== 1 ? 's' : ''} remaining
            </p>
          </div>

          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px 0',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  padding: '18px 22px',
                  borderRadius: '14px',
                  background: m.role === 'user' 
                    ? 'linear-gradient(135deg, #3FB68B 0%, #3FB68B 100%)'
                    : 'rgba(245, 242, 235, 0.05)',
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  lineHeight: '1.7',
                  fontSize: '15px',
                  color: m.role === 'user' ? '#0D1B2A' : '#F5F2EB',
                  boxShadow: m.role === 'user' 
                    ? '0 4px 12px rgba(63, 182, 139, 0.3)'
                    : 'none',
                  border: m.role === 'assistant' ? '1px solid rgba(245, 242, 235, 0.08)' : 'none'
                }}
              >
                {m.content}
              </div>
            ))}
            {reflecting && (
              <div style={{
                padding: '18px 22px',
                borderRadius: '14px',
                background: 'rgba(245, 242, 235, 0.05)',
                alignSelf: 'flex-start',
                maxWidth: '85%',
                border: '1px solid rgba(245, 242, 235, 0.08)',
                color: '#b8b8d1'
              }}>
                Reflecting...
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div style={{
            padding: '20px 0',
            borderTop: '1px solid rgba(245, 242, 235, 0.1)'
          }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && input.trim() && left > 0) {
                    setMessages(prev => [...prev, { role: 'user', content: input }]);
                    setReflecting(true);
                    const userMsg = input;
                    setInput('');
                    setTimeout(() => {
                      reflect(userMsg);
                      setReflecting(false);
                      setLeft(left - 1);
                    }, 1500);
                  }
                }}
                placeholder={left > 0 ? "What's present for you?" : "No reflections remaining"}
                disabled={left === 0}
                style={{
                  flex: 1,
                  padding: '15px 20px',
                  fontSize: '15px',
                  background: 'rgba(245, 242, 235, 0.05)',
                  border: '2px solid rgba(245, 242, 235, 0.1)',
                  borderRadius: '12px',
                  color: '#F5F2EB',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3FB68B';
                  e.target.style.background = 'rgba(245, 242, 235, 0.08)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(245, 242, 235, 0.1)';
                  e.target.style.background = 'rgba(245, 242, 235, 0.05)';
                }}
              />
              <button
                onClick={() => {
                  if (input.trim() && left > 0) {
                    setMessages(prev => [...prev, { role: 'user', content: input }]);
                    setReflecting(true);
                    const userMsg = input;
                    setInput('');
                    setTimeout(() => {
                      reflect(userMsg);
                      setReflecting(false);
                      setLeft(left - 1);
                    }, 1500);
                  }
                }}
                disabled={!input.trim() || left === 0}
                style={{
                  background: input.trim() && left > 0
                    ? 'linear-gradient(135deg, #3FB68B 0%, #3FB68B 100%)'
                    : 'rgba(245, 242, 235, 0.1)',
                  color: input.trim() && left > 0 ? '#0D1B2A' : '#666680',
                  border: 'none',
                  padding: '15px 32px',
                  fontSize: '15px',
                  fontWeight: '600',
                  borderRadius: '12px',
                  cursor: input.trim() && left > 0 ? 'pointer' : 'not-allowed',
                  transition: 'all 0.3s ease',
                  opacity: input.trim() && left > 0 ? 1 : 0.5
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}