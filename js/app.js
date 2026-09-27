let currentRoute = 'home';
let currentEventFilter = 'ALL';
let currentProjectFilter = 'ALL';
const SCELL_APP_STATE = {
  rollLookupTimer: null,
  lastAutoFillStudent: null,
  pendingOtp: null,
  pendingRole: null
};

const SCELL_ADMIN_STATE = {
  activeTab: 'missions',
  editingEventId: null,
  editingTeamMemberId: null,
  contentSection: 'home'
};

async function initApp() {
  if (localStorage.theme === 'light' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: light)').matches)) {
    document.documentElement.classList.remove('dark');
  } else {
    document.documentElement.classList.add('dark');
  }

  const hash = window.location.hash.replace('#', '');
  if (hash && ['home', 'events', 'projects', 'startups', 'arena', 'memories', 'team', 'about', 'admin'].includes(hash)) {
    currentRoute = hash;
  }

  runBootSequence();
  hydratePersistedScellData();
  await syncFromCloud();
  hydrateTeamDirectory();
  savePersistedScellData();
  updateAuthNavbar();
  renderRoute(currentRoute);
  initCanvas();
  initCursor();
  setupGlobalListeners();
}

function runBootSequence() {
  const boot = document.getElementById('bootloader');
  const bar = document.getElementById('boot-bar');
  const percent = document.getElementById('boot-percent');
  const text = document.getElementById('boot-text');

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 22) + 12;
    if (progress > 100) progress = 100;

    bar.style.width = progress + '%';
    percent.innerText = progress + '%';

    if (progress > 40 && progress < 80) {
      text.innerText = 'SYNCING SUPABASE POSTGRES...';
    } else if (progress >= 80) {
      text.innerText = 'SYSTEM READY // SCELL ONLINE';
    }

    if (progress === 100) {
      clearInterval(interval);
      setTimeout(() => {
        boot.style.opacity = '0';
        setTimeout(() => {
          boot.style.display = 'none';
          lucide.createIcons();
        }, 700);
      }, 350);
    }
  }, 70);
}

function navigate(route, param = null) {
  currentRoute = route;
  window.location.hash = route;
  window.scrollTo({ top: 0, behavior: 'smooth' });

  document.querySelectorAll('.nav-btn').forEach(btn => {
    if (btn.getAttribute('data-route') === route) {
      btn.classList.add('text-brand-electric', 'dark:text-brand-neon', 'font-bold');
    } else {
      btn.classList.remove('text-brand-electric', 'dark:text-brand-neon', 'font-bold');
    }
  });

  renderRoute(route, param);
}

function mobileNav(route) {
  document.getElementById('mobile-menu').classList.add('translate-x-full');
  if (route) navigate(route);
}

function renderRoute(route, param = null) {
  const app = document.getElementById('app');
  
  switch(route) {
    case 'home':
      app.innerHTML = renderHomeView();
      initCountUps();
      break;
    case 'events':
      app.innerHTML = renderEventsView();
      break;
    case 'event-detail':
      app.innerHTML = renderEventDetailView(param);
      break;
    case 'projects':
      app.innerHTML = renderProjectsView();
      break;
    case 'startups':
      app.innerHTML = renderStartupsView();
      break;
    case 'arena':
      app.innerHTML = renderArenaView();
      break;
    case 'memories':
      app.innerHTML = renderMemoriesView();
      break;
    case 'team':
      app.innerHTML = renderTeamView();
      break;
    case 'about':
      app.innerHTML = renderAboutView();
      break;
    case 'admin':
      app.innerHTML = renderAdminView();
      break;
    default:
      app.innerHTML = renderHomeView();
  }

  lucide.createIcons();
}

function setEventFilter(tab) {
  currentEventFilter = tab;
  renderRoute('events');
}

function setProjectFilter(tag) {
  currentProjectFilter = tag;
  renderRoute('projects');
}

/* Modal Openers & Closers */
function resetRegistrationForm() {
  const fields = ['reg-name', 'reg-roll', 'reg-email', 'reg-branch', 'reg-sem'];
  fields.forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.disabled = false;
      element.value = '';
    }
  });
  SCELL_APP_STATE.lastAutoFillStudent = null;
  const errorBox = document.getElementById('reg-error');
  if (errorBox) {
    errorBox.classList.add('hidden');
    errorBox.innerText = '';
  }
}

function bindRegistrationRollLookup() {
  const rollInput = document.getElementById('reg-roll');
  if (!rollInput || rollInput.dataset.bound === 'true') return;
  rollInput.dataset.bound = 'true';
  rollInput.addEventListener('input', () => {
    const value = rollInput.value.trim();
    if (!value || value.length < 3) {
      if (SCELL_APP_STATE.rollLookupTimer) clearTimeout(SCELL_APP_STATE.rollLookupTimer);
      return;
    }
    if (SCELL_APP_STATE.rollLookupTimer) clearTimeout(SCELL_APP_STATE.rollLookupTimer);
    SCELL_APP_STATE.rollLookupTimer = setTimeout(async () => {
      const student = await lookupStudentByRoll(value);
      if (student) {
        SCELL_APP_STATE.lastAutoFillStudent = student;
        const fields = {
          regName: document.getElementById('reg-name'),
          regEmail: document.getElementById('reg-email'),
          regBranch: document.getElementById('reg-branch'),
          regSem: document.getElementById('reg-sem')
        };
        if (fields.regName) {
          fields.regName.value = student.name || '';
          fields.regName.disabled = true;
        }
        if (fields.regEmail) {
          fields.regEmail.value = student.email || '';
          fields.regEmail.disabled = true;
        }
        if (fields.regBranch) {
          fields.regBranch.value = student.branch || fields.regBranch.value;
          fields.regBranch.disabled = true;
        }
        if (fields.regSem) {
          fields.regSem.value = student.sem || fields.regSem.value;
          fields.regSem.disabled = true;
        }
        showToast('Cadre record verified and prefilled.');
      } else {
        alert('Cadre record not found. Please register via Student Portal first.');
      }
    }, 400);
  });
}

