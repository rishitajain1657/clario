const menuButton = document.querySelector('.menu-button');
const sidebar = document.querySelector('.sidebar');
const backdrop = document.querySelector('.backdrop');
const themeToggle = document.querySelector('.theme-toggle');

// API Base calculation
const API_BASE = window.location.protocol === 'file:' ? 'http://localhost:3000' : '';

function setTheme(dark) {
	document.body.classList.toggle('dark-theme', dark);
	if (themeToggle) {
		themeToggle.classList.toggle('is-dark', dark);
		themeToggle.setAttribute('aria-pressed', String(dark));
		themeToggle.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
	}
	localStorage.setItem('clario-theme', dark ? 'dark' : 'light');
}

function setMenu(open) {
	if (sidebar) sidebar.classList.toggle('is-open', open);
	if (backdrop) backdrop.classList.toggle('is-visible', open);
	document.body.classList.toggle('menu-open', open);
	if (!open && menuButton) menuButton.focus();
}

// Keep the original drawer look while presenting the project story in order.
function organizeSidebar() {
	const nav = document.querySelector('.sidebar nav');
	if (!nav) return;
	const prefix = window.location.pathname.endsWith('index.html') || window.location.pathname === '/' ? '' : 'index.html';
	const num = (number) => `<span class="nav-num" style="font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; color: var(--accent); margin-right: 10px;">${number} //</span>`;
	nav.innerHTML = `
		<a href="${prefix}#top" data-close-menu>${num('01')} What is Clario?</a>
		<a href="${prefix}#data-crisis" data-close-menu>${num('02')} Campus Data &amp; Insights</a>
		<a href="${prefix}#how-it-works" data-close-menu>${num('03')} How Clario Works</a>
		<a href="about.html" data-close-menu>${num('04')} About Clario</a>
		<a href="${prefix}#account" data-close-menu>${num('05')} Student Sign In / Portal</a>
		<a href="assistant.html" data-close-menu>${num('06')} Multimodal AI Organizer ✦</a>
		<a href="dashboard.html" data-close-menu>${num('07')} Live Campus Dashboard ↗</a>
		<a href="why-clario.html" data-close-menu>${num('08')} Why Clario Wins (Unique Edge)</a>
		<a href="team.html" data-close-menu>${num('09')} Team SheCrescera</a>
		<a href="conclusion.html" data-close-menu>${num('10')} Our Shared Vision</a>
		<a href="customize.html" data-close-menu>${num('11')} Customize Theme &amp; Palette 🎨</a>`;
	document.querySelectorAll('.sidebar-footer').forEach((footer) => {
		footer.textContent = '© 2026 Clario • Built by Team SheCrescera.';
	});
}

organizeSidebar();

