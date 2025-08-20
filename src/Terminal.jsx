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
    }
  };

  return (
    <div className="terminal-container" ref={terminalRef}>
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
          <div className={response.success ? 'success-message' : 'error-message'}>
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
  );
};

export default Terminal;