function openRegistrationModal(eventId) {
  const event = SCELL_DATA.events.find(e => e.id === eventId) || SCELL_DATA.events[0];
  if (!event) return;
  document.getElementById('reg-event-id').value = event.id;
  document.getElementById('reg-event-title').innerText = 'Register: ' + event.title;
  document.getElementById('reg-form-container').classList.remove('hidden');
  document.getElementById('reg-success-slip').classList.add('hidden');
  document.getElementById('reg-error').classList.add('hidden');
  document.getElementById('reg-modal').classList.remove('hidden');
  resetRegistrationForm();
  bindRegistrationRollLookup();
}

function closeRegModal() {
  document.getElementById('reg-modal').classList.add('hidden');
}

function toggleTeamField(val) {
  const field = document.getElementById('team-name-group');
  if (val === 'Team') field.classList.remove('hidden');
  else field.classList.add('hidden');
}

/* Register Candidate Directly to Cloud */
async function generateQrPass(regId, roll, eventId, eventName) {
  const canvas = document.getElementById('reg-qr-canvas');
  const payload = {
    reg_id: regId,
    roll,
    event_id: eventId,
    event_name: eventName,
    timestamp: new Date().toISOString()
  };
  if (canvas && window.QRCode) {
    window.QRCode.toCanvas(canvas, JSON.stringify(payload), { width: 220, margin: 1 }, (error) => {
      if (error) console.error('QR generation failed:', error);
    });
  }
  return payload;
}

async function handleRegistrationSubmit(e) {
  e.preventDefault();
  const eventId = document.getElementById('reg-event-id').value;
  const event = SCELL_DATA.events.find(ev => ev.id === eventId);
  const name = document.getElementById('reg-name').value.trim();
  const roll = document.getElementById('reg-roll').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const branch = document.getElementById('reg-branch').value;
  const sem = document.getElementById('reg-sem').value;
  const errBox = document.getElementById('reg-error');

  if (!eventId || !event) {
    errBox.innerText = 'Please select a valid event.';
    errBox.classList.remove('hidden');
    return;
  }

  if (!name || !roll || !email) {
    errBox.innerText = 'Please fill in all required candidate details.';
    errBox.classList.remove('hidden');
    return;
  }

  if (db) {
    const duplicateExists = await ensureUniqueRegistration(eventId, roll);
    if (duplicateExists) {
      errBox.innerText = 'Candidate already registered for this mission.';
      errBox.classList.remove('hidden');
      return;
    }
  }

  const regId = generateRegistrationId();
  const payload = createRegistrationPayload({
    id: regId,
    eventId,
    eventName: event.title,
    name,
    roll,
    email,
    branch,
    sem,
    year: 'N/A',
    batch: 'N/A',
    phone: 'N/A',
    qrData: { reg_id: regId, roll, event_id: eventId, timestamp: new Date().toISOString() },
    status: 'confirmed'
  });

  try {
    if (!db) throw new Error('Database connection is not configured.');
    const inserted = await registerEventInStore(payload);
    const qrPayload = await generateQrPass(regId, roll, eventId, event.title);

    await db.from('events').update({ seats_filled: (event.seatsFilled || 0) + 1 }).eq('id', eventId);
    await triggerTicketEmail({ ...payload, event_name: event.title, qr_payload: JSON.stringify(qrPayload) });

    document.getElementById('slip-event-name').innerText = event.title;
    document.getElementById('slip-name').innerText = name;
    document.getElementById('slip-id').innerText = regId;
    document.getElementById('slip-roll').innerText = roll;
    document.getElementById('slip-dept').innerText = `${branch} · ${sem} Sem`;

    const qrWrap = document.getElementById('reg-qr-wrap');
    if (qrWrap) {
      qrWrap.innerHTML = '<canvas id="reg-qr-canvas" width="180" height="180"></canvas>';
      await generateQrPass(regId, roll, eventId, event.title);
    }

    document.getElementById('reg-form-container').classList.add('hidden');
    document.getElementById('reg-success-slip').classList.remove('hidden');
    await syncFromCloud();
    showToast('Pass Created: ' + regId);
    lucide.createIcons();
  } catch (error) {
    errBox.innerText = 'Registration failed: ' + (error?.message || 'Please try again.');
    errBox.classList.remove('hidden');
  }
}

function setAdminTab(tab) {
  SCELL_ADMIN_STATE.activeTab = tab;
  renderRoute('admin');
}

function formatEventDates(startDate, endDate) {
  if (!startDate) return 'TBA';
  const start = new Date(startDate + 'T00:00:00');
  if (!endDate || endDate === startDate) return start.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
  const end = new Date(endDate + 'T00:00:00');
  const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
  if (sameMonth) {
    return `${start.getDate()} – ${end.getDate()} ${start.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}`;
  }
  return `${start.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })} – ${end.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}`;
}

function formatEventTime(startTime, endTime) {
  if (!startTime) return 'TBA';
  const format = (value) => {
    if (!value) return '';
    const [hours, minutes] = value.split(':').map(Number);
    const suffix = hours >= 12 ? 'PM' : 'AM';
    const hour12 = ((hours + 11) % 12) + 1;
    return `${hour12}:${String(minutes).padStart(2, '0')} ${suffix}`;
  };

  if (!endTime) return format(startTime);
  return `${format(startTime)} – ${format(endTime)}`;
}