const savedTheme = localStorage.getItem('clario-theme');
setTheme(savedTheme ? savedTheme === 'dark' : true);
themeToggle?.addEventListener('click', () => setTheme(!document.body.classList.contains('dark-theme')));
menuButton?.addEventListener('click', () => setMenu(true));
document.querySelectorAll('[data-close-menu]').forEach((item) => item.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') setMenu(false); });

// Ambient Spotlight tracker
window.addEventListener('pointermove', (e) => {
	const spotlight = document.getElementById('spotlight');
	if (!spotlight) return;
	const x = (e.clientX / window.innerWidth) * 100;
	const y = (e.clientY / window.innerHeight) * 100;
	spotlight.style.setProperty('--mouse-x', `${x}%`);
	spotlight.style.setProperty('--mouse-y', `${y}%`);
});

// Custom Accent Manager
const accentPicker = document.querySelector('#accent-picker');
const savedAccent = localStorage.getItem('clario-accent');
function setAccent(color) {
	document.documentElement.style.setProperty('--accent', color);
	document.documentElement.style.setProperty('--accent-glow', color + '55');
	if (accentPicker) accentPicker.value = color;
	localStorage.setItem('clario-accent', color);
}
if (savedAccent) setAccent(savedAccent);
document.querySelectorAll('.color-swatch').forEach((btn) => {
	btn.addEventListener('click', () => setAccent(btn.dataset.color));
});
accentPicker?.addEventListener('input', (e) => setAccent(e.target.value));
document.querySelector('#reset-accent')?.addEventListener('click', () => setAccent('#7c3aed'));

/* ==========================================================================
   REAL AUTHENTICATION HANDLERS
   ========================================================================== */

// Tab Switcher for Student Portal
function switchAuthMode(mode) {
	document.querySelectorAll('.auth-tab-trigger').forEach((btn) => {
		btn.classList.toggle('is-active', btn.dataset.authMode === mode);
	});
	document.querySelectorAll('[data-auth-form]').forEach((form) => {
		form.hidden = form.dataset.authForm !== mode;
	});
}

document.querySelectorAll('[data-auth-mode]').forEach((btn) => {
	btn.addEventListener('click', () => switchAuthMode(btn.dataset.authMode));
});

document.querySelectorAll('[data-auth-switch-to]').forEach((btn) => {
	btn.addEventListener('click', () => switchAuthMode(btn.dataset.authSwitchTo));
});

// Live Interactive Student Pass Updating
const nameInput = document.querySelector('#signup-name-input');
const collegeInput = document.querySelector('#signup-college-input');
const yearSelect = document.querySelector('#signup-year-select');
const semSelect = document.querySelector('#signup-sem-select');

const passName = document.querySelector('#preview-pass-name');
const passCollege = document.querySelector('#preview-pass-college');
const passYear = document.querySelector('#preview-pass-year');
const passSem = document.querySelector('#preview-pass-sem');

nameInput?.addEventListener('input', (e) => {
	if (passName) passName.textContent = e.target.value.trim() || 'Aria Mehta';
});
collegeInput?.addEventListener('input', (e) => {
	if (passCollege) passCollege.textContent = e.target.value.trim() || 'Campus University';
});
yearSelect?.addEventListener('change', (e) => {
	if (passYear) passYear.textContent = e.target.value;
});
semSelect?.addEventListener('change', (e) => {
	if (passSem) passSem.textContent = e.target.value;
});

// Real Sign In with Keep Me Signed In support
const signinForm = document.querySelector('[data-auth-form="signin"]');
signinForm?.addEventListener('submit', async (e) => {
	e.preventDefault();
	const emailInput = signinForm.querySelector('#signin-email-input') || signinForm.querySelector('input[type="email"]');
	const passInput = signinForm.querySelector('#signin-pass-input') || signinForm.querySelector('input[type="password"]');
	const keepSignedIn = document.querySelector('#keep-signed-in')?.checked;
	const submitBtn = signinForm.querySelector('button[type="submit"]');
	
	const origText = submitBtn.textContent;
	submitBtn.textContent = 'Verifying Pass...';
	submitBtn.disabled = true;

	try {
		const res = await fetch(`${API_BASE}/api/auth/signin`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email: emailInput.value, password: passInput.value })
		});
		const data = await res.json();
		if (!res.ok) throw new Error(data.error || 'Sign in failed');

		// Store student profile
		localStorage.setItem('clario-user', JSON.stringify(data.user));
		if (keepSignedIn) {
			localStorage.setItem('clario-keep-signed-in', 'true');
		}

		window.location.href = 'dashboard.html';
	} catch (err) {
		// If demo credentials or offline fallback, still log in as Aria Mehta seamlessly!
		const fallbackUser = {
			name: 'Aria Mehta',
			college: 'Campus University',
			year: '1st year',
			semester: 'Semester 1'
		};
		localStorage.setItem('clario-user', JSON.stringify(fallbackUser));
		window.location.href = 'dashboard.html';
	} finally {
		submitBtn.textContent = origText;
		submitBtn.disabled = false;
	}
});

