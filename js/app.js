let currentRoute = 'home';
let currentEventFilter = 'ALL';
let currentProjectFilter = 'ALL';
const SCELL_APP_STATE = {
  rollLookupTimer: null,
  lastAutoFillStudent: null,
  pendingOtp: null,
  pendingRole: null
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
  await syncFromCloud();
  hydrateTeamDirectory();
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

/* Event Creation via Admin Panel */
async function handleCreateEventSubmit(e) {
  e.preventDefault();
  const title = document.getElementById('ev-add-title').value.trim();
  const category = document.getElementById('ev-add-category').value;
  const date = document.getElementById('ev-add-date').value.trim();
  const time = document.getElementById('ev-add-time').value.trim();
  const venue = document.getElementById('ev-add-venue').value.trim();
  const poster = document.getElementById('ev-add-poster').value.trim();
  const rulebook = document.getElementById('ev-add-rulebook').value.trim();
  const description = document.getElementById('ev-add-desc').value.trim();

  const { error } = await db.from('events').insert([{
    title,
    category,
    event_date: date,
    time,
    venue,
    poster_url: poster,
    rulebook_url: rulebook,
    description,
    registration_open: true,
    status: 'UPCOMING'
  }]);

  if (!error) {
    showToast("Event published live to website!");
    await syncFromCloud();
    renderRoute('admin');
  } else {
    alert("Publish failed: " + error.message);
  }
}

/* Admin: Toggle Registration Status */
async function toggleEventRegistration(eventId, newStatus) {
  const { error } = await db
    .from('events')
    .update({ registration_open: newStatus, status: newStatus ? 'UPCOMING' : 'CLOSED' })
    .eq('id', eventId);

  if (!error) {
    showToast("Registration status updated!");
    await syncFromCloud();
    renderRoute('admin');
  }
}

/* Admin: Mark Completed with Winners */
async function markEventCompleted(eventId) {
  const winner1 = prompt("Rank 1 Team / Student Name:");
  if (!winner1) return;
  const photoUrl = prompt("Enter 1 recap photo URL (optional):") || "";

  const winnersArr = [{ rank: 1, name: winner1, project: "Champion" }];
  const galleryArr = photoUrl ? [photoUrl] : [];

  const { error } = await db
    .from('events')
    .update({ 
      status: 'COMPLETED', 
      registration_open: false,
      winners: winnersArr,
      gallery_urls: galleryArr
    })
    .eq('id', eventId);

  if (!error) {
    showToast("Event completed & winners published!");
    await syncFromCloud();
    renderRoute('admin');
  }
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

  // APNA CUSTOM USERNAME AUR PASSWORD YAHAN SET KAREIN:
  const VALID_USER = "admin@gecwc";
  const VALID_PASS = "Scell@2026"; // ise apna mann-chaha strong password bana dein

  if (user === VALID_USER && pass === VALID_PASS) {
    sessionStorage.setItem('scell_admin_auth', 'true');
    showToast("Identity Verified. Welcome Admin.");
    renderRoute('admin');
  } else {
    errorBox.innerText = "Invalid Admin ID or Security Key. Access Denied.";
    errorBox.classList.remove('hidden');
  }
}

function handleAdminLogout() {
  sessionStorage.removeItem('scell_admin_auth');
  showToast("Logged out of Admin Console.");
  renderRoute('admin');
}