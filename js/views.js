/* HOME VIEW */
function renderHomeView() {
  const home = SCELL_DATA.siteContent?.home || {};
  const heroHeading = home.heading || 'BUILD. INNOVATE. LAUNCH.';
  const heroSubheading = home.subheading || 'Building an uncompromising innovation and entrepreneurship ecosystem at Government Engineering College, West Champaran.';
  const heroDescription = home.description || 'From embedded hardware to venture-backed startups, SCELL creates a practical bridge from campus ideas to scalable impact.';
  const ctaPrimary = home.ctaPrimary || 'EXPLORE MISSIONS';
  const ctaSecondary = home.ctaSecondary || 'JOIN SCELL FELLOWSHIP';

  return `
    <section class="relative pt-12 pb-24 md:pt-20 md:pb-32 overflow-hidden tech-grid border-b border-slate-200 dark:border-slate-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div class="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-brand-electric/30 bg-blue-500/5 dark:bg-blue-950/30 text-xs font-mono text-brand-electric dark:text-brand-neon">
            <span class="w-2 h-2 rounded-full bg-brand-neon animate-ping"></span>
            <span>${home.announcement || '// STARTUP_CELL.GECWC_INCUBATOR'}</span>
          </div>
          <div class="hidden sm:flex items-center gap-6 font-mono text-[11px] text-slate-400">
            <span>LAT: 26.799° N</span>
            <span>LONG: 84.502° E</span>
            <span class="text-emerald-500 font-bold">● CLOUD DB LINKED</span>
          </div>
        </div>

        <div class="max-w-5xl">
          <h1 class="text-5xl sm:text-7xl lg:text-8xl font-black font-editorial tracking-tight leading-[0.95] uppercase mb-8">
            ${heroHeading.split(' ').slice(0, 3).join(' ')}. <br/>
            <span class="bg-gradient-to-r from-brand-electric via-indigo-500 to-brand-neon bg-clip-text text-transparent">${heroHeading.split(' ').slice(3, 6).join(' ') || 'INNOVATE.'}</span> <br/>
            ${heroHeading.split(' ').slice(6).join(' ') || 'LAUNCH.'}
          </h1>
          <p class="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed mb-10 font-normal">
            ${heroSubheading}
          </p>
          <p class="text-sm text-slate-500 dark:text-slate-400 max-w-xl mb-8">${heroDescription}</p>

          <div class="flex flex-wrap items-center gap-4">
            <button onclick="navigate('events')" class="px-7 py-4 rounded-xl bg-brand-electric hover:bg-blue-600 text-white font-mono text-xs font-bold tracking-wider uppercase transition shadow-xl shadow-brand-electric/25 flex items-center gap-3 cursor-pointer group" data-cursor="EXPLORE">
              <span>${ctaPrimary}</span>
              <i data-lucide="arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform"></i>
            </button>
            <button onclick="openAuthModal('register')" class="px-7 py-4 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-brand-electric dark:hover:border-brand-neon hover:bg-slate-100 dark:hover:bg-slate-800 font-mono text-xs font-bold tracking-wider uppercase transition flex items-center gap-2 cursor-pointer" data-cursor="JOIN">
              <span>${ctaSecondary}</span>
              <i data-lucide="sparkles" class="w-4 h-4 text-brand-neon"></i>
            </button>
          </div>
        </div>

        <div class="mt-14 flex flex-wrap gap-2.5 font-mono text-xs text-slate-500 dark:text-slate-400">
          <span class="px-3 py-1 rounded bg-slate-200/50 dark:bg-slate-800/60 border border-slate-300/40 dark:border-slate-700/50">#AGRITECH</span>
          <span class="px-3 py-1 rounded bg-slate-200/50 dark:bg-slate-800/60 border border-slate-300/40 dark:border-slate-700/50">#DRONES</span>
          <span class="px-3 py-1 rounded bg-slate-200/50 dark:bg-slate-800/60 border border-slate-300/40 dark:border-slate-700/50">#EV_PROTOTYPING</span>
          <span class="px-3 py-1 rounded bg-slate-200/50 dark:bg-slate-800/60 border border-slate-300/40 dark:border-slate-700/50">#BIHAR_STARTUP_POLICY</span>
          <span class="px-3 py-1 rounded bg-slate-200/50 dark:bg-slate-800/60 border border-slate-300/40 dark:border-slate-700/50">#PATENT_FILING</span>
        </div>

        <div class="mt-12 grid gap-4 md:grid-cols-3">
          <div class="rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-white/70 dark:bg-slate-900/50 p-5 shadow-lg shadow-brand-electric/5 backdrop-blur-sm">
            <div class="font-mono text-[10px] uppercase tracking-[0.22em] text-brand-electric dark:text-brand-neon mb-2">01 // IDEATE</div>
            <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Student teams turn raw ideas into working prototypes with mentorship, labs, and project guidance.</p>
          </div>
          <div class="rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-white/70 dark:bg-slate-900/50 p-5 shadow-lg shadow-brand-electric/5 backdrop-blur-sm">
            <div class="font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-500 mb-2">02 // VALIDATE</div>
            <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">We support pilots, feedback loops, and problem-market fit so founders learn from real-world users.</p>
          </div>
          <div class="rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-white/70 dark:bg-slate-900/50 p-5 shadow-lg shadow-brand-electric/5 backdrop-blur-sm">
            <div class="font-mono text-[10px] uppercase tracking-[0.22em] text-violet-500 mb-2">03 // LAUNCH</div>
            <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">From campus experiments to startup-ready ventures, SCELL helps transform ambition into impact.</p>
          </div>
        </div>
      </div>
    </section>

    <div class="relative py-4 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 overflow-hidden whitespace-nowrap">
      <div class="inline-flex animate-marquee font-mono text-xs font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase gap-8">
        <span>INNOVATION • ENTREPRENEURSHIP • TECHNOLOGY • DEEP TECH • PROTOTYPES • HACKATHONS • GEC WEST CHAMPARAN • SEED CAPITAL • VENTURE INCUBATION •</span>
        <span>INNOVATION • ENTREPRENEURSHIP • TECHNOLOGY • DEEP TECH • PROTOTYPES • HACKATHONS • GEC WEST CHAMPARAN • SEED CAPITAL • VENTURE INCUBATION •</span>
      </div>
    </div>

    <section class="py-16 bg-white dark:bg-brand-surface/40 border-b border-slate-200 dark:border-slate-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div class="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-brand-cardDark/50">
            <span class="font-mono text-xs text-brand-electric dark:text-brand-neon uppercase tracking-widest block mb-2">// CAPACITY</span>
            <div class="text-4xl sm:text-5xl font-extrabold font-editorial count-up" data-target="${SCELL_DATA.stats.eventsCount}">0</div>
            <div class="text-xs font-mono text-slate-500 mt-2">TECHNICAL EVENTS & LABS</div>
          </div>
          <div class="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-brand-cardDark/50">
            <span class="font-mono text-xs text-emerald-500 uppercase tracking-widest block mb-2">// CADRE</span>
            <div class="text-4xl sm:text-5xl font-extrabold font-editorial count-up" data-target="${SCELL_DATA.stats.studentsCount}">0</div>
            <div class="text-xs font-mono text-slate-500 mt-2">ACTIVE STUDENT BUILDERS</div>
          </div>
          <div class="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-brand-cardDark/50">
            <span class="font-mono text-xs text-brand-neon uppercase tracking-widest block mb-2">// INTELLECTUAL IP</span>
            <div class="text-4xl sm:text-5xl font-extrabold font-editorial count-up" data-target="${SCELL_DATA.stats.projectsCount}">0</div>
            <div class="text-xs font-mono text-slate-500 mt-2">HARDWARE & SOFTWARE BUILDS</div>
          </div>
          <div class="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-brand-cardDark/50">
            <span class="font-mono text-xs text-purple-400 uppercase tracking-widest block mb-2">// VENTURES</span>
            <div class="text-4xl sm:text-5xl font-extrabold font-editorial count-up" data-target="${SCELL_DATA.stats.startupsCount}">0</div>
            <div class="text-xs font-mono text-slate-500 mt-2">STUDENT FOUNDED STARTUPS</div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-20 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-brand-surface/20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-2xl mx-auto mb-16">
          <span class="font-mono text-xs text-brand-electric dark:text-brand-neon uppercase tracking-widest block mb-2">// FOUNDATION MATRIX</span>
          <h2 class="text-3xl sm:text-4xl font-extrabold font-editorial">Why SCELL GECWC Exists</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-cardDark hover:border-brand-electric transition">
            <div class="w-12 h-12 rounded-xl bg-blue-500/10 text-brand-electric flex items-center justify-center mb-6">
              <i data-lucide="cpu" class="w-6 h-6"></i>
            </div>
            <h3 class="text-xl font-bold font-editorial mb-3">R&D Hardware Prototyping</h3>
            <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
              Bridging pure theory into embedded circuits, drones, and autonomous robotics with access to 3D printing and test benches.
            </p>
          </div>

          <div class="p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-cardDark hover:border-brand-electric transition">
            <div class="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-6">
              <i data-lucide="trending-up" class="w-6 h-6"></i>
            </div>
            <h3 class="text-xl font-bold font-editorial mb-3">Bihar Seed Funding Liaison</h3>
            <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
              Assisting verified student teams to tap into the ₹10 Lakhs seed grants, DPR audits, and institutional IP registrations.
            </p>
          </div>

          <div class="p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-cardDark hover:border-brand-electric transition">
            <div class="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-6">
              <i data-lucide="award" class="w-6 h-6"></i>
            </div>
            <h3 class="text-xl font-bold font-editorial mb-3">Gamified Arena Honors</h3>
            <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
              Every git commit, workshop participation, and hackathon win logs direct XP onto your decentralized SCELL credentials.
            </p>
          </div>
        </div>
      </div>
    </section>
  `;
}