function getEventById(eventId) {
  return SCELL_DATA.events.find(event => event.id === eventId) || null;
}

function prefillEventEditor(eventId) {
  const event = getEventById(eventId);
  if (!event) return;

  SCELL_ADMIN_STATE.editingEventId = eventId;
  const fields = {
    'ev-add-title': event.title || '',
    'ev-add-category': event.category || 'WORKSHOP',
    'ev-add-start-date': event.startDate || '',
    'ev-add-end-date': event.endDate || '',
    'ev-add-start-time': event.startTime || '',
    'ev-add-end-time': event.endTime || '',
    'ev-add-venue': event.venue || '',
    'ev-add-map-url': event.mapUrl || '',
    'ev-add-poster': event.poster || '',
    'ev-add-rulebook': event.rulebook || '',
    'ev-add-short-desc': event.shortDescription || event.description || '',
    'ev-add-full-desc': event.fullDescription || event.description || '',
    'ev-add-eligibility': event.eligibility || '',
    'ev-add-rules': event.rules || '',
    'ev-add-reg-open': event.registrationOpen ? 'open' : 'closed',
    'ev-add-reg-start': event.registrationStart || '',
    'ev-add-reg-deadline': event.registrationDeadline || '',
    'ev-add-max-participants': event.maxParticipants || 100,
    'ev-add-participation-type': event.participationType || 'Individual',
    'ev-add-max-team-size': event.maxTeamSize || 4,
    'ev-add-status': event.status || 'UPCOMING'
  };

  Object.entries(fields).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el) el.value = value;
  });

  const saveBtn = document.getElementById('publish-event-btn');
  if (saveBtn) saveBtn.textContent = 'UPDATE EVENT';
}

function resetEventEditor() {
  SCELL_ADMIN_STATE.editingEventId = null;
  const ids = [
    'ev-add-title', 'ev-add-category', 'ev-add-start-date', 'ev-add-end-date', 'ev-add-start-time', 'ev-add-end-time',
    'ev-add-venue', 'ev-add-map-url', 'ev-add-poster', 'ev-add-rulebook', 'ev-add-short-desc', 'ev-add-full-desc',
    'ev-add-eligibility', 'ev-add-rules', 'ev-add-reg-open', 'ev-add-reg-start', 'ev-add-reg-deadline', 'ev-add-max-participants',
    'ev-add-participation-type', 'ev-add-max-team-size', 'ev-add-status'
  ];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      if (el.tagName === 'SELECT') el.value = el.options[0]?.value || '';
      else el.value = '';
    }
  });
  const saveBtn = document.getElementById('publish-event-btn');
  if (saveBtn) saveBtn.textContent = 'PUBLISH EVENT LIVE';
}

async function handleCreateEventSubmit(e) {
  e.preventDefault();
  const title = document.getElementById('ev-add-title')?.value.trim();
  const category = document.getElementById('ev-add-category')?.value || 'WORKSHOP';
  const startDate = document.getElementById('ev-add-start-date')?.value || '';
  const endDate = document.getElementById('ev-add-end-date')?.value || '';
  const startTime = document.getElementById('ev-add-start-time')?.value || '';
  const endTime = document.getElementById('ev-add-end-time')?.value || '';
  const venue = document.getElementById('ev-add-venue')?.value.trim();
  const mapUrl = document.getElementById('ev-add-map-url')?.value.trim();
  const poster = document.getElementById('ev-add-poster')?.value.trim();
  const rulebook = document.getElementById('ev-add-rulebook')?.value.trim();
  const shortDescription = document.getElementById('ev-add-short-desc')?.value.trim();
  const fullDescription = document.getElementById('ev-add-full-desc')?.value.trim();
  const eligibility = document.getElementById('ev-add-eligibility')?.value.trim();
  const rules = document.getElementById('ev-add-rules')?.value.trim();
  const regOpen = document.getElementById('ev-add-reg-open')?.value === 'open';
  const regStart = document.getElementById('ev-add-reg-start')?.value || '';
  const regDeadline = document.getElementById('ev-add-reg-deadline')?.value || '';
  const maxParticipants = Number(document.getElementById('ev-add-max-participants')?.value || 100);
  const participationType = document.getElementById('ev-add-participation-type')?.value || 'Individual';
  const maxTeamSize = Number(document.getElementById('ev-add-max-team-size')?.value || 4);
  const status = document.getElementById('ev-add-status')?.value || 'UPCOMING';

  if (!title || !venue) {
    showToast('Please fill the required event title and venue.');
    return;
  }

  const eventDates = {
    startDate,
    endDate,
    startTime,
    endTime,
    date: formatEventDates(startDate, endDate),
    time: formatEventTime(startTime, endTime)
  };

  const existing = SCELL_DATA.events.find(event => event.id === SCELL_ADMIN_STATE.editingEventId);
  const nextEvent = {
    id: existing ? existing.id : `EV-${Date.now().toString(36).toUpperCase()}`,
    title,
    category,
    status,
    registrationOpen: regOpen,
    registrationStart: regStart,
    registrationDeadline: regDeadline,
    maxParticipants,
    participationType,
    maxTeamSize,
    venue,
    mapUrl,
    poster: poster || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop',
    rulebook,
    description: shortDescription || fullDescription || 'Official SCELL mission for the campus innovation ecosystem.',
    fullDescription: fullDescription || shortDescription,
    shortDescription: shortDescription || fullDescription,
    eligibility: eligibility || 'Open to GECWC students and community participants as applicable.',
    rules: rules || 'Follow all campus rules and event instructions.',
    date: eventDates.date,
    time: eventDates.time,
    startDate,
    endDate,
    startTime,
    endTime,
    featured: existing ? existing.featured : false,
    seatsTotal: maxParticipants,
    seatsFilled: existing ? existing.seatsFilled || 0 : 0,
    winners: existing ? existing.winners || [] : [],
    gallery: existing ? existing.gallery || [] : []
  };

  if (existing) {
    const index = SCELL_DATA.events.findIndex(item => item.id === existing.id);
    SCELL_DATA.events[index] = nextEvent;
  } else {
    SCELL_DATA.events.unshift(nextEvent);
  }

  SCELL_DATA.stats.eventsCount = SCELL_DATA.events.length;
  savePersistedScellData();

  if (db) {
    try {
      const payload = {
        id: nextEvent.id,
        title: nextEvent.title,
        category: nextEvent.category,
        status: nextEvent.status,
        event_date: nextEvent.startDate || nextEvent.date,
        time: nextEvent.time,
        venue: nextEvent.venue,
        poster_url: nextEvent.poster,
        rulebook_url: nextEvent.rulebook,
        description: nextEvent.description,
        registration_open: nextEvent.registrationOpen,
        seats_total: nextEvent.seatsTotal,
        seats_filled: nextEvent.seatsFilled,
        badge: nextEvent.status,
        winners: nextEvent.winners || [],
        gallery_urls: nextEvent.gallery || [],
        updated_at: new Date().toISOString()
      };
      if (existing) {
        await db.from('events').upsert(payload, { onConflict: 'id' });
      } else {
        await db.from('events').insert(payload);
      }
    } catch (error) {
      console.warn('Supabase event sync warning:', error);
    }
  }

  showToast(existing ? 'Event updated successfully.' : 'Event published live to website.');
  resetEventEditor();
  renderRoute('admin');
}

