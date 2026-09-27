const SUPABASE_URL = "https://evcslijagfygsnkirrpc.supabase.co";
const SUPABASE_KEY = "sb_publishable_52yxCR78Mo40JSL_UNMTmQ_t1D6qAtJ";
const SCELL_STORAGE_BUCKET = "scell-assets";

const db = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;

const SCELL_DATA = {
  stats: {
    eventsCount: 0,
    studentsCount: 650,
    projectsCount: 3,
    startupsCount: 3,
    grantsAwarded: "₹ 14.5L"
  },
  events: [],
  registrations: [],
  assets: [],
  siteContent: {
    home: {
      heading: 'BUILD. INNOVATE. LAUNCH.',
      subheading: 'Building an uncompromising innovation and entrepreneurship ecosystem at Government Engineering College, West Champaran.',
      description: 'From embedded hardware to venture-backed startups, SCELL creates a practical bridge from campus ideas to scalable impact.',
      ctaPrimary: 'EXPLORE MISSIONS',
      ctaSecondary: 'JOIN SCELL FELLOWSHIP',
      announcement: 'SCELL // STARTUP_CELL.GECWC_INCUBATOR',
      featuredEvent: 'Innovation Sprint 2026',
      featuredProject: 'GandakHydro',
      visible: true
    },
    events: { heading: 'Events', subtitle: 'Launch pads for student-led innovation', intro: 'Official events, workshops, competitions and startup programmes from SCELL GECWC.', showUpcoming: true, showPast: true, visible: true },
    projects: { heading: 'R&D Prototypes', subtitle: 'Student innovations', intro: 'Research and product prototypes built across the campus ecosystem.', visible: true },
    startups: { heading: 'Student Enterprises', subtitle: 'Entrepreneurial ventures', intro: 'Commercial ideas turning into ventures with real-world traction.', visible: true },
    arena: { heading: 'SCELL Arena', subtitle: 'Participation and recognition', intro: 'Simple, clean profiles for members of the SCELL community.', visible: true },
    memories: { heading: 'Memories & Footprints', subtitle: 'Visual archive', intro: 'Moments from workshops, competitions and community events.', visible: true },
    team: { heading: 'People powering innovation', subtitle: 'Leadership and student network', intro: 'Faculty, coordinators, representatives and builders behind SCELL.', visible: true },
    about: { heading: 'About SCELL GECWC', subtitle: 'Our charter', intro: 'SCELL helps students transform ideas into prototypes, ventures and measurable impact.', visible: true }
  },
  projects: [
    {
      id: "PRJ-01",
      name: "GandakHydro: IoT Flood Early-Warning Telemetry",
      category: "IoT / EMBEDDED",
      status: "TESTING IN RIVER BASIN",
      team: ["Anurag Kumar (CSE)", "Sneha Roy (ECE)", "Amit Patel (EE)"],
      problem: "Seasonal flooding of the Gandak River causes severe damage to West Champaran crops without real-time upstream surge notifications.",
      solution: "Solar-powered LoRa mesh nodes deployed along embankment stations sending millimetric water level and flow telemetry to local panchayats.",
      techStack: ["ESP32", "LoRaWAN 868MHz", "TimescaleDB", "Tailwind/Next.js", "FreeRTOS"],
      github: "https://github.com",
      demo: "#",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: "PRJ-02",
      name: "AgriVision AI: Cane Leaf Disease Classifier",
      category: "AI / COMPUTER VISION",
      status: "PILOT AT MAJHUALIA",
      team: ["Vikash Mehta (CSE-AI)", "Pooja Kumari (CSE)"],
      problem: "Sugarcane red rot disease in Bihar goes unnoticed until 40% of the yield is permanently damaged.",
      solution: "Offline edge-inference mobile application running a quantized MobileNetV3 model to spot fungal spots in under 200 milliseconds.",
      techStack: ["TensorFlow Lite", "Python", "Flutter", "FastAPI"],
      github: "https://github.com",
      demo: "#",
      image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: "PRJ-03",
      name: "VidyutRover: Low-Cost Agricultural EV Tiller",
      category: "EV / HARDWARE",
      status: "FABRICATION STAGE",
      team: ["Ravi Shankar (ME)", "Prince Verma (EE)", "Alok Gupta (ECE)"],
      problem: "Smallholder farmers cannot afford heavy 45HP diesel tractors for 1-acre fragmented farmlands.",
      solution: "Modular 48V LiFePO4 battery-swappable electric power tiller with regenerative torque steering.",
      techStack: ["BLDC Motor Controller", "SolidWorks", "CAN Bus", "Arduino"],
      github: "https://github.com",
      demo: "#",
      image: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=800&auto=format&fit=crop"
    }
  ],
  startups: [
    {
      id: "STP-01",
      name: "Champaran AgroTech Solutions",
      stage: "INCUBATED · SEED APPLIED",
      founders: "Kunal Kashyap (Batch '24) & Priya Ranjan",
      category: "AGRITECH LOGISTICS",
      valuation: "₹ 1.2 Cr Target",
      description: "Connecting sugarcane and banana cultivators directly with regional procurement mills through micro-warehousing cold lockers.",
      achievements: "Winner of Bihar Innovation Challenge 2025; ₹3L prototype grant sanction."
    },
    {
      id: "STP-02",
      name: "DroneNirvaha Systems",
      stage: "PILOT DEPLOYMENT",
      founders: "Md. Tariq & Siddharth Anand",
      category: "DRONE-AS-A-SERVICE",
      valuation: "₹ 80 Lakhs",
      description: "Precision pesticide mist spraying services and infrared land-boundary orthomosaic mapping for North Bihar farmers.",
      achievements: "Cleared DGCA training protocol; 140+ acres serviced in Bettiah rural belt."
    },
    {
      id: "STP-03",
      name: "Edunova VR Labs",
      stage: "PROTOTYPE TESTING",
      founders: "Shweta Tiwari & Rahul Raj",
      category: "EDTECH / IMMERSIVE",
      valuation: "Bootstrapped",
      description: "Ultra-low-cost cardboard VR science kits mapped to Bihar State Board secondary school curriculum.",
      achievements: "Piloted across 4 government high schools in West Champaran."
    }
  ],
  arena: {
    leaderboard: [],
    badgeCatalog: [
      { id: "HACKATHON_CHAMP", title: "Hackathon Victor", desc: "Top 3 placement in state-recognized hackathons." },
      { id: "DRONE_MASTERY", title: "Drone Aviator", desc: "Completed 40 hours of flight telemetry workshops." },
      { id: "INNOVATOR", title: "Prototype Builder", desc: "Fabricated hardware or launched deployed software at SCELL." },
      { id: "PATENT_FILED", title: "IP Creator", desc: "Submitted provisional patent or design registration." }
    ]
  },
  team: {
    faculty: [],
    districtCoordinator: null,
    studentRepresentatives: [],
    coordinators: [],
    leads: [],
    developedBy: {
      name: "SCELL Platform Team",
      branch: "To be updated",
      batch: "Campus Innovation Team",
      role: "Website & Digital Operations",
      image: "",
      status: "SYSTEM ARCHITECT",
      badge: "PLATFORM BUILDER",
      description: "This profile can be edited by the admin whenever the official platform lead details are finalized."
    }
  },
  memories: [
    { id: 1, title: "Drone Calibration & Autonomous Test Flight", tag: "WORKSHOP", date: "FEB 2026", img: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?q=80&w=800&auto=format&fit=crop" },
    { id: 2, title: "Bihar Startup Conclave Delegation Pitch", tag: "STARTUP", date: "DEC 2025", img: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=800&auto=format&fit=crop" },
    { id: 3, title: "Hardware Circuit Soldering & PCB Assembly", tag: "HACKATHON", date: "NOV 2025", img: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop" },
    { id: 4, title: "National Science Day Innovation Showcase", tag: "EXHIBITION", date: "FEB 2026", img: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop" },
    { id: 5, title: "Design Sprint & Ideation Blackboard Session", tag: "BRAINSTORM", date: "OCT 2025", img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop" },
    { id: 6, title: "Industrial Mentor Round with Senior Engineers", tag: "MENTORSHIP", date: "SEP 2025", img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop" }
  ]
};

function hydratePersistedScellData() {
  const saved = JSON.parse(localStorage.getItem('scell_cms_state_v1') || 'null');
  if (!saved) return;

  if (saved.events) SCELL_DATA.events = saved.events;
  if (saved.registrations) SCELL_DATA.registrations = saved.registrations;
  if (saved.assets) SCELL_DATA.assets = saved.assets;
  if (saved.siteContent) SCELL_DATA.siteContent = { ...SCELL_DATA.siteContent, ...saved.siteContent };
  if (saved.projects) SCELL_DATA.projects = saved.projects;
  if (saved.startups) SCELL_DATA.startups = saved.startups;
  if (saved.memories) SCELL_DATA.memories = saved.memories;
  if (saved.team) SCELL_DATA.team = { ...SCELL_DATA.team, ...saved.team };
  if (saved.arena) SCELL_DATA.arena = { ...SCELL_DATA.arena, ...saved.arena };
  SCELL_DATA.stats.eventsCount = SCELL_DATA.events.length;
}

function savePersistedScellData() {
  localStorage.setItem('scell_cms_state_v1', JSON.stringify({
    events: SCELL_DATA.events,
    registrations: SCELL_DATA.registrations,
    assets: SCELL_DATA.assets,
    siteContent: SCELL_DATA.siteContent,
    projects: SCELL_DATA.projects,
    startups: SCELL_DATA.startups,
    memories: SCELL_DATA.memories,
    team: SCELL_DATA.team,
    arena: SCELL_DATA.arena
  }));
}

function hydrateTeamDirectory() {
  try {
    const saved = JSON.parse(localStorage.getItem('scell_team_directory_v1') || 'null');
    if (!saved) return;
    if (saved.faculty) SCELL_DATA.team.faculty = saved.faculty;
    if (saved.districtCoordinator) SCELL_DATA.team.districtCoordinator = saved.districtCoordinator;
    if (saved.studentRepresentatives) SCELL_DATA.team.studentRepresentatives = saved.studentRepresentatives;
    if (saved.coordinators) SCELL_DATA.team.coordinators = saved.coordinators;
    if (saved.developedBy) SCELL_DATA.team.developedBy = saved.developedBy;
    if (Array.isArray(saved.studentCoordinators)) SCELL_DATA.team.studentRepresentatives = saved.studentCoordinators;
    if (Array.isArray(saved.coreTeam)) SCELL_DATA.team.studentRepresentatives = saved.coreTeam;
    SCELL_DATA.team.leads = SCELL_DATA.team.studentRepresentatives;
  } catch (err) {
    console.warn('Team directory hydrate failed:', err);
  }
}

function saveTeamDirectory() {
  try {
    const payload = {
      faculty: SCELL_DATA.team.faculty,
      districtCoordinator: SCELL_DATA.team.districtCoordinator,
      studentRepresentatives: SCELL_DATA.team.studentRepresentatives,
      coordinators: SCELL_DATA.team.coordinators,
      developedBy: SCELL_DATA.team.developedBy
    };
    localStorage.setItem('scell_team_directory_v1', JSON.stringify(payload));
    SCELL_DATA.team.leads = SCELL_DATA.team.studentRepresentatives;
  } catch (err) {
    console.warn('Team directory save failed:', err);
  }
}

function getCurrentStudentSession() {
  try {
    const raw = sessionStorage.getItem('scell_student_session');
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
}

function saveCurrentStudentSession(student) {
  if (!student) return;
  sessionStorage.setItem('scell_student_session', JSON.stringify(student));
}

async function ensureStorageBucket() {
  if (!db) return false;
  try {
    const { error } = await db.storage.from(SCELL_STORAGE_BUCKET).list();
    if (error && error.message && error.message.toLowerCase().includes('not found')) {
      const { error: createError } = await db.storage.createBucket(SCELL_STORAGE_BUCKET, { public: true, allowedMimeTypes: ['image/*', 'application/pdf'], fileSizeLimit: '10MB' });
      if (createError) console.warn('Storage bucket create warning:', createError.message);
      return !createError;
    }
    return true;
  } catch (err) {
    console.warn('Storage bucket check failed:', err);
    return false;
  }
}

async function uploadAssetToStorage(file, path) {
  if (!db || !file) return null;
  const bucket = SCELL_STORAGE_BUCKET;
  const filePath = path || `${Date.now()}-${file.name}`;
  const { data, error } = await db.storage.from(bucket).upload(filePath, file, {
    cacheControl: '3600',
    upsert: true,
    contentType: file.type
  });
  if (error) {
    console.error('Storage upload failed:', error);
    return null;
  }
  const { data: publicUrlData } = db.storage.from(bucket).getPublicUrl(filePath);
  return publicUrlData?.publicUrl || null;
}

async function dispatchStudentWebhook(payload, endpointName) {
  const url = endpointName && endpointName.includes('welcome') ? 'https://example.com/scell-webhook/welcome' : 'https://example.com/scell-webhook/ticket';
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return response.ok;
  } catch (error) {
    console.warn(`${endpointName} webhook failed:`, error);
    return false;
  }
}

async function syncFromCloud() {
  if (!db) return;

  try {
    await ensureStorageBucket();

    const { data: eventsData, error: evErr } = await db.from('events').select('*').order('created_at', { ascending: false });
    if (!evErr && eventsData) {
      SCELL_DATA.events = eventsData.map(e => ({
        id: e.id,
        title: e.title,
        category: e.category || 'WORKSHOP',
        status: e.status || 'UPCOMING',
        featured: e.featured || false,
        date: e.event_date || 'TBA',
        time: e.time || '10:00 AM IST',
        venue: e.venue || 'GECWC Campus',
        collaborator: e.collaborator || 'SCELL GECWC',
        poster: e.poster_url || 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=1200&auto=format&fit=crop',
        rulebook: e.rulebook_url || '',
        registrationOpen: e.registration_open ?? true,
        seatsTotal: e.seats_total || 100,
        seatsFilled: e.seats_filled || 0,
        badge: e.badge || (e.status === 'UPCOMING' ? 'ACTIVE' : 'ARCHIVED'),
        description: e.description || 'Official Event organized by Startup Cell, GEC West Champaran.',
        winners: e.winners || [],
        gallery: e.gallery_urls || []
      }));
      SCELL_DATA.stats.eventsCount = SCELL_DATA.events.length;
    }

    const { data: regData, error: regErr } = await db.from('registrations').select('*').order('created_at', { ascending: false });
    if (!regErr && regData) {
      SCELL_DATA.registrations = regData.map(r => ({
        id: r.id,
        eventId: r.event_id,
        eventName: r.event_name,
        name: r.name,
        roll: r.roll,
        email: r.email,
        branch: r.branch,
        sem: r.sem,
        status: 'CONFIRMED'
      }));
    }
  } catch (err) {
    console.error('Cloud Sync Exception:', err);
  }
}

async function lookupStudentByRoll(roll) {
  if (!db || !roll) return null;
  const normalized = String(roll).trim();
  if (!normalized) return null;

  const { data, error } = await db.from('students').select('*').eq('roll', normalized).maybeSingle();
  if (error) {
    console.warn('Student lookup failed:', error.message);
    return null;
  }
  return data || null;
}

async function fetchStudentByIdentifier(identifier) {
  if (!db || !identifier) return null;
  const value = String(identifier).trim();
  if (!value) return null;
  const { data, error } = await db.from('students').select('*').or(`roll.eq.${value},email.eq.${value}`).maybeSingle();
  if (error) {
    console.warn('Student identifier lookup failed:', error.message);
    return null;
  }
  return data || null;
}

async function registerEventInStore(payload) {
  if (!db) throw new Error('Database connection is not configured.');
  const { data, error } = await db.from('registrations').insert([payload]).select();
  if (error) throw error;
  return data?.[0] || null;
}

async function ensureUniqueRegistration(eventId, roll) {
  if (!db) return false;
  const { data, error } = await db.from('registrations').select('id').eq('event_id', eventId).eq('roll', roll).maybeSingle();
  if (error) {
    console.warn('Duplicate check failed:', error.message);
    return false;
  }
  return !!data;
}

function generateRegistrationId() {
  const stamp = Date.now().toString().slice(-6);
  return `SCELL-${new Date().getFullYear()}-${stamp}`;
}

function generateDailyOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function createRegistrationPayload({ id, eventId, eventName, name, roll, email, branch, sem, year, batch, phone, qrData, status = 'confirmed' }) {
  return {
    id,
    event_id: eventId,
    event_name: eventName,
    name,
    roll,
    email,
    branch,
    sem,
    year,
    batch,
    phone,
    qr_payload: JSON.stringify(qrData),
    status
  };
}

async function triggerOtpEmail(email, otp, studentName) {
  const payload = {
    to: email,
    subject: 'SCELL GECWC - Email Verification OTP',
    template: 'otp_verification',
    otp,
    studentName
  };
  return dispatchStudentWebhook(payload, 'welcome');
}

async function triggerWelcomeEmail(student) {
  const payload = {
    to: student.email,
    subject: 'Welcome to SCELL GECWC',
    template: 'welcome_cadre',
    studentName: student.name,
    roll: student.roll,
    branch: student.branch
  };
  return dispatchStudentWebhook(payload, 'welcome');
}

async function triggerTicketEmail(registrationPayload) {
  const payload = {
    to: registrationPayload.email,
    subject: `Your SCELL Event Pass - ${registrationPayload.event_name}`,
    template: 'event_ticket',
    ...registrationPayload
  };
  return dispatchStudentWebhook(payload, 'ticket');
}