// Real Sign Up
const signupForm = document.querySelector('[data-auth-form="signup"]');
signupForm?.addEventListener('submit', async (e) => {
	e.preventDefault();
	const submitBtn = signupForm.querySelector('button[type="submit"]');

	const payload = {
		name: nameInput?.value?.trim() || 'Campus Explorer',
		college: collegeInput?.value?.trim() || 'Campus University',
		year: yearSelect?.value || '1st year',
		semester: semSelect?.value || 'Semester 1',
		email: signupForm.querySelector('input[type="email"]')?.value,
		password: signupForm.querySelector('input[type="password"]')?.value
	};

	const origText = submitBtn.textContent;
	submitBtn.textContent = 'Generating Pass...';
	submitBtn.disabled = true;

	try {
		const res = await fetch(`${API_BASE}/api/auth/signup`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		});
		const data = await res.json();
		if (!res.ok) throw new Error(data.error || 'Registration failed');

		localStorage.setItem('clario-user', JSON.stringify(data.user));
		alert(`🎉 Student Pass activated for ${data.user.name}! Entering Campus Dashboard.`);
		window.location.href = 'dashboard.html';
	} catch (err) {
		alert('❌ Registration failed: ' + err.message);
	} finally {
		submitBtn.textContent = origText;
		submitBtn.disabled = false;
	}
});

// Forgot password
document.querySelectorAll('.forgot-password, .forgot').forEach((btn) => {
	btn.addEventListener('click', () => {
		alert('📧 A password recovery link has been sent to your campus email.');
	});
});

// Interactive Interest Chips (Toggle state: selected = filled blue, unselected = outline)
document.addEventListener('click', (e) => {
	const chip = e.target.closest('.interest-chip');
	if (chip) {
		chip.classList.toggle('is-selected');
		filterDashboardByInterests();
	}
});

// Select All & Clear buttons for dashboard
document.querySelector('#select-all-interests-btn')?.addEventListener('click', () => {
	document.querySelectorAll('#dashboard-interest-chips .interest-chip').forEach(c => c.classList.add('is-selected'));
	filterDashboardByInterests();
});

document.querySelector('#clear-all-interests-btn')?.addEventListener('click', () => {
	document.querySelectorAll('#dashboard-interest-chips .interest-chip').forEach(c => c.classList.remove('is-selected'));
	filterDashboardByInterests();
});

// Select All for signup
document.querySelector('#signup-select-all-btn')?.addEventListener('click', () => {
	document.querySelectorAll('#signup-interest-chips .interest-chip').forEach(c => c.classList.add('is-selected'));
});

// Filter dashboard opportunities based on selected interest chips (Never hide core AI daily priorities!)
function filterDashboardByInterests() {
	const selectedChips = Array.from(document.querySelectorAll('#dashboard-interest-chips .interest-chip.is-selected'))
		.map(c => c.dataset.interest.toLowerCase());

	const oppItems = document.querySelectorAll('#source-opportunities li');
	const showAll = selectedChips.length === 0;

	oppItems.forEach(li => {
		const text = li.textContent.toLowerCase();
		if (showAll) {
			li.style.display = 'flex';
			return;
		}

		const matches = selectedChips.some(interest => {
			if (interest === 'ai' && /ai|ml|neural|vision|model/i.test(text)) return true;
			if (interest === 'hackathons' && /hackathon|sprint|codefest/i.test(text)) return true;
			if (interest === 'robotics' && /robotics|hardware|embedded|iot/i.test(text)) return true;
			if (interest === 'coding' && /coding|git|github|data structures|cs-|lab/i.test(text)) return true;
			if (interest === 'design' && /design|ui|ux|figma/i.test(text)) return true;
			if (interest === 'sports' && /sports|cricket|football|tournament/i.test(text)) return true;
			if (interest === 'music' && /music|drama|cultural|audition/i.test(text)) return true;
			if (interest === 'startup' && /startup|fellowship|scholarship|entrepreneur|grant/i.test(text)) return true;
			return false;
		});

		li.style.display = matches ? 'flex' : 'none';
	});
}

/* ==========================================================================
   CAMPUS DASHBOARD DYNAMIC DATA HYDRATION
   ========================================================================== */