async function toggleEventRegistration(eventId, newStatus) {
  const event = SCELL_DATA.events.find(item => item.id === eventId);
  if (!event) return;

  event.registrationOpen = newStatus;
  event.status = newStatus ? (event.status === 'COMPLETED' ? 'COMPLETED' : 'UPCOMING') : 'REGISTRATION CLOSED';
  savePersistedScellData();

  if (db) {
    try {
      await db.from('events').update({ registration_open: newStatus, status: event.status, updated_at: new Date().toISOString() }).eq('id', eventId);
    } catch (error) {
      console.warn('Registration sync warning:', error);
    }
  }

  showToast('Registration status updated.');
  renderRoute('admin');
}

async function markEventCompleted(eventId) {
  const event = SCELL_DATA.events.find(item => item.id === eventId);
  if (!event) return;

  const winnerName = prompt('Enter winner name or winning team:', event.title) || 'Winner';
  event.status = 'COMPLETED';
  event.registrationOpen = false;
  event.winners = [{ rank: 1, name: winnerName, project: event.title }];
  savePersistedScellData();

  if (db) {
    try {
      await db.from('events').update({ status: 'COMPLETED', registration_open: false, winners: event.winners, updated_at: new Date().toISOString() }).eq('id', eventId);
    } catch (error) {
      console.warn('Completion sync warning:', error);
    }
  }

  showToast('Event marked completed.');
  renderRoute('admin');
}

function duplicateEvent(eventId) {
  const event = getEventById(eventId);
  if (!event) return;
  const cloned = { ...event, id: `EV-${Date.now().toString(36).toUpperCase()}`, title: `${event.title} (Copy)` };
  SCELL_DATA.events.unshift(cloned);
  savePersistedScellData();
  showToast('Event duplicated.');
  renderRoute('admin');
}

function deleteEvent(eventId) {
  const ok = window.confirm('Delete this event permanently from the SCELL command hub?');
  if (!ok) return;

  SCELL_DATA.events = SCELL_DATA.events.filter(item => item.id !== eventId);
  savePersistedScellData();
  if (db) {
    try { db.from('events').delete().eq('id', eventId); } catch (error) { console.warn('Delete event warning:', error); }
  }
  showToast('Event deleted successfully.');
  renderRoute('admin');
}

