import React, { useState, useEffect, useRef } from 'react';

const Terminal = () => {
  const [stage, setStage] = useState('init');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    github: '',
    twitter: '',
    project: '',
    reason: '',
    skills: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [response, setResponse] = useState(null);
  const [typingText, setTypingText] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [matrixRain, setMatrixRain] = useState(false);
  const terminalRef = useRef(null);

  const isMobile = window.innerWidth <= 768;
  
  const bootSequence = isMobile ? [
    'ULTRATHINK ACCESS TERMINAL',
    'MAGIC WORD DETECTED...',
    'THINKING BUDGET: ∞',
    '',
    'WELCOME TO ULTRATHINK',
    'FOR BUILDERS BY BUILDERS',
    '',
    'EXCLUSIVE AI COMMUNITY',
    'ACCESS RESTRICTED',
    ''
  ] : [
    'INITIALIZING ULTRATHINK ACCESS TERMINAL...',
    'SCANNING FOR MAGIC WORDS...',
    '"ULTRATHINK" DETECTED - ENHANCED COGNITION ENABLED',
    'ALLOCATING MAXIMUM THINKING BUDGET...',
    'LOADING QUANTUM ENCRYPTION PROTOCOLS...',
    'ESTABLISHING SECURE CONNECTION...',
    'VERIFYING BUILDER AUTHENTICATION SYSTEM...',
    '',
    'SYSTEM READY.',
    'THINKING MODE: ULTRATHINK',
    '',
    'WELCOME TO ULTRATHINK',
    'FOR BUILDERS BY BUILDERS',
    '',
    'THIS IS AN EXCLUSIVE COMMUNITY OF AI BUILDERS',
    'THOSE WHO KNOW THE MAGIC WORDS',
    'THOSE WHO PUSH THE BOUNDARIES OF THOUGHT',
    '',
    'THE WORD "ULTRATHINK" UNLOCKS DEEPER COMPUTATION',
    'USE IT WISELY.',
    '',
    'ACCESS IS RESTRICTED.',
    'EVALUATION REQUIRED.',
    ''
  ];

  // ASCII art celebration frames
  const celebrationFrames = [
    `
    ╔═══════════════════════════════╗
    ║   APPLICATION ACCEPTED! 🎉    ║
    ╚═══════════════════════════════╝
    `,
    `
    ╔═══════════════════════════════╗
    ║   🌟 WELCOME TO ULTRATHINK 🌟  ║
    ╚═══════════════════════════════╝
    `,
    `
         ██╗   ██╗██╗████████╗██████╗  █████╗ 
         ██║   ██║██║╚══██╔══╝██╔══██╗██╔══██╗
         ██║   ██║██║   ██║   ██████╔╝███████║
         ██║   ██║██║   ██║   ██╔══██╗██╔══██║
         ╚██████╔╝███████╗██║   ██║  ██║██║  ██║
          ╚═════╝ ╚══════╝╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝
                    THINK!
    `
  ];

  useEffect(() => {
    // Console easter egg
    console.log('%c[ULTRATHINK SYSTEM]', 'color: #00ff00; font-size: 20px; font-weight: bold;');
    console.log('%cThose who speak the magic word unlock enhanced cognition.', 'color: #00aa00; font-size: 12px;');
    console.log('%cHint: The word that triggers thinking budget allocation...', 'color: #00aa00; font-size: 10px; font-style: italic;');
    
    let index = 0;
    let currentLine = 0;
    
    const typeWriter = () => {
      if (currentLine < bootSequence.length) {
        const line = bootSequence[currentLine];
        if (index < line.length) {
          setTypingText(prev => prev + line[index]);
          index++;
          setTimeout(typeWriter, isMobile ? 20 : 30);
        } else {
          setTypingText(prev => prev + '\n');
          currentLine++;
          index = 0;
          setTimeout(typeWriter, 100);
        }
      } else {
        setTimeout(() => setShowForm(true), 500);
      }
    };

    typeWriter();
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [typingText, showForm]);

  const triggerCelebration = () => {
    setShowCelebration(true);
    setMatrixRain(true);
    
    // Play celebration animation
    let frameIndex = 0;
    const animateFrames = setInterval(() => {
      if (frameIndex < celebrationFrames.length * 3) {
        const frame = celebrationFrames[frameIndex % celebrationFrames.length];
        document.querySelector('.celebration-overlay').innerText = frame;
        frameIndex++;
      } else {
        clearInterval(animateFrames);
        setTimeout(() => {
          setShowCelebration(false);
          setMatrixRain(false);
        }, 2000);
      }
    }, 500);

    // Add confetti effect
    createConfetti();
  };

  const createConfetti = () => {
    const colors = ['#00ff00', '#00ffff', '#ff00ff', '#ffff00'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.animationDelay = Math.random() * 3 + 's';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      document.body.appendChild(confetti);
      
      setTimeout(() => confetti.remove(), 3000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Check if application contains the magic word
    const hasMagicWord = Object.values(formData).some(value => 
      value.toLowerCase().includes('ultrathink')
    );

    try {
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          magicWordDetected: hasMagicWord
        }),
      });

      const data = await res.json();
      
      // Special response for magic word users
      if (hasMagicWord) {
        data.message = `${data.message}\n\n[SYSTEM] MAGIC WORD DETECTED.\nENHANCED EVALUATION PROTOCOLS INITIATED.\nTHINKING BUDGET: MAXIMUM.`;
      }
      
      setResponse(data);
      setStage('submitted');
      
      // Trigger celebration animation
      if (data.success) {
        triggerCelebration();
      }
    } catch (error) {
      setResponse({
        success: false,
        message: 'CONNECTION FAILED. RETRY LATER.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Easter egg: detect magic word
    if (value.toLowerCase().includes('ultrathink')) {
      console.log('%c[SYSTEM] MAGIC WORD DETECTED: ENHANCED THINKING ACTIVATED', 'color: #00ff00; font-size: 16px; text-shadow: 0 0 10px #00ff00;');
      // Add visual feedback
      e.target.classList.add('magic-word-active');
      setTimeout(() => e.target.classList.remove('magic-word-active'), 1000);
    }
  };

  return (
    <>
      <div className={`terminal-container ${matrixRain ? 'matrix-rain' : ''}`} ref={terminalRef}>
        <div className="terminal-header">
          <h1 className="terminal-title glitch">ULTRATHINK</h1>
          <p className="terminal-subtitle">ACCESS TERMINAL v0.1.0</p>
        </div>

        <div className="terminal-content">
          <pre style={{ color: '#00ff00', whiteSpace: 'pre-wrap' }}>{typingText}</pre>
          
          {showForm && !response && (
            <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
              <div className="terminal-line">
                <span className="prompt">&gt;</span>
                <span>INITIATE APPLICATION SEQUENCE</span>
              </div>

              <div className="form-field">
                <label className="form-label">IDENTIFICATION</label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  placeholder="Full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-field">
                <label className="form-label">COMMUNICATION CHANNEL</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-field">
                <label className="form-label">GITHUB PROFILE</label>
                <input
                  type="text"
                  name="github"
                  className="form-input"
                  placeholder="github.com/username"
                  value={formData.github}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-field">
                <label className="form-label">X/TWITTER HANDLE (OPTIONAL)</label>
                <input
                  type="text"
                  name="twitter"
                  className="form-input"
                  placeholder="@handle"
                  value={formData.twitter}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-field">
                <label className="form-label">CURRENT PROJECT</label>
                <textarea
                  name="project"
                  className="form-input form-textarea"
                  placeholder="Describe your most ambitious AI project..."
                  value={formData.project}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-field">
                <label className="form-label">MOTIVATION VECTOR</label>
                <textarea
                  name="reason"
                  className="form-input form-textarea"
                  placeholder="Why ULTRATHINK? What drives you to build?"
                  value={formData.reason}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-field">
                <label className="form-label">TECHNICAL CAPABILITIES</label>
                <input
                  type="text"
                  name="skills"
                  className="form-input"
                  placeholder="Core skills and technologies"
                  value={formData.skills}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <button 
                type="submit" 
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'TRANSMITTING...' : 'SUBMIT APPLICATION'}
              </button>
            </form>
          )}

          {response && (
            <div className={response.success ? 'success-message celebration-trigger' : 'error-message'}>
              <div className="terminal-line">
                <span className="prompt">&gt;</span>
                <span>TRANSMISSION {response.success ? 'COMPLETE' : 'FAILED'}</span>
              </div>
              <div style={{ marginTop: '10px' }}>
                {response.message}
              </div>
              {response.applicationId && (
                <div style={{ marginTop: '10px', fontSize: '12px', opacity: 0.8 }}>
                  APPLICATION ID: {response.applicationId}
                </div>
              )}
            </div>
          )}

          {isSubmitting && (
            <div className="loading">
              ESTABLISHING SECURE CONNECTION
            </div>
          )}
        </div>
      </div>

      {showCelebration && (
        <div className="celebration-overlay">
          {/* ASCII art will be inserted here */}
        </div>
      )}

      <style jsx>{`
        .celebration-overlay {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: #00ff00;
          font-family: monospace;
          font-size: 14px;
          text-align: center;
          white-space: pre;
          z-index: 9999;
          text-shadow: 0 0 20px #00ff00;
          animation: pulse 0.5s infinite;
        }

        .confetti {
          position: fixed;
          width: 10px;
          height: 10px;
          top: -10px;
          animation: fall 3s linear forwards;
          z-index: 9998;
        }

        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
          }
        }

        .matrix-rain::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            180deg,
            transparent,
            rgba(0, 255, 0, 0.1),
            transparent
          );
          animation: matrix 1s linear infinite;
          pointer-events: none;
          z-index: 1;
        }

        @keyframes matrix {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100%);
          }
        }

        .celebration-trigger {
          animation: celebrationGlow 2s ease-in-out;
        }

        @keyframes celebrationGlow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(0, 255, 0, 0.5);
          }
          25% {
            box-shadow: 0 0 40px rgba(0, 255, 255, 1);
          }
          50% {
            box-shadow: 0 0 40px rgba(255, 0, 255, 1);
          }
          75% {
            box-shadow: 0 0 40px rgba(255, 255, 0, 1);
          }
        }
      `}</style>
    </>
  );
};

export default Terminal;