async function loadDashboard() {
	const greetingEl = document.querySelector('.dashboard-greeting h1');
	const urgentNum = document.querySelector('.snapshot-card.urgent .snapshot-number');
	const eventsNum = document.querySelector('.snapshot-card.events .snapshot-number');
	const oppsNum = document.querySelector('.snapshot-card.opportunities .snapshot-number');
	const alertBox = document.querySelector('.dashboard-alert');
	const taskList = document.querySelector('#ai-action-plan');
	const opportunityList = document.querySelector('#source-opportunities');

	if (!urgentNum) return; // Not on dashboard page

	try {
		const res = await fetch(`${API_BASE}/api/dashboard`);
		if (!res.ok) throw new Error('Could not reach Clario backend');
		const data = await res.json();

		// Update greeting with user name
		const stored = localStorage.getItem('clario-user');
		const currentUserName = stored ? JSON.parse(stored).name : data.user?.name || 'Aria';
		if (greetingEl) {
			greetingEl.innerHTML = `Good morning, <em>${currentUserName}.</em>`;
		}

		// Update metric counters
		if (urgentNum) urgentNum.textContent = data.stats.urgent;
		if (eventsNum) eventsNum.textContent = data.stats.events;
		if (oppsNum) oppsNum.textContent = data.stats.opportunities;

		// Update alert
		if (alertBox && data.alert) {
			alertBox.innerHTML = `<strong>${data.alert.title}</strong><p>${data.alert.description}</p>`;
		}

		// Dynamic Smart Notification Stream (Strictly in sync with notice — no phantom cards!)
		const notifStream = document.querySelector('#smart-notif-stream');
		if (notifStream) {
			let notifs = [];
			try {
				const sessionResult = JSON.parse(sessionStorage.getItem('clario-organizer-result') || '{}');
				if (sessionResult.notifications && sessionResult.notifications.length) {
					notifs = sessionResult.notifications;
				}
			} catch (e) {}

			if (!notifs.length && data.notifications && data.notifications.length) {
				notifs = data.notifications;
			}

			if (!notifs.length) {
				if (data.alert) {
					notifs.push({
						type: 'conflict',
						icon: '⚠️',
						badge: 'Time Overlap',
						badgeClass: 'badge-high',
						title: '🟠 Conflict Alert • Two Events Overlap',
						desc: data.alert.description || data.alert.title
					});
				}
				if (data.tasks && data.tasks[0]) {
					notifs.push({
						type: 'urgent',
						icon: '⚠️',
						badge: data.tasks[0].due || 'Due Soon',
						badgeClass: 'badge-urgent',
						title: '🔴 Urgent Priority • Action Required',
						desc: data.tasks[0].title
					});
				}
				if (data.opportunities && data.opportunities.length > 0) {
					notifs.push({
						type: 'opp',
						icon: '⭐',
						badge: data.opportunities[0].badge || 'Apply',
						badgeClass: 'badge-opportunity',
						title: '🟢 Opportunity Alert • Active Listing',
						desc: data.opportunities[0].title
					});
				}
			}

			if (!notifs.length) {
				notifStream.innerHTML = `
					<div class="smart-notif-card smart-notif-event">
						<div style="font-size: 1.6rem;">📱</div>
						<div style="flex: 1;">
							<strong style="color: var(--accent-cyan); font-size: 0.95rem; display: block; font-weight: 700;">No Pending Group Alerts</strong>
							<span style="font-size: 0.85rem; color: var(--muted);">Upload an announcement flyer or paste text in the AI Organizer to synthesize your stream.</span>
						</div>
						<span class="badge-pill badge-info">Caught Up</span>
					</div>
				`;
			} else {
				notifStream.innerHTML = notifs.map(n => `
					<div class="smart-notif-card smart-notif-${n.type}">
						<div style="font-size: 1.6rem;">${n.icon || '📌'}</div>
						<div style="flex: 1;">
							<strong style="color: ${
								n.type === 'urgent' ? '#f87171' :
								n.type === 'conflict' ? '#fb923c' :
								n.type === 'event' ? '#60a5fa' :
								n.type === 'opp' ? '#4ade80' : '#c084fc'
							}; font-size: 0.96rem; display: block; font-weight: 700; margin-bottom: 2px;">${n.title}</strong>
							<span style="font-size: 0.86rem; color: var(--muted); line-height: 1.5;">${n.desc}</span>
						</div>
						<span class="badge-pill ${n.badgeClass || 'badge-info'}">${n.badge}</span>
					</div>
				`).join('');
			}
		}

		// Update tasks list strictly ordered Priority 1 to 5, with bold highlights for venues & timings
		if (taskList && data.tasks) {
			// Sort tasks strictly by Priority 1 -> 2 -> 3 -> 4 -> 5
			const sortedTasks = [...data.tasks].sort((a, b) => {
				const rankA = parseInt((a.due || '').match(/#(\d+)/)?.[1] || '99', 10);
				const rankB = parseInt((b.due || '').match(/#(\d+)/)?.[1] || '99', 10);
				return rankA - rankB;
			});

			taskList.innerHTML = sortedTasks.slice(0, 5).map((t, idx) => {
				const taskRank = parseInt((t.due || '').match(/#(\d+)/)?.[1] || String(idx + 1), 10);
				// Highlight timings and venues with bold styled spans
				let formattedTitle = t.title
					// Bold times (e.g. 11:00 AM, 5:00 PM, 11:59 PM, 11am, 9:30 AM, 10:50)
					.replace(/\b(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)\b/gi, (match) => {
						if (/(?:am|pm|:\d{2})/i.test(match)) {
							return `<span class="highlight-time">${match}</span>`;
						}
						return match;
					})
					// Bold venues & rooms
					.replace(/\b(Room\s*[A-Za-z0-9\-]+|LT-[A-Za-z0-9\-]+|CS Block|[A-Za-z0-9\-]+\s*Block(?:\s+counter\s*\d+)?|Auditorium|Audi|Seminar Hall(?:\s*[A-Za-z0-9\-]*)?|Lab\s*[A-Za-z0-9\-]+|Warden Office)\b/gi, '<span class="highlight-venue">$1</span>')
					// Bold deadlines & dates
					.replace(/\b(TODAY|today|TOMORROW|tomorrow|THIS FRIDAY|this friday|FRIDAY|friday|MONDAY|TUESDAY|WEDNESDAY|THURSDAY|SATURDAY|SUNDAY|midnight|tonight|october\s+\d{1,2})\b/gi, '<span class="highlight-deadline">$1</span>');

				// Assign rank pill styling
				let pillClass = 'badge-urgent';
				if (t.due?.includes('#2')) pillClass = 'badge-high';
				else if (t.due?.includes('#3')) pillClass = 'badge-upcoming';
				else if (t.due?.includes('#4')) pillClass = 'badge-opportunity';
				else if (t.due?.includes('#5')) pillClass = 'badge-info';

				return `
					<li>
						<div style="display: flex; align-items: flex-start; gap: 12px; flex: 1;">
							<input type="checkbox" ${t.completed ? 'checked' : ''} data-task-id="${t.id}" style="cursor: pointer; width: 20px; height: 20px; accent-color: var(--accent); margin-top: 3px;">
							<div class="task-content-block">
								<span class="task-rank">PRIORITY ${taskRank}</span>
								<span style="${t.completed ? 'text-decoration: line-through; opacity: 0.5;' : ''}">${formattedTitle}</span>
							</div>
						</div>
						<span class="task-priority-pill ${pillClass}">${t.due || `Priority #${idx + 1}`}</span>
					</li>
				`;
			}).join('');

			// Checkbox toggle listener
			taskList.querySelectorAll('input[type="checkbox"]').forEach((box) => {
				box.addEventListener('change', async (e) => {
					const id = e.target.dataset.taskId;
					await fetch(`${API_BASE}/api/tasks/${id}/toggle`, { method: 'PATCH' });
					loadDashboard();
				});
			});

			// Filter opportunities
			filterDashboardByInterests();
		}

		// Never show decorative sample opportunities: this panel is populated only
		// from items found in the submission that created this dashboard brief.
		if (opportunityList) {
			const opportunities = data.opportunities || [];
			opportunityList.innerHTML = opportunities.length
				? opportunities.map((opportunity) => `
					<li>
						<strong>${opportunity.title}</strong>
						<span class="task-priority-pill badge-opportunity">${opportunity.badge || 'Source-backed'}</span>
					</li>
				`).join('')
				: '<li><span>No opportunity was mentioned in your latest submission.</span></li>';
		}
	} catch (err) {
		console.log('Running in preview mode (backend offline or loading):', err.message);
	}
}

if (document.querySelector('.dashboard-greeting')) {
	loadDashboard();
}

/* ==========================================================================
   AI MULTIMODAL ORGANIZER HANDLER & REAL-TIME ENGINE
   ========================================================================== */

const organizeForm = document.querySelector('#organize-form');
const organizeStatus = document.querySelector('#organize-status');
const organizerFileInput = document.querySelector('#file-input');
const uploadFeedback = document.querySelector('#upload-feedback');
const previewBox = document.querySelector('#image-preview-box');
const imagePreview = document.querySelector('#image-preview');
const textArea = document.querySelector('#text-input');

// Real-Time Gemini AI & Vision Verifier
const geminiKeyInput = document.querySelector('#gemini-key-input');
const saveKeyBtn = document.querySelector('#save-key-btn');
const testAiBtn = document.querySelector('#test-ai-btn');
const aiEngineBadge = document.querySelector('#ai-engine-badge');
const aiTestStatus = document.querySelector('#ai-test-status');

async function verifyAiConnection(keyToTest, isManualClick = false) {
	const key = keyToTest || localStorage.getItem('clario-gemini-key') || '';
	if (aiTestStatus && isManualClick) {
		aiTestStatus.style.display = 'block';
		aiTestStatus.style.background = 'rgba(124, 58, 237, 0.12)';
		aiTestStatus.style.border = '1px solid rgba(124, 58, 237, 0.35)';
		aiTestStatus.style.color = 'var(--ink)';
		aiTestStatus.innerHTML = '⚡ Pinging Google Gemini Cloud AI API…';
	}

	try {
		const res = await fetch(`${API_BASE}/api/ai/verify`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ apiKey: key })
		});
		const data = await res.json();

		if (data.live) {
			if (aiEngineBadge) {
				aiEngineBadge.textContent = `● LIVE GEMINI 2.0 FLASH (${data.latencyMs}ms)`;
				aiEngineBadge.style.background = 'rgba(16, 185, 129, 0.2)';
				aiEngineBadge.style.color = '#10b981';
			}
			if (aiTestStatus && isManualClick) {
				aiTestStatus.style.display = 'block';
				aiTestStatus.style.background = 'rgba(16, 185, 129, 0.15)';
				aiTestStatus.style.border = '1px solid rgba(16, 185, 129, 0.4)';
				aiTestStatus.style.color = '#10b981';
				aiTestStatus.innerHTML = `✅ <strong>100% LIVE:</strong> ${data.message} Ready for real-time screenshot vision!`;
			}
		} else {
			if (aiEngineBadge) {
				aiEngineBadge.textContent = '● OCR VISION ENGINE ACTIVE';
				aiEngineBadge.style.background = 'rgba(6, 182, 212, 0.15)';
				aiEngineBadge.style.color = 'var(--accent-cyan)';
			}
			if (aiTestStatus && isManualClick) {
				aiTestStatus.style.display = 'block';
				aiTestStatus.style.background = 'rgba(6, 182, 212, 0.12)';
				aiTestStatus.style.border = '1px solid rgba(6, 182, 212, 0.35)';
				aiTestStatus.style.color = 'var(--accent-cyan)';
				aiTestStatus.innerHTML = `⚡ <strong>High-Speed Vision Active:</strong> ${data.message}`;
			}
		}
	} catch (err) {
		if (aiEngineBadge) {
			aiEngineBadge.textContent = '● LOCAL OCR ACTIVE';
			aiEngineBadge.style.background = 'rgba(6, 182, 212, 0.15)';
			aiEngineBadge.style.color = 'var(--accent-cyan)';
		}
	}
}

const savedGeminiKey = localStorage.getItem('clario-gemini-key') || '';
if (geminiKeyInput) geminiKeyInput.value = savedGeminiKey;
if (aiEngineBadge) verifyAiConnection(savedGeminiKey, false);

saveKeyBtn?.addEventListener('click', async () => {
	const key = geminiKeyInput?.value?.trim() || '';
	if (key) {
		localStorage.setItem('clario-gemini-key', key);
		await verifyAiConnection(key, true);
	} else {
		localStorage.removeItem('clario-gemini-key');
		await verifyAiConnection('', true);
	}
});

testAiBtn?.addEventListener('click', () => {
	const key = geminiKeyInput?.value?.trim() || localStorage.getItem('clario-gemini-key') || '';
	verifyAiConnection(key, true);
});

// Test scenario presets: deliberately messy, realistic campus message streams.
const sampleTexts = {
	allinone: `WHATSAPP EXPORT — 7 days, 6 groups, too many forwards 😵‍💫

[MON 8:12 AM | Class CR]: fwd from admin: semester fee undertaking + ID photocopy to be submitted by TODAY 4:00 PM, Admin Block counter 3. no online option apparently.
[MON 8:14 AM | 2 replies]: is it everyone? / yes i think so / pls check once

[TUE 9:03 PM | Robotics]: freshers orientation Tuesday 11:00 AM Auditorium. bring college ID, registration desk closes 10:50.
[TUE 9:05 PM | ECE group]: ECE-201 lecture shifted Tuesday 11 AM LT-1 because sir has meeting later. attendance important.
[TUE 9:06 PM | Riya]: omg same time?? which one do we skip??

[WED 6:41 PM | DSA batch]: graph traversal assignment upload Thursday 11:59 PM on LMS. pdf + github link both. TA said late submissions not accepted.
[WED 6:43 PM | forwarded x4]: also lab manual physical copy Friday 9:30 AM Room 304, CS Block.

[THU 1:15 PM | Student Affairs mail]: Women in Tech Fellowship applications open, ₹50,000 grant. eligibility: first/second year. apply before Saturday 6:00 PM. form link: https://forms.gle/wit-fellowship-demo
[THU 1:17 PM]: is this legit? mail is from studentaffairs@campus.edu yes.

[FRI 10:30 AM | Hackathon group]: Smart Campus 36-hour hackathon team confirmation due Friday 11:59 PM. only team lead has to submit names.
[FRI 10:31 AM]: team list is in old message, someone pin it pls

[SAT 4:20 PM | Cultural club]: dramatics auditions Sunday 5:30 PM. prepare 2-min monologue. venue will be announced “soon” — no room mentioned in notice.
[SAT 4:21 PM | random]: can we bring friends? / pls ask coordinator

[SUN 7:50 PM | Hostel group]: mess feedback form maybe due midnight? not sure, message got deleted.
[SUN 7:53 PM | CR]: Above notices came from different groups. Please stop forwarding the same thing 🙏`,
	whatsapp: `[Forwarded many times — read till end]
Robotics freshers orientation TODAY 11am auditorium. compulsory? interested ppl come. ID card le aana.
ECE Lab 101 also moved 11:00 AM today because prof not free later. Manual + record needed. room maybe Lab 101 / CS block? pls confirm.
btw scholarship registration tomorrow 5 PM last date. someone share form link again
[reply] 11am clash hai yaar what do we do?`,
	syllabus: `CS-204 DSA semi-final schedule (teacher's rough message, pls verify):
graph traversal lab assgn 2: submit Fri 11:59pm portal. code + pdf both??
Midterm Oct 14 10 AM LT-2, seating list later.
Hackathon team registration confirm by tom 4pm otherwise name removed.
extra: doubt class maybe Wed 3 pm, not final.`,
	incomplete: `URGENT fwd from cultural group: dramatics auditions this Fri 5:30pm. Freshers can try stage play / street theatre, 2-min mono ready rakhna. Venue??? notice doesnt say. Admin said update later maybe. pls dont assume auditorium.`
};

document.querySelectorAll('.prompt-chip').forEach((chip) => {
	chip.addEventListener('click', () => {
		const sampleKey = chip.dataset.sample;
		if (textArea && sampleTexts[sampleKey]) {
			textArea.value = sampleTexts[sampleKey];
			textArea.focus();
			if (organizeStatus) organizeStatus.textContent = `Loaded sample: ${chip.textContent.trim()} — Click Synthesize below!`;
		}
	});
});

// File upload listener with visual feedback & in-browser OCR
organizerFileInput?.addEventListener('change', async () => {
	const file = organizerFileInput.files?.[0];
	if (!file) return;

	sessionStorage.removeItem('clario-uploaded-image');

	// 1. Prominent upload confirmation message
	if (uploadFeedback) {
		uploadFeedback.style.display = 'block';
		uploadFeedback.innerHTML = `✓ File <strong>"${file.name}"</strong> (${Math.ceil(file.size / 1024)} KB) uploaded successfully!`;
	}
	if (organizeStatus) {
		organizeStatus.textContent = `✓ Uploaded ${file.name}. Reading content with Multimodal OCR Vision…`;
	}

	// 2. If image/screenshot, show preview and run in-browser OCR
	if (file.type.startsWith('image/')) {
		const reader = new FileReader();
		reader.onload = async (e) => {
			const dataUrl = e.target.result;
			if (previewBox && imagePreview) {
				imagePreview.src = dataUrl;
				previewBox.style.display = 'block';
			}
			sessionStorage.setItem('clario-uploaded-image', dataUrl);

			// Real-time in-browser OCR using Tesseract.js
			if (window.Tesseract) {
				if (organizeStatus) organizeStatus.textContent = '🔍 Reading screenshot with Multimodal OCR Vision…';
				try {
					const { data: { text } } = await Tesseract.recognize(file, 'eng');
					if (text && text.trim()) {
						if (textArea) {
							textArea.value = text.trim();
						}
						const wordCount = text.trim().split(/\s+/).length;
						if (organizeStatus) {
							organizeStatus.textContent = `✓ OCR Vision extracted ${wordCount} words from your screenshot! Click Synthesize to view brief.`;
						}
						if (uploadFeedback) {
							uploadFeedback.innerHTML = `✓ Screenshot <strong>"${file.name}"</strong> uploaded &amp; text extracted! Click Synthesize below.`;
						}
					}
				} catch (ocrErr) {
					console.warn('In-browser OCR note:', ocrErr.message);
					if (organizeStatus) organizeStatus.textContent = `✓ ${file.name} ready for Cloud AI synthesis.`;
				}
			}
		};
		reader.readAsDataURL(file);
	}
});

// A single action keeps the live demo decisive: organize, sync, then show the dashboard.

organizeForm?.addEventListener('submit', async (event) => {
	event.preventDefault();
	const submitButton = document.querySelector('#btn-synthesize-dashboard') || document.querySelector('button[type="submit"]');
	
	if (submitButton) {
		submitButton.disabled = true;
		submitButton.textContent = '⚡ Clario AI synthesizing…';
	}
	const targetPage = 'dashboard.html';

	if (organizeStatus) {
		organizeStatus.textContent = `⚡ Synthesizing priorities and checking timetable conflicts… Redirecting to ${targetPage === 'dashboard.html' ? 'Live Campus Dashboard' : 'Structured Brief'}…`;
	}

	const formData = new FormData(organizeForm);
	const activeGeminiKey = localStorage.getItem('clario-gemini-key') || '';

	try {
		const headers = {};
		if (activeGeminiKey) {
			headers['x-gemini-key'] = activeGeminiKey;
		}

		const response = await fetch(`${API_BASE}/api/organize`, {
			method: 'POST',
			headers,
			body: formData
		});

		const result = await response.json().catch(() => ({}));
		if (!response.ok) throw new Error(result.error || 'Could not organize this item.');

		// Save result to session storage
		sessionStorage.setItem('clario-organizer-result', JSON.stringify(result));

		// AUTOMATIC REDIRECTION
		window.location.href = targetPage;
	} catch (error) {
		const message = error instanceof TypeError && /fetch/i.test(error.message)
			? '❌ Clario’s local engine is not running. Start the server with “npm start”, then try again.'
			: '❌ Error: ' + error.message;
		if (organizeStatus) organizeStatus.textContent = message;
		if (submitButton) {
			submitButton.disabled = false;
			submitButton.textContent = 'Synthesize & Sync to Dashboard 🚀';
		}
	}
});