function exportRegistrationsCSV() {
  const rows = [
    ['ID', 'Event', 'Name', 'Roll', 'Email', 'Branch', 'Semester', 'Status']
  ];
  SCELL_DATA.registrations.forEach(reg => {
    rows.push([reg.id, reg.eventName || '', reg.name || '', reg.roll || '', reg.email || '', reg.branch || '', reg.sem || '', reg.status || 'confirmed']);
  });

  const csv = rows.map(row => row.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'SCELL_GECWC_Registrations.csv';
  a.click();
  URL.revokeObjectURL(url);
  showToast('CSV exported successfully.');
}

function downloadSlipMock() {
  window.print();
}

function exportRegistrationsCSV() {
  let csv = "ID,Event,Name,Roll,Email,Branch,Semester,Status\n";
  SCELL_DATA.registrations.forEach(r => {
    csv += `"${r.id}","${r.eventName}","${r.name}","${r.roll}","${r.email}","${r.branch}","${r.sem}","${r.status}"\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `SCELL_GECWC_Registrations_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast("CSV dataset exported successfully.");
}

/* STUDENT PORTAL MODAL & TAB CONTROLLER */
let uploadedStudentPhotoBase64 = "";

function openAuthModal(tab = 'login') {
  const modal = document.getElementById('auth-modal');
  if (!modal) return;
  modal.classList.remove('hidden');
  switchAuthTab(tab);
}

function closeAuthModal() {
  const modal = document.getElementById('auth-modal');
  if (modal) modal.classList.add('hidden');
}

function switchAuthTab(tab) {
  const loginView = document.getElementById('auth-login-view');
  const registerView = document.getElementById('auth-register-view');
  const loginBtn = document.getElementById('tab-login-btn');
  const regBtn = document.getElementById('tab-register-btn');

  if (!loginView || !registerView || !loginBtn || !regBtn) return;

  if (tab === 'login') {
    loginView.classList.remove('hidden');
    registerView.classList.add('hidden');
    loginBtn.className = "px-4 py-2 rounded-xl font-mono text-xs font-bold uppercase transition cursor-pointer bg-brand-electric text-white shadow-md shadow-brand-electric/25";
    regBtn.className = "px-4 py-2 rounded-xl font-mono text-xs font-bold uppercase transition cursor-pointer text-slate-400 hover:text-white";
  } else {
    loginView.classList.add('hidden');
    registerView.classList.remove('hidden');
    regBtn.className = "px-4 py-2 rounded-xl font-mono text-xs font-bold uppercase transition cursor-pointer bg-brand-electric text-white shadow-md shadow-brand-electric/25";
    loginBtn.className = "px-4 py-2 rounded-xl font-mono text-xs font-bold uppercase transition cursor-pointer text-slate-400 hover:text-white";
  }
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function handlePhotoUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  if (file.size > 2 * 1024 * 1024) {
    alert("Image size must be less than 2MB.");
    e.target.value = "";
    return;
  }

  const reader = new FileReader();
  reader.onload = function(event) {
    uploadedStudentPhotoBase64 = event.target.result;
    const box = document.getElementById('photo-preview-box');
    if (box) {
      box.innerHTML = `<img src="${uploadedStudentPhotoBase64}" class="w-full h-full object-cover">`;
    }
  };
  reader.readAsDataURL(file);
}

async function handleStudentRegister(e) {
  e.preventDefault();
  const name = document.getElementById('reg-student-name').value.trim();
  const roll = document.getElementById('reg-student-roll').value.trim();
  const branch = document.getElementById('reg-student-branch').value;
  const batch = document.getElementById('reg-student-batch').value;
  const year = document.getElementById('reg-student-year').value;
  const sem = document.getElementById('reg-student-sem').value;
  const email = document.getElementById('reg-student-email').value.trim();
  const mobile = document.getElementById('reg-student-mobile').value.trim();
  const domain = document.getElementById('reg-student-domain').value;
  const password = document.getElementById('reg-student-password').value;
  const errBox = document.getElementById('register-error');

  if (!uploadedStudentPhotoBase64) {
    if (errBox) {
      errBox.innerText = 'Please upload a passport size photo.';
      errBox.classList.remove('hidden');
    }
    return;
  }

  if (!db) {
    if (errBox) {
      errBox.innerText = 'Database connection is not configured.';
      errBox.classList.remove('hidden');
    }
    return;
  }

  const otp = generateDailyOtp();
  const otpVerified = window.prompt('Enter the 6-digit OTP sent to your institutional email:');
  const expectedOtp = SCELL_APP_STATE.pendingOtp?.otp || otp;

  if (!otpVerified || otpVerified.trim() !== expectedOtp) {
    const sent = await triggerOtpEmail(email, otp, name);
    SCELL_APP_STATE.pendingOtp = { email, otp, expiresAt: Date.now() + 300000 };
    if (sent) {
      showToast('OTP sent to your institutional email.');
    }
    const promptResult = window.prompt('Enter the 6-digit OTP sent to your institutional email to continue.');
    if (!promptResult || promptResult.trim() !== otp) {
      if (errBox) {
        errBox.innerText = 'OTP verification failed. Please retry your registration.';
        errBox.classList.remove('hidden');
      }
      return;
    }
  }

  const { data, error } = await db.from('students').insert([{
    name,
    roll,
    branch,
    batch,
    year,
    sem,
    email,
    mobile,
    domain,
    photo_url: uploadedStudentPhotoBase64,
    password
  }]).select();

  if (error) {
    if (errBox) {
      errBox.innerText = 'Registration Error: ' + error.message;
      errBox.classList.remove('hidden');
    }
    return;
  }

  const student = data[0];
  saveCurrentStudentSession(student);
  await triggerWelcomeEmail(student);
  closeAuthModal();
  updateAuthNavbar();
  showToast(`Welcome to SCELL GECWC, ${name}!`);
}

async function handleStudentLogin(e) {
  e.preventDefault();
  const identifier = document.getElementById('login-identifier').value.trim();
  const password = document.getElementById('login-password').value;
  const errBox = document.getElementById('login-error');

  if (!db) {
    if (errBox) {
      errBox.innerText = 'Database connection is not configured.';
      errBox.classList.remove('hidden');
    }
    return;
  }

  const { data, error } = await db
    .from('students')
    .select('*')
    .or(`roll.eq.${identifier},email.eq.${identifier}`)
    .eq('password', password)
    .single();

  if (error || !data) {
    if (errBox) {
      errBox.innerText = 'Invalid Roll No / Email or Password.';
      errBox.classList.remove('hidden');
    }
    return;
  }

  saveCurrentStudentSession(data);
  closeAuthModal();
  updateAuthNavbar();
  showToast(`Welcome back, ${data.name}!`);
}

function handleStudentLogout() {
  sessionStorage.removeItem('scell_student_session');
  updateAuthNavbar();
  showToast("Logged out successfully.");
}

function updateAuthNavbar() {
  const container = document.getElementById('auth-btn-container');
  if (!container) return;

  const session = sessionStorage.getItem('scell_student_session');
  if (session) {
    const student = JSON.parse(session);
    container.innerHTML = `
      <div class="flex items-center gap-2.5 bg-slate-100 dark:bg-brand-cardDark border border-slate-300 dark:border-slate-700 py-1.5 px-3 rounded-xl font-mono text-xs">
        <img src="${student.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100'}" class="w-7 h-7 rounded-full object-cover border border-brand-electric">
        <div class="hidden sm:block text-left">
          <span class="font-bold block text-slate-800 dark:text-white leading-tight">${student.name.split(' ')[0]}</span>
          <span class="text-[9px] text-slate-400 block">${student.roll}</span>
        </div>
        <button onclick="handleStudentLogout()" title="Logout" class="text-slate-400 hover:text-red-400 ml-1 cursor-pointer">
          <i data-lucide="log-out" class="w-3.5 h-3.5"></i>
        </button>
      </div>
    `;
  } else {
    container.innerHTML = `
      <button onclick="openAuthModal('login')" class="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-md bg-gradient-to-r from-brand-electric to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-xs font-mono font-bold tracking-wider shadow-md shadow-brand-electric/25 hover:shadow-brand-electric/40 active:scale-95 transition-all cursor-pointer" data-cursor="PORTAL">
        <i data-lucide="user" class="w-3.5 h-3.5"></i>
        <span>LOGIN / REGISTER</span>
      </button>
    `;
  }
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function getTeamPhotoDefault(role) {
  const defaults = {
    faculty: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop',
    districtCoordinator: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop',
    pratik: 'https://images.unsplash.com/photo-1504593811423-6dd665756598?q=80&w=800&auto=format&fit=crop',
    ananya: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=800&auto=format&fit=crop',
    anurag: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop'
  };
  return defaults[role] || '';
}

function setTeamPhoto(role, imageUrl) {
  const team = SCELL_DATA.team;

  if (role === 'faculty') team.faculty[0].image = imageUrl || getTeamPhotoDefault(role);
  if (role === 'districtCoordinator') team.districtCoordinator.image = imageUrl || getTeamPhotoDefault(role);
  if (role === 'pratik') team.studentRepresentatives[0].image = imageUrl || getTeamPhotoDefault(role);
  if (role === 'ananya') team.studentRepresentatives[1].image = imageUrl || getTeamPhotoDefault(role);
  if (role === 'anurag') team.developedBy.image = imageUrl || getTeamPhotoDefault(role);

  team.leads = team.studentRepresentatives;
  saveTeamDirectory();

  if (currentRoute === 'team' || currentRoute === 'admin') {
    renderRoute(currentRoute);
  }
}

function removeTeamPhoto(role) {
  setTeamPhoto(role, '');
}

function handleTeamPhotoUpload(event, role) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    showToast('Please upload a valid image file.');
    event.target.value = '';
    return;
  }

  if (file.size > 2 * 1024 * 1024) {
    showToast('Image size must be under 2MB.');
    event.target.value = '';
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    setTeamPhoto(role, e.target.result);
    event.target.value = '';
    showToast('Team photo updated successfully.');
  };
  reader.readAsDataURL(file);
}

function openLightbox(img, title, tag) {
  document.getElementById('lightbox-img').src = img;
  document.getElementById('lightbox-caption').innerText = title;
  document.getElementById('lightbox-tag').innerText = tag;
  document.getElementById('lightbox').classList.remove('hidden');
}
function closeLightbox() {
  document.getElementById('lightbox').classList.add('hidden');
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  document.getElementById('toast-msg').innerText = msg;
  toast.classList.remove('translate-y-24', 'opacity-0');
  setTimeout(() => {
    toast.classList.add('translate-y-24', 'opacity-0');
  }, 3500);
}

async function claimDailyArenaXp() {
  const student = getCurrentStudentSession();
  if (!student) {
    showToast('Please log in first to claim Arena XP.');
    openAuthModal('login');
    return;
  }

  const today = new Date().toISOString().slice(0, 10);
  const claimKey = `scell_daily_game_${student.roll}_${today}`;

  if (sessionStorage.getItem(claimKey) === 'claimed') {
    showToast('Daily mission already claimed for today.');
    return;
  }

  const xpReward = 50;
  if (db) {
    try {
      const { error } = await db.from('daily_game_logs').insert([{ student_roll: student.roll, date_claimed: today }]);
      if (error && !error.message.includes('duplicate')) console.warn('Daily log insert warning:', error.message);
    } catch (err) {
      console.warn('Daily claim log failed:', err);
    }
  }

  const nextXp = Number(student.xp || 0) + xpReward;
  student.xp = nextXp;
  saveCurrentStudentSession(student);
  sessionStorage.setItem(claimKey, 'claimed');
  showToast(`Daily challenge cleared. +${xpReward} XP awarded.`);
  renderRoute('arena');
}

function initCountUps() {
  const counters = document.querySelectorAll('.count-up');
  counters.forEach(counter => {
    const target = +counter.getAttribute('data-target');
    let count = 0;
    const step = Math.max(1, Math.ceil(target / 40));
    const timer = setInterval(() => {
      count += step;
      if (count >= target) {
        counter.innerText = target + '+';
        clearInterval(timer);
      } else {
        counter.innerText = count;
      }
    }, 30);
  });
}

function initCursor() {
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  const label = document.getElementById('cursor-label');

  if (!dot || !ring) return;

  window.addEventListener('mousemove', (e) => {
    dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    ring.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
  });

  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest('[data-cursor]');
    if (target) {
      const cursorText = target.getAttribute('data-cursor');
      ring.style.width = '64px';
      ring.style.height = '64px';
      ring.style.backgroundColor = 'rgba(0, 102, 255, 0.15)';
      if (cursorText) {
        label.innerText = cursorText;
        label.classList.remove('opacity-0');
      }
    } else {
      ring.style.width = '36px';
      ring.style.height = '36px';
      ring.style.backgroundColor = 'transparent';
      label.classList.add('opacity-0');
    }
  });
}

