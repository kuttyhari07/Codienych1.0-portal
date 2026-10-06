export const EVENT_CONFIG = {
  EVENT_NAME: 'CODIENYCH 1.0',
  EVENT_TYPE: '24-HOUR HACKATHON',
  TAGLINE: '24 Hours of Coding, Creativity and Innovation.',
  MISSION_MOTTO: 'ONE HACKATHON. 24 HOURS. BUILD THE FUTURE.',
  
  REGISTRATION_DEADLINE: '2026-10-06T23:59:59+05:30',
  REGISTRATION_DEADLINE_DISPLAY: 'October 6, 2026, 11:59 PM IST',
  FORCE_REGISTRATION_CLOSED: true, // Manually closed by coordinator
  ALLOW_ONE_FINAL_TEAM: false, // Closed
  
  HACKATHON_START_DATE: '2026-10-08T09:00:00',
  HACKATHON_DATES_DISPLAY: 'October 8 – 9, 2026',
  
  REGISTRATION_FEE_PER_MEMBER: 500,
  PRIZE_POOL_DISPLAY: 'Upto ₹50,000+ & Free Internship',
  PRIZE_CASH_DISPLAY: 'Upto ₹50,000+',
  
  UPI_ID: 'EZE0222899@CUB',
  UPI_MERCHANT_NAME: 'THE PRINCIPAL ERODE SENGUNTHAR EN',
  BANK_NAME: 'City Union Bank',
  BRANCH_NAME: 'Erode Branch',
  ACCOUNT_NAME: 'The Principal, Erode Sengunthar Engineering College',
  ACCOUNT_NUMBER: '500101012593567',
  IFSC_CODE: 'CIUB0000059',
  ACCOUNT_TYPE: 'SB Account',
  
  COLLEGE_NAME: 'ERODE SENGUNTHAR ENGINEERING COLLEGE',
  DEPARTMENT: 'DEPARTMENT OF INFORMATION TECHNOLOGY',
  VENUE: 'ESEC CONVENTION CENTER, ERODE SENGUNTHAR ENGINEERING COLLEGE, ERODE, TAMILNADU',
  ORGANIZER_EMAIL: 'codienych@gmail.com',
  PHONE_NUMBER: '+91 63809 11912',
  ADMIN_CONTACTS: [
    { name: 'Hariharan G', phone: '+91 63809 11912' },
    { name: 'Lingeswaran M', phone: '+91 97516 39673' },
  ],
  ASSOCIATION_COORDINATOR: { name: 'Mr. M. Dhanapal, AP/IT', phone: '+91 99940 36446' },
  STAFF_COORDINATORS: [
    { name: 'Mr. S. Prabakaran, AP/IT', phone: '7904640937' },
    { name: 'Mr. M. Sujith Kumar, AP/IT', phone: '+919361636487' },
  ],
  STUDENT_COORDINATORS: [
    { name: 'RK Nandha Kumar', phone: '+91 93428 09449' },
    { name: 'R Sastha Babu', phone: '+91 90807 13459' },
    { name: 'R. Darshana', phone: '+91 63806 27552' },
    { name: 'M. Harini', phone: '+91 70940 61016' },
  ],
  OVERALL_COORDINATORS: 'IE Members And Association Members (Information Technology)',
  WHATSAPP_GROUP_URL: 'https://chat.whatsapp.com/J8wJdNPam0j7cJIOGnPXHy',
};

export const HACKATHON_DOMAINS = [
  {
    id: 'aiml',
    name: 'AI & Machine Learning (AI ML)',
    shortTitle: 'AI ML',
    tagline: 'Neural Piracy & Intelligent Agents',
    color: '#ffd700',
  },
  {
    id: 'web-app',
    name: 'Web & App Development',
    shortTitle: 'Web & App Dev',
    tagline: 'Digital Fleets & Full-Stack Artifacts',
    color: '#00e5ff',
  },
  {
    id: 'cybersecurity',
    name: 'Cyber Security',
    shortTitle: 'Cyber Security',
    tagline: 'High-Seas Defense & Cryptographic Bastions',
    color: '#ff4444',
  },
  {
    id: 'iot',
    name: 'Internet of Things (IOT)',
    shortTitle: 'IOT',
    tagline: 'Connected Vessels & Telemetry (Simulation / Hardware)',
    color: '#39ff14',
  },
  {
    id: 'cloud',
    name: 'Cloud Computing',
    shortTitle: 'Cloud Computing',
    tagline: 'Distributed Oceans & Scalable Infrastructure',
    color: '#b388ff',
  },
];

/**
 * Check if the registration deadline has passed or if manually closed.
 * Also supports URL preview override ?closed=true for administrative testing.
 */
export const isRegistrationClosed = () => {
  try {
    // If coordinator manually closed registrations:
    if (EVENT_CONFIG.FORCE_REGISTRATION_CLOSED) {
      return true;
    }
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('closed') === 'true') return true;
      if (params.get('open') === 'true') return false;
    }
    // If coordinator explicitly opened 1 final team slot:
    if (EVENT_CONFIG.ALLOW_ONE_FINAL_TEAM) {
      return false;
    }
    const deadline = new Date(EVENT_CONFIG.REGISTRATION_DEADLINE).getTime();
    return Date.now() >= deadline;
  } catch (e) {
    return true;
  }
};
