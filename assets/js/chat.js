/* ==========================================================================
   Laxmi Hospital, Firozabad - Live Chat Simulator
   Simulates real-time clinical assistance, triage, and patient guidance
   ========================================================================== */

let chatState = {
  mode: 'bot', // 'bot' | 'booking' | 'live' | 'query' | 'cancel_appt'
  bookingStep: 'none', // 'none' | 'name' | 'mobile' | 'dept' | 'doctor' | 'date'
  bookingData: {
    name: '',
    mobile: '',
    department: '',
    doctorName: '',
    date: ''
  },
  queryStep: 'none', // 'none' | 'input'
  cancelStep: 'none', // 'none' | 'token'
  liveAgentConnected: false
};

// Extensively trained clinical knowledge base and triage keywords
const CHAT_KEYWORDS = {
  emergency: "🚨 <strong>EMERGENCY CONTACTS (24x7):</strong><br>For immediate trauma, ICU, or ambulance support, please call our Emergency Hotlines: <strong>+91 7078221122</strong> or <strong>05612-297700</strong>. Our ambulance dispatch is active 24/7.",
  ambulance: "🚑 <strong>AMBULANCE DISPATCH:</strong><br>Laxmi Hospital maintains a fleet of advanced life-support (ALS) ambulances stationed around Firozabad. Call <strong>+91 7078221122</strong> for immediate dispatch (0-minute delay target).",
  gynecology: "🤰 <strong>GYNECOLOGY & MATERNITY:</strong><br>Led by <strong>Dr. Lata Rajput (M.S. Obs & Gynae)</strong>, senior gynecologist. We specialize in painless deliveries, high-risk pregnancies, infertility treatments, and neonatal care. View her profile <a href='doctors/dr-lata-rajput.html' style='color:var(--primary);text-decoration:underline;font-weight:700;'>here</a>.",
  orthopedic: "🦴 <strong>ORTHOPEDICS & TRAUMA:</strong><br>Led by <strong>Dr. Amit Gupta (M.S. Ortho)</strong> and <strong>Dr. Mohammad Shafiq (M.S. Ortho)</strong>. We specialize in joint replacement, complex fracture repairs, arthritis management, and spine surgery.",
  pediatric: "👶 <strong>PEDIATRIC CARE:</strong><br>Led by child specialist <strong>Dr. Paras Rajput (M.D. Pediatrics)</strong>. Offers newborn checks, immunizations, and asthma care. View child health tips in our blog <a href='blog/child-health-tips.html' style='color:var(--primary);text-decoration:underline;font-weight:700;'>here</a>.",
  surgery: "🔪 <strong>GENERAL & LAPAROSCOPIC SURGERY:</strong><br>Led by <strong>Dr. Ajay Bahadur Singh (M.S. General Surgery)</strong>, senior specialist in minimally invasive gallbladder, hernia, appendix, and gastrointestinal surgeries.",
  cardiology: "❤️ <strong>CARDIOLOGY & MEDICINE:</strong><br>Led by our Senior Consultant Physicians, specializing in cardiac management, hypertension, diabetic care, and ICU management.",
  ent: "👂 <strong>ENT SPECIALIST:</strong><br>Our ENT specialist clinic treats ear, nose, throat disorders, and head-neck surgeries.",
  timing: "⏰ <strong>OPD & HOSPITAL TIMINGS:</strong><br>• <strong>General OPD:</strong> 9:00 AM to 8:00 PM (Monday - Saturday)<br>• <strong>Emergency & ICU:</strong> Open 24/7/365<br>• <strong>Diagnostic Lab & Radiology:</strong> 8:00 AM to 8:00 PM (Emergency 24x7).",
  insurance: "💳 <strong>CASHLESS INSURANCE & TPA:</strong><br>We offer cashless treatment with all major insurance providers: Star Health, HDFC Ergo, ICICI Lombard, SBI General, Bajaj Allianz, Niva Bupa, and various govt. schemes. Bring your TPA card to the admin desk on admission.",
  location: "📍 <strong>ADDRESS & DIRECTIONS:</strong><br>Laxmi Hospital is situated at: <strong>Nagla Bari, Firozabad, Uttar Pradesh</strong>. Easily accessible via bypass road. Check our <a href='contact.html' style='color:var(--primary);text-decoration:underline;font-weight:700;'>Contact Page</a> for map routing.",
  pricing: "💰 <strong>HEALTH PACKAGE PRICING:</strong><br>• Basic Wellness Check: ₹1,499<br>• Senior Citizen Checkup: ₹2,499<br>• Cardiac Care Check: ₹2,999<br>• Diabetic Screening: ₹1,999<br>Inquire at the reception desk for customization.",
  dengue: "🦟 <strong>DENGUE CLINICAL CARE:</strong><br>Dengue symptoms include high fever, joint pain, rashes, and low platelets. Please consult our general medicine department immediately or check our clinical guide <a href='blog/dengue-symptoms.html' style='color:var(--primary);text-decoration:underline;font-weight:700;'>here</a>.",
  icu: "🏥 <strong>ICU & CRITICAL CARE:</strong><br>Our state-of-the-art 24-bed ICU is equipped with advanced ventilators, multipara monitors, central oxygen, and round-the-clock intensive care physicians.",
  lab: "🔬 <strong>LAB & DIAGNOSTIC SERVICES:</strong><br>In-house digital X-ray, Ultrasound, Pathology Lab, and ECG. Quick reporting ensures swift clinical decisions.",
  help: "🙋 <strong>HOW I CAN ASSIST YOU:</strong><br>You can type keywords to query us, or select action chips:<br>• Type <strong>'book'</strong> or <strong>'appointment'</strong> to schedule.<br>• Type <strong>'status'</strong> or <strong>'my booking'</strong> to view appointment status.<br>• Type <strong>'cancel booking'</strong> to cancel an appointment.<br>• Type <strong>'live'</strong> or <strong>'support'</strong> to talk directly to our desk staff.",
  default: "Thank you for contacting Laxmi Hospital. 😊 I am your digital assistant. How can I help you today? You can ask about our:<br>• <strong>'emergency'</strong> services or <strong>'ambulance'</strong><br>• <strong>'doctors'</strong> or specific departments (e.g. <strong>'gynecology'</strong>)<br>• <strong>'insurance'</strong> cashless partners<br>• <strong>'timings'</strong>, <strong>'location'</strong> or ask to <strong>'book'</strong> or <strong>'check status'</strong> of appointments."
};

