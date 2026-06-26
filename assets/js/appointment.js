/* ==========================================================================
   Laxmi Hospital, Firozabad - Appointment Booking Engine
   Handles dynamic doctor assignment, validation, and simulated bookings
   ========================================================================== */

// Mapping of Departments to Doctors (dynamically resolved from localStorage or fallbacks)
const DEFAULT_DEPT_DOCTORS = {
  "General Medicine": [
    { id: "dr-piyush-taneja", name: "Dr. Piyush Taneja (M.B.B.S., M.D. Medicine)" }
  ],
  "Gynecology": [
    { id: "dr-lata-rajput", name: "Dr. Lata Rajput (M.S. Obstetrics & Gynecology)" }
  ],
  "Pediatrics": [
    { id: "dr-paras-rajput", name: "Dr. Paras Rajput (M.D. Pediatrics)" }
  ],
  "Orthopedics": [
    { id: "dr-amit-gupta", name: "Dr. Amit Gupta (M.S. Orthopedics, Joint Replacement)" },
    { id: "dr-premraj", name: "Dr. Premraj (MBBS, MS Orthopedics)" }
  ],
  "General Surgery": [
    { id: "dr-ajay-bahadur-singh", name: "Dr. Ajay Bahadur Singh (M.S. General Surgery, Chief Surgeon)" }
  ],
  "Emergency Care": [
    { id: "emergency-duty", name: "Duty Emergency Medical Officer (24x7 Available)" },
    { id: "dr-sachin-tiwari", name: "Dr. Sachin Tiwari (Consultant Intensivist)" }
  ],
  "ICU": [
    { id: "dr-piyush-taneja", name: "Dr. Piyush Taneja (Consultant Physician)" },
    { id: "dr-sachin-tiwari", name: "Dr. Sachin Tiwari (Consultant Anesthesiologist & Intensivist)" }
  ],
  "Trauma Care": [
    { id: "dr-amit-gupta", name: "Dr. Amit Gupta (Trauma & Joint Specialist)" },
    { id: "dr-premraj", name: "Dr. Premraj (Senior Orthopedic Surgeon)" },
    { id: "dr-sachin-tiwari", name: "Dr. Sachin Tiwari (Consultant Intensivist)" }
  ],
  "Cardiology": [
    { id: "dr-piyush-taneja", name: "Dr. Piyush Taneja (M.B.B.S., M.D. Medicine - Cardiology Consult)" }
  ],
  "Neurology": [
    { id: "dr-piyush-taneja", name: "Dr. Piyush Taneja (M.B.B.S., M.D. Medicine - Neurology Consult)" }
  ],
  "ENT": [
    { id: "dr-ajay-bahadur-singh", name: "Dr. Ajay Bahadur Singh (M.S. General Surgery - ENT Surgery Consult)" }
  ],
  "Physiotherapy": [
    { id: "dr-amit-gupta", name: "Dr. Amit Gupta (Supervising Joint Surgeon)" }
  ]
};

let DEPT_DOCTORS = {};

// Load dynamic doctors database mapped by department
function loadBookingDatabase() {
  const storedDocs = localStorage.getItem('laxmi_doctors');
  if (storedDocs) {
    try {
      const doctorsList = JSON.parse(storedDocs);
      DEPT_DOCTORS = {};
      // Initialize empty mapping for all standard departments
      Object.keys(DEFAULT_DEPT_DOCTORS).forEach(dept => {
        DEPT_DOCTORS[dept] = [];
      });
      
      // Always keep Emergency Duty Emergency Officer
      DEPT_DOCTORS["Emergency Care"].push({ id: "emergency-duty", name: "Duty Emergency Medical Officer (24x7 Available)" });

      doctorsList.forEach(doc => {
        if (doc.departments && Array.isArray(doc.departments)) {
          doc.departments.forEach(dept => {
            if (!DEPT_DOCTORS[dept]) {
              DEPT_DOCTORS[dept] = [];
            }
            // Avoid duplicate entries
            if (!DEPT_DOCTORS[dept].some(d => d.id === doc.id)) {
              DEPT_DOCTORS[dept].push({
                id: doc.id,
                name: `${doc.name} (${doc.qual})`
              });
            }
          });
        }
      });
    } catch(e) {
      console.error("Failed to parse dynamic doctors list. Falling back to presets.", e);
      DEPT_DOCTORS = Object.assign({}, DEFAULT_DEPT_DOCTORS);
    }
  } else {
    DEPT_DOCTORS = Object.assign({}, DEFAULT_DEPT_DOCTORS);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadBookingDatabase();
  initBookingSystem();
});

