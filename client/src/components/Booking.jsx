import { useState } from 'react';
import { sendMessage } from '../api';
import { FiCalendar, FiClock, FiCheckCircle, FiAlertCircle, FiSend } from 'react-icons/fi';

const TIME_SLOTS = [
  '09:30 AM',
  '11:00 AM',
  '01:30 PM',
  '03:00 PM',
  '04:30 PM',
];

const CONSULTATION_TOPICS = [
  { id: 'ai-safety', label: 'AI Safety & LLM Reliability' },
  { id: 'saas-dev', label: 'B2B SaaS Development' },
  { id: 'research', label: 'Academic & Empirical Research' },
  { id: 'collaboration', label: 'General Project Coordination' },
];

export default function Booking() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('ai-safety');
  const [form, setForm] = useState({ name: '', email: '', details: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  // Generate calendar dates for the current month view
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const prevMonthTotalDays = new Date(year, month, 0).getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const days = [];
  
  // Padding from previous month
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    days.push({
      day: prevMonthTotalDays - i,
      isCurrentMonth: false,
      date: new Date(year, month - 1, prevMonthTotalDays - i)
    });
  }

  // Days of current month
  for (let i = 1; i <= totalDays; i++) {
    days.push({
      day: i,
      isCurrentMonth: true,
      date: new Date(year, month, i)
    });
  }

  // Padding for next month to complete the grid (usually 42 cells)
  const remainingCells = 42 - days.length;
  for (let i = 1; i <= remainingCells; i++) {
    days.push({
      day: i,
      isCurrentMonth: false,
      date: new Date(year, month + 1, i)
    });
  }

  const handleDateSelect = (dateObj) => {
    const today = new Date();
    today.setHours(0,0,0,0);
    if (dateObj.date < today) return; // Can't book past dates
    setSelectedDate(dateObj.date);
    setSelectedTime(''); // Reset time when date changes
  };

  const validateForm = () => {
    const errs = {};
    if (!selectedDate) errs.date = 'Please select a date from the calendar';
    if (!selectedTime) errs.time = 'Please select a time slot';
    if (!form.name.trim()) errs.name = 'Your name is required';
    if (!form.email.trim()) errs.email = 'Your email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email format';
    
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setStatus('');

    const formattedDate = selectedDate.toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    const topicLabel = CONSULTATION_TOPICS.find(t => t.id === selectedTopic)?.label || selectedTopic;

    const messageContent = `[Consultation Booking Request]
Topic: ${topicLabel}
Requested Date: ${formattedDate}
Requested Time Slot: ${selectedTime}

Client Additional Details:
${form.details || 'No additional details provided.'}`;

    try {
      await sendMessage({
        name: form.name,
        email: form.email,
        message: messageContent
      });
      setStatus('success');
      setForm({ name: '', email: '', details: '' });
      setSelectedDate(null);
      setSelectedTime('');
    } catch (err) {
      console.error('Booking failed:', err);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const todayStr = new Date();
  todayStr.setHours(0,0,0,0);

  return (
    <section className="section booking-section" id="booking">
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: 650, margin: '0 auto 48px' }}>
          <div className="section__badge">Consultation</div>
          <h2 className="section__title">
            Book a <span className="text-gradient">Meeting</span>
          </h2>
          <p className="section__subtitle" style={{ margin: '0 auto' }}>
            Schedule an appointment to discuss AI safety research, SaaS systems, or software collaborations.
          </p>
        </div>

        <div className="booking__grid">
          {/* Calendar Selector card */}
          <div className="booking__card booking__card--calendar">
            <div className="booking__calendar-header">
              <button className="booking__calendar-btn" onClick={handlePrevMonth}>&larr;</button>
              <h3 className="booking__calendar-month">{monthNames[month]} {year}</h3>
              <button className="booking__calendar-btn" onClick={handleNextMonth}>&rarr;</button>
            </div>

            <div className="booking__calendar-grid-weekdays">
              <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
            </div>

            <div className="booking__calendar-grid-days">
              {days.map((d, index) => {
                const isSelected = selectedDate && selectedDate.toDateString() === d.date.toDateString();
                const isPast = d.date < todayStr;
                const isToday = d.date.toDateString() === new Date().toDateString();
                
                let dayClass = "booking__day";
                if (!d.isCurrentMonth) dayClass += " booking__day--prev-next";
                if (isPast) dayClass += " booking__day--past";
                if (isToday) dayClass += " booking__day--today";
                if (isSelected) dayClass += " booking__day--selected";

                return (
                  <button
                    key={index}
                    className={dayClass}
                    onClick={() => handleDateSelect(d)}
                    disabled={isPast}
                    type="button"
                  >
                    {d.day}
                  </button>
                );
              })}
            </div>
            
            <div className="booking__selected-summary">
              <FiCalendar className="booking__summary-icon" />
              <span>
                {selectedDate 
                  ? `Selected: ${selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                  : 'Please select a date from the calendar'
                }
              </span>
            </div>
            {errors.date && <span className="booking__error-text">{errors.date}</span>}
          </div>

          {/* Time Slot and Form Card */}
          <div className="booking__card booking__card--form">
            <h3 className="booking__form-heading">Appointment Details</h3>
            
            <form onSubmit={handleSubmit} className="booking__form">
              {/* Topic Selector */}
              <div className="booking__field-group">
                <label className="booking__label">Select Consultation Topic</label>
                <div className="booking__topics-grid">
                  {CONSULTATION_TOPICS.map((topic) => (
                    <button
                      key={topic.id}
                      type="button"
                      className={`booking__topic-btn ${selectedTopic === topic.id ? 'booking__topic-btn--active' : ''}`}
                      onClick={() => setSelectedTopic(topic.id)}
                    >
                      {topic.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slots */}
              <div className="booking__field-group">
                <label className="booking__label">Select Available Time Slot</label>
                <div className="booking__slots-grid">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      className={`booking__slot-btn ${selectedTime === slot ? 'booking__slot-btn--active' : ''}`}
                      onClick={() => setSelectedTime(slot)}
                    >
                      <FiClock size={12} style={{ marginRight: 6 }} />
                      {slot}
                    </button>
                  ))}
                </div>
                {errors.time && <span className="booking__error-text">{errors.time}</span>}
              </div>

              {/* Input details */}
              <div className="booking__inputs-row">
                <div className="booking__input-wrapper">
                  <label className="booking__label" htmlFor="booking-name">Name</label>
                  <input
                    type="text"
                    id="booking-name"
                    className="booking__input"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Enter your name"
                  />
                  {errors.name && <span className="booking__error-text">{errors.name}</span>}
                </div>

                <div className="booking__input-wrapper">
                  <label className="booking__label" htmlFor="booking-email">Email</label>
                  <input
                    type="email"
                    id="booking-email"
                    className="booking__input"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="your@email.com"
                  />
                  {errors.email && <span className="booking__error-text">{errors.email}</span>}
                </div>
              </div>

              <div className="booking__input-wrapper">
                <label className="booking__label" htmlFor="booking-details">Additional Notes (Optional)</label>
                <textarea
                  id="booking-details"
                  rows="3"
                  className="booking__input booking__input--textarea"
                  value={form.details}
                  onChange={(e) => setForm({ ...form, details: e.target.value })}
                  placeholder="Tell me a bit about your project or consultation needs..."
                />
              </div>

              <button
                type="submit"
                className="booking__submit-btn"
                disabled={loading}
              >
                {loading ? 'Scheduling...' : <><FiSend size={15} style={{ marginRight: 8 }} /> Confirm Consultation</>}
              </button>

              {status === 'success' && (
                <div className="booking__success-msg">
                  <FiCheckCircle size={18} style={{ marginRight: 8 }} />
                  <span>Request received! I will review the date and time and follow up with a calendar link.</span>
                </div>
              )}

              {status === 'error' && (
                <div className="booking__error-msg">
                  <FiAlertCircle size={18} style={{ marginRight: 8 }} />
                  <span>Failed to process booking request. Please try again.</span>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
