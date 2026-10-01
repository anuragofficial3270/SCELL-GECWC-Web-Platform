let currentRoute = 'home';
let currentEventFilter = 'ALL';
let currentProjectFilter = 'ALL';
const SCELL_APP_STATE = {
  rollLookupTimer: null,
  lastAutoFillStudent: null,
  pendingOtp: null,
  pendingRole: null
};

function getStoredSessionUser() {
  try {
    const raw = sessionStorage.getItem('scell_student_session');
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
}

async function createLocalStudentAccount(account) {
  const users = JSON.parse(localStorage.getItem('scell_users_v1') || '[]');
  const email = String(account.email || '').trim().toLowerCase();
  const roll = String(account.roll || '').trim();
  const duplicate = users.some((user) => (user.email && normalizeEmail(user.email) === email) || (user.roll && String(user.roll).trim() === roll));
  if (duplicate) {
    throw new Error('An account with this email or roll number already exists.');
  }

  const passwordHash = await hashPassword(account.password);
  const user = {
    id: `user_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`,
    name: account.name,
    roll,
    branch: account.branch,
    batch: account.batch,
    year: account.year,
    sem: account.sem,
    email,
    mobile: account.mobile,
    domain: account.domain,
    photo_url: account.photo_url || '',
    password_hash: passwordHash,
    created_at: new Date().toISOString()
  };

  users.push(user);
  localStorage.setItem('scell_users_v1', JSON.stringify(users));
  return user;
}

async function authenticateLocalStudent(identifier, password) {
  const users = JSON.parse(localStorage.getItem('scell_users_v1') || '[]');
  const value = String(identifier || '').trim();
  if (!value || !password) return null;

  const user = users.find((entry) => String(entry.roll).trim() === value || normalizeEmail(entry.email) === normalizeEmail(value));
  if (!user) return null;

  const passwordHash = await hashPassword(password);
  if (user.password_hash !== passwordHash) return null;

  return { ...user, password: undefined, password_hash: undefined };
}

function renderUserDashboard() {
  const session = getStoredSessionUser();
  if (!session) {
    return `
      <div class="max-w-2xl mx-auto px-4 py-20">
        <div class="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-cardDark p-8 text-center shadow-xl">
          <div class="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-brand-electric/10 text-brand-electric dark:text-brand-neon">
            <i data-lucide="lock" class="w-6 h-6"></i>
          </div>
          <p class="text-[10px] font-mono uppercase tracking-[0.25em] text-brand-electric dark:text-brand-neon">Member portal</p>
          <h2 class="mt-3 text-3xl font-bold font-editorial">Student dashboard</h2>
          <p class="mt-3 text-sm text-slate-500 font-mono">Please sign in to view your profile, registrations, and event access.</p>
          <button onclick="openAuthModal('login')" class="mt-6 px-6 py-3 rounded-xl bg-brand-electric text-white font-mono text-xs font-bold uppercase cursor-pointer">Login to continue</button>
        </div>
      </div>
    `;
  }

  const records = JSON.parse(localStorage.getItem('scell_event_registrations_v1') || '[]');
  const userRegistrations = records.filter((registration) => registration.userId === session.id || normalizeEmail(registration.email) === normalizeEmail(session.email));
  const otrProfiles = JSON.parse(localStorage.getItem('scell_otr_profiles_v1') || '[]');
  const profile = otrProfiles.find((entry) => normalizeEmail(entry.email) === normalizeEmail(session.email) || String(entry.roll).trim() === String(session.roll).trim()) || {};

  const fieldRows = [
    ['Full Name', profile.fullName || session.name || '—'],
    ['Email', profile.email || session.email || '—'],
    ['Mobile', profile.mobile || session.mobile || '—'],
    ['Roll Number', profile.roll || session.roll || '—'],
    ['Course / Programme', profile.course || session.domain || '—'],
    ['Branch / Department', profile.branch || session.branch || '—'],
    ['Academic Year / Batch', profile.batch || session.batch || '—'],
    ['College / Institution', profile.college || 'Government Engineering College, West Champaran']
  ];

  const registrationRows = userRegistrations.length
    ? userRegistrations.map((entry) => `
        <tr class="border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
          <td class="px-3 py-3">${entry.eventName || 'Event'}</td>
          <td class="px-3 py-3">${entry.registrationId || '—'}</td>
          <td class="px-3 py-3">${entry.status || 'REGISTERED'}</td>
          <td class="px-3 py-3">${entry.venue || 'Campus'}</td>
          <td class="px-3 py-3"><button class="px-2 py-1 rounded border border-brand-electric/30 text-brand-electric dark:text-brand-neon text-[10px] font-mono uppercase cursor-pointer">QR</button></td>
        </tr>
      `).join('')
    : `
        <tr class="border-t border-slate-200 dark:border-slate-800">
          <td colspan="5" class="px-3 py-6 text-center text-sm text-slate-500 dark:text-slate-400">No registrations yet. Visit the events page to apply.</td>
        </tr>
      `;

  return `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="text-[10px] font-mono uppercase tracking-[0.25em] text-brand-electric dark:text-brand-neon">Member portal</p>
          <h1 class="mt-2 text-3xl font-bold font-editorial">My Dashboard</h1>
        </div>
        <div class="flex flex-wrap gap-2">
          <button onclick="navigate('events')" class="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-mono uppercase">Events</button>
          <button onclick="openOtrEditor()" class="px-4 py-2 rounded-xl bg-brand-electric text-white text-xs font-mono uppercase">${Object.keys(profile).length ? 'Update OTR' : 'Complete OTR'}</button>
        </div>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6">
        <div class="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-cardDark p-6 shadow-xl">
          <div class="flex items-center gap-4 mb-6">
            <img src="${session.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200'}" class="w-16 h-16 rounded-full object-cover border border-slate-200 dark:border-slate-700" alt="avatar">
            <div>
              <div class="text-xs font-mono uppercase tracking-[0.2em] text-brand-electric dark:text-brand-neon">Profile</div>
              <h2 class="text-2xl font-bold font-editorial">${session.name}</h2>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${fieldRows.map(([label, value]) => `
              <div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 p-3">
                <div class="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-400">${label}</div>
                <div class="mt-2 text-sm font-medium text-slate-700 dark:text-slate-200">${value}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-cardDark p-6 shadow-xl">
          <div class="text-xs font-mono uppercase tracking-[0.2em] text-brand-electric dark:text-brand-neon mb-4">Quick actions</div>
          <div class="space-y-3">
            <button onclick="navigate('events')" class="w-full text-left rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 p-3 font-mono text-xs uppercase">Browse events</button>
            <button onclick="openOtrEditor()" class="w-full text-left rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 p-3 font-mono text-xs uppercase">Update OTR</button>
            <button onclick="handleStudentLogout()" class="w-full text-left rounded-2xl border border-red-500/40 bg-red-500/5 p-3 font-mono text-xs uppercase text-red-400">Logout</button>
          </div>
        </div>
      </div>

      <div class="mt-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-cardDark shadow-xl overflow-hidden">
        <div class="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 class="text-xl font-bold font-editorial">My registrations</h3>
          <span class="text-[10px] font-mono uppercase text-slate-500">${userRegistrations.length} entries</span>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
            <thead class="bg-slate-50 dark:bg-slate-950/50">
              <tr class="text-left text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400">
                <th class="px-3 py-3">Event</th>
                <th class="px-3 py-3">Registration ID</th>
                <th class="px-3 py-3">Status</th>
                <th class="px-3 py-3">Venue</th>
                <th class="px-3 py-3">QR</th>
              </tr>
            </thead>
            <tbody>${registrationRows}</tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function openOtrEditor() {
  const session = getStoredSessionUser();
  if (!session) {
    openAuthModal('login');
    return;
  }

  const profiles = JSON.parse(localStorage.getItem('scell_otr_profiles_v1') || '[]');
  const profile = profiles.find((item) => normalizeEmail(item.email) === normalizeEmail(session.email) || String(item.roll || '').trim() === String(session.roll || '').trim()) || {
    fullName: session.name || '',
    email: session.email || '',
    mobile: session.mobile || '',
    roll: session.roll || '',
    course: session.domain || '',
    branch: session.branch || '',
    batch: session.batch || '',
    college: 'Government Engineering College, West Champaran',
    state: 'Bihar',
    city: 'West Champaran'
  };

  const modal = document.createElement('div');
  modal.id = 'scell-otr-modal';
  modal.innerHTML = `
    <div class="fixed inset-0 z-[60] bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div class="w-full max-w-3xl rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-brand-surface p-6 shadow-2xl">
        <div class="flex items-center justify-between mb-6">
          <div>
            <p class="text-[10px] font-mono uppercase tracking-[0.2em] text-brand-electric dark:text-brand-neon">OTR registration</p>
            <h2 class="text-2xl font-bold font-editorial mt-1">Complete your profile</h2>
          </div>
          <button onclick="document.getElementById('scell-otr-modal')?.remove()" class="text-slate-500 hover:text-red-400 cursor-pointer">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>
        <form onsubmit="submitOtrProfile(event)" class="space-y-4 font-mono text-xs">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label class="block mb-1 text-slate-400">Full Name *</label><input name="fullName" required value="${profile.fullName || ''}" class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 outline-none"></div>
            <div><label class="block mb-1 text-slate-400">Email *</label><input name="email" type="email" required value="${profile.email || session.email || ''}" class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 outline-none"></div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label class="block mb-1 text-slate-400">Mobile Number *</label><input name="mobile" type="tel" required value="${profile.mobile || session.mobile || ''}" class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 outline-none"></div>
            <div><label class="block mb-1 text-slate-400">Roll Number *</label><input name="roll" required value="${profile.roll || session.roll || ''}" class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 outline-none"></div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label class="block mb-1 text-slate-400">Course / Programme *</label><input name="course" required value="${profile.course || session.domain || ''}" class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 outline-none"></div>
            <div><label class="block mb-1 text-slate-400">Branch / Department *</label><input name="branch" required value="${profile.branch || session.branch || ''}" class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 outline-none"></div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><label class="block mb-1 text-slate-400">Batch *</label><input name="batch" required value="${profile.batch || session.batch || ''}" class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 outline-none"></div>
            <div><label class="block mb-1 text-slate-400">College / Institution *</label><input name="college" required value="${profile.college || 'Government Engineering College, West Champaran'}" class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 outline-none"></div>
            <div><label class="block mb-1 text-slate-400">State</label><input name="state" value="${profile.state || 'Bihar'}" class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 outline-none"></div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label class="block mb-1 text-slate-400">City / District</label><input name="city" value="${profile.city || 'West Champaran'}" class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 outline-none"></div>
            <div><label class="block mb-1 text-slate-400">Gender</label><input name="gender" value="${profile.gender || ''}" class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 outline-none"></div>
          </div>
          <div class="flex justify-end gap-3 pt-2">
            <button type="button" onclick="document.getElementById('scell-otr-modal')?.remove()" class="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-mono uppercase">Cancel</button>
            <button type="submit" class="px-5 py-2.5 rounded-lg bg-brand-electric text-white text-xs font-mono uppercase">Save profile</button>
          </div>
        </form>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function submitOtrProfile(event) {
  event.preventDefault();
  const session = getStoredSessionUser();
  if (!session) {
    showToast('Please login to save your OTR.');
    return;
  }

  const data = Object.fromEntries(new FormData(event.currentTarget).entries());
  const profile = {
    ...data,
    email: normalizeEmail(data.email || session.email),
    roll: String(data.roll || session.roll || '').trim(),
    updatedAt: new Date().toISOString()
  };

  const profiles = JSON.parse(localStorage.getItem('scell_otr_profiles_v1') || '[]');
  const index = profiles.findIndex((entry) => normalizeEmail(entry.email) === normalizeEmail(profile.email) || String(entry.roll || '').trim() === String(profile.roll).trim());
  if (index >= 0) profiles[index] = { ...profiles[index], ...profile };
  else profiles.push(profile);
  localStorage.setItem('scell_otr_profiles_v1', JSON.stringify(profiles));

  document.getElementById('scell-otr-modal')?.remove();
  const merged = { ...session, ...profile, name: profile.fullName || session.name };
  saveCurrentStudentSession(merged);
  renderRoute('dashboard');
  showToast('Your OTR profile has been saved.');
}

function forgotPasswordResetCode(email) {
  const token = Math.random().toString(36).slice(2, 10).toUpperCase();
  const key = normalizeEmail(email);
  const payload = JSON.parse(localStorage.getItem('scell_reset_tokens_v1') || '{}');
  payload[key] = { token, expiresAt: Date.now() + 900000 };
  localStorage.setItem('scell_reset_tokens_v1', JSON.stringify(payload));
  return token;
}

async function handleForgotPassword(event) {
  event.preventDefault();
  const email = event.currentTarget.email.value.trim();
  const users = JSON.parse(localStorage.getItem('scell_users_v1') || '[]');
  const existing = users.some((user) => normalizeEmail(user.email) === normalizeEmail(email));
  if (!existing) {
    showToast('No account found for that email.');
    return;
  }
  const code = forgotPasswordResetCode(email);
  alert(`Your SCELL reset token is: ${code}`);
  showToast('Reset token generated. Use it to set a new password.');
  switchAuthTab('login');
}

async function handleResetPassword(event) {
  event.preventDefault();
  const email = event.currentTarget.email.value.trim();
  const token = String(event.currentTarget.token.value || '').trim().toUpperCase();
  const password = String(event.currentTarget.password.value || '').trim();

  if (password.length < 6) {
    showToast('Password must contain at least 6 characters.');
    return;
  }

  const payload = JSON.parse(localStorage.getItem('scell_reset_tokens_v1') || '{}');
  const record = payload[normalizeEmail(email)];
  if (!record || record.token !== token || Date.now() > record.expiresAt) {
    showToast('Invalid or expired reset token.');
    return;
  }

  const users = JSON.parse(localStorage.getItem('scell_users_v1') || '[]');
  const index = users.findIndex((user) => normalizeEmail(user.email) === normalizeEmail(email));
  if (index === -1) {
    showToast('Account not found.');
    return;
  }

  users[index].password_hash = await hashPassword(password);
  localStorage.setItem('scell_users_v1', JSON.stringify(users));
  delete payload[normalizeEmail(email)];
  localStorage.setItem('scell_reset_tokens_v1', JSON.stringify(payload));
  showToast('Password reset successful. Please login.');
  switchAuthTab('login');
}

function normalizeOtpInput(value) {
  return String(value ?? '').trim().replace(/\s+/g, '');
}

function isOtpExpired(candidate) {
  return !candidate || !candidate.expiresAt || Date.now() > candidate.expiresAt;
}

function getOrCreatePendingOtp(email) {
  const normalizedEmail = String(email ?? '').trim().toLowerCase();
  const current = SCELL_APP_STATE.pendingOtp;

  if (!current || !current.email || current.email !== normalizedEmail || isOtpExpired(current)) {
    const otp = generateDailyOtp();
    SCELL_APP_STATE.pendingOtp = {
      email: normalizedEmail,
      otp,
      expiresAt: Date.now() + 300000
    };
    return { otp, isFresh: true };
  }

  return { otp: current.otp, isFresh: false };
}

const SCELL_ADMIN_STATE = {
  activeTab: 'missions',
  editingEventId: null,
  editingTeamMemberId: null,
  contentSection: 'home'
};

function escapeHtml(value) {
  return String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function getEventCustomForm(event) {
  if (!event) return { heading: '', description: '', fields: [] };
  const customForm = event.customForm || {};
  return {
    heading: customForm.heading || event.heading || event.title || '',
    description: customForm.description || event.formDescription || event.description || '',
    fields: Array.isArray(customForm.fields) ? customForm.fields : []
  };
}

function createDefaultCustomQuestion() {
  return {
    id: `q_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`,
    label: '',
    type: 'short_text',
    required: false,
    placeholder: '',
    helpText: '',
    options: ''
  };
}

function renderCustomQuestionEditor(question = createDefaultCustomQuestion(), index = 0) {
  const options = Array.isArray(question.options) ? question.options.join('\n') : (question.options || '');
  const selectedType = question.type || 'short_text';
  const questionId = question.id || `q_${index}_${Date.now()}`;

  return `
    <div class="event-custom-question rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 p-4" data-index="${index}" data-question-id="${escapeHtml(questionId)}">
      <div class="flex items-center justify-between gap-3 mb-3">
        <span class="font-mono text-[10px] uppercase tracking-[0.2em] text-brand-electric dark:text-brand-neon">Question ${index + 1}</span>
        <button type="button" onclick="removeCustomEventQuestion(${index})" class="px-2.5 py-1.5 rounded-lg border border-red-500/30 text-red-400 text-[10px] font-mono uppercase">Remove</button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block mb-1 text-slate-500 dark:text-slate-300">Question Text</label>
          <input type="text" data-field="label" value="${escapeHtml(question.label || '')}" placeholder="What is your team name?" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950/40 outline-none focus:border-brand-electric">
        </div>
        <div>
          <label class="block mb-1 text-slate-500 dark:text-slate-300">Answer Type</label>
          <select data-field="type" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950/40 outline-none focus:border-brand-electric">
            <option value="short_text" ${selectedType === 'short_text' ? 'selected' : ''}>Short Text</option>
            <option value="long_text" ${selectedType === 'long_text' ? 'selected' : ''}>Long Text</option>
            <option value="number" ${selectedType === 'number' ? 'selected' : ''}>Number</option>
            <option value="email" ${selectedType === 'email' ? 'selected' : ''}>Email</option>
            <option value="phone" ${selectedType === 'phone' ? 'selected' : ''}>Phone</option>
            <option value="date" ${selectedType === 'date' ? 'selected' : ''}>Date</option>
            <option value="select" ${selectedType === 'select' ? 'selected' : ''}>Dropdown</option>
            <option value="checkbox" ${selectedType === 'checkbox' ? 'selected' : ''}>Checkbox</option>
          </select>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <label class="block mb-1 text-slate-500 dark:text-slate-300">Placeholder / Helper</label>
          <input type="text" data-field="placeholder" value="${escapeHtml(question.placeholder || '')}" placeholder="Optional placeholder" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950/40 outline-none focus:border-brand-electric">
        </div>
        <div>
          <label class="block mb-1 text-slate-500 dark:text-slate-300">Help Text</label>
          <input type="text" data-field="helpText" value="${escapeHtml(question.helpText || '')}" placeholder="Optional guide text" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950/40 outline-none focus:border-brand-electric">
        </div>
      </div>
      <div class="mt-4">
        <label class="block mb-1 text-slate-500 dark:text-slate-300">Options (one per line or comma separated)</label>
        <textarea data-field="options" rows="2" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950/40 outline-none focus:border-brand-electric">${escapeHtml(options)}</textarea>
      </div>
      <label class="mt-4 flex items-center gap-2 text-slate-500 dark:text-slate-300 font-mono text-[10px] uppercase tracking-[0.18em]">
        <input type="checkbox" data-field="required" ${question.required ? 'checked' : ''}>
        <span>Required</span>
      </label>
    </div>
  `;
}

function renderCustomQuestionEditorList(fields = []) {
  const list = document.getElementById('event-custom-question-list');
  if (!list) return;
  const normalized = Array.isArray(fields) && fields.length ? fields : [createDefaultCustomQuestion()];
  list.innerHTML = normalized.map((field, index) => renderCustomQuestionEditor(field, index)).join('');
}

function addCustomEventQuestion() {
  const list = document.getElementById('event-custom-question-list');
  if (!list) return;
  const current = serializeCustomFormFieldsFromAdmin();
  current.push(createDefaultCustomQuestion());
  renderCustomQuestionEditorList(current);
}

function removeCustomEventQuestion(index) {
  const list = document.getElementById('event-custom-question-list');
  if (!list) return;
  const current = serializeCustomFormFieldsFromAdmin();
  current.splice(index, 1);
  if (!current.length) current.push(createDefaultCustomQuestion());
  renderCustomQuestionEditorList(current);
}

function serializeCustomFormFieldsFromAdmin() {
  const list = document.getElementById('event-custom-question-list');
  if (!list) return [];

  return Array.from(list.querySelectorAll('.event-custom-question')).map((card, index) => {
    const label = (card.querySelector('[data-field="label"]')?.value || '').trim();
    if (!label) return null;

    const type = card.querySelector('[data-field="type"]')?.value || 'short_text';
    const required = !!card.querySelector('[data-field="required"]')?.checked;
    const placeholder = (card.querySelector('[data-field="placeholder"]')?.value || '').trim();
    const helpText = (card.querySelector('[data-field="helpText"]')?.value || '').trim();
    const rawOptions = card.querySelector('[data-field="options"]')?.value || '';
    const options = String(rawOptions)
      .split(/\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);

    return {
      id: card.dataset.questionId || `q_${index}_${Date.now()}`,
      label,
      type,
      required,
      placeholder,
      helpText,
      options
    };
  }).filter(Boolean);
}

function renderCustomRegistrationFields(event) {
  const form = getEventCustomForm(event);
  if (!form.fields || !form.fields.length) return '';

  return form.fields.map((field, index) => {
    const questionId = `custom-${field.id || index}`;
    const label = `${field.label || 'Custom Question'}${field.required ? ' *' : ''}`;
    const commonClass = 'w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-sm focus:border-brand-electric focus:ring-1 focus:ring-brand-electric outline-none';
    const required = field.required ? 'required' : '';
    const options = Array.isArray(field.options) ? field.options : String(field.options || '').split(/\n|,/).map((item) => item.trim()).filter(Boolean);

    let inputMarkup = '';

    if (field.type === 'long_text') {
      inputMarkup = `<textarea data-custom-field="${questionId}" ${required} rows="3" placeholder="${escapeHtml(field.placeholder || '')}" class="${commonClass}"></textarea>`;
    } else if (field.type === 'select') {
      const selectOptions = options.length ? options.map((option) => `<option value="${escapeHtml(option)}">${escapeHtml(option)}</option>`).join('') : '<option value="">Select one</option>';
      inputMarkup = `<select data-custom-field="${questionId}" ${required} class="${commonClass}">${selectOptions}</select>`;
    } else if (field.type === 'checkbox') {
      inputMarkup = `<label class="flex items-center gap-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-3 py-2.5 text-sm"><input type="checkbox" data-custom-field="${questionId}" ${required} class="h-4 w-4 rounded border-slate-300 text-brand-electric focus:ring-brand-electric"><span>${escapeHtml(field.label || 'Custom option')}</span></label>`;
    } else if (field.type === 'date') {
      inputMarkup = `<input type="date" data-custom-field="${questionId}" ${required} class="${commonClass}">`;
    } else if (field.type === 'number') {
      inputMarkup = `<input type="number" data-custom-field="${questionId}" ${required} placeholder="${escapeHtml(field.placeholder || '')}" class="${commonClass}">`;
    } else if (field.type === 'email') {
      inputMarkup = `<input type="email" data-custom-field="${questionId}" ${required} placeholder="${escapeHtml(field.placeholder || '')}" class="${commonClass}">`;
    } else if (field.type === 'phone') {
      inputMarkup = `<input type="tel" data-custom-field="${questionId}" ${required} placeholder="${escapeHtml(field.placeholder || '')}" class="${commonClass}">`;
    } else {
      inputMarkup = `<input type="text" data-custom-field="${questionId}" ${required} placeholder="${escapeHtml(field.placeholder || '')}" class="${commonClass}">`;
    }

    return `
      <div class="space-y-1.5">
        <label class="block text-xs font-mono font-medium text-slate-600 dark:text-slate-300 mb-1">${escapeHtml(label)}</label>
        ${inputMarkup}
        ${field.helpText ? `<p class="text-[10px] text-slate-500 dark:text-slate-400 font-mono">${escapeHtml(field.helpText)}</p>` : ''}
      </div>
    `;
  }).join('');
}

function collectRegistrationCustomAnswers() {
  const entries = Array.from(document.querySelectorAll('[data-custom-field]'));
  const answers = {};
  entries.forEach((field) => {
    const key = field.getAttribute('data-custom-field');
    if (!key) return;
    if (field.type === 'checkbox') {
      answers[key] = field.checked ? 'Yes' : 'No';
      return;
    }
    answers[key] = field.value;
  });
  return answers;
}

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
      if (document.getElementById('event-custom-question-list')) {
        renderCustomQuestionEditorList([createDefaultCustomQuestion()]);
      }
      break;
    case 'dashboard':
      app.innerHTML = renderUserDashboard();
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
  const fields = ['reg-name', 'reg-roll', 'reg-email', 'reg-branch', 'reg-sem', 'reg-phone', 'reg-team-name', 'reg-notes', 'reg-mode'];
  fields.forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.disabled = false;
      element.value = '';
    }
  });
  const extraFields = document.getElementById('reg-extra-fields');
  if (extraFields) extraFields.innerHTML = '';
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
  const formHeading = getEventCustomForm(event).heading || event.title || 'Register for Event';
  document.getElementById('reg-event-title').innerText = formHeading;
  document.getElementById('reg-form-container').classList.remove('hidden');
  document.getElementById('reg-success-slip').classList.add('hidden');
  document.getElementById('reg-error').classList.add('hidden');
  const extraFields = document.getElementById('reg-extra-fields');
  if (extraFields) extraFields.innerHTML = renderCustomRegistrationFields(event);
  const intro = document.getElementById('reg-form')?.querySelector('p') || null;
  if (intro) {
    intro.innerText = getEventCustomForm(event).description || 'Fill your verified institutional details. Your official registration slip will generate instantly.';
  }
  document.getElementById('reg-modal').classList.remove('hidden');
  resetRegistrationForm();
  bindRegistrationRollLookup();
  const currentForm = document.getElementById('reg-extra-fields');
  if (currentForm) currentForm.innerHTML = renderCustomRegistrationFields(event);
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
  const phone = document.getElementById('reg-phone').value.trim();
  const customAnswers = collectRegistrationCustomAnswers();
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
    phone: phone || 'N/A',
    qrData: { reg_id: regId, roll, event_id: eventId, timestamp: new Date().toISOString() },
    status: 'confirmed',
    customAnswers,
    customForm: event.customForm || { fields: [] }
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
  const customForm = getEventCustomForm(event);
  const fields = {
    'ev-add-title': event.title || '',
    'ev-add-category': event.category || 'Workshop',
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
    'ev-add-form-heading': customForm.heading || event.title || '',
    'ev-add-form-description': customForm.description || event.description || '',
    'ev-add-reg-open': event.registrationOpen ? 'open' : 'closed',
    'ev-add-reg-start': event.registrationStart || '',
    'ev-add-reg-deadline': event.registrationDeadline || '',
    'ev-add-max-participants': event.maxParticipants || 100,
    'ev-add-participation-type': event.participationType || 'Individual',
    'ev-add-max-team-size': event.maxTeamSize || 4,
    'ev-add-status': event.status || 'Upcoming'
  };

  Object.entries(fields).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el) el.value = value;
  });

  renderCustomQuestionEditorList(customForm.fields || []);
  const saveBtn = document.getElementById('publish-event-btn');
  if (saveBtn) saveBtn.textContent = 'UPDATE EVENT';
}

function resetEventEditor() {
  SCELL_ADMIN_STATE.editingEventId = null;
  const ids = [
    'ev-add-title', 'ev-add-category', 'ev-add-start-date', 'ev-add-end-date', 'ev-add-start-time', 'ev-add-end-time',
    'ev-add-venue', 'ev-add-map-url', 'ev-add-poster', 'ev-add-rulebook', 'ev-add-short-desc', 'ev-add-full-desc',
    'ev-add-eligibility', 'ev-add-rules', 'ev-add-form-heading', 'ev-add-form-description', 'ev-add-reg-open', 'ev-add-reg-start', 'ev-add-reg-deadline', 'ev-add-max-participants',
    'ev-add-participation-type', 'ev-add-max-team-size', 'ev-add-status'
  ];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      if (el.tagName === 'SELECT') el.value = el.options[0]?.value || '';
      else el.value = '';
    }
  });
  renderCustomQuestionEditorList([createDefaultCustomQuestion()]);
  const saveBtn = document.getElementById('publish-event-btn');
  if (saveBtn) saveBtn.textContent = 'PUBLISH EVENT LIVE';
}

async function handleCreateEventSubmit(e) {
  e.preventDefault();
  const title = document.getElementById('ev-add-title')?.value.trim();
  const category = document.getElementById('ev-add-category')?.value || 'Workshop';
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
  const formHeading = document.getElementById('ev-add-form-heading')?.value.trim() || title;
  const formDescription = document.getElementById('ev-add-form-description')?.value.trim() || shortDescription || fullDescription || '';
  const customFormFields = serializeCustomFormFieldsFromAdmin();
  const regOpen = document.getElementById('ev-add-reg-open')?.value === 'open';
  const regStart = document.getElementById('ev-add-reg-start')?.value || '';
  const regDeadline = document.getElementById('ev-add-reg-deadline')?.value || '';
  const maxParticipants = Number(document.getElementById('ev-add-max-participants')?.value || 100);
  const participationType = document.getElementById('ev-add-participation-type')?.value || 'Individual';
  const maxTeamSize = Number(document.getElementById('ev-add-max-team-size')?.value || 4);
  const status = document.getElementById('ev-add-status')?.value || 'Upcoming';

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
    heading: formHeading,
    formDescription: formDescription,
    customForm: {
      heading: formHeading,
      description: formDescription,
      fields: customFormFields
    },
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
        custom_form: nextEvent.customForm,
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
  const resetView = document.getElementById('auth-reset-view');
  const loginBtn = document.getElementById('tab-login-btn');
  const regBtn = document.getElementById('tab-register-btn');
  const resetBtn = document.getElementById('tab-reset-btn');

  if (!loginView || !registerView || !loginBtn || !regBtn) return;

  const showLogin = tab === 'login';
  const showRegister = tab === 'register';
  const showReset = tab === 'reset';

  loginView.classList.toggle('hidden', !showLogin);
  registerView.classList.toggle('hidden', !showRegister);
  if (resetView) resetView.classList.toggle('hidden', !showReset);

  if (showLogin) {
    loginBtn.className = "px-4 py-2 rounded-xl font-mono text-xs font-bold uppercase transition cursor-pointer bg-brand-electric text-white shadow-md shadow-brand-electric/25";
    regBtn.className = "px-4 py-2 rounded-xl font-mono text-xs font-bold uppercase transition cursor-pointer text-slate-400 hover:text-white";
    if (resetBtn) resetBtn.className = "px-4 py-2 rounded-xl font-mono text-xs font-bold uppercase transition cursor-pointer text-slate-400 hover:text-white";
  } else if (showRegister) {
    loginBtn.className = "px-4 py-2 rounded-xl font-mono text-xs font-bold uppercase transition cursor-pointer text-slate-400 hover:text-white";
    regBtn.className = "px-4 py-2 rounded-xl font-mono text-xs font-bold uppercase transition cursor-pointer bg-brand-electric text-white shadow-md shadow-brand-electric/25";
    if (resetBtn) resetBtn.className = "px-4 py-2 rounded-xl font-mono text-xs font-bold uppercase transition cursor-pointer text-slate-400 hover:text-white";
  } else if (showReset && resetView) {
    loginBtn.className = "px-4 py-2 rounded-xl font-mono text-xs font-bold uppercase transition cursor-pointer text-slate-400 hover:text-white";
    regBtn.className = "px-4 py-2 rounded-xl font-mono text-xs font-bold uppercase transition cursor-pointer text-slate-400 hover:text-white";
    if (resetBtn) resetBtn.className = "px-4 py-2 rounded-xl font-mono text-xs font-bold uppercase transition cursor-pointer bg-brand-electric text-white shadow-md shadow-brand-electric/25";
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

  if (!name || !roll || !email || !mobile || !password || password.length < 6) {
    if (errBox) {
      errBox.innerText = 'Please complete all required fields and use a password with at least 6 characters.';
      errBox.classList.remove('hidden');
    }
    return;
  }

  try {
    const user = await createLocalStudentAccount({
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
    });

    const sessionUser = { ...user, password: undefined, password_hash: undefined };
    saveCurrentStudentSession(sessionUser);
    closeAuthModal();
    updateAuthNavbar();
    showToast(`Welcome to SCELL GECWC, ${name}!`);
    navigate('dashboard');
  } catch (error) {
    if (errBox) {
      errBox.innerText = error.message || 'Registration failed. Please try again.';
      errBox.classList.remove('hidden');
    }
  }
}

async function handleStudentLogin(e) {
  e.preventDefault();
  const identifier = document.getElementById('login-identifier').value.trim();
  const password = document.getElementById('login-password').value;
  const errBox = document.getElementById('login-error');

  const localUser = await authenticateLocalStudent(identifier, password);
  if (localUser) {
    saveCurrentStudentSession(localUser);
    closeAuthModal();
    updateAuthNavbar();
    showToast(`Welcome back, ${localUser.name}!`);
    navigate('dashboard');
    return;
  }

  if (db) {
    try {
      const { data, error } = await db
        .from('students')
        .select('*')
        .or(`roll.eq.${identifier},email.eq.${identifier}`)
        .eq('password', password)
        .single();

      if (!error && data) {
        saveCurrentStudentSession(data);
        closeAuthModal();
        updateAuthNavbar();
        showToast(`Welcome back, ${data.name}!`);
        navigate('dashboard');
        return;
      }
    } catch (error) {
      console.warn('Supabase student login fallback failed:', error);
    }
  }

  if (errBox) {
    errBox.innerText = 'Invalid Roll No / Email or Password.';
    errBox.classList.remove('hidden');
  }
}

function handleStudentLogout() {
  sessionStorage.removeItem('scell_student_session');
  updateAuthNavbar();
  showToast("Logged out successfully.");
}

function updateAuthNavbar() {
  const container = document.getElementById('auth-btn-container');
  if (!container) return;

  const session = getStoredSessionUser();
  if (session) {
    const student = session;
    container.innerHTML = `
      <div class="flex items-center gap-2.5 bg-slate-100 dark:bg-brand-cardDark border border-slate-300 dark:border-slate-700 py-1.5 px-3 rounded-xl font-mono text-xs">
        <img src="${student.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100'}" class="w-7 h-7 rounded-full object-cover border border-brand-electric">
        <div class="hidden sm:block text-left">
          <span class="font-bold block text-slate-800 dark:text-white leading-tight">${student.name.split(' ')[0]}</span>
          <span class="text-[9px] text-slate-400 block">${student.roll}</span>
        </div>
        <button onclick="navigate('dashboard')" title="Dashboard" class="text-slate-500 hover:text-brand-electric dark:hover:text-brand-neon cursor-pointer">
          <i data-lucide="layout-grid" class="w-3.5 h-3.5"></i>
        </button>
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
  if (cleaned.startsWith('data:image/')) return cleaned;
  try {
    const parsed = new URL(cleaned);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') return cleaned;
  } catch (error) {
    return fallback;
  }
  return fallback;
}

function handleTeamPhotoUpload(event) {
  const file = event.target.files && event.target.files[0];
  const hiddenInput = document.getElementById('team-photo-url');
  const preview = document.getElementById('team-photo-preview');
  if (!file) {
    if (hiddenInput) hiddenInput.value = '';
    if (preview) preview.innerHTML = '';
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    const dataUrl = String(reader.result || '');
    if (hiddenInput) hiddenInput.value = dataUrl;
    if (preview) {
      preview.innerHTML = `
        <div class="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 p-2">
          <img src="${dataUrl}" class="w-12 h-12 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
          <span class="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500">Photo Selected</span>
        </div>
      `;
    }
  };
  reader.readAsDataURL(file);
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
  const ids = ['team-name', 'team-role', 'team-category', 'team-phone', 'team-whatsapp', 'team-department', 'team-batch', 'team-linkedin', 'team-email', 'team-website', 'team-order', 'team-status'];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (id === 'team-category') el.value = 'Student Representatives';
    else if (id === 'team-status') el.value = 'Active';
    else if (id === 'team-order') el.value = '1';
    else el.value = '';
  });

  const photoInput = document.getElementById('team-photo');
  if (photoInput) photoInput.value = '';

  const hiddenPhoto = document.getElementById('team-photo-url');
  if (hiddenPhoto) hiddenPhoto.value = '';

  const preview = document.getElementById('team-photo-preview');
  if (preview) preview.innerHTML = '';

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
  const photoInput = document.getElementById('team-photo');
  const hiddenPhoto = document.getElementById('team-photo-url');
  const preview = document.getElementById('team-photo-preview');
  if (hiddenPhoto) hiddenPhoto.value = member.image || '';
  if (preview) {
    const image = member.image || '';
    preview.innerHTML = image ? `
      <div class="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 p-2">
        <img src="${normalizeTeamImageUrl(image)}" class="w-12 h-12 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
        <span class="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500">Current Photo</span>
      </div>
    ` : '';
  }
  if (photoInput) photoInput.value = '';
  Object.entries(ids).forEach(([key, value]) => {
    const el = document.getElementById(key);
    if (el) el.value = value;
  });
  SCELL_ADMIN_STATE.editingTeamMemberId = `${normalizedCategory}::${name}`;
}

function handleSaveTeamMember(e) {
  e.preventDefault();
  const category = normalizeTeamCategory(document.getElementById('team-category').value);
  const uploadedImage = document.getElementById('team-photo-url')?.value || document.getElementById('team-photo')?.value || '';
  const member = {
    name: document.getElementById('team-name').value.trim(),
    role: document.getElementById('team-role').value.trim(),
    designation: document.getElementById('team-role').value.trim(),
    category,
    group: category,
    image: normalizeTeamImageUrl(uploadedImage),
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