function initBookingSystem() {
  const deptSelect = document.getElementById('book-dept');
  const docSelect = document.getElementById('book-doctor');
  const dateInput = document.getElementById('book-date');
  const bookingForm = document.getElementById('appointment-booking-form');
  
  if (!deptSelect || !docSelect) return;

  const currentSelectedDept = deptSelect.value;

  // Populate Department Dropdown dynamically from localStorage
  const storedDepts = localStorage.getItem('laxmi_departments');
  let departments = [];
  if (storedDepts) {
    try {
      departments = JSON.parse(storedDepts).filter(d => d.isActive);
    } catch(e) {
      console.error("Failed to parse departments for booking dropdown", e);
    }
  }
  
  if (departments.length > 0) {
    const placeholder = deptSelect.options[0];
    deptSelect.innerHTML = '';
    if (placeholder) {
      deptSelect.appendChild(placeholder);
    } else {
      deptSelect.innerHTML = '<option value="" disabled selected>Select Medical Speciality *</option>';
    }
    
    departments.forEach(dept => {
      const option = document.createElement('option');
      option.value = dept.title;
      option.textContent = dept.title;
      deptSelect.appendChild(option);
    });

    // Restore previously selected department if still available
    if (currentSelectedDept && Array.from(deptSelect.options).some(o => o.value === currentSelectedDept)) {
      deptSelect.value = currentSelectedDept;
    }
  }
  
  // 1. Set tomorrow's date as the minimum date in calendar
  if (dateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    dateInput.min = `${yyyy}-${mm}-${dd}`;
  }
  
  // 2. Dynamic dropdown update when department changes
  const updateDoctorDropdown = (selectedDept) => {
    docSelect.innerHTML = '<option value="" disabled selected>Choose Doctor *</option>';
    
    if (selectedDept && DEPT_DOCTORS[selectedDept] && DEPT_DOCTORS[selectedDept].length > 0) {
      DEPT_DOCTORS[selectedDept].forEach(doctor => {
        const option = document.createElement('option');
        option.value = doctor.id;
        option.textContent = doctor.name;
        docSelect.appendChild(option);
      });
      docSelect.disabled = false;
      return true;
    } else {
      const option = document.createElement('option');
      option.value = "";
      option.textContent = "No Doctors Available *";
      option.disabled = true;
      option.selected = true;
      docSelect.appendChild(option);
      docSelect.disabled = true;
      return false;
    }
  };

  // Re-sync doctor dropdown options for selected department
  if (deptSelect.value) {
    updateDoctorDropdown(deptSelect.value);
  }

  if (!deptSelect._hasChangeListener) {
    deptSelect._hasChangeListener = true;
    deptSelect.addEventListener('change', () => {
      updateDoctorDropdown(deptSelect.value);
    });
  }

  // 2b. Parse URL Query Parameters on load (?dept=... or ?doctor=...)
  const urlParams = new URLSearchParams(window.location.search);
  const paramDept = urlParams.get('dept');
  const paramDoctor = urlParams.get('doctor');

  if (paramDept) {
    // Find matching option (case insensitive match)
    for (let option of deptSelect.options) {
      if (option.value.toLowerCase() === paramDept.toLowerCase()) {
        deptSelect.value = option.value;
        updateDoctorDropdown(option.value);
        break;
      }
    }
  }

  if (paramDoctor) {
    // Find department for this doctor
    let foundDept = null;
    let foundDocId = null;
    
    for (let dept in DEPT_DOCTORS) {
      const match = DEPT_DOCTORS[dept].find(d => d.id === paramDoctor);
      if (match) {
        foundDept = dept;
        foundDocId = match.id;
        break;
      }
    }
    
    if (foundDept && foundDocId) {
      deptSelect.value = foundDept;
      updateDoctorDropdown(foundDept);
      docSelect.value = foundDocId;
    }
  }

  // 3. Form submission validation and local storage integration
  if (bookingForm && !bookingForm._hasSubmitListener) {
    bookingForm._hasSubmitListener = true;
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('book-name').value.trim();
      const mobile = document.getElementById('book-mobile').value.trim();
      const department = deptSelect.value;
      const doctorId = docSelect.value;
      const doctorName = docSelect.options[docSelect.selectedIndex].text;
      const date = dateInput.value;
      const message = document.getElementById('book-message').value.trim();
      
      // Basic input validation
      if (!name || !mobile || !department || !doctorId || !date) {
        showFeedback('Please fill out all required fields marked with *', 'error');
        return;
      }
      
      // Indian mobile phone check (10 digits)
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(mobile)) {
        showFeedback('Please enter a valid 10-digit Indian mobile number (e.g. 9876543210)', 'error');
        return;
      }
      
      // Generate unique booking receipt details
      const appointmentId = 'LXH-' + Math.floor(100000 + Math.random() * 900000);
      const bookingData = {
        appointmentId,
        name,
        mobile,
        department,
        doctorId,
        doctorName,
        date,
        message,
        timestamp: new Date().toISOString()
      };
      
      // Save appointment locally for reference
      let appointments = JSON.parse(localStorage.getItem('laxmi_appointments') || '[]');
      appointments.push(bookingData);
      localStorage.setItem('laxmi_appointments', JSON.stringify(appointments));
      
      // Show elegant visual success state in place of form
      renderBookingSuccess(bookingForm, bookingData);
    });
  }
}