function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h;
  let particles = [];

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  for (let i = 0; i < 40; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      radius: Math.random() * 1.8 + 0.8
    });
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    const isDark = document.documentElement.classList.contains('dark');
    ctx.fillStyle = isDark ? '#00f0ff' : '#0066ff';
    ctx.strokeStyle = isDark ? 'rgba(0, 240, 255, 0.08)' : 'rgba(0, 102, 255, 0.08)';

    for (let i = 0; i < particles.length; i++) {
      let p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        let p2 = particles[j];
        let dist = Math.hypot(p.x - p2.x, p.y - p2.y);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
}

function setupGlobalListeners() {
  document.getElementById('theme-toggle').addEventListener('click', () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    }
  });

  document.getElementById('mobile-menu-btn').addEventListener('click', () => {
    document.getElementById('mobile-menu').classList.remove('translate-x-full');
  });
  document.getElementById('mobile-close-btn').addEventListener('click', () => {
    document.getElementById('mobile-menu').classList.add('translate-x-full');
  });
}

window.onload = initApp;

/* ADMIN AUTHENTICATION CONTROLLER */
function handleAdminLogin(e) {
  e.preventDefault();
  const user = document.getElementById('admin-user').value.trim();
  const pass = document.getElementById('admin-pass').value.trim();
  const errorBox = document.getElementById('admin-login-error');

  const VALID_USER = 'admin@gecwc';
  const VALID_PASS = 'Scell@2026';

  if (user === VALID_USER && pass === VALID_PASS) {
    sessionStorage.setItem('scell_admin_auth', 'true');
    showToast('Identity Verified. Welcome Admin.');
    renderRoute('admin');
  } else {
    if (errorBox) {
      errorBox.innerText = 'Invalid Admin ID or Security Key. Access Denied.';
      errorBox.classList.remove('hidden');
    }
  }
}