/* EVENTS DIRECTORY VIEW */
function renderEventsView() {
  const filteredEvents = SCELL_DATA.events.filter(e => {
    if (currentEventFilter === 'ALL') return true;
    if (currentEventFilter === 'UPCOMING') return e.status === 'UPCOMING';
    if (currentEventFilter === 'PAST') return e.status === 'COMPLETED';
    return e.category === currentEventFilter;
  });

  const hasEvents = filteredEvents.length > 0;

  return `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 dark:border-slate-800 pb-10 mb-10">
        <div>
          <span class="font-mono text-xs text-brand-electric dark:text-brand-neon uppercase tracking-widest block mb-2">// EVENTS // SCELL GECWC</span>
          <h1 class="text-4xl sm:text-5xl font-extrabold font-editorial">Events</h1>
        </div>

        <div class="flex flex-wrap gap-2 font-mono text-xs">
          ${['ALL', 'UPCOMING', 'WORKSHOP', 'HACKATHON', 'STARTUP', 'PAST'].map(tab => `
            <button onclick="setEventFilter('${tab}')" class="px-3.5 py-1.5 rounded-lg border transition cursor-pointer ${currentEventFilter === tab ? 'bg-brand-electric text-white border-brand-electric' : 'border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'}">
              ${tab}
            </button>
          `).join('')}
        </div>
      </div>

      ${!hasEvents ? `
        <div class="relative overflow-hidden rounded-[28px] border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-brand-cardDark/70 shadow-[0_24px_80px_rgba(0,102,255,0.08)] backdrop-blur-sm">
          <div class="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:28px_28px] opacity-60"></div>
          <div class="relative px-6 py-14 sm:px-10 sm:py-20 text-center">
            <div class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-brand-electric/40 bg-brand-electric/10 text-brand-electric dark:text-brand-neon shadow-lg shadow-brand-electric/10">
              <i data-lucide="calendar-days" class="w-8 h-8"></i>
            </div>
            <div class="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.24em] text-emerald-400">
              <span class="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              STATUS: STANDBY
            </div>
            <h2 class="font-editorial text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">NO EVENTS PUBLISHED</h2>
            <p class="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-slate-500 dark:text-slate-400 font-mono leading-relaxed">
              Official events, workshops, competitions and startup programmes will appear here once published by SCELL GECWC.
            </p>
            <div class="mt-8 inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100/70 dark:bg-slate-900/60 px-4 py-2 text-[10px] font-mono uppercase tracking-[0.22em] text-slate-500 dark:text-slate-300">
              <span>EVENTS // AWAITING PUBLICATION</span>
            </div>
          </div>
        </div>
      ` : `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          ${filteredEvents.map(event => `
            <div class="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-cardDark overflow-hidden flex flex-col justify-between hover:border-brand-electric dark:hover:border-brand-neon transition-all duration-300 shadow-lg hover:shadow-2xl">
              <div>
                <div class="relative h-48 overflow-hidden">
                  <img src="${event.poster}" alt="${event.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                  <div class="absolute top-3 left-3 flex gap-2">
                    <span class="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${event.status === 'UPCOMING' ? 'bg-emerald-500 text-black' : 'bg-slate-800 text-slate-300'}">
                      ${event.status}
                    </span>
                    <span class="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-black/70 backdrop-blur text-white">
                      ${event.category}
                    </span>
                  </div>
                </div>

                <div class="p-6">
                  <div class="text-[11px] font-mono text-brand-electric dark:text-brand-neon mb-1.5">${event.date}</div>
                  <h3 class="text-xl font-bold font-editorial mb-3 group-hover:text-brand-electric dark:group-hover:text-brand-neon transition">${event.title}</h3>
                  <p class="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">${event.description}</p>
                  
                  <div class="text-[11px] font-mono text-slate-500 flex items-center gap-2">
                    <i data-lucide="map-pin" class="w-3.5 h-3.5"></i>
                    <span class="truncate">${event.venue}</span>
                  </div>
                </div>
              </div>

              <div class="p-6 pt-0 border-t border-slate-100 dark:border-slate-800/80 mt-4 flex items-center gap-2">
                ${event.registrationOpen ? `
                  <button onclick="openRegistrationModal('${event.id}')" class="flex-1 py-2.5 rounded-lg bg-brand-electric hover:bg-blue-600 text-white font-mono text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer">
                    <i data-lucide="user-check" class="w-3.5 h-3.5"></i>
                    <span>REGISTER</span>
                  </button>
                ` : `
                  <button disabled class="flex-1 py-2.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-500 font-mono text-xs font-bold cursor-not-allowed">
                    ${event.status === 'COMPLETED' ? 'COMPLETED' : 'CLOSED'}
                  </button>
                `}
                <button onclick="navigate('event-detail', '${event.id}')" class="px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition font-mono text-xs cursor-pointer">
                  DETAILS
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      `}
    </div>
  `;
}

/* EVENT DETAIL VIEW */
function renderEventDetailView(eventId) {
  const event = SCELL_DATA.events.find(e => e.id === eventId) || SCELL_DATA.events[0];
  if (!event) return `<div class="p-20 text-center font-mono">Event not found.</div>`;

  return `
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <button onclick="navigate('events')" class="mb-8 flex items-center gap-2 font-mono text-xs text-slate-500 hover:text-brand-electric cursor-pointer">
        <i data-lucide="arrow-left" class="w-4 h-4"></i>
        <span>BACK TO MISSIONS</span>
      </button>

      <div class="relative h-64 sm:h-96 rounded-3xl overflow-hidden mb-8 border border-slate-200 dark:border-slate-800 shadow-2xl">
        <img src="${event.poster}" alt="${event.title}" class="w-full h-full object-cover">
        <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
        <div class="absolute bottom-6 left-6 right-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span class="px-3 py-1 rounded bg-brand-electric text-white font-mono text-xs font-bold">${event.category}</span>
            <h1 class="text-3xl sm:text-5xl font-black font-editorial text-white mt-3">${event.title}</h1>
          </div>
          <div class="flex gap-2">
            ${event.rulebook ? `
              <a href="${event.rulebook}" target="_blank" class="px-4 py-3 rounded-xl bg-slate-800/90 text-white font-mono text-xs font-bold flex items-center gap-1.5 hover:bg-slate-700 transition">
                <i data-lucide="book-open" class="w-4 h-4"></i>
                <span>RULE BOOK</span>
              </a>
            ` : ''}
            ${event.registrationOpen ? `
              <button onclick="openRegistrationModal('${event.id}')" class="px-6 py-3 rounded-xl bg-brand-neon text-black font-mono text-xs font-bold tracking-wider shadow-xl shadow-brand-neon/30 hover:scale-105 transition cursor-pointer">
                REGISTER NOW
              </button>
            ` : `
              <span class="px-4 py-3 rounded-xl bg-slate-800 text-slate-400 font-mono text-xs font-bold uppercase">
                ${event.status === 'COMPLETED' ? 'EVENT COMPLETED' : 'REGISTRATION CLOSED'}
              </span>
            `}
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="md:col-span-2 space-y-8">
          <div class="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-cardDark">
            <h2 class="text-xl font-bold font-editorial mb-3">About this Initiative</h2>
            <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">${event.description}</p>
          </div>

          <!-- WINNERS SECTION (Shows when completed) -->
          ${event.status === 'COMPLETED' && event.winners && event.winners.length > 0 ? `
            <div class="p-6 rounded-2xl border border-amber-500/40 bg-amber-500/5">
              <h2 class="text-xl font-bold font-editorial mb-4 text-amber-400 flex items-center gap-2">
                <i data-lucide="trophy" class="w-5 h-5"></i>
                <span>Official Champions & Podiums</span>
              </h2>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                ${event.winners.map(w => `
                  <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-cardDark">
                    <span class="text-[10px] text-amber-500 font-bold block mb-1">RANK ${w.rank || 'WINNER'}</span>
                    <div class="font-bold text-sm text-slate-800 dark:text-white">${w.name}</div>
                    <div class="text-[11px] text-slate-400 mt-1">${w.project || ''}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- EVENT RECAP PHOTOS -->
          ${event.status === 'COMPLETED' && event.gallery && event.gallery.length > 0 ? `
            <div class="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-cardDark">
              <h2 class="text-xl font-bold font-editorial mb-4">Event Glimpses</h2>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                ${event.gallery.map(img => `
                  <img src="${img}" class="rounded-lg h-32 w-full object-cover cursor-pointer hover:scale-105 transition" onclick="openLightbox('${img}', '${event.title}', 'RECAP')">
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>

        <div class="space-y-6">
          <div class="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-cardDark font-mono text-xs space-y-4">
            <h3 class="font-bold text-sm uppercase text-brand-electric dark:text-brand-neon pb-2 border-b border-slate-200 dark:border-slate-800">
              Details
            </h3>
            <div>
              <span class="text-slate-400 block text-[10px]">SCHEDULE:</span>
              <span class="font-semibold">${event.date}</span>
            </div>
            <div>
              <span class="text-slate-400 block text-[10px]">TIME:</span>
              <span class="font-semibold">${event.time}</span>
            </div>
            <div>
              <span class="text-slate-400 block text-[10px]">VENUE:</span>
              <span class="font-semibold">${event.venue}</span>
            </div>
            <div>
              <span class="text-slate-400 block text-[10px]">SLOTS:</span>
              <span class="font-semibold text-emerald-400">${event.seatsTotal - event.seatsFilled} Seats Remaining</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

/* PROJECTS EXPLORER VIEW */
function renderProjectsView() {
  const filtered = SCELL_DATA.projects.filter(p => {
    if (currentProjectFilter === 'ALL') return true;
    return p.category.includes(currentProjectFilter);
  });

  return `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 dark:border-slate-800 pb-10 mb-10">
        <div>
          <span class="font-mono text-xs text-brand-electric dark:text-brand-neon uppercase tracking-widest block mb-2">// HARDWARE & SOFTWARE INCUBATIONS</span>
          <h1 class="text-4xl sm:text-5xl font-extrabold font-editorial">R&D Prototypes</h1>
        </div>

        <div class="flex flex-wrap gap-2 font-mono text-xs">
          ${['ALL', 'IoT', 'AI', 'EV'].map(tag => `
            <button onclick="setProjectFilter('${tag}')" class="px-3.5 py-1.5 rounded-lg border transition cursor-pointer ${currentProjectFilter === tag ? 'bg-brand-electric text-white border-brand-electric' : 'border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'}">
              ${tag}
            </button>
          `).join('')}
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        ${filtered.map(proj => `
          <div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-cardDark overflow-hidden flex flex-col justify-between hover:border-brand-neon/60 transition group">
            <div>
              <div class="relative h-48 overflow-hidden">
                <img src="${proj.image}" alt="${proj.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                <div class="absolute top-3 left-3 bg-black/70 backdrop-blur px-2.5 py-1 rounded font-mono text-[10px] text-brand-neon font-bold">
                  ${proj.id}
                </div>
              </div>

              <div class="p-6">
                <span class="text-[10px] font-mono text-emerald-400 font-bold block mb-1 uppercase">${proj.status}</span>
                <h3 class="text-xl font-bold font-editorial mb-3">${proj.name}</h3>
                
                <div class="space-y-3 text-xs mb-4">
                  <div>
                    <strong class="font-mono text-[10px] text-slate-400 uppercase block">The Problem:</strong>
                    <p class="text-slate-600 dark:text-slate-300">${proj.problem}</p>
                  </div>
                  <div>
                    <strong class="font-mono text-[10px] text-slate-400 uppercase block">Engineering Solution:</strong>
                    <p class="text-slate-600 dark:text-slate-300">${proj.solution}</p>
                  </div>
                </div>

                <div class="flex flex-wrap gap-1.5 mb-4">
                  ${proj.techStack.map(t => `<span class="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-mono">${t}</span>`).join('')}
                </div>
              </div>
            </div>

            <div class="p-6 pt-0 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-mono">
              <span class="text-slate-400 text-[10px] truncate max-w-[150px]">${proj.team.join(', ')}</span>
              <a href="${proj.github}" target="_blank" class="flex items-center gap-1 text-brand-electric dark:text-brand-neon hover:underline">
                <span>GITHUB</span>
                <i data-lucide="external-link" class="w-3 h-3"></i>
              </a>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

/* STARTUPS SHOWCASE VIEW */
function renderStartupsView() {
  return `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="border-b border-slate-200 dark:border-slate-800 pb-10 mb-10">
        <span class="font-mono text-xs text-brand-electric dark:text-brand-neon uppercase tracking-widest block mb-2">// VENTURE REGISTER</span>
        <h1 class="text-4xl sm:text-5xl font-extrabold font-editorial">Student Enterprises</h1>
        <p class="text-sm text-slate-500 max-w-2xl mt-2 font-mono">Real student-led commercial entities incubated and nurtured at GEC West Champaran under Bihar Startup Policy.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        ${SCELL_DATA.startups.map(startup => `
          <div class="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-cardDark flex flex-col justify-between hover:border-brand-electric transition">
            <div>
              <div class="flex items-center justify-between mb-4">
                <span class="font-mono text-[10px] px-2.5 py-1 rounded bg-brand-electric/10 text-brand-electric dark:text-brand-neon font-bold">${startup.stage}</span>
                <span class="font-mono text-xs text-slate-400">${startup.valuation}</span>
              </div>

              <h3 class="text-2xl font-bold font-editorial mb-2">${startup.name}</h3>
              <span class="text-xs font-mono text-slate-500 block mb-4">${startup.category}</span>
              
              <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-6 font-normal">${startup.description}</p>
            </div>

            <div class="pt-6 border-t border-slate-100 dark:border-slate-800 font-mono text-xs space-y-2">
              <div class="flex justify-between">
                <span class="text-slate-400">FOUNDERS:</span>
                <span class="font-bold text-right">${startup.founders}</span>
              </div>
              <div class="text-[11px] text-emerald-400 pt-2 border-t border-slate-100 dark:border-slate-800/50">
                ★ ${startup.achievements}
              </div>
            </div>
          </div>
        `).join('')}
      </div>

      <div class="mt-16 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-cardDark p-6 sm:p-8">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p class="font-mono text-[10px] uppercase tracking-[0.28em] text-brand-electric dark:text-brand-neon">COLLABORATION & ECOSYSTEM</p>
            <h3 class="text-2xl font-bold font-editorial mt-2">Startup ecosystem partners</h3>
          </div>
          <div class="flex flex-wrap gap-3">
            <a href="https://startupbihar.nic.in/" target="_blank" rel="noopener" class="flex items-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-700 p-3 hover:border-brand-electric transition">
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-black">SB</div>
              <div>
                <div class="font-bold text-sm">Startup Bihar</div>
                <div class="font-mono text-[10px] text-slate-500">startupbihar.nic.in</div>
              </div>
            </a>
            <a href="https://www.startupindia.gov.in/" target="_blank" rel="noopener" class="flex items-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-700 p-3 hover:border-brand-electric transition">
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center font-black">SI</div>
              <div>
                <div class="font-bold text-sm">Startup India</div>
                <div class="font-mono text-[10px] text-slate-500">startupindia.gov.in</div>
              </div>
            </a>
            <a href="https://iic.mic.gov.in/" target="_blank" rel="noopener" class="flex items-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-700 p-3 hover:border-brand-electric transition">
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white flex items-center justify-center font-black">IIC</div>
              <div>
                <div class="font-bold text-sm">IIC</div>
                <div class="font-mono text-[10px] text-slate-500">iic.mic.gov.in</div>
              </div>
            </a>
            <a href="https://dpiit.gov.in/" target="_blank" rel="noopener" class="flex items-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-700 p-3 hover:border-brand-electric transition">
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white flex items-center justify-center font-black">DPIIT</div>
              <div>
                <div class="font-bold text-sm">DPIIT</div>
                <div class="font-mono text-[10px] text-slate-500">dpiit.gov.in</div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  `;
}

/* SCELL ARENA VIEW */
function renderArenaView() {
  const student = getCurrentStudentSession();
  const xp = student && student.xp ? student.xp : 0;
  const todayLabel = new Date().toLocaleDateString('en-CA');
  const leaderboard = SCELL_DATA.arena.leaderboard || [];

  return `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="border-b border-slate-200 dark:border-slate-800 pb-10 mb-10">
        <div class="flex items-center gap-2 font-mono text-xs text-brand-neon uppercase tracking-wider mb-2">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>MISSION CONTROL // TELEMETRY & CADRE HONORS</span>
        </div>
        <h1 class="text-4xl sm:text-5xl font-extrabold font-editorial">SCELL Arena</h1>
        <p class="text-sm text-slate-500 max-w-2xl mt-2 font-mono">Proof of Work leaderboard. Students accumulate verified XP through hackathons, patents, hardware sprints, and workshop mentorships.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div class="lg:col-span-8 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-cardDark shadow-xl">
          <h3 class="text-xl font-bold font-editorial mb-6 flex items-center justify-between">
            <span>Top Builders Leaderboard</span>
            <span class="text-xs font-mono text-slate-400 font-normal">SEASON 2026</span>
          </h3>

          ${leaderboard.length === 0 ? `
            <div class="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 p-8 text-center">
              <div class="w-14 h-14 mx-auto rounded-full border border-brand-electric/30 bg-brand-electric/10 flex items-center justify-center text-brand-electric dark:text-brand-neon mb-4">
                <i data-lucide="trophy" class="w-7 h-7"></i>
              </div>
              <h4 class="text-xl font-bold font-editorial mb-2">Leaderboard is waiting for official entries</h4>
              <p class="text-sm text-slate-500 font-mono">The admin can publish verified names, scores, and badges here as soon as the official arena records are ready.</p>
            </div>
          ` : `
            <div class="space-y-4">
              ${leaderboard.map(item => `
                <div class="flex items-center justify-between p-4 rounded-xl border border-slate-200/60 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 hover:border-brand-neon/40 transition">
                  <div class="flex items-center gap-4">
                    <div class="w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-sm ${item.rank === 1 ? 'bg-amber-400 text-black' : item.rank === 2 ? 'bg-slate-300 text-black' : item.rank === 3 ? 'bg-amber-700 text-white' : 'bg-slate-800 text-slate-300'}">
                      0${item.rank}
                    </div>
                    <div>
                      <div class="font-bold text-sm">${item.name}</div>
                      <div class="text-[10px] font-mono text-slate-400">ROLL: ${item.roll || 'TBA'} · LVL ${item.level || 'TBA'}</div>
                    </div>
                  </div>

                  <div class="flex items-center gap-6">
                    <div class="hidden sm:flex gap-1.5">
                      ${(item.badges || []).map(b => `<span class="px-2 py-0.5 rounded bg-brand-electric/10 text-brand-electric dark:text-brand-neon text-[9px] font-mono">${b}</span>`).join('')}
                    </div>
                    <div class="text-right">
                      <div class="font-mono font-bold text-brand-electric dark:text-brand-neon text-sm">${item.xp || 0} XP</div>
                      <div class="w-16 bg-slate-800 h-1 rounded-full mt-1 overflow-hidden">
                        <div class="bg-brand-neon h-full" style="width: ${((item.xp || 0) / 1500) * 100}%"></div>
                      </div>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>

        <div class="lg:col-span-4 space-y-6">
          <div class="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-cardDark font-mono text-xs">
            <h4 class="font-bold text-sm uppercase text-brand-electric dark:text-brand-neon mb-4">Daily Engineering Puzzle</h4>
            <div class="rounded-2xl border border-dashed border-brand-electric/30 bg-brand-electric/5 p-4 mb-4">
              <div class="text-[10px] text-brand-electric dark:text-brand-neon uppercase mb-2">Challenge // Logic Gate Path</div>
              <div class="text-lg font-bold text-slate-900 dark:text-white">Optimize the circuit route</div>
              <div class="text-[11px] text-slate-500 mt-2">Trace the correct signal path through the logic gate chain to unlock the daily XP reward.</div>
            </div>
            <button onclick="claimDailyArenaXp()" class="w-full py-3 rounded-xl bg-gradient-to-r from-brand-electric to-brand-neon text-white font-bold uppercase tracking-wider cursor-pointer">
              Claim +50 XP · ${student ? 'Live' : 'Login first'}
            </button>
            <div class="mt-3 text-[10px] text-slate-500">Today: ${todayLabel} · Current student XP: ${xp}</div>
          </div>

          <div class="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-cardDark font-mono text-xs">
            <h4 class="font-bold text-sm uppercase text-brand-electric dark:text-brand-neon mb-4">Official Honor Badges</h4>
            <div class="space-y-4">
              ${SCELL_DATA.arena.badgeCatalog.map(b => `
                <div class="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                  <div class="font-bold text-slate-800 dark:text-white mb-1">⚡ ${b.title}</div>
                  <p class="text-[11px] text-slate-400 leading-normal">${b.desc}</p>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

/* MEMORIES GALLERY VIEW */
function renderMemoriesView() {
  return `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="border-b border-slate-200 dark:border-slate-800 pb-10 mb-10">
        <span class="font-mono text-xs text-brand-electric dark:text-brand-neon uppercase tracking-widest block mb-2">// VISUAL ARCHIVE</span>
        <h1 class="text-4xl sm:text-5xl font-extrabold font-editorial">Memories & Footprints</h1>
        <p class="text-sm text-slate-500 max-w-2xl mt-2 font-mono">Highlights from workshops, field drone operations, hackathons, and state delegations.</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        ${SCELL_DATA.memories.map(item => `
          <div onclick="openLightbox('${item.img}', '${item.title}', '${item.tag}')" class="group relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 h-64 cursor-pointer">
            <img src="${item.img}" alt="${item.title}" class="w-full h-full object-cover group-hover:scale-110 transition duration-500">
            <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition"></div>
            <div class="absolute bottom-4 left-4 right-4 text-white">
              <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-electric/80 font-bold uppercase">${item.tag}</span>
              <h4 class="font-bold text-sm font-editorial mt-2">${item.title}</h4>
              <span class="text-[10px] font-mono text-slate-300 block mt-1">${item.date}</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

/* TEAM VIEW */
function renderTeamView() {
  const faculty = SCELL_DATA.team.faculty && SCELL_DATA.team.faculty[0];
  const coordinator = SCELL_DATA.team.districtCoordinator;
  const reps = SCELL_DATA.team.studentRepresentatives || [];
  const coordinators = SCELL_DATA.team.coordinators || [];
  const developer = SCELL_DATA.team.developedBy;
  const safeImage = (img, fallback) => img || fallback;

  return `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      <div class="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-brand-cardDark/60 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,102,255,0.10)] p-6 sm:p-8">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <p class="font-mono text-[10px] uppercase tracking-[0.28em] text-brand-electric dark:text-brand-neon">SCELL // PEOPLE & LEADERSHIP</p>
            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-editorial mt-3">People powering innovation, entrepreneurship and student leadership at GECWC.</h1>
          </div>
          <div class="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 text-[10px] font-mono uppercase tracking-[0.25em]">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>SCELL NETWORK ACTIVE</span>
          </div>
        </div>

        <div class="relative mb-10">
          <div class="hidden md:flex items-center justify-center gap-5 font-mono text-[10px] uppercase text-slate-500 dark:text-slate-400">
            <span class="px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100/70 dark:bg-slate-900/60">FACULTY INCHARGE</span>
            <i data-lucide="arrow-down" class="w-3.5 h-3.5"></i>
            <span class="px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100/70 dark:bg-slate-900/60">DISTRICT COORDINATOR</span>
            <i data-lucide="arrow-down" class="w-3.5 h-3.5"></i>
            <span class="px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100/70 dark:bg-slate-900/60">STUDENT REPRESENTATIVES</span>
            <i data-lucide="arrow-down" class="w-3.5 h-3.5"></i>
            <span class="px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100/70 dark:bg-slate-900/60">COORDINATORS</span>
          </div>
        </div>

        ${(faculty || coordinator || reps.length || coordinators.length) ? `
          <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
            ${faculty ? `
              <div class="rounded-3xl border border-slate-200 dark:border-slate-700 bg-slate-950/90 p-5 text-white shadow-2xl">
                <div class="flex items-center justify-between mb-4">
                  <span class="font-mono text-[10px] uppercase tracking-[0.25em] text-brand-neon">FACULTY NODE</span>
                  <span class="inline-flex items-center gap-1.5 px-2 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-[10px] text-emerald-300 font-mono uppercase">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> ACTIVE
                  </span>
                </div>
                <div class="flex flex-col sm:flex-row gap-5 items-start">
                  <img src="${safeImage(faculty.image, getTeamPhotoDefault('faculty'))}" alt="${faculty.name || 'Faculty In-charge'}" class="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-2 border-brand-electric/60 shadow-lg shadow-brand-electric/25" />
                  <div class="flex-1">
                    <h3 class="text-2xl font-bold font-editorial">${faculty.name || 'Faculty In-Charge'}</h3>
                    <p class="mt-2 text-sm text-slate-300 font-mono">${faculty.designation || 'To be updated'}</p>
                    <p class="mt-2 text-xs text-slate-400 font-mono">${faculty.org || 'Official SCELL liaison'}</p>
                    <p class="mt-4 text-sm text-slate-300 leading-relaxed">${faculty.description || 'Admin can add the final faculty details here.'}</p>
                  </div>
                </div>
              </div>
            ` : ''}

            ${coordinator ? `
              <div class="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/60 p-5 shadow-xl backdrop-blur">
                <div class="flex items-center justify-between mb-4">
                  <span class="font-mono text-[10px] uppercase tracking-[0.25em] text-brand-electric dark:text-brand-neon">DISTRICT NODE</span>
                  <span class="inline-flex items-center gap-1.5 px-2 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-[10px] text-emerald-400 font-mono uppercase">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> ACTIVE
                  </span>
                </div>
                <div class="flex flex-col sm:flex-row gap-5 items-start">
                  <img src="${safeImage(coordinator.image, getTeamPhotoDefault('districtCoordinator'))}" alt="${coordinator.name || 'District Startup Coordinator'}" class="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border border-slate-300 dark:border-slate-700 shadow-md" />
                  <div class="flex-1">
                    <h3 class="text-xl font-bold font-editorial">${coordinator.name || 'District Startup Coordinator'}</h3>
                    <p class="mt-2 text-sm text-brand-electric dark:text-brand-neon font-mono">${coordinator.designation || 'To be updated'}</p>
                    <p class="mt-2 text-xs text-slate-500 font-mono">${coordinator.org || 'Official district liaison'}</p>
                    <p class="mt-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">${coordinator.description || 'Admin can add the official district coordinator profile.'}</p>
                  </div>
                </div>
              </div>
            ` : ''}
          </div>
        ` : `
          <div class="rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 p-8 text-center">
            <h3 class="text-2xl font-bold font-editorial mb-2">Leadership roster pending approval</h3>
            <p class="text-sm text-slate-500 font-mono">Faculty, district liaison and representative details will appear here after official SCELL admin updates.</p>
          </div>
        `}
      </div>

      <div class="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-brand-cardDark/60 p-6 sm:p-8">
        <div class="flex items-center justify-between gap-4 mb-6">
          <div>
            <p class="font-mono text-[10px] uppercase tracking-[0.25em] text-brand-electric dark:text-brand-neon">STUDENT REPRESENTATIVES</p>
            <h2 class="text-2xl sm:text-3xl font-extrabold font-editorial mt-2">Campus Voice & Student Leadership</h2>
          </div>
          <span class="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em]">${reps.length} ACTIVE NODES</span>
        </div>

        ${reps.length === 0 ? `
          <div class="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 p-6 text-center text-slate-500 font-mono">Student representative roster is not published yet.</div>
        ` : `
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            ${reps.map((rep, index) => `
              <div class="group rounded-3xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900/40 p-5 shadow-lg hover:-translate-y-1 transition-all duration-200">
                <div class="flex items-center gap-4">
                  <img src="${safeImage(rep.image, getTeamPhotoDefault(index === 0 ? 'pratik' : 'ananya'))}" alt="${rep.name}" class="w-20 h-20 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-md" />
                  <div class="flex-1">
                    <div class="flex items-center justify-between gap-3">
                      <h3 class="text-xl font-bold font-editorial">${rep.name}</h3>
                      <span class="inline-flex items-center gap-1.5 px-2 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-[10px] text-emerald-400 font-mono uppercase">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> ACTIVE
                      </span>
                    </div>
                    <p class="mt-2 text-sm text-brand-electric dark:text-brand-neon font-mono">${rep.role || 'Student Representative'}</p>
                    <p class="mt-1 text-xs text-slate-500 font-mono">Batch: ${rep.batch || 'To be updated'}</p>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>

      <div class="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-brand-cardDark/60 p-6 sm:p-8">
        <div class="flex items-center justify-between gap-4 mb-6">
          <div>
            <p class="font-mono text-[10px] uppercase tracking-[0.25em] text-brand-electric dark:text-brand-neon">COORDINATORS</p>
            <h2 class="text-2xl sm:text-3xl font-extrabold font-editorial mt-2">Operational Team</h2>
          </div>
          <span class="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em]">${coordinators.length} entries</span>
        </div>

        ${coordinators.length === 0 ? `
          <div class="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 p-6 text-center text-slate-500 font-mono">Coordinator list is pending official approval.</div>
        ` : `
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            ${coordinators.map(member => `
              <div class="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900/40 p-4">
                <div class="flex items-center gap-3 mb-3">
                  <img src="${safeImage(member.image, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop')}" alt="${member.name}" class="w-12 h-12 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                  <div>
                    <div class="font-bold">${member.name}</div>
                    <div class="text-[11px] text-slate-500 font-mono">${member.role || member.designation || 'Coordinator'}</div>
                  </div>
                </div>
                <div class="text-[11px] font-mono text-slate-500">${member.batch || member.org || 'Official SCELL role'}</div>
              </div>
            `).join('')}
          </div>
        `}
      </div>

      <div class="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-950 text-white p-6 sm:p-8 shadow-[0_25px_90px_rgba(0,240,255,0.08)]">
        <div class="flex items-center justify-between gap-4 mb-6">
          <div>
            <p class="font-mono text-[10px] uppercase tracking-[0.25em] text-brand-neon">DEVELOPED BY</p>
            <h2 class="text-2xl sm:text-3xl font-extrabold font-editorial mt-2">System Builder</h2>
          </div>
          <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-neon/30 bg-brand-neon/10 text-[10px] text-brand-neon font-mono uppercase tracking-[0.22em]">
            <span class="w-2 h-2 rounded-full bg-brand-neon animate-pulse"></span>
            PLATFORM BUILDER
          </span>
        </div>

        <div class="rounded-2xl border border-brand-neon/20 bg-white/5 p-5">
          <div class="flex flex-col sm:flex-row items-start gap-5">
            <img src="${safeImage(developer.image, getTeamPhotoDefault('anurag'))}" alt="${developer.name}" class="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-brand-neon/60 shadow-lg shadow-brand-neon/20" />
            <div class="flex-1">
              <div class="font-mono text-[10px] uppercase tracking-[0.2em] text-brand-neon mb-2">// SYSTEM ARCHITECT</div>
              <h3 class="text-2xl font-bold font-editorial">${developer.name}</h3>
              <div class="mt-3 space-y-1 font-mono text-xs text-slate-300">
                <p>${developer.branch}</p>
                <p>${developer.batch}</p>
                <p>${developer.role}</p>
              </div>
            </div>
          </div>

          <div class="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="rounded-xl border border-slate-700 bg-slate-900/60 p-3 font-mono text-[10px] text-slate-300">
              <div class="mb-2 text-brand-neon uppercase tracking-[0.2em]">SYSTEM STATUS</div>
              <div class="flex items-center gap-2"><span class="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span> WEBSITE ONLINE</div>
            </div>
            <div class="rounded-xl border border-slate-700 bg-slate-900/60 p-3 font-mono text-[10px] text-slate-300">
              <div class="mb-2 text-brand-neon uppercase tracking-[0.2em]">BUILD LAYER</div>
              <div class="text-slate-200">Frontend Architecture • Portal Logic • Campus Innovation Dashboard</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

/* ABOUT VIEW */
function renderAboutView() {
  return `
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div class="border-b border-slate-200 dark:border-slate-800 pb-10">
        <span class="font-mono text-xs text-brand-electric dark:text-brand-neon uppercase tracking-widest block mb-2">// THE CHARTER</span>
        <h1 class="text-4xl sm:text-5xl font-extrabold font-editorial">About SCELL GECWC</h1>
        <p class="text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mt-4">
          The Startup Cell (SCELL) at Government Engineering College, West Champaran is dedicated to transforming student engineers into founders, intellectual property creators, and hardware innovators in Bihar.
        </p>
      </div>

      <div>
        <h2 class="text-2xl font-bold font-editorial mb-8">The Innovation Pipeline</h2>
        <div class="relative border-l-2 border-brand-electric/30 ml-4 pl-8 space-y-10 font-mono">
          <div class="relative">
            <span class="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-brand-electric border-4 border-black"></span>
            <span class="text-xs text-brand-electric dark:text-brand-neon font-bold">STAGE 01 // DISCOVER & IDEATE</span>
            <h4 class="text-lg font-bold text-slate-800 dark:text-white mt-1">Idea Validation & Regional Need Analysis</h4>
            <p class="text-xs text-slate-500 mt-1 leading-relaxed">Identifying concrete pain points across Champaran agriculture, flood telemetry, and supply chain logistics.</p>
          </div>

          <div class="relative">
            <span class="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-brand-neon border-4 border-black"></span>
            <span class="text-xs text-brand-electric dark:text-brand-neon font-bold">STAGE 02 // LAB BUILD</span>
            <h4 class="text-lg font-bold text-slate-800 dark:text-white mt-1">Hardware & Software Rapid Prototyping</h4>
            <p class="text-xs text-slate-500 mt-1 leading-relaxed">Access to PCB design, 3D printing, embedded firmware labs, and dedicated compute power at GECWC.</p>
          </div>

          <div class="relative">
            <span class="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-indigo-500 border-4 border-black"></span>
            <span class="text-xs text-brand-electric dark:text-brand-neon font-bold">STAGE 03 // PILOT TESTING</span>
            <h4 class="text-lg font-bold text-slate-800 dark:text-white mt-1">Ground Deployment & Field Validation</h4>
            <p class="text-xs text-slate-500 mt-1 leading-relaxed">Testing sensors in the Majhualia cane belt, Gandak floodbanks, and local municipal environments.</p>
          </div>

          <div class="relative">
            <span class="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-emerald-400 border-4 border-black"></span>
            <span class="text-xs text-brand-electric dark:text-brand-neon font-bold">STAGE 04 // ENTITY LAUNCH</span>
            <h4 class="text-lg font-bold text-slate-800 dark:text-white mt-1">Bihar Startup Incubation & Legal Formation</h4>
            <p class="text-xs text-slate-500 mt-1 leading-relaxed">Incorporation assistance, seed grant applications under Bihar Startup Policy, and initial angel pitch rounds.</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

/* ADMIN LOGIN & DASHBOARD VIEW */
function renderAdminView() {
  const isAuthenticated = sessionStorage.getItem('scell_admin_auth') === 'true';

  if (!isAuthenticated) {
    return `
      <div class="min-h-[80vh] flex items-center justify-center px-4 py-16">
        <div class="max-w-md w-full p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-cardDark shadow-2xl relative">
          <div class="w-12 h-12 rounded-xl bg-brand-electric/10 text-brand-electric dark:text-brand-neon flex items-center justify-center mb-6 mx-auto">
            <i data-lucide="shield-check" class="w-6 h-6"></i>
          </div>
          <div class="text-center mb-6">
            <span class="text-[10px] font-mono uppercase tracking-widest text-brand-electric dark:text-brand-neon font-bold">// ACCESS RESTRICTED</span>
            <h2 class="text-2xl font-bold font-editorial text-slate-900 dark:text-white mt-1">Admin Command Login</h2>
            <p class="text-xs text-slate-500 font-mono mt-1">Official GEC West Champaran SCELL Council Gateway</p>
          </div>
          <form onsubmit="handleAdminLogin(event)" class="space-y-4 font-mono text-xs">
            <div>
              <label class="block text-slate-400 mb-1">Admin Identity ID</label>
              <input type="text" id="admin-user" required placeholder="admin@gecwc" class="w-full px-3.5 py-2.5 rounded-lg border dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 outline-none focus:border-brand-electric text-slate-900 dark:text-white">
            </div>
            <div>
              <label class="block text-slate-400 mb-1">Security Key / Password</label>
              <input type="password" id="admin-pass" required placeholder="••••••••••••" class="w-full px-3.5 py-2.5 rounded-lg border dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 outline-none focus:border-brand-electric text-slate-900 dark:text-white">
            </div>
            <div id="admin-login-error" class="hidden p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-[11px] text-center"></div>
            <button type="submit" class="w-full py-3 rounded-xl bg-brand-electric hover:bg-blue-600 text-white font-bold tracking-wider uppercase transition cursor-pointer shadow-lg shadow-brand-electric/30">
              AUTHENTICATE GATEWAY
            </button>
          </form>
          <div class="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
            <button onclick="navigate('home')" class="font-mono text-xs text-slate-500 hover:text-slate-400 cursor-pointer">← Return to Main Portal</button>
          </div>
        </div>
      </div>
    `;
  }

  const activeTab = SCELL_ADMIN_STATE.activeTab || 'missions';
  const navTabs = [
    { key: 'missions', label: 'MISSIONS' },
    { key: 'assets', label: 'ASSETS' },
    { key: 'team', label: 'TEAM' },
    { key: 'content', label: 'CONTENT' }
  ];

  const renderMissionsTab = () => `
    <div class="space-y-8">
      <div class="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-cardDark shadow-xl">
        <div class="flex items-center justify-between gap-3 mb-6">
          <h3 class="text-2xl font-bold font-editorial">Deploy New Event to Website</h3>
          <button onclick="resetEventEditor(); showToast('Event form reset.');" class="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-mono uppercase">RESET</button>
        </div>
        <form onsubmit="handleCreateEventSubmit(event)" class="space-y-4 font-mono text-xs">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block mb-1 text-slate-500 dark:text-slate-300">Event Title *</label>
              <input type="text" id="ev-add-title" required placeholder="e.g. Drone Innovation Bootcamp" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 outline-none focus:border-brand-electric">
            </div>
            <div>
              <label class="block mb-1 text-slate-500 dark:text-slate-300">Category *</label>
              <select id="ev-add-category" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 outline-none focus:border-brand-electric">
                <option value="Workshop">Workshop</option>
                <option value="Hackathon">Hackathon</option>
                <option value="Competition">Competition</option>
                <option value="Ideathon">Ideathon</option>
                <option value="Seminar">Seminar</option>
                <option value="Webinar">Webinar</option>
                <option value="Quiz">Quiz</option>
                <option value="Exhibition">Exhibition</option>
                <option value="Outreach">Outreach</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="flex items-center gap-2 mb-1 text-slate-500 dark:text-slate-300"><i data-lucide="calendar-days" class="w-3.5 h-3.5"></i> Start Date *</label>
              <input type="date" id="ev-add-start-date" required class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 outline-none focus:border-brand-electric">
            </div>
            <div>
              <label class="flex items-center gap-2 mb-1 text-slate-500 dark:text-slate-300"><i data-lucide="calendar-days" class="w-3.5 h-3.5"></i> End Date</label>
              <input type="date" id="ev-add-end-date" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 outline-none focus:border-brand-electric">
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="flex items-center gap-2 mb-1 text-slate-500 dark:text-slate-300"><i data-lucide="clock" class="w-3.5 h-3.5"></i> Start Time</label>
              <input type="time" id="ev-add-start-time" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 outline-none focus:border-brand-electric">
            </div>
            <div>
              <label class="flex items-center gap-2 mb-1 text-slate-500 dark:text-slate-300"><i data-lucide="clock" class="w-3.5 h-3.5"></i> End Time</label>
              <input type="time" id="ev-add-end-time" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 outline-none focus:border-brand-electric">
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="flex items-center gap-2 mb-1 text-slate-500 dark:text-slate-300"><i data-lucide="map-pin" class="w-3.5 h-3.5"></i> Venue *</label>
              <input type="text" id="ev-add-venue" required placeholder="Auditorium, GECWC" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 outline-none focus:border-brand-electric">
            </div>
            <div>
              <label class="flex items-center gap-2 mb-1 text-slate-500 dark:text-slate-300"><i data-lucide="navigation" class="w-3.5 h-3.5"></i> Venue Map URL</label>
              <input type="url" id="ev-add-map-url" placeholder="https://maps.google.com/..." class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 outline-none focus:border-brand-electric">
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="flex items-center gap-2 mb-1 text-slate-500 dark:text-slate-300"><i data-lucide="image" class="w-3.5 h-3.5"></i> Poster Image URL</label>
              <input type="url" id="ev-add-poster" placeholder="https://images.unsplash.com/..." class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 outline-none focus:border-brand-electric">
            </div>
            <div>
              <label class="flex items-center gap-2 mb-1 text-slate-500 dark:text-slate-300"><i data-lucide="file-text" class="w-3.5 h-3.5"></i> Rulebook PDF URL</label>
              <input type="url" id="ev-add-rulebook" placeholder="https://drive.google.com/..." class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 outline-none focus:border-brand-electric">
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block mb-1 text-slate-500 dark:text-slate-300">Short Description</label>
              <textarea id="ev-add-short-desc" rows="2" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 outline-none focus:border-brand-electric"></textarea>
            </div>
            <div>
              <label class="block mb-1 text-slate-500 dark:text-slate-300">Full Event Description</label>
              <textarea id="ev-add-full-desc" rows="2" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 outline-none focus:border-brand-electric"></textarea>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block mb-1 text-slate-500 dark:text-slate-300">Eligibility</label>
              <textarea id="ev-add-eligibility" rows="2" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 outline-none focus:border-brand-electric"></textarea>
            </div>
            <div>
              <label class="block mb-1 text-slate-500 dark:text-slate-300">Rules / Instructions</label>
              <textarea id="ev-add-rules" rows="2" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 outline-none focus:border-brand-electric"></textarea>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block mb-1 text-slate-500 dark:text-slate-300">Registration</label>
              <select id="ev-add-reg-open" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 outline-none focus:border-brand-electric">
                <option value="open">OPEN</option>
                <option value="closed">CLOSED</option>
              </select>
            </div>
            <div>
              <label class="block mb-1 text-slate-500 dark:text-slate-300">Registration Start</label>
              <input type="date" id="ev-add-reg-start" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 outline-none focus:border-brand-electric">
            </div>
            <div>
              <label class="block mb-1 text-slate-500 dark:text-slate-300">Registration Deadline</label>
              <input type="date" id="ev-add-reg-deadline" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 outline-none focus:border-brand-electric">
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block mb-1 text-slate-500 dark:text-slate-300">Max Participants</label>
              <input type="number" id="ev-add-max-participants" value="100" min="1" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 outline-none focus:border-brand-electric">
            </div>
            <div>
              <label class="block mb-1 text-slate-500 dark:text-slate-300">Participation Type</label>
              <select id="ev-add-participation-type" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 outline-none focus:border-brand-electric">
                <option value="Individual">Individual</option>
                <option value="Team">Team</option>
                <option value="Both">Both</option>
              </select>
            </div>
            <div>
              <label class="block mb-1 text-slate-500 dark:text-slate-300">Max Team Size</label>
              <input type="number" id="ev-add-max-team-size" value="4" min="2" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 outline-none focus:border-brand-electric">
            </div>
          </div>

          <div class="flex items-center justify-between gap-4 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30 p-4">
            <div>
              <label class="block mb-1 text-slate-500 dark:text-slate-300">Event Status</label>
              <select id="ev-add-status" class="px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/80 outline-none focus:border-brand-electric">
                <option value="Draft">Draft</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Registration Open">Registration Open</option>
                <option value="Registration Closed">Registration Closed</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <button id="publish-event-btn" type="submit" class="px-6 py-3 rounded-xl bg-brand-electric hover:bg-blue-600 text-white font-bold tracking-wider uppercase cursor-pointer">PUBLISH EVENT LIVE</button>
          </div>
        </form>
      </div>

      <div class="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-cardDark shadow-xl">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-2xl font-bold font-editorial">Manage Active & Past Events</h3>
          <span class="font-mono text-[11px] text-slate-400">Total: ${SCELL_DATA.events.length}</span>
        </div>
        <div class="space-y-4">
          ${SCELL_DATA.events.length === 0 ? '<div class="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-6 text-slate-500">No event published yet. Create your first mission.</div>' : SCELL_DATA.events.map(ev => `
            <div class="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50/60 dark:bg-slate-900/40">
              <div class="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                <div class="flex items-center gap-4">
                  <img src="${ev.poster || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop'}" alt="${ev.title}" class="w-20 h-20 object-cover rounded-xl border border-slate-200 dark:border-slate-700">
                  <div>
                    <div class="flex flex-wrap items-center gap-2 mb-1">
                      <span class="px-2 py-1 rounded-full bg-blue-500/10 text-blue-500 text-[10px] font-mono font-bold">${ev.category || 'Workshop'}</span>
                      <span class="px-2 py-1 rounded-full ${ev.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'} text-[10px] font-mono font-bold">${ev.status}</span>
                    </div>
                    <h4 class="text-lg font-bold font-editorial">${ev.title}</h4>
                    <div class="mt-2 flex flex-wrap gap-3 text-[11px] text-slate-500 font-mono">
                      <span class="flex items-center gap-1"><i data-lucide="calendar-days" class="w-3.5 h-3.5"></i> ${ev.date || 'TBA'}</span>
                      <span class="flex items-center gap-1"><i data-lucide="clock" class="w-3.5 h-3.5"></i> ${ev.time || 'TBA'}</span>
                      <span class="flex items-center gap-1"><i data-lucide="map-pin" class="w-3.5 h-3.5"></i> ${ev.venue || 'GECWC'}</span>
                    </div>
                  </div>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                  <button onclick="prefillEventEditor('${ev.id}')" class="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-[10px] font-mono uppercase">EDIT</button>
                  <button onclick="navigate('event-detail', '${ev.id}')" class="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-[10px] font-mono uppercase">VIEW</button>
                  <button onclick="exportRegistrationsCSV()" class="px-3 py-2 rounded-lg border border-emerald-500/40 text-emerald-400 text-[10px] font-mono uppercase">REGISTRATIONS</button>
                  <button onclick="toggleEventRegistration('${ev.id}', ${!ev.registrationOpen})" class="px-3 py-2 rounded-lg border ${ev.registrationOpen ? 'border-red-500/40 text-red-400' : 'border-emerald-500/40 text-emerald-400'} text-[10px] font-mono uppercase">${ev.registrationOpen ? 'CLOSE REG' : 'OPEN REG'}</button>
                  <button onclick="markEventCompleted('${ev.id}')" class="px-3 py-2 rounded-lg border border-amber-500/40 text-amber-400 text-[10px] font-mono uppercase">FINISHED</button>
                  <button onclick="duplicateEvent('${ev.id}')" class="px-3 py-2 rounded-lg border border-violet-500/40 text-violet-400 text-[10px] font-mono uppercase">DUPLICATE</button>
                  <button onclick="deleteEvent('${ev.id}')" class="px-3 py-2 rounded-lg border border-red-500/40 text-red-400 text-[10px] font-mono uppercase">DELETE</button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  const renderAssetsTab = () => `
    <div class="space-y-8">
      <div class="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-cardDark shadow-xl">
        <h3 class="text-2xl font-bold font-editorial mb-6">Assets Library</h3>
        <form onsubmit="handleAssetSubmit(event)" class="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs">
          <div class="md:col-span-2">
            <label class="block mb-1 text-slate-500 dark:text-slate-300">Asset Name</label>
            <input id="asset-name" type="text" required placeholder="Drone workshop poster" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 outline-none focus:border-brand-electric">
          </div>
          <div>
            <label class="block mb-1 text-slate-500 dark:text-slate-300">Category</label>
            <select id="asset-category" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 outline-none focus:border-brand-electric">
              <option value="Event Posters">Event Posters</option>
              <option value="Gallery / Memories">Gallery / Memories</option>
              <option value="Project Images">Project Images</option>
              <option value="Startup Logos">Startup Logos</option>
              <option value="Team Photos">Team Photos</option>
              <option value="Documents / PDFs">Documents / PDFs</option>
            </select>
          </div>
          <div>
            <label class="block mb-1 text-slate-500 dark:text-slate-300">Asset URL</label>
            <input id="asset-url" type="url" required placeholder="https://..." class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 outline-none focus:border-brand-electric">
          </div>
          <div class="md:col-span-4 flex justify-end">
            <button type="submit" class="px-5 py-3 rounded-xl bg-brand-electric text-white font-bold uppercase tracking-wider">Add Asset</button>
          </div>
        </form>
      </div>

      <div class="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-cardDark shadow-xl">
        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          ${SCELL_DATA.assets.length === 0 ? '<div class="col-span-full text-slate-500">No assets saved yet.</div>' : SCELL_DATA.assets.map(asset => `
            <div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 p-3">
              <img src="${asset.url}" alt="${asset.name}" class="w-full h-40 object-cover rounded-xl mb-3 border border-slate-200 dark:border-slate-700">
              <div class="flex items-center justify-between gap-2 mb-2">
                <p class="font-bold text-sm truncate">${asset.name}</p>
                <span class="text-[10px] font-mono text-slate-500">${asset.category}</span>
              </div>
              <div class="flex gap-2">
                <button onclick="copyAssetUrl('${asset.url}')" class="flex-1 px-2 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-[10px] font-mono uppercase">COPY</button>
                <button onclick="deleteAsset('${asset.id}')" class="flex-1 px-2 py-2 rounded-lg border border-red-500/40 text-red-400 text-[10px] font-mono uppercase">DELETE</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  const renderTeamTab = () => `
    <div class="space-y-8">
      <div class="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-cardDark shadow-xl">
        <h3 class="text-2xl font-bold font-editorial mb-6">Team Management</h3>
        <form onsubmit="handleSaveTeamMember(event)" class="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          <div>
            <label class="block mb-1 text-slate-500 dark:text-slate-300">Full Name *</label>
            <input id="team-name" required type="text" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 outline-none focus:border-brand-electric">
          </div>
          <div>
            <label class="block mb-1 text-slate-500 dark:text-slate-300">Designation / Role *</label>
            <input id="team-role" required type="text" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 outline-none focus:border-brand-electric">
          </div>
          <div>
            <label class="block mb-1 text-slate-500 dark:text-slate-300">Category</label>
            <select id="team-category" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 outline-none focus:border-brand-electric">
              <option value="Faculty In-Charge">Faculty In-Charge</option>
              <option value="District Startup Coordinator">District Startup Coordinator</option>
              <option value="Student Representatives" selected>Student Representatives</option>
              <option value="Coordinators">Coordinators</option>
            </select>
          </div>
          <div>
            <label class="block mb-1 text-slate-500 dark:text-slate-300">Profile Photo URL</label>
            <input id="team-photo" type="url" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 outline-none focus:border-brand-electric" placeholder="https://images.unsplash.com/...">
          </div>
          <div>
            <label class="block mb-1 text-slate-500 dark:text-slate-300">Mobile Number</label>
            <input id="team-phone" type="tel" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 outline-none focus:border-brand-electric" placeholder="+91 98765 43210">
          </div>
          <div>
            <label class="block mb-1 text-slate-500 dark:text-slate-300">WhatsApp / Contact Link</label>
            <input id="team-whatsapp" type="url" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 outline-none focus:border-brand-electric" placeholder="https://wa.me/919876543210">
          </div>
          <div>
            <label class="block mb-1 text-slate-500 dark:text-slate-300">Department / Organisation</label>
            <input id="team-department" type="text" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 outline-none focus:border-brand-electric">
          </div>
          <div>
            <label class="block mb-1 text-slate-500 dark:text-slate-300">Academic Year / Batch</label>
            <input id="team-batch" type="text" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 outline-none focus:border-brand-electric">
          </div>
          <div>
            <label class="block mb-1 text-slate-500 dark:text-slate-300">LinkedIn URL</label>
            <input id="team-linkedin" type="url" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 outline-none focus:border-brand-electric">
          </div>
          <div>
            <label class="block mb-1 text-slate-500 dark:text-slate-300">Email</label>
            <input id="team-email" type="email" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 outline-none focus:border-brand-electric">
          </div>
          <div>
            <label class="block mb-1 text-slate-500 dark:text-slate-300">Website / Portfolio</label>
            <input id="team-website" type="url" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 outline-none focus:border-brand-electric" placeholder="https://your-portfolio.com">
          </div>
          <div>
            <label class="block mb-1 text-slate-500 dark:text-slate-300">Display Order</label>
            <input id="team-order" type="number" value="1" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 outline-none focus:border-brand-electric">
          </div>
          <div>
            <label class="block mb-1 text-slate-500 dark:text-slate-300">Status</label>
            <select id="team-status" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 outline-none focus:border-brand-electric">
              <option value="Active">Active</option>
              <option value="Hidden">Hidden</option>
            </select>
          </div>
          <div class="md:col-span-2 flex justify-end gap-2">
            <button type="button" onclick="resetTeamForm()" class="px-5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 font-bold uppercase">CLEAR</button>
            <button type="submit" class="px-5 py-3 rounded-xl bg-brand-electric text-white font-bold uppercase">SAVE MEMBER</button>
          </div>
        </form>
      </div>

      <div class="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-cardDark shadow-xl">
        <h3 class="text-xl font-bold font-editorial mb-4">Member Directory</h3>
        <div class="space-y-4">
          ${[
            { title: 'Faculty In-Charge', items: SCELL_DATA.team.faculty || [] },
            { title: 'District Startup Coordinator', items: SCELL_DATA.team.districtCoordinator ? [SCELL_DATA.team.districtCoordinator] : [] },
            { title: 'Student Representatives', items: SCELL_DATA.team.studentRepresentatives || [] },
            { title: 'Coordinators', items: SCELL_DATA.team.coordinators || [] }
          ].map(group => `
            <div class="rounded-2xl border border-slate-200 dark:border-slate-800 p-3">
              <div class="font-bold mb-3 text-sm uppercase tracking-widest text-slate-500">${group.title}</div>
              <div class="space-y-3">
                ${group.items.length === 0 ? '<div class="text-slate-500 text-[11px]">No members published yet.</div>' : group.items.map(member => `
                  <div class="flex items-center justify-between gap-4 rounded-xl border border-slate-200 dark:border-slate-800 p-3">
                    <div class="flex items-center gap-3">
                      <img src="${member.image || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop'}" class="w-12 h-12 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                      <div>
                        <div class="font-bold">${member.name || 'To be updated'}</div>
                        <div class="text-[11px] text-slate-500 font-mono">${member.role || member.designation || group.title} · ${member.batch || member.org || 'Manual entry'}</div>
                        <div class="mt-1 flex flex-wrap gap-2 text-[10px] text-slate-500 font-mono">
                          ${member.phone ? `<a href="tel:${member.phone}" class="text-brand-electric dark:text-brand-neon">Call</a>` : ''}
                          ${member.whatsapp ? `<a href="${member.whatsapp}" target="_blank" rel="noreferrer" class="text-emerald-500">WhatsApp</a>` : ''}
                          ${member.email ? `<a href="mailto:${member.email}" class="text-brand-electric dark:text-brand-neon">Email</a>` : ''}
                          ${member.linkedin ? `<a href="${member.linkedin}" target="_blank" rel="noreferrer" class="text-violet-500">LinkedIn</a>` : ''}
                        </div>
                      </div>
                    </div>
                    <div class="flex gap-2">
                      <button onclick="prefillTeamMember('${escapeTeamAttribute(member.name || '')}', '${escapeTeamAttribute(group.title)}')" class="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-[10px] font-mono uppercase">EDIT</button>
                      <button onclick="deleteTeamMember('${escapeTeamAttribute(member.name || '')}', '${escapeTeamAttribute(group.title)}')" class="px-3 py-2 rounded-lg border border-red-500/40 text-red-400 text-[10px] font-mono uppercase">REMOVE</button>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  const renderContentTab = () => `
    <div class="space-y-8">
      ${['home', 'events', 'projects', 'startups', 'arena', 'memories', 'team', 'about'].map(section => {
        const content = SCELL_DATA.siteContent[section] || {};
        return `
          <div class="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-cardDark shadow-xl">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xl font-bold font-editorial uppercase">${section}</h3>
              <button onclick="saveContentSection('${section}')" class="px-3 py-2 rounded-lg bg-brand-electric text-white text-[10px] font-mono uppercase">SAVE</button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="md:col-span-2">
                <label class="block mb-1 text-slate-500 dark:text-slate-300">Heading</label>
                <input id="content-heading-${section}" value="${(content.heading || '').replace(/"/g, '&quot;')}" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 outline-none focus:border-brand-electric">
              </div>
              <div class="md:col-span-2">
                <label class="block mb-1 text-slate-500 dark:text-slate-300">Subtitle / Intro</label>
                <textarea id="content-subtitle-${section}" rows="2" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 outline-none focus:border-brand-electric">${(content.subtitle || content.intro || '').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</textarea>
              </div>
              <div class="md:col-span-2">
                <label class="block mb-1 text-slate-500 dark:text-slate-300">Description</label>
                <textarea id="content-description-${section}" rows="2" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 outline-none focus:border-brand-electric">${(content.description || content.subheading || '').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</textarea>
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  const tabContent = {
    missions: renderMissionsTab(),
    assets: renderAssetsTab(),
    team: renderTeamTab(),
    content: renderContentTab()
  }[activeTab] || renderMissionsTab();

  return `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-8 mb-8">
        <div>
          <div class="flex items-center gap-2 font-mono text-xs text-emerald-400">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>SCELL // LIVE_CLOUD_OPS</span>
          </div>
          <h1 class="text-3xl font-extrabold font-editorial mt-1">Admin Command Hub</h1>
        </div>
        <div class="flex items-center gap-3">
          <button onclick="exportRegistrationsCSV()" class="px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-black font-mono text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20">
            <i data-lucide="file-spreadsheet" class="w-4 h-4"></i>
            <span>EXPORT CSV</span>
          </button>
          <button onclick="handleAdminLogout()" class="px-4 py-2.5 rounded-lg border border-red-500/40 text-red-400 hover:bg-red-500/10 font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer">
            <i data-lucide="log-out" class="w-4 h-4"></i>
            <span>LOGOUT</span>
          </button>
        </div>
      </div>

      <div class="mb-8 flex flex-wrap gap-2 font-mono text-xs">
        ${navTabs.map(tab => `
          <button onclick="setAdminTab('${tab.key}')" class="px-3 py-2 rounded-xl border transition ${activeTab === tab.key ? 'bg-brand-electric text-white border-brand-electric' : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300'}">${tab.label}</button>
        `).join('')}
      </div>

      ${tabContent}
    </div>
  `;
}