import { useState, useRef, useEffect } from 'react';
import { FiMessageSquare, FiX, FiSend, FiUser, FiCpu } from 'react-icons/fi';

const PRE_SUGGESTIONS = [
  "What is Tabassum's current role?",
  "Tell me about her AI safety research",
  "Where did she study?",
  "What B2B SaaS platforms has she built?",
  "How can I contact her?",
];

const BOT_KNOWLEDGE = {
  role: "Tabassum Mustafa Authoy is currently the **Business Development Manager** at **SoftifyBD Limited** (promoted in May 2026). In this role, she leads B2B SaaS sales, manages projects (Faith Trip, Ghorer Bazar Bangladesh, ISP Digital, TrackMe, RoadGuard), and builds in-house products as a full-stack developer.",
  research: "Her research concentrates on **AI Safety and LLM Reliability**, specifically: \n1. **Synaptic Replay Networks (SRNs)**: A proposed mammalian sleep-inspired dream-phase replay buffer with a metacognitive risk head to mitigate LLM hallucinations.\n2. **Academic Performance Analysis**: A 5-year mixed-methods study exploring gender and course-type effects using statistical models (LMMs) and ML (XGBoost, SHAP) for IEEE publications.",
  education: "Tabassum is currently pursuing:\n- **M.Sc. in Computer Science & Engineering** at BRAC University (focus: LLM Reliability, 2025-2027).\n- **Executive MBA (MIS)** at University of Dhaka, Faculty of Business Studies (2026-2028).\n\nShe graduated with **B.Sc. in Information Technology (Honours) in Software Engineering** from SEGi University, Malaysia (First Class Honours, CGPA 3.70/4.00, top 20% ranking).",
  experience: "Her professional timeline includes:\n- **SoftifyBD Ltd** (BDM / Full-Stack Developer, Mar 2026 - Present)\n- **TechSolutions Plex / Probashi Polli Group** (Senior Executive - BD & IT, Aug 2025 - Jan 2026) managing Fanam Trip OTA, e-commerce, and digital operations.\n- **NZ World Travels** (Front-End Developer & Senior Executive, Nov 2022 - May 2025) maintaining mynztrip.com OTA platform.\n- **QRAC Homes Malaysia** (IT Industrial Intern, Jul 2022 - Oct 2022).",
  contact: "You can reach out to Tabassum via:\n- **Email**: tabassumauthoy123@gmail.com\n- **LinkedIn**: [tabassum-authoy](https://linkedin.com/in/tabassum-authoy)\n- **GitHub**: [TabassumAuthoy123](https://github.com/TabassumAuthoy123)\n- **Booking**: You can schedule a direct consultation using the calendar widget on this site!",
  fallback: "I'm Tabassum's AI Assistant, loaded with details from her LinkedIn and CV. I can tell you about her **experience**, **AI research (SRNs)**, **education**, **SaaS projects**, or how to **contact** her. Try clicking one of the suggestions or ask a question!"
};

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "Assalamu Alaikum! ✨ I'm Tabassum's AI Assistant. Ask me anything about her professional experience, academic background, or AI safety research!",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (text) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg = {
      sender: 'user',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Dynamic response logic
    setTimeout(() => {
      let botResponse = BOT_KNOWLEDGE.fallback;
      const lowerText = text.toLowerCase();

      if (lowerText.includes('role') || lowerText.includes('current') || lowerText.includes('job') || lowerText.includes('manager') || lowerText.includes('softify')) {
        botResponse = BOT_KNOWLEDGE.role;
      } else if (lowerText.includes('research') || lowerText.includes('safety') || lowerText.includes('llm') || lowerText.includes('replay') || lowerText.includes('synaptic') || lowerText.includes('hallucination')) {
        botResponse = BOT_KNOWLEDGE.research;
      } else if (lowerText.includes('study') || lowerText.includes('education') || lowerText.includes('university') || lowerText.includes('msc') || lowerText.includes('segi') || lowerText.includes('brac') || lowerText.includes('emba')) {
        botResponse = BOT_KNOWLEDGE.education;
      } else if (lowerText.includes('experience') || lowerText.includes('history') || lowerText.includes('work') || lowerText.includes('past') || lowerText.includes('company')) {
        botResponse = BOT_KNOWLEDGE.experience;
      } else if (lowerText.includes('contact') || lowerText.includes('email') || lowerText.includes('linkedin') || lowerText.includes('touch') || lowerText.includes('reach') || lowerText.includes('book')) {
        botResponse = BOT_KNOWLEDGE.contact;
      }

      setMessages(prev => [...prev, {
        sender: 'bot',
        text: botResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setIsTyping(false);
    }, 1200); // 1.2s delay for typing realism
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button 
        className={`ai-trigger ${isOpen ? 'ai-trigger--active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open AI Assistant"
      >
        {isOpen ? <FiX size={22} /> : <FiMessageSquare size={22} />}
        {!isOpen && <span className="ai-trigger__badge">Ask AI</span>}
      </button>

      {/* Slide-out Chat Drawer */}
      <div className={`ai-drawer ${isOpen ? 'ai-drawer--open' : ''}`}>
        {/* Header */}
        <div className="ai-drawer__header">
          <div className="ai-drawer__identity">
            <div className="ai-drawer__avatar">
              <FiCpu size={16} />
            </div>
            <div>
              <h4 className="ai-drawer__title">Authoy AI</h4>
              <span className="ai-drawer__status"><span className="status-dot">●</span> Online</span>
            </div>
          </div>
          <button className="ai-drawer__close" onClick={() => setIsOpen(false)} aria-label="Close Chat">
            <FiX size={18} />
          </button>
        </div>

        {/* Messages body */}
        <div className="ai-drawer__messages">
          {messages.map((msg, i) => (
            <div key={i} className={`ai-message ai-message--${msg.sender}`}>
              <div className="ai-message__avatar">
                {msg.sender === 'bot' ? <FiCpu size={12} /> : <FiUser size={12} />}
              </div>
              <div className="ai-message__bubble">
                <p className="ai-message__text" dangerouslySetInnerHTML={{ 
                  __html: msg.text
                    .replace(/\n/g, '<br/>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="text-decoration: underline; color: #2dd4bf">$1</a>')
                }} />
                <span className="ai-message__time">{msg.time}</span>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="ai-message ai-message--bot">
              <div className="ai-message__avatar">
                <FiCpu size={12} />
              </div>
              <div className="ai-message__bubble ai-message__bubble--typing">
                <div className="typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Suggestion Chips */}
        {messages.length === 1 && (
          <div className="ai-drawer__suggestions">
            <p className="suggestions-label">Suggested Questions:</p>
            <div className="suggestions-list">
              {PRE_SUGGESTIONS.map((s) => (
                <button 
                  key={s} 
                  className="suggestion-chip"
                  onClick={() => handleSendMessage(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer Input */}
        <div className="ai-drawer__footer">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputValue);
            }}
            className="ai-drawer__form"
          >
            <input
              type="text"
              className="ai-drawer__input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me about Tabassum..."
              disabled={isTyping}
            />
            <button 
              type="submit" 
              className="ai-drawer__send-btn"
              disabled={!inputValue.trim() || isTyping}
              aria-label="Send Message"
            >
              <FiSend size={15} />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