function handleAdminLogout() {
  sessionStorage.removeItem('scell_admin_auth');
  showToast('Logged out of Admin Console.');
  renderRoute('admin');
}

function copyAssetUrl(url) {
  navigator.clipboard.writeText(url).then(() => {
    showToast('Asset URL copied to clipboard.');
  }).catch(() => {
    showToast('Copy failed. Please copy manually.');
  });
}

function deleteAsset(id) {
  const ok = window.confirm('Delete this asset from the media library?');
  if (!ok) return;
  SCELL_DATA.assets = SCELL_DATA.assets.filter(asset => asset.id !== id);
  savePersistedScellData();
  renderRoute('admin');
  showToast('Asset removed.');
}

function handleAssetSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('asset-name').value.trim();
  const category = document.getElementById('asset-category').value;
  const url = document.getElementById('asset-url').value.trim();
  if (!name || !url) {
    showToast('Asset name and URL are required.');
    return;
  }

  SCELL_DATA.assets.unshift({
    id: `asset-${Date.now()}`,
    name,
    category,
    url
  });

  savePersistedScellData();
  e.target.reset();
  renderRoute('admin');
  showToast('Asset added to the media library.');
}

function normalizeTeamImageUrl(value) {
  const fallback = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop';
  if (!value || !String(value).trim()) return fallback;
  const cleaned = String(value).trim();
  try {
    const parsed = new URL(cleaned);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') return cleaned;
  } catch (error) {
    return fallback;
  }
  return fallback;
}

function escapeTeamAttribute(value) {
  return String(value ?? '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function normalizeTeamCategory(category) {
  const normalized = String(category || '').trim();
  const aliases = {
    'faculty in-charge': 'Faculty In-Charge',
    faculty: 'Faculty In-Charge',
    'district startup coordinator': 'District Startup Coordinator',
    'district coordinator': 'District Startup Coordinator',
    'student representative': 'Student Representatives',
    'student representatives': 'Student Representatives',
    'student coordinators': 'Student Representatives',
    'core team': 'Student Representatives',
    coordinators: 'Coordinators',
    coordinator: 'Coordinators'
  };
  return aliases[normalized.toLowerCase()] || normalized || 'Student Representatives';
}

function resetTeamForm() {
  const ids = ['team-name', 'team-role', 'team-category', 'team-photo', 'team-phone', 'team-whatsapp', 'team-department', 'team-batch', 'team-linkedin', 'team-email', 'team-website', 'team-order', 'team-status'];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (id === 'team-category') el.value = 'Student Representatives';
    else if (id === 'team-status') el.value = 'Active';
    else if (id === 'team-order') el.value = '1';
    else el.value = '';
  });
  SCELL_ADMIN_STATE.editingTeamMemberId = null;
}

function getTeamCollectionForCategory(category) {
  const normalized = normalizeTeamCategory(category);
  if (normalized === 'Faculty In-Charge') return SCELL_DATA.team.faculty || [];
  if (normalized === 'District Startup Coordinator') return [SCELL_DATA.team.districtCoordinator].filter(Boolean);
  if (normalized === 'Coordinators') return SCELL_DATA.team.coordinators || [];
  return SCELL_DATA.team.studentRepresentatives || [];
}

function setTeamCollectionForCategory(category, list) {
  const normalized = normalizeTeamCategory(category);
  if (normalized === 'Faculty In-Charge') {
    SCELL_DATA.team.faculty = list;
    return;
  }
  if (normalized === 'District Startup Coordinator') {
    SCELL_DATA.team.districtCoordinator = list[0] || null;
    return;
  }
  if (normalized === 'Coordinators') {
    SCELL_DATA.team.coordinators = list;
    return;
  }
  SCELL_DATA.team.studentRepresentatives = list;
  SCELL_DATA.team.leads = list;
}