// Dynamic helper to escape HTML
function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Inject premium styling rules at runtime
function injectCustomStyles() {
  const css = `
    /* Realistic Doctor Avatar for Chat Toggle */
    #chat-toggle-btn {
      background: #ffffff !important;
      border: 2px solid var(--primary) !important;
      padding: 0 !important;
      width: 60px !important;
      height: 60px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      box-shadow: 0 8px 24px rgba(0, 123, 158, 0.25) !important;
      transition: all 0.3s ease !important;
    }
    #chat-toggle-btn:hover {
      transform: scale(1.08) translateY(-2px) !important;
      box-shadow: 0 12px 30px rgba(0, 123, 158, 0.35) !important;
    }
    #chat-toggle-btn svg {
      width: 100% !important;
      height: 100% !important;
      border-radius: 50% !important;
    }
    /* Pulsing Green Online Badge */
    #chat-toggle-btn::after {
      content: "";
      position: absolute;
      top: 2px;
      right: 2px;
      width: 12px;
      height: 12px;
      background-color: #28a745;
      border: 2px solid #ffffff;
      border-radius: 50%;
      box-shadow: 0 0 0 0 rgba(40, 167, 69, 0.7);
      animation: pulse-online 2s infinite;
    }
    @keyframes pulse-online {
      0% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0 rgba(40, 167, 69, 0.7);
      }
      70% {
        transform: scale(1);
        box-shadow: 0 0 0 6px rgba(40, 167, 69, 0);
      }
      100% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0 rgba(40, 167, 69, 0);
      }
    }
    
    /* Interactive chips styling */
    .chat-chip {
      display: inline-block;
      background-color: var(--primary-light) !important;
      color: var(--primary) !important;
      border: 1px solid rgba(0, 123, 158, 0.15) !important;
      padding: 6px 12px !important;
      margin: 4px 2px !important;
      border-radius: 20px !important;
      font-size: 0.75rem !important;
      font-weight: 600 !important;
      cursor: pointer !important;
      transition: all 0.2s ease !important;
    }
    .chat-chip:hover {
      background-color: var(--primary) !important;
      color: #ffffff !important;
      border-color: var(--primary) !important;
      transform: translateY(-1px);
    }
  `;
  const style = document.createElement('style');
  style.type = 'text/css';
  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);
}