/* --- Inline feedback indicators --- */
function showFeedback(text, type) {
  let existingAlert = document.querySelector('.booking-alert');
  if (existingAlert) existingAlert.remove();
  
  const alertDiv = document.createElement('div');
  alertDiv.className = `booking-alert btn-${type === 'error' ? 'emergency' : 'secondary'}`;
  alertDiv.style.width = '100%';
  alertDiv.style.padding = '12px 16px';
  alertDiv.style.borderRadius = 'var(--radius-sm)';
  alertDiv.style.marginBottom = '20px';
  alertDiv.style.fontSize = '0.9rem';
  alertDiv.style.fontWeight = '600';
  alertDiv.style.textAlign = 'center';
  alertDiv.style.animation = 'fadeIn 0.3s ease';
  alertDiv.innerText = text;
  
  const formBox = document.querySelector('.booking-form-box');
  if (formBox) {
    const heading = formBox.querySelector('h3');
    heading.after(alertDiv);
    
    // Auto-dismiss after 6 seconds
    setTimeout(() => {
      alertDiv.remove();
    }, 6000);
  }
}

/* --- Elegant dynamic receipt drawer --- */
function renderBookingSuccess(formElement, data) {
  const container = formElement.parentElement;
  if (!container) return;
  
  // Format appointment date nicely
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = new Date(data.date).toLocaleDateString('en-US', options);
  
  container.innerHTML = `
    <div class="booking-success-card" style="text-align: center; padding: 10px 0; animation: fadeIn 0.6s ease;">
      <div class="success-icon-badge" style="width: 72px; height: 72px; background-color: var(--secondary-light); color: var(--secondary); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2.2rem; margin: 0 auto 24px auto; box-shadow: var(--shadow-teal);">
        ✓
      </div>
      <h3 style="font-size: 1.8rem; font-weight: 800; color: var(--primary); margin-bottom: 8px;">Appointment Confirmed!</h3>
      <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 24px; max-width: 420px; margin-left: auto; margin-right: auto;">
        Dear <strong>${data.name}</strong>, your digital booking slot has been secured. A confirmation SMS with details has been simulated.
      </p>
      
      <!-- Receipt Box -->
      <div class="receipt-box" style="background-color: var(--bg-light); border: var(--border-light); border-radius: var(--radius-md); padding: 24px; text-align: left; margin-bottom: 30px; box-shadow: var(--shadow-sm);">
        <div style="display: flex; justify-content: space-between; border-bottom: 1.5px dashed var(--border-color); padding-bottom: 12px; margin-bottom: 16px;">
          <span style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Receipt Details</span>
          <span style="font-size: 0.9rem; font-weight: 800; color: var(--primary);">${data.appointmentId}</span>
        </div>
        
        <div style="display: flex; flex-direction: column; gap: 10px; font-size: 0.9rem;">
          <div><span style="color: var(--text-muted);">Specialist:</span> <strong style="color: var(--text-dark);">${data.doctorName}</strong></div>
          <div><span style="color: var(--text-muted);">Department:</span> <span style="font-weight: 600; color: var(--text-dark);">${data.department}</span></div>
          <div><span style="color: var(--text-muted);">Scheduled Date:</span> <span style="font-weight: 600; color: var(--text-dark);">${formattedDate}</span></div>
          <div><span style="color: var(--text-muted);">Patient Contact:</span> <span style="font-weight: 600; color: var(--text-dark);">${data.mobile}</span></div>
        </div>
      </div>
      
      <!-- Action Buttons -->
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <a href="https://wa.me/917078221122?text=Hi%20Laxmi%20Hospital%2C%20I%20have%20booked%20an%20appointment%20with%20ID%20${data.appointmentId}%20for%20${data.doctorName}%20on%20${data.date}.%20Please%20confirm%20my%20arrival." 
           target="_blank" 
           class="btn btn-whatsapp" 
           style="width: 100%;">
          <i class="fab fa-whatsapp"></i> Confirm Arrival on WhatsApp
        </a>
        <button onclick="window.location.reload();" class="btn btn-outline" style="width: 100%;">
          Book Another Appointment
        </button>
      </div>
    </div>
  `;
}

/* --- Cross-tab Real-time Synchronization --- */
window.addEventListener('storage', (e) => {
  if (e.key === 'laxmi_doctors' || e.key === 'laxmi_departments') {
    loadBookingDatabase();
    initBookingSystem();
  }
});