function prefillTeamMember(name, category = 'Student Representatives') {
  const normalizedCategory = normalizeTeamCategory(category);
  const list = getTeamCollectionForCategory(normalizedCategory);
  const member = list.find(item => item.name === name);
  if (!member) return;
  const ids = {
    'team-name': member.name || '',
    'team-role': member.role || member.designation || '',
    'team-category': normalizedCategory,
    'team-photo': normalizeTeamImageUrl(member.image),
    'team-phone': member.phone || '',
    'team-whatsapp': member.whatsapp || '',
    'team-department': member.department || member.org || '',
    'team-batch': member.batch || '',
    'team-linkedin': member.linkedin || '',
    'team-email': member.email || '',
    'team-website': member.website || member.portfolio || '',
    'team-order': member.order || 1,
    'team-status': member.status || 'Active'
  };
  Object.entries(ids).forEach(([key, value]) => {
    const el = document.getElementById(key);
    if (el) el.value = value;
  });
  SCELL_ADMIN_STATE.editingTeamMemberId = `${normalizedCategory}::${name}`;
}

function handleSaveTeamMember(e) {
  e.preventDefault();
  const category = normalizeTeamCategory(document.getElementById('team-category').value);
  const member = {
    name: document.getElementById('team-name').value.trim(),
    role: document.getElementById('team-role').value.trim(),
    designation: document.getElementById('team-role').value.trim(),
    category,
    group: category,
    image: normalizeTeamImageUrl(document.getElementById('team-photo').value),
    phone: document.getElementById('team-phone').value.trim(),
    whatsapp: document.getElementById('team-whatsapp').value.trim(),
    department: document.getElementById('team-department').value.trim(),
    org: document.getElementById('team-department').value.trim(),
    batch: document.getElementById('team-batch').value.trim(),
    linkedin: document.getElementById('team-linkedin').value.trim(),
    email: document.getElementById('team-email').value.trim(),
    website: document.getElementById('team-website').value.trim(),
    portfolio: document.getElementById('team-website').value.trim(),
    order: Number(document.getElementById('team-order').value || 1),
    status: document.getElementById('team-status').value,
    badge: category.toUpperCase()
  };

  if (!member.name || !member.role) {
    showToast('Member name and role are required.');
    return;
  }

  const list = [...getTeamCollectionForCategory(category)];
  const existingKey = SCELL_ADMIN_STATE.editingTeamMemberId || `${category}::${member.name}`;
  const existingIndex = list.findIndex(item => `${category}::${item.name}` === existingKey || item.name === member.name);
  if (existingIndex >= 0) {
    list[existingIndex] = { ...list[existingIndex], ...member };
  } else {
    list.push(member);
  }

  if (category === 'Faculty In-Charge') {
    SCELL_DATA.team.faculty = list;
  } else if (category === 'District Startup Coordinator') {
    SCELL_DATA.team.districtCoordinator = list[0] || null;
  } else if (category === 'Coordinators') {
    SCELL_DATA.team.coordinators = list;
  } else {
    SCELL_DATA.team.studentRepresentatives = list;
    SCELL_DATA.team.leads = list;
  }

  saveTeamDirectory();
  savePersistedScellData();
  resetTeamForm();
  renderRoute('admin');
  showToast('Team record saved.');
}

function deleteTeamMember(name, category = 'Student Representatives') {
  const normalizedCategory = normalizeTeamCategory(category);
  const ok = window.confirm(`Remove ${name} from ${normalizedCategory}?`);
  if (!ok) return;

  if (normalizedCategory === 'Faculty In-Charge') {
    SCELL_DATA.team.faculty = (SCELL_DATA.team.faculty || []).filter(member => member.name !== name);
  } else if (normalizedCategory === 'District Startup Coordinator') {
    if (SCELL_DATA.team.districtCoordinator && SCELL_DATA.team.districtCoordinator.name === name) {
      SCELL_DATA.team.districtCoordinator = null;
    }
  } else if (normalizedCategory === 'Coordinators') {
    SCELL_DATA.team.coordinators = (SCELL_DATA.team.coordinators || []).filter(member => member.name !== name);
  } else {
    SCELL_DATA.team.studentRepresentatives = (SCELL_DATA.team.studentRepresentatives || []).filter(member => member.name !== name);
    SCELL_DATA.team.leads = SCELL_DATA.team.studentRepresentatives;
  }

  saveTeamDirectory();
  savePersistedScellData();
  renderRoute('admin');
  showToast('Team member removed.');
}

function saveContentSection(section) {
  const values = {
    heading: document.getElementById(`content-heading-${section}`)?.value || '',
    subtitle: document.getElementById(`content-subtitle-${section}`)?.value || '',
    description: document.getElementById(`content-description-${section}`)?.value || ''
  };

  if (!SCELL_DATA.siteContent[section]) {
    SCELL_DATA.siteContent[section] = {};
  }

  if (section === 'home') {
    SCELL_DATA.siteContent.home = { ...SCELL_DATA.siteContent.home, heading: values.heading || SCELL_DATA.siteContent.home.heading, subheading: values.subtitle || SCELL_DATA.siteContent.home.subheading, description: values.description || SCELL_DATA.siteContent.home.description, announcement: SCELL_DATA.siteContent.home.announcement || '// STARTUP_CELL.GECWC_INCUBATOR' };
  } else {
    SCELL_DATA.siteContent[section] = {
      ...SCELL_DATA.siteContent[section],
      heading: values.heading || SCELL_DATA.siteContent[section].heading,
      subtitle: values.subtitle || SCELL_DATA.siteContent[section].subtitle,
      intro: values.subtitle || SCELL_DATA.siteContent[section].intro,
      description: values.description || SCELL_DATA.siteContent[section].description
    };
  }

  savePersistedScellData();
  renderRoute(currentRoute || 'home');
  showToast(`${section.toUpperCase()} content saved.`);
}