// Insert custom vector Doctor avatar dynamically
function insertDoctorAvatar() {
  const chatToggle = document.getElementById('chat-toggle-btn');
  if (!chatToggle) return;

  const avatarSVG = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <defs>
        <linearGradient id="avatar-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#e0f2f1" />
          <stop offset="100%" stop-color="#80deea" />
        </linearGradient>
        <linearGradient id="coat-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="100%" stop-color="#f5f5f5" />
        </linearGradient>
      </defs>
      <circle cx="60" cy="60" r="54" fill="url(#avatar-bg)" stroke="#00acc1" stroke-width="2"/>
      <path d="M60 25 C45 25, 42 45, 42 52 C42 62, 50 68, 60 68 C70 68, 78 62, 78 52 C78 45, 75 25, 60 25 Z" fill="#ffe0b2"/>
      <path d="M60 21 C43 21, 40 38, 40 46 C40 50, 43 45, 46 43 C52 40, 58 45, 60 41 C62 45, 68 40, 74 43 C77 45, 80 50, 80 46 C80 38, 77 21, 60 21 Z" fill="#37474f"/>
      <path d="M40 40 L40 58 C40 58, 44 48, 46 48 L46 40 Z" fill="#37474f"/>
      <path d="M80 40 L80 58 C80 58, 76 48, 74 48 L74 40 Z" fill="#37474f"/>
      <circle cx="53" cy="48" r="3" fill="#37474f"/>
      <circle cx="67" cy="48" r="3" fill="#37474f"/>
      <path d="M55 58 Q60 62, 65 58" stroke="#d84315" stroke-width="2" fill="none" stroke-linecap="round"/>
      <rect x="56" y="65" width="8" height="10" fill="#ffe0b2"/>
      <path d="M48 70 Q48 90, 60 90 Q72 90, 72 70" stroke="#78909c" stroke-width="3" fill="none"/>
      <path d="M60 90 L60 98" stroke="#78909c" stroke-width="3" fill="none"/>
      <circle cx="60" cy="101" r="5" fill="#37474f" stroke="#78909c" stroke-width="2"/>
      <path d="M40 78 L45 74 L52 86 L48 105 L32 105 Z" fill="url(#coat-grad)" stroke="#cfd8dc" stroke-width="1"/>
      <path d="M80 78 L75 74 L68 86 L72 105 L88 105 Z" fill="url(#coat-grad)" stroke="#cfd8dc" stroke-width="1"/>
      <path d="M52 75 L60 88 L68 75 Z" fill="#00838f"/>
    </svg>
  `;
  chatToggle.innerHTML = avatarSVG + `<span class="floating-tooltip">Laxmi Virtual Care</span>`;
}

document.addEventListener('DOMContentLoaded', () => {
  injectCustomStyles();
  insertDoctorAvatar();
  initChatWidget();
});

// Fetch doctors dynamically from localStorage or fallback defaults
function getDoctorsFromStorage() {
  try {
    const data = localStorage.getItem('laxmi_doctors');
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error("Error reading doctors from localStorage:", e);
  }
  return [
    { id: "dr-lata-rajput", name: "Dr. Lata Rajput", spec: "Obstetrics & Gynecology", departments: ["Gynecology"] },
    { id: "dr-amit-gupta", name: "Dr. Amit Gupta", spec: "Orthopedics & Joint Surgery", departments: ["Orthopedics", "Trauma Care", "Physiotherapy"] },
    { id: "dr-paras-rajput", name: "Dr. Paras Rajput", spec: "Pediatrics & Neonatal Care", departments: ["Pediatrics"] },
    { id: "dr-ajay-bahadur-singh", name: "Dr. Ajay Bahadur Singh", spec: "General & Laparoscopic Surgery", departments: ["General Surgery"] },
    { id: "dr-mohammad-shafiq", name: "Dr. Mohammad Shafiq", spec: "Orthopedics & Spine Surgery", departments: ["Orthopedics", "Trauma Care", "Joint Replacement", "Emergency Care"] },
    { id: "dr-piyush-taneja", name: "Dr. Piyush Taneja", spec: "General Medicine & Lifestyle Health", departments: ["General Medicine", "ICU", "Emergency Care"] },
    { id: "dr-sachin-tiwari", name: "Dr. Sachin Tiwari", spec: "Critical Care & Anesthesia", departments: ["ICU", "Emergency Care", "Trauma Care"] },
    { id: "dr-premraj", name: "Dr. Premraj", spec: "Orthopedics & Joint Care", departments: ["Orthopedics", "Trauma Care", "Joint Replacement"] }
  ];
}

function initChatWidget() {
  const chatToggle = document.getElementById('chat-toggle-btn');
  const chatClose = document.getElementById('chat-widget-close');
  const chatWidget = document.getElementById('chat-widget-panel');
  const chatInput = document.getElementById('chat-widget-input');
  const chatSend = document.getElementById('chat-widget-send');
  const chatMessages = document.getElementById('chat-widget-messages');
  const chatOptions = document.querySelectorAll('.chat-option');

  if (!chatWidget) return;

  // Toggle panel visibility
  if (chatToggle) {
    chatToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      chatWidget.classList.toggle('active');

      // Send welcoming bot message if empty
      if (chatMessages && chatMessages.children.length === 0) {
        sendBotMessage("Hello! Welcome to the Laxmi Hospital Digital Desk. 🏥 I am your virtual assistant.<br><br>Select a quick action below or type a query (e.g. <strong>'gynecology'</strong>, <strong>'insurance'</strong>, <strong>'book'</strong>, <strong>'live support'</strong>) to get started.");
      }
    });
  }

  if (chatClose) {
    chatClose.addEventListener('click', () => {
      chatWidget.classList.remove('active');
    });
  }

  // Close chat when clicking outside the panel
  document.addEventListener('click', (e) => {
    if (chatWidget.classList.contains('active') &&
      !chatWidget.contains(e.target) &&
      (!chatToggle || !chatToggle.contains(e.target))) {
      chatWidget.classList.remove('active');
    }
  });

  // Quick options triggers (resets state first for clean redirection)
  chatOptions.forEach(option => {
    option.addEventListener('click', () => {
      const keyword = option.getAttribute('data-value');
      const optionText = option.textContent;

      resetChatState();

      if (keyword === 'appointment') {
        sendUserMessage(optionText);
        startBookingFlow();
      } else {
        sendUserMessage(optionText);
        simulateBotTyping(keyword);
      }
    });
  });

  // Setup Event Delegation for dynamic inline buttons inside chat messages
  if (chatMessages) {
    chatMessages.addEventListener('click', (e) => {
      const chip = e.target.closest('.chat-chip');
      if (chip) {
        const val = chip.getAttribute('data-value');
        if (val) {
          handleUserMsg(val);
        }
      }
    });
  }

  // Manual input send
  if (chatSend && chatInput) {
    const handleSend = () => {
      const text = chatInput.value.trim();
      if (!text) return;

      chatInput.value = '';
      handleUserMsg(text);
    };

    chatSend.addEventListener('click', handleSend);
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleSend();
    });
  }
}

function handleUserMsg(text) {
  const query = text.trim();
  if (!query) return;

  // Render user's message
  sendUserMessage(query);

  const lowerQuery = query.toLowerCase();

  // Global Check for cancellation or exit
  if (lowerQuery === 'cancel' || lowerQuery === 'exit') {
    resetChatState();
    simulateBotTyping('cancelled');
    return;
  }

  // Routing depending on the mode
  if (chatState.mode === 'booking') {
    processBookingStep(query);
  } else if (chatState.mode === 'query') {
    processQueryStep(query);
  } else if (chatState.mode === 'cancel_appt') {
    processCancelStep(query);
  } else if (chatState.mode === 'live') {
    processLiveAgentMsg(query);
  } else {
    // Mode is 'bot' (General Q&A)
    const isCancelTrigger = ['cancel appointment', 'cancel booking', 'delete booking', 'remove booking', 'cancel appt'].some(kw => lowerQuery.includes(kw));
    const isQueryTrigger = ['status', 'check', 'my appointment', 'find booking', 'view booking', 'token', 'search appointment', 'lookup'].some(kw => lowerQuery.includes(kw)) && !isCancelTrigger;
    const isBookingTrigger = ['book', 'appointment', 'schedule', 'opd', 'meeting', 'consultation'].some(kw => lowerQuery.includes(kw)) && !isQueryTrigger && !isCancelTrigger;
    
    // Narrow trigger logic to prevent false connections on general words like "support"
    const isLiveTrigger = ['live chat', 'live support', 'talk to human', 'talk to admin', 'talk to agent', 'live agent', 'chat with agent', 'connect agent', 'human helper', 'chat directly'].some(kw => lowerQuery.includes(kw)) ||
                          (lowerQuery === 'agent') ||
                          (lowerQuery === 'support') ||
                          (lowerQuery === 'live');

    if (isCancelTrigger) {
      startCancelFlow();
    } else if (isQueryTrigger) {
      startQueryFlow();
    } else if (isBookingTrigger) {
      startBookingFlow();
    } else if (isLiveTrigger) {
      startLiveSupportFlow();
    } else {
      // Find matches in CHAT_KEYWORDS
      let matchedKeyword = 'default';
      
      // Smart Multi-keyword matcher
      if (['time', 'hour', 'opd timing', 'open'].some(kw => lowerQuery.includes(kw))) {
        matchedKeyword = 'timing';
      } else if (['cashless', 'insurance', 'tpa', 'card', 'billing', 'panel'].some(kw => lowerQuery.includes(kw))) {
        matchedKeyword = 'insurance';
      } else if (['icu', 'ventilator', 'critical'].some(kw => lowerQuery.includes(kw))) {
        matchedKeyword = 'icu';
      } else if (['lab', 'test', 'report', 'xray', 'ct scan', 'ultrasound', 'pathology'].some(kw => lowerQuery.includes(kw))) {
        matchedKeyword = 'lab';
      } else if (['surgery', 'operation', 'laparoscopic', 'hernia', 'appendix', 'gallbladder', 'ajay', 'bahadur'].some(kw => lowerQuery.includes(kw))) {
        matchedKeyword = 'surgery';
      } else if (['gynecology', 'gynaecology', 'pregnancy', 'delivery', 'maternity', 'lata', 'rajput', 'female', 'woman', 'pregnant'].some(kw => lowerQuery.includes(kw))) {
        matchedKeyword = 'gynecology';
      } else if (['orthopedic', 'ortho', 'bone', 'joint', 'fracture', 'amit', 'gupta', 'shafiq', 'knee', 'spine', 'back pain'].some(kw => lowerQuery.includes(kw))) {
        matchedKeyword = 'orthopedic';
      } else if (['pediatric', 'child', 'baby', 'paras', 'newborn', 'kid'].some(kw => lowerQuery.includes(kw))) {
        matchedKeyword = 'pediatric';
      } else if (['cardiology', 'heart', 'taneja', 'medicine', 'general medicine', 'cardiologist'].some(kw => lowerQuery.includes(kw))) {
        matchedKeyword = 'cardiology';
      } else if (['ent', 'ear', 'nose', 'throat'].some(kw => lowerQuery.includes(kw))) {
        matchedKeyword = 'ent';
      } else if (['price', 'cost', 'fee', 'charge', 'package'].some(kw => lowerQuery.includes(kw))) {
        matchedKeyword = 'pricing';
      } else if (['help', 'menu', 'options', 'how to'].some(kw => lowerQuery.includes(kw))) {
        matchedKeyword = 'help';
      } else {
        // Fallback to exact keyword matching loop
        for (let key in CHAT_KEYWORDS) {
          if (lowerQuery.includes(key)) {
            matchedKeyword = key;
            break;
          }
        }
      }

      simulateBotTyping(matchedKeyword);
    }
  }
}

function startBookingFlow() {
  chatState.mode = 'booking';
  chatState.bookingStep = 'name';
  chatState.bookingData = { name: '', mobile: '', department: '', doctorName: '', date: '' };

  simulateBotTyping('booking_start');
}

function startLiveSupportFlow() {
  chatState.mode = 'live';
  chatState.liveAgentConnected = false;

  simulateBotTyping('live_connect');
}

function startQueryFlow() {
  chatState.mode = 'query';
  chatState.queryStep = 'input';
  simulateBotTyping('query_start');
}

function startCancelFlow() {
  chatState.mode = 'cancel_appt';
  chatState.cancelStep = 'token';
  simulateBotTyping('cancel_start');
}

function processBookingStep(input) {
  const step = chatState.bookingStep;

  if (step === 'name') {
    chatState.bookingData.name = input;
    chatState.bookingStep = 'mobile';
    simulateBotTyping('booking_ask_mobile');
  } 
  else if (step === 'mobile') {
    // Validate 10-digit mobile number
    const num = input.replace(/\s+/g, '');
    if (!/^\d{10}$/.test(num)) {
      sendBotMessage("⚠️ <strong>Invalid Number:</strong> Please enter a valid 10-digit mobile number (digits only, e.g. 9876543210):");
      return;
    }
    chatState.bookingData.mobile = num;
    chatState.bookingStep = 'dept';
    simulateBotTyping('booking_ask_dept');
  } 
  else if (step === 'dept') {
    let deptInput = input.trim().toLowerCase();
    let normalizedDept = input;

    // Normalizing clinical department queries to match DEFAULT_DEPT_DOCTORS schema in appointment.js
    if (['gyn', 'pregnancy', 'delivery', 'maternity', 'women', 'obstetrics'].some(kw => deptInput.includes(kw))) {
      normalizedDept = 'Gynecology';
    } else if (['ortho', 'bone', 'joint', 'fracture', 'spine'].some(kw => deptInput.includes(kw))) {
      normalizedDept = 'Orthopedics';
    } else if (['pedi', 'child', 'baby', 'neonatal', 'infant', 'kid'].some(kw => deptInput.includes(kw))) {
      normalizedDept = 'Pediatrics';
    } else if (['cardio', 'heart'].some(kw => deptInput.includes(kw))) {
      normalizedDept = 'Cardiology';
    } else if (['surgery', 'operation', 'laparoscopic', 'hernia', 'appendix'].some(kw => deptInput.includes(kw))) {
      normalizedDept = 'General Surgery';
    } else if (['ent', 'ear', 'nose', 'throat'].some(kw => deptInput.includes(kw))) {
      normalizedDept = 'ENT';
    } else if (['medicine', 'fever', 'general medicine', 'physician'].some(kw => deptInput.includes(kw))) {
      normalizedDept = 'General Medicine';
    } else if (['emerg', 'accident', 'trauma care', 'casualty'].some(kw => deptInput.includes(kw))) {
      normalizedDept = 'Emergency Care';
    } else if (['icu', 'critical', 'intensive'].some(kw => deptInput.includes(kw))) {
      normalizedDept = 'ICU';
    } else if (['trauma'].some(kw => deptInput.includes(kw))) {
      normalizedDept = 'Trauma Care';
    } else if (['neuro'].some(kw => deptInput.includes(kw))) {
      normalizedDept = 'Neurology';
    } else if (['physio', 'rehab', 'exercise'].some(kw => deptInput.includes(kw))) {
      normalizedDept = 'Physiotherapy';
    } else {
      // Clean casing
      normalizedDept = deptInput.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }

    chatState.bookingData.department = normalizedDept;
    chatState.bookingStep = 'doctor';
    simulateBotTyping('booking_ask_doctor');
  } 
  else if (step === 'doctor') {
    chatState.bookingData.doctorName = input;
    chatState.bookingStep = 'date';
    simulateBotTyping('booking_ask_date');
  } 
  else if (step === 'date') {
    let chosenDate = input.trim();
    const lowerDate = chosenDate.toLowerCase();
    
    if (lowerDate === 'today') {
      chosenDate = new Date().toISOString().substring(0, 10);
    } else if (lowerDate === 'tomorrow') {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      chosenDate = tomorrow.toISOString().substring(0, 10);
    } else if (lowerDate === 'day after tomorrow' || lowerDate === 'day after') {
      const dayAfter = new Date();
      dayAfter.setDate(dayAfter.getDate() + 2);
      chosenDate = dayAfter.toISOString().substring(0, 10);
    } else {
      // Support DD/MM/YYYY, DD-MM-YYYY, or DD.MM.YYYY formats
      const dmyRegex = /^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})$/;
      const match = chosenDate.match(dmyRegex);
      if (match) {
        const day = match[1].padStart(2, '0');
        const month = match[2].padStart(2, '0');
        const year = match[3];
        chosenDate = `${year}-${month}-${day}`;
      } else {
        // Try parsing using standard JavaScript Date parser
        const parsed = Date.parse(chosenDate);
        if (!isNaN(parsed)) {
          chosenDate = new Date(parsed).toISOString().substring(0, 10);
        } else {
          sendBotMessage("⚠️ <strong>Invalid Date:</strong> Please enter a valid date in the format YYYY-MM-DD (e.g. 2026-06-25) or click Today/Tomorrow:");
          return;
        }
      }
    }

    // Validate not in past
    const todayStr = new Date().toISOString().substring(0, 10);
    if (chosenDate < todayStr) {
      sendBotMessage("⚠️ <strong>Date in Past:</strong> You cannot schedule an appointment in the past. Please enter today's date or a future date:");
      return;
    }

    chatState.bookingData.date = chosenDate;
    saveAppointmentAndShowReceipt();
  }
}

function processQueryStep(input) {
  const query = input.trim();
  let appointments = [];
  try {
    const stored = localStorage.getItem('laxmi_appointments');
    if (stored) {
      appointments = JSON.parse(stored);
    }
  } catch(e) { console.error(e); }

  const queryClean = query.replace(/\s+/g, '').toLowerCase();

  // Find appointments matching clean Token ID or Mobile number
  const matches = appointments.filter(appt => {
    const apptId = appt.appointmentId.replace(/\s+/g, '').toLowerCase();
    const apptMobile = appt.mobile.replace(/\s+/g, '').toLowerCase();
    return apptId === queryClean || apptMobile === queryClean;
  });

  if (matches.length > 0) {
    let matchesHTML = "";
    matches.forEach(appt => {
      const formattedDate = new Date(appt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      
      let statusBg = "#ffeeba";
      let statusText = "#856404";
      if (appt.status === 'Cancelled') {
        statusBg = "#f8d7da";
        statusText = "#721c24";
      } else if (appt.status === 'Confirmed') {
        statusBg = "#d4edda";
        statusText = "#155724";
      } else if (appt.status === 'Completed') {
        statusBg = "#e2e3e5";
        statusText = "#383d41";
      }

      matchesHTML += `
        <div style="border: 1px solid rgba(0, 123, 158, 0.15); border-radius: 6px; padding: 10px; margin-top: 8px; background: #ffffff; box-shadow: var(--shadow-sm);">
          <div style="display: flex; justify-content: space-between; font-weight: 700; color: var(--primary); font-size: 0.8rem; margin-bottom: 6px;">
            <span>Token: ${appt.appointmentId}</span>
            <span style="background-color: ${statusBg}; color: ${statusText}; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; font-weight: 700;">${appt.status}</span>
          </div>
          <div style="font-size: 0.8rem; color: var(--text-dark); line-height: 1.4;">
            • <strong>Patient:</strong> ${escapeHTML(appt.name)}<br>
            • <strong>Consultant:</strong> ${escapeHTML(appt.doctorName)} (${escapeHTML(appt.department)})<br>
            • <strong>Date:</strong> ${formattedDate}
          </div>
        </div>
      `;
    });

    const bodyHTML = `
      🔍 <strong>Found ${matches.length} Appointment(s):</strong><br>
      ${matchesHTML}
      <br>
      What would you like to do next?<br><br>
      <span class="chat-chip" data-value="Cancel Appointment">🗑️ Cancel Appointment</span>
      <span class="chat-chip" data-value="Main Menu">🏠 Main Menu</span>
    `;

    resetChatState();
    simulateBotTyping('query_complete', bodyHTML);
  } else {
    resetChatState();
    simulateBotTyping('query_empty', query);
  }
}

function processCancelStep(input) {
  const token = input.trim().toUpperCase();
  let appointments = [];
  try {
    const stored = localStorage.getItem('laxmi_appointments');
    if (stored) {
      appointments = JSON.parse(stored);
    }
  } catch(e) { console.error(e); }

  const index = appointments.findIndex(appt => appt.appointmentId.toUpperCase() === token);
  if (index !== -1) {
    // Update status to Cancelled
    appointments[index].status = 'Cancelled';
    localStorage.setItem('laxmi_appointments', JSON.stringify(appointments));

    // Dispatch StorageEvent for tab synchronization
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'laxmi_appointments',
      newValue: JSON.stringify(appointments)
    }));

    resetChatState();
    simulateBotTyping('cancel_complete', token);
  } else {
    sendBotMessage("⚠️ <strong>Token Not Found:</strong> We couldn't find an appointment with Token ID <strong>" + escapeHTML(token) + "</strong>. Please enter a valid Token ID:");
  }
}

function saveAppointmentAndShowReceipt() {
  const apptId = 'LXH-' + Math.floor(100000 + Math.random() * 900000);
  const appt = {
    appointmentId: apptId,
    name: chatState.bookingData.name,
    mobile: chatState.bookingData.mobile,
    department: chatState.bookingData.department,
    doctorName: chatState.bookingData.doctorName,
    date: chatState.bookingData.date,
    status: 'Pending',
    timestamp: new Date().toISOString()
  };

  // Push to local storage
  let appointments = [];
  try {
    const stored = localStorage.getItem('laxmi_appointments');
    if (stored) {
      appointments = JSON.parse(stored);
    }
  } catch(e) {
    console.error(e);
  }
  appointments.push(appt);
  localStorage.setItem('laxmi_appointments', JSON.stringify(appointments));

  // Sync immediately for cross-tab or current-tab listeners
  window.dispatchEvent(new StorageEvent('storage', {
    key: 'laxmi_appointments',
    newValue: JSON.stringify(appointments)
  }));

  // Build the receipt card HTML
  const receiptHTML = `
    <div style="border: 1px solid rgba(0, 123, 158, 0.18); border-radius: 8px; padding: 14px; margin-top: 5px; background: linear-gradient(135deg, #ffffff 0%, #f7fafd 100%); box-shadow: 0 4px 10px rgba(0,0,0,0.04); font-family: inherit;">
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px; border-bottom: 1px dashed var(--border-color); padding-bottom: 6px;">
        <span style="background-color: #28a745; color: white; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 0.75rem;"><i class="fas fa-check"></i></span>
        <span style="font-weight: 700; color: #28a745; font-size: 0.9rem;">OPD Appointment Scheduled!</span>
      </div>
      <table style="width: 100%; border-collapse: collapse; font-size: 0.8rem; line-height: 1.5;">
        <tr>
          <td style="color: var(--text-muted); padding: 3px 0;">Token ID:</td>
          <td style="font-weight: 700; color: var(--primary); text-align: right;">${appt.appointmentId}</td>
        </tr>
        <tr>
          <td style="color: var(--text-muted); padding: 3px 0;">Patient Name:</td>
          <td style="font-weight: 600; text-align: right; color: var(--text-dark);">${escapeHTML(appt.name)}</td>
        </tr>
        <tr>
          <td style="color: var(--text-muted); padding: 3px 0;">Mobile Line:</td>
          <td style="text-align: right; color: var(--text-dark);">${escapeHTML(appt.mobile)}</td>
        </tr>
        <tr>
          <td style="color: var(--text-muted); padding: 3px 0;">Specialty Desk:</td>
          <td style="font-weight: 600; text-align: right; color: var(--text-dark);">${escapeHTML(appt.department)}</td>
        </tr>
        <tr>
          <td style="color: var(--text-muted); padding: 3px 0;">Physician:</td>
          <td style="font-weight: 600; text-align: right; color: var(--primary);">${escapeHTML(appt.doctorName)}</td>
        </tr>
        <tr>
          <td style="color: var(--text-muted); padding: 3px 0;">Booking Date:</td>
          <td style="font-weight: 600; text-align: right; color: var(--text-dark);">${appt.date}</td>
        </tr>
        <tr>
          <td style="color: var(--text-muted); padding: 3px 0;">Status:</td>
          <td style="text-align: right;"><span style="background-color: #ffeeba; color: #856404; padding: 1px 6px; border-radius: 4px; font-size: 0.7rem; font-weight: 700;">${appt.status}</span></td>
        </tr>
      </table>
      <div style="font-size: 0.72rem; color: var(--text-muted); text-align: center; margin-top: 10px; padding-top: 6px; border-top: 1px solid var(--border-color); font-style: italic;">
        Appointment record successfully transmitted to the Laxmi Admin Panel. Please show this Token on arrival.
      </div>
    </div>
  `;

  resetChatState();

  // Render receipt
  simulateBotTyping('booking_complete', receiptHTML);
}

function processLiveAgentMsg(query) {
  // Simple simulator responses from Rahul
  simulateBotTyping('live_reply', query);
}

function resetChatState() {
  chatState.mode = 'bot';
  chatState.bookingStep = 'none';
  chatState.bookingData = { name: '', mobile: '', department: '', doctorName: '', date: '' };
  chatState.queryStep = 'none';
  chatState.cancelStep = 'none';

  // Restore header status
  const chatStatusName = document.querySelector('#chat-widget-panel .chat-status h4');
  const chatStatusSpan = document.querySelector('#chat-widget-panel .chat-status span');
  const chatInput = document.getElementById('chat-widget-input');

  if (chatStatusName) chatStatusName.textContent = "Laxmi Digital Desk";
  if (chatStatusSpan) chatStatusSpan.innerHTML = "Online (Instant Help)";
  if (chatInput) chatInput.placeholder = "Type a message (e.g. 'gynecologist')...";
}

function sendUserMessage(text) {
  const chatMessages = document.getElementById('chat-widget-messages');
  if (!chatMessages) return;

  const msgDiv = document.createElement('div');
  msgDiv.className = 'msg msg-user';
  msgDiv.textContent = text;
  chatMessages.appendChild(msgDiv);
  scrollChatToBottom();
}

// Support relative paths from subdirectories
function getPathPrefix() {
  const path = window.location.pathname;
  if (path.includes('/doctors/') || path.includes('/departments/') || path.includes('/blog/')) {
    return '../';
  }
  return '';
}

function adjustLinks(html) {
  const prefix = getPathPrefix();
  if (!prefix) return html;
  return html.replace(/href=(['"])(?!\/|https?:|mailto:|tel:|#)([^'"]+)\1/g, `href=$1${prefix}$2$1`);
}

function sendBotMessage(htmlContent) {
  const chatMessages = document.getElementById('chat-widget-messages');
  if (!chatMessages) return;

  const msgDiv = document.createElement('div');
  msgDiv.className = 'msg msg-bot';
  msgDiv.innerHTML = adjustLinks(htmlContent);
  chatMessages.appendChild(msgDiv);
  scrollChatToBottom();
}

function simulateBotTyping(action, extraPayload) {
  const chatMessages = document.getElementById('chat-widget-messages');
  if (!chatMessages) return;

  // Create typing placeholder
  const typingDiv = document.createElement('div');
  typingDiv.className = 'msg msg-bot typing-placeholder';
  
  let typingLabel = "Laxmi Assistant Typing...";
  if (chatState.mode === 'live') {
    typingLabel = "Rahul (Support Executive) Typing...";
  }
  
  typingDiv.innerHTML = `<span style="display:inline-block;animation:flash 1s infinite;">•</span> <span style="display:inline-block;animation:flash 1s infinite 0.2s;">•</span> <span style="display:inline-block;animation:flash 1s infinite 0.4s;">•</span> ${typingLabel}`;
  chatMessages.appendChild(typingDiv);
  scrollChatToBottom();

  // Simulated typing delay
  setTimeout(() => {
    typingDiv.remove();

    let reply = "";

    if (action === 'booking_start') {
      reply = "📅 <strong>OPD & Consultation Booking:</strong><br>Let's schedule your consultation. To get started, please enter the <strong>Patient's Full Name</strong>:<br><br><em>(Type 'cancel' at any time to exit booking)</em>";
    } 
    else if (action === 'booking_ask_mobile') {
      reply = `Thank you. Now, please enter the <strong>10-digit mobile number</strong> for patient <strong>${escapeHTML(chatState.bookingData.name)}</strong>:`;
    } 
    else if (action === 'booking_ask_dept') {
      // Generate department options dynamically
      const depts = ["Gynecology", "Orthopedics", "Pediatrics", "Cardiology", "General Surgery", "ENT", "General Medicine"];
      const chips = depts.map(d => `<span class="chat-chip" data-value="${d}">${d}</span>`).join(" ");
      reply = `Got it! Please select the **department** you want to consult:<br><br>${chips}`;
    } 
    else if (action === 'booking_ask_doctor') {
      // Filter doctors dynamically based on department
      const doctors = getDoctorsFromStorage();
      const dept = chatState.bookingData.department.toLowerCase();
      const filtered = doctors.filter(doc => 
        doc.departments.some(d => d.toLowerCase() === dept)
      );

      // Render matching doctors or all if none
      const listToRender = filtered.length > 0 ? filtered : doctors;
      const chips = listToRender.map(doc => `<span class="chat-chip" data-value="${doc.name}">${doc.name}</span>`).join(" ");
      
      if (filtered.length > 0) {
        reply = `Here are our active specialists in **${chatState.bookingData.department}**. Please click one of the options below:<br><br>${chips}`;
      } else {
        reply = `We didn't find direct matches for '${chatState.bookingData.department}', but here is our complete team. Please select a specialist:<br><br>${chips}`;
      }
    } 
    else if (action === 'booking_ask_date') {
      const today = new Date().toISOString().substring(0, 10);
      const tom = new Date();
      tom.setDate(tom.getDate() + 1);
      const tomorrow = tom.toISOString().substring(0, 10);

      const chips = `
        <span class="chat-chip" data-value="Today">Today (${today})</span>
        <span class="chat-chip" data-value="Tomorrow">Tomorrow (${tomorrow})</span>
      `;
      reply = `Excellent! Finally, select a consultation **Date** below, or type one in <strong>YYYY-MM-DD</strong> format:<br><br>${chips}`;
    } 
    else if (action === 'booking_complete') {
      reply = `Thank you for choosing Laxmi Hospital. Your appointment slot has been registered:<br>${extraPayload}`;
    } 
    else if (action === 'query_start') {
      reply = "🔍 <strong>Appointment status check:</strong><br>Please enter your <strong>Token ID</strong> (e.g. LXH-123456) or your <strong>10-digit mobile number</strong> to check reservation status:<br><br><em>(Type 'cancel' to exit)</em>";
    }
    else if (action === 'query_complete') {
      reply = extraPayload;
    }
    else if (action === 'query_empty') {
      reply = `❌ <strong>No Record Found:</strong> We couldn't find any appointment matching <strong>"${escapeHTML(extraPayload)}"</strong>. Please ensure the Token ID/mobile number is correct.<br><br>Options:<br><br><span class="chat-chip" data-value="Book OPD">📅 Book OPD</span> <span class="chat-chip" data-value="Main Menu">🏠 Main Menu</span>`;
    }
    else if (action === 'cancel_start') {
      reply = "🗑️ <strong>Cancel Appointment:</strong><br>Please enter the **Token ID** (e.g. LXH-123456) of the appointment you wish to cancel:<br><br><em>(Type 'cancel' to exit)</em>";
    }
    else if (action === 'cancel_complete') {
      reply = `✅ <strong>Cancellation Complete:</strong> The appointment with Token ID <strong>${escapeHTML(extraPayload)}</strong> has been successfully cancelled and updated in our dashboard panel.<br><br><span class="chat-chip" data-value="Main Menu">🏠 Main Menu</span>`;
    }
    else if (action === 'live_connect') {
      // Connect live executive
      const chatStatusName = document.querySelector('#chat-widget-panel .chat-status h4');
      const chatStatusSpan = document.querySelector('#chat-widget-panel .chat-status span');
      const chatInput = document.getElementById('chat-widget-input');

      if (chatStatusName) chatStatusName.textContent = "Rahul (Support Executive)";
      if (chatStatusSpan) chatStatusSpan.innerHTML = '<span style="color: #28a745;">●</span> Live (Connected)';
      if (chatInput) chatInput.placeholder = "Type a message to Rahul (or 'exit')...";
      
      chatState.liveAgentConnected = true;
      reply = "👋 <strong>Hello! I am Rahul from the Laxmi Admin Desk.</strong> I have joined the chat to assist you directly. How can I help you? You can ask me about billing, report statuses, or ask me to schedule an appointment for you.";
    } 
    else if (action === 'live_reply') {
      const q = extraPayload.toLowerCase();
      
      if (['book', 'appointment', 'schedule', 'consultation', 'opd', 'meeting'].some(kw => q.includes(kw))) {
        chatState.mode = 'booking';
        chatState.bookingStep = 'name';
        chatState.bookingData = { name: '', mobile: '', department: '', doctorName: '', date: '' };
        reply = "I can definitely schedule that for you! Let's initialize your booking. To begin, please enter the **Patient's Full Name**:";
      } 
      else if (['timing', 'time', 'hours', 'opd timing', 'open'].some(kw => q.includes(kw))) {
        reply = "Certainly! Our general OPD consultation operates daily from 9:00 AM to 8:00 PM. The Emergency care Unit, ICU admission, and ambulance fleet services remain active 24/7.";
      } 
      else if (['insurance', 'cashless', 'tpa', 'card', 'bill'].some(kw => q.includes(kw))) {
        reply = "Yes, we accept cashless coverage from Star Health, HDFC Ergo, ICICI Lombard, SBI General, Bajaj Allianz, and major TPAs. Just carry your valid insurance/TPA card to the admin desk on admission.";
      }
      else if (['address', 'where', 'location', 'map', 'direction'].some(kw => q.includes(kw))) {
        reply = "We are located at Nagla Bari, Firozabad (UP). It is right on the main bypass. If you need navigation, I suggest visiting our Contact Us page for direct Google Maps guidance!";
      }
      else {
        reply = "Understood. As your support representative, I am here to help. Would you like me to guide you to start booking an OPD slot, share contact details, or explain our clinical departments?";
      }
    } 
    else if (action === 'cancelled') {
      reply = "🔄 **Session Reset:** I have cleared the active session. 😊 Back to Laxmi Digital Assistant. How can I help you today?";
    } 
    else if (action === 'pricing') {
      const storedPkgs = localStorage.getItem('laxmi_packages');
      let pkgs = [];
      if (storedPkgs) {
        try {
          pkgs = JSON.parse(storedPkgs);
        } catch(e) {}
      }
      if (pkgs && pkgs.length > 0) {
        let pkgLines = pkgs.map(p => `• ${p.name}: ${p.price}`).join('<br>');
        reply = `💰 <strong>HEALTH PACKAGE PRICING:</strong><br>${pkgLines}<br>Inquire at the reception desk for customization.`;
      } else {
        reply = CHAT_KEYWORDS['pricing'];
      }
    } 
    else {
      // General keywords reply
      reply = CHAT_KEYWORDS[action] || CHAT_KEYWORDS['default'];
    }

    sendBotMessage(reply);
  }, 750);
}

function scrollChatToBottom() {
  const chatMessages = document.getElementById('chat-widget-messages');
  if (!chatMessages) return;
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
